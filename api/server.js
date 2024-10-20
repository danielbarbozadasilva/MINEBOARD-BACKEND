const { version, name } = require('../package.json');
const express = require('express');
require('express-async-errors');
require('dotenv').config({ path: '.env' });
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const cors = require('cors');
const router = require('./routers/router');
const db = require('../db/config');
const port = process.env.PORT || 3001;

const app = express();

// Middleware para adicionar segurança contra vulnerabilidades comuns
app.use(helmet());

// Limite de requisições - prevenindo ataques de força bruta e DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite cada IP a 100 requisições por "janela" (neste caso, 15 minutos)
  message:
    'Muitas requisições feitas deste IP, por favor, tente novamente após 15 minutos.'
});

app.use(limiter);

// Sanitização dos dados enviados no body, params e query - prevenindo XSS
app.use(xss());

// Habilitar CORS para controlar o acesso à sua API de diferentes domínios
app.use(
  cors({
    origin: 'http://localhost:3011', // Defina os domínios permitidos aqui
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Defina os métodos permitidos
    optionsSuccessStatus: 200 // Resposta para o método OPTIONS (requisição preflight)
  })
);

app.use(express.json());
app.use('/static', express.static(`${__dirname}/../api/utils/file`));
app.listen(port, () =>
  console.log(
    `<<< ${name} v${version} was started in 'DEV' environment on port ${port}>>>`
  )
);

router(app, db);

module.exports = { app };
