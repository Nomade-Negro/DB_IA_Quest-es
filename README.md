# Banco de Questões IA

Aplicação fullstack com frontend estático em `public/`, API serverless em `api/` e persistência real no PostgreSQL via `DATABASE_URL`.

## Estrutura

```text
/api
  questoes.js    # CRUD serverless
/lib
  db.js          # Pool PostgreSQL + inicialização da tabela
/public
  index.html     # Interface web
```

## Stack

- Frontend: HTML, CSS e JavaScript vanilla
- Backend: Node.js serverless na Vercel
- Banco: PostgreSQL externo (Neon, Supabase, Railway, etc.)
- Driver: `pg`

## Variáveis de ambiente

Crie a variável abaixo localmente e também no painel da Vercel:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Importante:
- Não use `@database_url`
- Não configure `DATABASE_URL` no `vercel.json`
- O projeto usa apenas `process.env.DATABASE_URL`

## Setup local

```bash
npm install
cp .env.example .env
npm run dev
```

## Seed opcional

```bash
npm run seed
```

## API

- `GET /api/questoes`: lista as questões
- `POST /api/questoes`: cria uma questão
- `PUT /api/questoes?id=1`: atualiza uma questão
- `DELETE /api/questoes?id=1`: remove uma questão

Payload esperado para `POST` e `PUT`:

```json
{
  "disciplina": "Direito Penal",
  "assunto": "Crimes contra a pessoa",
  "dificuldade": "Médio",
  "enunciado": "O homicídio culposo...",
  "gabarito": "E",
  "justificativa": "Porque...",
  "fonte": "CP, art. 121"
}
```

## Deploy na Vercel

1. Faça o deploy do projeto.
2. No painel da Vercel, adicione `DATABASE_URL` com a string do seu PostgreSQL.
3. Redeploye o projeto.

A API cria a tabela `questoes` automaticamente se ela ainda não existir.
