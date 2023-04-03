## Descrição

Esse projeto é um sistema de autenticação básico feito com Node.js e Express.js. Ele permite que os usuários se registrem, façam login e visualizem suas informações.

## Tecnologias usadas

- Node.js
- Express.js
- Mongoose
- bcrypt
- JSON Web Tokens

## Requisitos

- Node.js instalado
- MongoDB instalado

## Como usar

1. Clone o repositório:

```bash
git clone https://github.com/Sarapessoa/authentication-jwt.git
```

2. Instale as dependências:

```npm
npm install
```

3. Crie um arquivo .env com as seguintes informações:

```makefile
DB_USER=seu-usuario-do-mongodb
DB_PASS=sua-senha-do-mongodb
SECRET=sua-chave-secreta
```

4. Inicie o servidor Node.js:

```npm
npm start
```

5. Use o aplicativo:
- Acesse o aplicativo no navegador em `http://localhost:3000/`
- Para registrar um usuário: `http://localhost:3000/auth/register`
- Para fazer login: `http://localhost:3000/auth/login`
- Para visualizar informações do usuário: `http://localhost:3000/user/:id`

## Estrutura do código

- `server.js`: arquivo principal que inicia o servidor Node.js e define as rotas
- `models/User.js`: modelo de dados do usuário
- `middlewares/checkToken.js`: middleware que verifica o token JWT
- `routes/auth.js`: rota de autenticação, incluindo registro e login de usuários

## Autor

Sara Pessoa Silva
