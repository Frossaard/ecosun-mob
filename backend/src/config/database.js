const sql = require('mssql');

const requiredVariables = ['DB_SERVER', 'DB_DATABASE', 'DB_USER', 'DB_PASSWORD'];

function getDatabaseConfig() {
  const missing = requiredVariables.filter((name) => !process.env[name] || process.env[name].startsWith('SENHA_'));
  if (missing.length > 0) {
    throw new Error('Database configuration is incomplete.');
  }

  return {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT || 1433),
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    connectionTimeout: 15000,
    requestTimeout: 15000,
  };
}

let poolPromise;

function getPool() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(getDatabaseConfig())
      .connect()
      .catch((error) => {
        poolPromise = undefined;
        throw error;
      });
  }

  return poolPromise;
}

module.exports = { getPool, sql };
