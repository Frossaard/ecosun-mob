const crypto = require('crypto');
const express = require('express');

const { getPool, sql } = require('../config/database');

const router = express.Router();

function text(value, field) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${field} é obrigatório`);
  }
  return value.trim();
}

function hashPassword(password) {
  const salt = crypto.randomBytes(8).toString('hex');
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

function passwordMatches(password, storedPassword) {
  if (storedPassword?.startsWith('scrypt:')) {
    const [, salt, expected] = storedPassword.split(':');
    const actual = crypto.scryptSync(password, salt, 32).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
  }

  return storedPassword === password;
}

function publicUser(user) {
  return { nome: user.nome, telefone: user.telefone || '', email: user.email };
}

router.post('/register', async (request, response) => {
  try {
    const nome = text(request.body?.nome, 'nome');
    const email = text(request.body?.email, 'email').toLowerCase();
    const senha = text(request.body?.senha, 'senha');
    const telefone = typeof request.body?.telefone === 'string' ? request.body.telefone.trim() : '';

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return response.status(400).json({ success: false, message: 'E-mail inválido' });
    }
    if (senha.length < 6) {
      return response.status(400).json({ success: false, message: 'A senha deve ter pelo menos 6 caracteres' });
    }

    const pool = await getPool();
    const existing = await pool.request()
      .input('email', sql.VarChar(255), email)
      .query('SELECT TOP 1 id FROM dbo.Usuario WHERE LOWER(email) = @email');
    if (existing.recordset.length > 0) {
      return response.status(409).json({ success: false, message: 'Este e-mail já está cadastrado.' });
    }

    const created = await pool.request()
      .input('nome', sql.VarChar(100), nome.slice(0, 100))
      .input('email', sql.VarChar(255), email)
      .input('senha', sql.VarChar(255), hashPassword(senha))
      .input('dataCadastro', sql.SmallDateTime, new Date())
      .input('statusUsuario', sql.VarChar(50), 'ATIVO')
      .query(`
        INSERT INTO dbo.Usuario (nome, email, senha, dataCadastro, statusUsuario)
        OUTPUT INSERTED.id, INSERTED.nome, INSERTED.email
        VALUES (@nome, @email, @senha, @dataCadastro, @statusUsuario)
      `);

    return response.status(201).json({ success: true, usuario: publicUser({ ...created.recordset[0], telefone }) });
  } catch (error) {
    if (error.message?.includes('é obrigatório')) {
      return response.status(400).json({ success: false, message: error.message });
    }
    console.error('Erro ao cadastrar usuário:', error.message);
    return response.status(503).json({ success: false, message: 'Não foi possível criar a conta' });
  }
});

router.post('/login', async (request, response) => {
  try {
    const email = text(request.body?.email, 'email').toLowerCase();
    const senha = text(request.body?.senha, 'senha');
    const pool = await getPool();
    const result = await pool.request()
      .input('email', sql.VarChar(255), email)
      .query(`
        SELECT TOP 1 nome, email, senha, statusUsuario
        FROM dbo.Usuario
        WHERE LOWER(email) = @email
      `);
    const user = result.recordset[0];
    if (!user || user.statusUsuario !== 'ATIVO' || !passwordMatches(senha, user.senha)) {
      return response.status(401).json({ success: false, message: 'E-mail ou senha inválidos.' });
    }

    return response.json({ success: true, usuario: publicUser(user) });
  } catch (error) {
    if (error.message?.includes('é obrigatório')) {
      return response.status(400).json({ success: false, message: error.message });
    }
    console.error('Erro ao autenticar usuário:', error.message);
    return response.status(503).json({ success: false, message: 'Não foi possível entrar agora' });
  }
});

module.exports = router;