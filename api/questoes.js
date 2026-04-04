import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Buscar todas as questões
        const questoes = await prisma.questao.findMany({
          orderBy: { created_at: 'desc' }
        });
        res.status(200).json(questoes);
        break;

      case 'POST':
        // Criar nova questão
        const { disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte } = req.body;

        // Validação básica
        if (!disciplina || !assunto || !dificuldade || !enunciado || !gabarito) {
          return res.status(400).json({ error: 'Campos obrigatórios: disciplina, assunto, dificuldade, enunciado, gabarito' });
        }

        if (!['C', 'E'].includes(gabarito)) {
          return res.status(400).json({ error: 'Gabarito deve ser "C" ou "E"' });
        }

        const novaQuestao = await prisma.questao.create({
          data: {
            disciplina,
            assunto,
            dificuldade,
            enunciado,
            gabarito,
            justificativa,
            fonte
          }
        });

        res.status(201).json(novaQuestao);
        break;

      case 'PUT':
        // Atualizar questão
        const { id } = req.query;
        const updateData = req.body;

        if (!id) {
          return res.status(400).json({ error: 'ID da questão é obrigatório' });
        }

        // Validar gabarito se fornecido
        if (updateData.gabarito && !['C', 'E'].includes(updateData.gabarito)) {
          return res.status(400).json({ error: 'Gabarito deve ser "C" ou "E"' });
        }

        const questaoAtualizada = await prisma.questao.update({
          where: { id: parseInt(id) },
          data: updateData
        });

        res.status(200).json(questaoAtualizada);
        break;

      case 'DELETE':
        // Deletar questão
        const { id: deleteId } = req.query;

        if (!deleteId) {
          return res.status(400).json({ error: 'ID da questão é obrigatório' });
        }

        await prisma.questao.delete({
          where: { id: parseInt(deleteId) }
        });

        res.status(204).end();
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Erro na API:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    await prisma.$disconnect();
  }
}