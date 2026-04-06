import pkg from 'pg';

const { Pool } = pkg;

const globalForDb = globalThis;
let schemaPromise;

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL não está definida. Configure a variável de ambiente no painel da Vercel ou no arquivo .env local.');
  }

  return databaseUrl;
}

function getPool() {
  if (globalForDb.pgPool) {
    return globalForDb.pgPool;
  }

  const databaseUrl = getDatabaseUrl();
  const shouldUseSsl = !/localhost|127\.0\.0\.1/i.test(databaseUrl);
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000
  });

  globalForDb.pgPool = pool;
  return pool;
}

export async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = getPool().query(`
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

  try {
    await schemaPromise;
  } catch (error) {
    schemaPromise = null;
    throw error;
  }
}

export async function query(text, params = []) {
  return getPool().query(text, params);
}

export async function withTransaction(callback) {
  const client = await getPool().connect();

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

export default getPool;
