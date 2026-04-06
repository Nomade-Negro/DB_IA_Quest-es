# Banco de Questões IA

Aplicação com frontend estático, API serverless na Vercel e PostgreSQL via `DATABASE_URL`. O fluxo principal agora é importar blocos de questões em JSON válido e persistir tudo no banco.

## Estrutura

```text
/api
  /questions
    index.js     # GET /api/questions e CRUD unitário
    bulk.js      # POST /api/questions/bulk
  questoes.js    # alias legado para compatibilidade
/lib
  db.js          # conexão PostgreSQL e bootstrap da tabela
  questions.js   # validação e normalização das questões
/public
  index.html     # interface com importação em massa
/sql
  questions.sql  # script SQL da tabela
```

## Dependências

```bash
npm install
```

O projeto usa `pg` e não depende de `@vercel/postgres`.

## Variável de ambiente

Cadastre no ambiente local e no painel da Vercel:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Importante:
- Não use `@database_url`
- Não configure `DATABASE_URL` no `vercel.json`
- Use apenas `process.env.DATABASE_URL`

## Banco de dados

O schema de referência está em [sql/questions.sql](/c:/Isaac área de trabalho/✅ Concursos/DB_IA_Questões/sql/questions.sql).

A API também cria a tabela `questions` automaticamente se ela ainda não existir.

## Endpoints

- `GET /api/questions`: lista as questões salvas
- `POST /api/questions`: cria uma única questão
- `PUT /api/questions?id=1`: atualiza uma questão
- `DELETE /api/questions?id=1`: remove uma questão
- `POST /api/questions/bulk`: importa várias questões de uma vez

### Exemplo para importação em massa

```json
[
  {
    "disciplina": "Direito Penal",
    "assunto": "Crimes contra a pessoa",
    "dificuldade": "Médio",
    "enunciado": "O homicídio culposo...",
    "gabarito": "C",
    "justificativa": "Porque o art. 121...",
    "fonte": "CP, art. 121"
  }
]
```

### Regras de validação

- O corpo de `/api/questions/bulk` deve ser um array JSON
- Cada item deve ser um objeto válido
- Campos obrigatórios: `disciplina`, `assunto`, `dificuldade`, `enunciado`, `gabarito`
- `dificuldade` aceita apenas `Fácil`, `Médio` ou `Difícil`
- `gabarito` aceita apenas `C` ou `E`

Quando houver erro, a API retorna uma mensagem principal e uma lista com os itens inválidos.

## Frontend

A tela principal em [public/index.html](/c:/Isaac área de trabalho/✅ Concursos/DB_IA_Questões/public/index.html) permite:

- Colar um bloco grande de questões em JSON
- Importar 50+ questões em uma única chamada
- Receber feedback visual de sucesso ou erro
- Consultar e filtrar as questões já salvas

## Setup local

```bash
cp .env.example .env
npm run dev
```

## Seed opcional

```bash
npm run seed
```

## Deploy na Vercel

1. Faça o deploy do projeto.
2. No painel da Vercel, adicione `DATABASE_URL` apontando para o Neon ou outro PostgreSQL compatível.
3. Redeploye o projeto.

Se o deploy falhar com a mensagem sobre `database_url` inexistente, revise o projeto na Vercel e confirme que a variável cadastrada é `DATABASE_URL` diretamente no painel, sem secret antigo.
