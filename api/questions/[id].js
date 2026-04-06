import { ensureSchema, query } from '../../lib/db.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function sendJson(res, status, payload) {
  return res.status(status).json(payload);
}

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return sendJson(res, 405, { error: `Método ${req.method} não permitido.` });
  }

  try {
    await ensureSchema();

    const id = parseId(req.query.id);
    if (!id) {
      return sendJson(res, 400, { error: 'ID inválido.' });
    }

    const existing = await query('SELECT id FROM questions WHERE id = $1', [id]);
    if (existing.rowCount === 0) {
      return sendJson(res, 404, { error: 'Questão não encontrada.' });
    }

    await query('DELETE FROM questions WHERE id = $1', [id]);
    return sendJson(res, 200, { success: true });
  } catch (error) {
    console.error('Erro na API DELETE /api/questions/[id]:', error);
    return sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Erro interno do servidor.'
    });
  }
}
