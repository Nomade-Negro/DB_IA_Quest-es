import { ensureSchema, query } from '../lib/db.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function normalizeQuestaoPayload(body = {}, partial = false) {
  const payload = {
    disciplina: typeof body.disciplina === 'string' ? body.disciplina.trim() : body.disciplina,
    assunto: typeof body.assunto === 'string' ? body.assunto.trim() : body.assunto,
    dificuldade: typeof body.dificuldade === 'string' ? body.dificuldade.trim() : body.dificuldade,
    enunciado: typeof body.enunciado === 'string' ? body.enunciado.trim() : body.enunciado,
    gabarito: typeof body.gabarito === 'string' ? body.gabarito.trim().toUpperCase() : body.gabarito,
    justificativa: typeof body.justificativa === 'string' ? body.justificativa.trim() : body.justificativa,
    fonte: typeof body.fonte === 'string' ? body.fonte.trim() : body.fonte
  };

  const requiredFields = ['disciplina', 'assunto', 'dificuldade', 'enunciado', 'gabarito'];
  for (const field of requiredFields) {
    if (!partial && !payload[field]) {
      return { error: `Campo obrigatório ausente: ${field}` };
    }
  }

  if (payload.gabarito && !['C', 'E'].includes(payload.gabarito)) {
    return { error: 'Gabarito deve ser "C" ou "E".' };
  }

  return {
    data: {
      ...payload,
      justificativa: payload.justificativa || null,
      fonte: payload.fonte || null
    }
  };
}

export default async function handler(req, res) {
  await ensureSchema();

  try {
    switch (req.method) {
      case 'GET': {
        const result = await query(
          `SELECT id, disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte, created_at
           FROM questoes
           ORDER BY created_at DESC, id DESC`
        );
        return res.status(200).json(result.rows);
      }

      case 'POST': {
        const normalized = normalizeQuestaoPayload(req.body);
        if (normalized.error) {
          return res.status(400).json({ error: normalized.error });
        }

        const { disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte } = normalized.data;
        const result = await query(
          `INSERT INTO questoes (disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte, created_at`,
          [disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte]
        );

        return res.status(201).json(result.rows[0]);
      }

      case 'PUT': {
        const id = parseId(req.query.id);
        if (!id) {
          return res.status(400).json({ error: 'ID inválido.' });
        }

        const normalized = normalizeQuestaoPayload(req.body);
        if (normalized.error) {
          return res.status(400).json({ error: normalized.error });
        }

        const { disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte } = normalized.data;
        const result = await query(
          `UPDATE questoes
           SET disciplina = $1,
               assunto = $2,
               dificuldade = $3,
               enunciado = $4,
               gabarito = $5,
               justificativa = $6,
               fonte = $7
           WHERE id = $8
           RETURNING id, disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte, created_at`,
          [disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte, id]
        );

        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Questão não encontrada.' });
        }

        return res.status(200).json(result.rows[0]);
      }

      case 'DELETE': {
        const id = parseId(req.query.id);
        if (!id) {
          return res.status(400).json({ error: 'ID inválido.' });
        }

        const result = await query('DELETE FROM questoes WHERE id = $1 RETURNING id', [id]);
        if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Questão não encontrada.' });
        }

        return res.status(204).end();
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
  } catch (error) {
    console.error('Erro na API de questões:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
