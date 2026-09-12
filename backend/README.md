# EcoSun API

Esta API é a única camada autorizada a se conectar ao SQL Server da Somee. O aplicativo Expo nunca recebe credenciais do banco.

## Configuração

1. Copie `.env.example` para `.env`.
2. Informe `DB_PASSWORD` e substitua `JWT_SECRET` por um segredo aleatório forte.
3. Instale as dependências com `npm install` dentro desta pasta.

## Comandos

- `npm run dev`: inicia a API local em modo de desenvolvimento.
- `npm start`: inicia a API.
- `npm run inspect:schema`: executa exclusivamente consultas `SELECT` de catálogo e gera `schema-report.json` local (ignorado pelo Git).

## Endpoints

- `GET /api/test`: testa a conexão com o SQL Server sem expor credenciais, erros de driver ou stack trace.
- `POST /api/auth/register`: cria uma conta em `dbo.Usuario`.
- `POST /api/auth/login`: autentica uma conta existente em `dbo.Usuario`.
- `POST /api/simulacoes`: salva uma simulação na tabela `dbo.Orcamento` e vincula ao usuário pelo e-mail.

O aplicativo Expo deve usar `EXPO_PUBLIC_API_URL` apontando para esta API. Em um aparelho físico, use o IP da máquina na rede local ou uma URL pública; nunca coloque as credenciais do SQL Server no aplicativo.

O servidor escuta em `0.0.0.0` por padrão para aceitar conexões LAN e encaminhamento de porta do Codespaces. Depois de alterar `EXPO_PUBLIC_API_URL`, reinicie o Metro com `npx expo start --tunnel -c`.
