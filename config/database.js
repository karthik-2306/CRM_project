// config/database.js
const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'Leads',
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;
