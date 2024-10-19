require('dotenv').config({ path: '.env' });

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASS,
  database: process.env.MARIADB_DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL!');
});

module.exports = connection;