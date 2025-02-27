# FastFeet API

Desafio 05 - API para controle de encomendas de uma transportadora fictícia.
Desafio Ignite Rocketseat

### Regras da aplicação

- [x] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
- [x] Deve ser possível realizar login com CPF e Senha
- [x] Deve ser possível realizar o CRUD dos entregadores
- [x] Deve ser possível realizar o CRUD das encomendas
- [x] Deve ser possível realizar o CRUD dos destinatários
- [x] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
- [x] Deve ser possível retirar uma encomenda
- [x] Deve ser possível marcar uma encomenda como entregue
- [x] Deve ser possível marcar uma encomenda como devolvida
- [x] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
- [x] Deve ser possível alterar a senha de um usuário
- [x] Deve ser possível listar as entregas de um usuário
  
### Regras de negócio

- [x] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [x] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- [x] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- [x] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- [x] Somente o entregador que retirou a encomenda pode marcar ela como entregue
- [x] Somente o admin pode alterar a senha de um usuário
- [x] Não deve ser possível um entregador listar as encomendas de outro entregador

## Tecnologias Utilizadas

- [Fastify](https://fastify.dev/)
- [Zod](https://github.com/colinhacks/zod)
- [Dotenv](https://github.com/motdotla/dotenv)
- [TypeScript](https://www.typescriptlang.org/)
- [Vitest](https://vitest.dev/)
- [ESLint](https://eslint.org/)
- [Prisma](https://www.prisma.io/)
- [Supertest](https://github.com/ladjs/supertest)
- [Bcrypt/Bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [@fastify/cookie](https://github.com/fastify/fastify-cookie)
- [@fastify/jwt](https://github.com/fastify/fastify-jwt)
- [AWS S3](https://aws.amazon.com/pt/s3/)
