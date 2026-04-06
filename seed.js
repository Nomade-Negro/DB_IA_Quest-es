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
  },
  {
    disciplina: "Língua Portuguesa",
    assunto: "Flexão de número: compostos",
    dificuldade: "Médio",
    enunciado: "De acordo com a regra \"quem varia varia, quem não varia não varia\", o plural do substantivo composto abaixo-assinado é abaixo-assinados, porque o primeiro elemento é invariável e o segundo, adjetivo, varia.",
    gabarito: "C",
    justificativa: "\"Abaixo\" é advérbio (invariável) e \"assinado\" funciona como adjetivo (varia). Logo, o plural correto é abaixo-assinados.",
    fonte: "Aula 02_005_Slide.pdf, p. 17"
  },
  {
    disciplina: "Língua Portuguesa",
    assunto: "Flexão de número: compostos",
    dificuldade: "Médio",
    enunciado: "O plural de guarda-civil é guarda-civis, pois o primeiro termo é um verbo e o segundo um substantivo, e, nessa estrutura, apenas o segundo termo varia.",
    gabarito: "E",
    justificativa: "Guarda-civil é formado por substantivo + adjetivo (não verbo + substantivo). O plural correto é guardas-civis, com ambos os termos variando.",
    fonte: "Aula 02_005_Slide.pdf, p. 20"
  },
  {
    disciplina: "Língua Portuguesa",
    assunto: "Flexão de número: compostos com preposição",
    dificuldade: "Médio",
    enunciado: "Os substantivos compostos ligados por preposição, como \"pé de moleque\" e \"mula sem cabeça\", são invariáveis no plural, permanecendo apenas o primeiro elemento no singular.",
    gabarito: "E",
    justificativa: "Nesses compostos, normalmente apenas o primeiro elemento vai para o plural: pés de moleque, mulas sem cabeça. Não são invariáveis; o primeiro termo varia.",
    fonte: "Aula 02_005_Slide.pdf, p. 19"
  },
  {
    disciplina: "Língua Portuguesa",
    assunto: "Flexão de gênero: substantivos uniformes",
    dificuldade: "Médio",
    enunciado: "Os substantivos epicenos, como \"a águia\", apresentam uma única forma para os dois gêneros, sendo a distinção de sexo feita pelas palavras macho e fêmea.",
    gabarito: "C",
    justificativa: "Substantivos epicenos possuem apenas um gênero gramatical e a distinção sexual é feita com os termos \"macho\" e \"fêmea\" (ex.: a águia macho, a águia fêmea).",
    fonte: "Aula 02_005_Slide.pdf, p. 30"
  },
  {
    disciplina: "Língua Portuguesa",
    assunto: "Grau do substantivo: valor semântico",
    dificuldade: "Médio",
    enunciado: "O diminutivo, além da ideia de tamanho reduzido, pode expressar afetividade (como em \"coraçãozinho\") ou ironia (como em \"sabichão\"), mas nunca pode indicar depreciação.",
    gabarito: "E",
    justificativa: "O diminutivo pode, sim, indicar depreciação. Exemplos: casebre, gentalha, povinho. Além disso, \"sabichão\" é aumentativo, não diminutivo.",
    fonte: "Aula 02_005_Slide.pdf, p. 33 e p. 36"
  },
  {
    disciplina: "Língua Portuguesa",
    assunto: "Flexão de número: diminutivos",
    dificuldade: "Difícil",
    enunciado: "No plural dos substantivos diminutivos, o sufixo diminutivo e o radical comportam-se como uma só palavra, de modo que a terminação de plural incide sobre o final do diminutivo, como em \"papeizinhos\" (plural de \"papelzinho\").",
    gabarito: "C",
    justificativa: "A regra é: coloca-se o substantivo no plural, retira-se o -s, acrescenta-se o sufixo diminutivo + s. Papéis -> papei + zinhos -> papeizinhos.",
    fonte: "Aula 02_005_Slide.pdf, p. 34"
  }
];

async function main() {
  console.log('Iniciando seed do banco de dados...');
  await ensureSchema();

  for (const questao of questoesIniciais) {
    await query(
      `INSERT INTO questoes (disciplina, assunto, dificuldade, enunciado, gabarito, justificativa, fonte)
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
