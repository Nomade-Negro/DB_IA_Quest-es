import pkg from 'pg';

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não está definida.');
}

const globalForDb = globalThis;
const shouldUseSsl = !/localhost|127\.0\.0\.1/i.test(process.env.DATABASE_URL);

const pool =
  globalForDb.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pgPool = pool;
}

let schemaPromise;

export async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS questoes (
        id SERIAL PRIMARY KEY,
        disciplina TEXT NOT NULL,
        assunto TEXT NOT NULL,
        dificuldade TEXT NOT NULL,
        enunciado TEXT NOT NULL,
        gabarito CHAR(1) NOT NULL CHECK (gabarito IN ('C', 'E')),
        justificativa TEXT,
        fonte TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  await schemaPromise;
}

export async function query(text, params = []) {
  return pool.query(text, params);
}

export default pool;
