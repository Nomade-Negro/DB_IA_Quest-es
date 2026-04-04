# Banco de Questões IA

Sistema de banco de questões para concursos públicos com frontend HTML/JS e backend PostgreSQL + API serverless.

## 🚀 Funcionalidades

- ✅ Banco de questões Certo/Errado
- 🔍 Filtros por disciplina, assunto, dificuldade e fonte
- 📊 Estatísticas de desempenho
- 💾 Persistência de respostas (localStorage)
- 🔄 API REST completa (CRUD)
- ☁️ Deploy serverless no Vercel

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + API Routes (Vercel)
- **Banco**: PostgreSQL
- **ORM**: Prisma
- **Deploy**: Vercel

## 📁 Estrutura do Projeto

```
/
├── api/
│   └── questoes.js          # API serverless (GET, POST, PUT, DELETE)
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
├── index.html               # Frontend principal
├── package.json             # Dependências
├── seed.js                  # Script para popular banco
└── .env.example             # Exemplo de variáveis de ambiente
```

## ⚙️ Setup Local

### 1. Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta no Vercel (opcional para deploy)

### 2. Instalação

```bash
# Clonar repositório
git clone <url-do-repo>
cd banco-questoes-ia

# Instalar dependências
npm install

# Configurar banco de dados
cp .env.example .env
# Edite .env com suas credenciais PostgreSQL
```

### 3. Configurar Banco

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar tabelas no banco
npx prisma db push

# Popular com questões iniciais
node seed.js
```

### 4. Desenvolvimento Local

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

## 🚀 Deploy no Vercel

### 1. Configurar PostgreSQL

Use um provedor como:
- Vercel Postgres
- Neon
- Supabase
- Railway

### 2. Deploy

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Adicionar variável de ambiente
vercel env add DATABASE_URL
```

### 3. Configurar Prisma

Após deploy, execute:

```bash
# Conectar ao banco de produção
npx prisma db push

# Popular questões
npx vercel env pull .env.local
node seed.js
```

## 📡 API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/questoes` | Listar todas as questões |
| POST | `/api/questoes` | Criar nova questão |
| PUT | `/api/questoes?id=1` | Atualizar questão |
| DELETE | `/api/questoes?id=1` | Deletar questão |

### Exemplo de Uso da API

```javascript
// Buscar questões
const response = await fetch('/api/questoes');
const questoes = await response.json();

// Criar questão
await fetch('/api/questoes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    disciplina: 'Direito Penal',
    assunto: 'Crimes contra pessoa',
    dificuldade: 'Difícil',
    enunciado: 'O homicídio culposo...',
    gabarito: 'E',
    justificativa: 'Porque...',
    fonte: 'CP, art. 121'
  })
});
```

## 🗄️ Modelo de Dados

```sql
CREATE TABLE questoes (
  id SERIAL PRIMARY KEY,
  disciplina TEXT NOT NULL,
  assunto TEXT NOT NULL,
  dificuldade TEXT NOT NULL,
  enunciado TEXT NOT NULL,
  gabarito CHAR(1) CHECK (gabarito IN ('C','E')),
  justificativa TEXT,
  fonte TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Desenvolvimento

### Adicionar Novas Questões

1. Via API (POST `/api/questoes`)
2. Ou diretamente no banco
3. Ou modificando `seed.js`

### Personalização

- **CSS**: Edite os estilos em `index.html`
- **Funcionalidades**: Modifique o JavaScript em `index.html`
- **API**: Edite `api/questoes.js`

## 📝 Licença

MIT