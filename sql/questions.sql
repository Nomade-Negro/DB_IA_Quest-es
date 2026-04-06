CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  disciplina TEXT NOT NULL,
  assunto TEXT NOT NULL,
  dificuldade TEXT CHECK (dificuldade IN ('Fácil','Médio','Difícil')),
  enunciado TEXT NOT NULL,
  gabarito CHAR(1) CHECK (gabarito IN ('C','E')),
  justificativa TEXT,
  fonte TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
