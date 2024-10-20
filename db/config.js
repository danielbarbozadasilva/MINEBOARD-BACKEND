const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASS,
  database: process.env.MARIADB_DB_NAME,
});

module.exports = { connection };