const express = require('express');
require('express-async-errors');
const cors = require('cors');
const router = require('./routers/router');
const db = require('../db/config');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/static', express.static(`${__dirname}/../api/utils/file`));

router(app, db);

module.exports = app;