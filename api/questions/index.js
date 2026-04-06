import { ensureSchema, query } from '../../lib/db.js';
import { normalizeQuestion, validateQuestion } from '../../lib/questions.js';

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function listQuestions(res) {
  const result = await query(
    `SELECT id, disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte, created_at
     FROM questions
     ORDER BY created_at DESC, id DESC`
  );

  return res.status(200).json(result.rows);
}

async function createQuestion(req, res) {
  const error = validateQuestion(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte } = normalizeQuestion(req.body);
  const result = await query(
    `INSERT INTO questions (disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte, created_at`,
    [disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte]
  );

  return res.status(201).json(result.rows[0]);
}

async function updateQuestion(req, res) {
  const id = parseId(req.query.id);
  if (!id) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  const error = validateQuestion(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  const { disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte } = normalizeQuestion(req.body);
  const result = await query(
    `UPDATE questions
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

async function deleteQuestion(req, res) {
  const id = parseId(req.query.id);
  if (!id) {
    return res.status(400).json({ error: 'ID inválido.' });
  }

  const result = await query('DELETE FROM questions WHERE id = $1 RETURNING id', [id]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: 'Questão não encontrada.' });
  }

  return res.status(204).end();
}

export { listQuestions, createQuestion, updateQuestion, deleteQuestion };

export default async function handler(req, res) {
  await ensureSchema();

  try {
    switch (req.method) {
      case 'GET':
        return await listQuestions(res);
      case 'POST':
        return await createQuestion(req, res);
      case 'PUT':
        return await updateQuestion(req, res);
      case 'DELETE':
        return await deleteQuestion(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }
  } catch (error) {
    console.error('Erro na API /api/questions:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}
