import pg from 'pg';

const pool = new pg.Pool({
  user: 'rleyva',
  host: 'pgsqltrans.face.ubiobio.cl',
  database: 'rleyva_bd',
  password: 'pass123',
  port: 5432,
});

export default pool;