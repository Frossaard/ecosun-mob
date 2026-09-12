const express = require('express');

const { getPool } = require('../config/database');

const router = express.Router();

router.get('/test', async (_request, response) => {
  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1 AS connected');
    return response.json({
      success: true,
      message: 'Conexão com SQL Server realizada com sucesso',
    });
  } catch (_error) {
    return response.status(503).json({
      success: false,
      message: 'Não foi possível conectar ao banco de dados',
    });
  }
});

module.exports = router;
