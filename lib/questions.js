const ALLOWED_DIFFICULTIES = ['Fácil', 'Médio', 'Difícil'];
const REQUIRED_FIELDS = ['disciplina', 'assunto', 'dificuldade', 'enunciado', 'gabarito'];

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : value;
}

export function normalizeQuestion(input = {}) {
  const question = {
    disciplina: normalizeString(input.disciplina),
    assunto: normalizeString(input.assunto),
    dificuldade: normalizeString(input.dificuldade),
    enunciado: normalizeString(input.enunciado),
    gabarito: typeof input.gabarito === 'string' ? input.gabarito.trim().toUpperCase() : input.gabarito,
    justificativa: normalizeString(input.justificativa),
    fonte: normalizeString(input.fonte)
  };

  return {
    ...question,
    justificativa: question.justificativa || null,
    fonte: question.fonte || null
  };
}

export function validateQuestion(input, index = null) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return formatError(index, 'Cada item deve ser um objeto JSON válido.');
  }

  const question = normalizeQuestion(input);

  for (const field of REQUIRED_FIELDS) {
    if (!question[field]) {
      return formatError(index, `Campo obrigatório ausente: ${field}.`);
    }
  }

  if (!ALLOWED_DIFFICULTIES.includes(question.dificuldade)) {
    return formatError(index, 'Dificuldade inválida. Use apenas Fácil, Médio ou Difícil.');
  }

  if (!['C', 'E'].includes(question.gabarito)) {
    return formatError(index, 'Gabarito inválido. Use apenas "C" ou "E".');
  }

  return null;
}

export function validateBulkQuestions(payload) {
  if (!Array.isArray(payload)) {
    return ['O corpo da requisição deve ser um array JSON válido.'];
  }

  if (payload.length === 0) {
    return ['Envie pelo menos uma questão para importar.'];
  }

  return payload
    .map((question, index) => validateQuestion(question, index))
    .filter(Boolean);
}

function formatError(index, message) {
  return index === null ? message : `Item ${index + 1}: ${message}`;
}
