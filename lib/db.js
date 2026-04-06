import pkg from 'pg';

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não está definida. Configure a variável de ambiente no painel da Vercel ou no arquivo .env local.');
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
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        disciplina TEXT NOT NULL,
        assunto TEXT NOT NULL,
        dificuldade TEXT CHECK (dificuldade IN ('Fácil','Médio','Difícil')),
        enunciado TEXT NOT NULL,
        gabarito CHAR(1) CHECK (gabarito IN ('C','E')),
        justificativa TEXT,
        fonte TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  await schemaPromise;
}

export async function query(text, params = []) {
  return pool.query(text, params);
}

export async function withTransaction(callback) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
