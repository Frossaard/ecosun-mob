const crypto = require('crypto');
const express = require('express');

const { getPool, sql } = require('../config/database');

const router = express.Router();

function requiredString(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${field} é obrigatório`);
  }

  return value.trim();
}

router.post('/', async (request, response) => {
  try {
    const { input, resultado, perfil } = request.body || {};
    const email = requiredString(perfil?.email, 'perfil.email').toLowerCase();
    const nome = requiredString(perfil?.nome, 'perfil.nome');

    if (!input || !resultado) {
      return response.status(400).json({ success: false, message: 'Dados da simulação são obrigatórios' });
    }

    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      const userRequest = new sql.Request(transaction);
      userRequest.input('email', sql.VarChar(255), email);
      let user = await userRequest.query('SELECT TOP 1 id FROM dbo.Usuario WHERE email = @email');
      let userId = user.recordset[0]?.id;

      if (!userId) {
        const createUser = new sql.Request(transaction);
        createUser.input('nome', sql.VarChar(100), nome.slice(0, 100));
        createUser.input('email', sql.VarChar(255), email);
        createUser.input('senha', sql.VarChar(255), crypto.randomBytes(32).toString('hex'));
        createUser.input('dataCadastro', sql.SmallDateTime, new Date());
        createUser.input('statusUsuario', sql.VarChar(50), 'ATIVO');
        user = await createUser.query(`
          INSERT INTO dbo.Usuario (nome, email, senha, dataCadastro, statusUsuario)
          OUTPUT INSERTED.id
          VALUES (@nome, @email, @senha, @dataCadastro, @statusUsuario)
        `);
        userId = user.recordset[0].id;
      }

      const simulation = new sql.Request(transaction);
      simulation.input('usuarioId', sql.Int, userId);
      simulation.input('dataOrcamento', sql.SmallDateTime, new Date());
      simulation.input('valor', sql.Decimal(18, 2), resultado.custoTotalBRL ?? null);
      simulation.input('area', sql.Numeric(18, 2), resultado.areaNecessariaM2 ?? null);
      simulation.input('conta', sql.Numeric(18, 2), input.consumoMensalKwh ?? null);
      simulation.input('economia', sql.Numeric(18, 2), resultado.economiaMensalBRL ?? null);
      simulation.input('email', sql.VarChar(255), email);
      simulation.input('endereco', sql.VarChar(255), `${input.cidade}, ${input.estado}`);
      simulation.input('energia', sql.Numeric(18, 2), resultado.geracaoAnualKwh ?? null);
      simulation.input('nome', sql.VarChar(100), nome.slice(0, 100));
      simulation.input('paineis', sql.Int, resultado.quantidadePlacas ?? null);
      simulation.input('objetivo', sql.VarChar(255), input.tipo ?? null);
      simulation.input('potencia', sql.Numeric(18, 2), resultado.potenciaSistemaKw ?? null);
      simulation.input('preco', sql.Numeric(18, 2), resultado.custoTotalBRL ?? null);
      simulation.input('produtos', sql.Text, JSON.stringify({ input, resultado }));
      simulation.input('status', sql.VarChar(50), 'SIMULACAO');
      simulation.input('telefone', sql.VarChar(30), perfil.telefone || null);
      simulation.input('retorno', sql.Int, Math.round((resultado.paybackAnos ?? 0) * 12));
      simulation.input('tipoTelhado', sql.VarChar(50), resultado.tipoEstrutura ?? null);

      const saved = await simulation.query(`
        INSERT INTO dbo.Orcamento (
          usuario_id, data_orcamento, valor, area_telhado, conta_mensal_media,
          data_criacao, economia_mensal, email, endereco, energia_total_gerada,
          nome, numero_paineis, objetivo_energia, potencia_sistema, preco_total,
          produtos_selecionados, status, telefone, tempo_retorno_meses, tipo_telhado
        )
        OUTPUT INSERTED.id
        VALUES (
          @usuarioId, @dataOrcamento, @valor, @area, @conta, GETDATE(), @economia,
          @email, @endereco, @energia, @nome, @paineis, @objetivo, @potencia,
          @preco, @produtos, @status, @telefone, @retorno, @tipoTelhado
        )
      `);

      await transaction.commit();
      return response.status(201).json({ success: true, id: saved.recordset[0].id });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    if (error.message?.includes('é obrigatório')) {
      return response.status(400).json({ success: false, message: error.message });
    }

    console.error('Erro ao salvar simulação:', error.message);
    return response.status(503).json({ success: false, message: 'Não foi possível salvar a simulação' });
  }
});

module.exports = router;