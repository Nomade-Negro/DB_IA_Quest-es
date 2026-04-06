import { ensureSchema, query } from './lib/db.js';

const questoesIniciais = [
  {
    disciplina: "Língua Portuguesa",
    assunto: "Substantivos: classificação (próprio x comum)",
    dificuldade: "Fácil",
    enunciado: "Os vocábulos Chapecó, Irene e Brasil são substantivos próprios.",
    gabarito: "C",
    justificativa: "Chapecó (cidade), Irene (nome próprio) e Brasil (país) são todos substantivos próprios, pois nomeiam seres de maneira específica e individual.",
    fonte: "Aula 02_005_Slide.pdf, p. 9"
  },
  {
    disciplina: "Língua Portuguesa",
    assunto: "Substantivos: concreto x abstrato",
    dificuldade: "Médio",
    enunciado: "Na frase \"A construção das Pirâmides do Egito deve ter sido demorada\", a palavra \"construção\" é classificada como substantivo concreto, por designar uma obra física.",
    gabarito: "E",
    justificativa: "\"Construção\" é substantivo abstrato, pois denota ação/resultado de construir (processo), e não um ser com existência independente.",
    fonte: "Aula 02_005_Slide.pdf, p. 8"
  },
  {
    disciplina: "Língua Portuguesa",
    assunto: "Substantivos: classificação (coletivo)",
    dificuldade: "Médio",
    enunciado: "O substantivo \"papanapá\" é um coletivo que designa um agrupamento de borboletas.",
    gabarito: "C",
    justificativa: "Papanapá é, de fato, o substantivo coletivo referente a um grupo de borboletas.",
    fonte: "Aula 02_005_Slide.pdf, p. 7"
  }
];

async function main() {
  console.log('Iniciando seed do banco de dados...');
  await ensureSchema();

  for (const questao of questoesIniciais) {
    await query(
      `INSERT INTO questions (disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        questao.disciplina,
        questao.assunto,
        questao.dificuldade,
        questao.enunciado,
        questao.gabarito,
        questao.justificativa,
        questao.fonte
      ]
    );
  }

  console.log('Seed concluído!');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
