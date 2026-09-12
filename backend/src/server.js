require('dotenv').config();

const cors = require('cors');
const express = require('express');

const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const simulacoesRouter = require('./routes/simulacoes');

const app = express();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use('/api', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/simulacoes', simulacoesRouter);

app.use((_request, response) => {
  response.status(404).json({ success: false, message: 'Rota não encontrada' });
});

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({ success: false, message: 'JSON inválido' });
  }

  return response.status(500).json({ success: false, message: 'Erro interno do servidor' });
});

app.listen(port, host, () => {
  console.log(`EcoSun API listening on http://${host}:${port}`);
});
