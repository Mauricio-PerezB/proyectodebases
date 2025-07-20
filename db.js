const { Pool } = require('pg');

const pool = new Pool({
  user: 'mauricio',
  host: 'localhost',
  database: 'proyecto',
  password: '1234',
  port: 5432,
});

module.exports = pool;
