import { ensureSchema, withTransaction } from '../../lib/db.js';
import { normalizeQuestion, validateBulkQuestions } from '../../lib/questions.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: `Método ${req.method} não permitido.` });
    }

    await ensureSchema();

    const errors = validateBulkQuestions(req.body);
    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Falha na validação do bloco de questões.',
        details: errors
      });
    }

    const normalizedQuestions = req.body.map((question) => normalizeQuestion(question));

    const inserted = await withTransaction(async (client) => {
      const rows = [];

      for (const question of normalizedQuestions) {
        const result = await client.query(
          `INSERT INTO questions (disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           RETURNING id, disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte, created_at`,
          [
            question.disciplina,
            question.assunto,
            question.dificuldade,
            question.enunciado,
            question.gabarito,
            question.justificativa,
            question.fonte
          ]
        );

        rows.push(result.rows[0]);
      }

      return rows;
    });

    return res.status(201).json({
      message: `${inserted.length} questão(ões) importada(s) com sucesso.`,
      insertedCount: inserted.length,
      items: inserted
    });
  } catch (error) {
    console.error('Erro na API /api/questions/bulk:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor.',
      details: [error instanceof Error ? error.message : 'Falha inesperada ao importar questões.']
    });
  }
}
