Este é o projeto do *backend* do Sins Of Macunaíma. Feito em:
- Nest.js
- Prisma
- PostgreSQL

## Configurando
1. Configure o PostgreSQL seguindo as instruções para seu sistema operacional. Talvez seja necessário criar uma `role` como é o caso em distribuições Linux baseadas em Arch.
2. Instale as dependências com `yarn install`.
3. Crie um arquivo `.env` na raíz do projeto e coloque 2 variáveis:
  - `DATABASE_URL`. Link usado para o Prisma se conectar ao Postgres. Algo como `postgresql://postgres@localhost:5432/postgres`.
  - `JWT_SECRET`. Usado para segurança no *backend*. Pode ser qualquer string, mas o ideal é que seja algo difícil de ser "quebrado".
4. Rode `yarn run build`.
5. Inicie o *backend* usando `yarn run start`.
6. Você pode monitorar o banco usando `npx prisma studio` ou entrando no *swagger* entrando em `localhost:3001/swagger`.