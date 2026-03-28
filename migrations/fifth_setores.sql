CREATE TABLE mapeamento.setores (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT NULL,
  lideres TEXT NULL,
  codigo_acesso TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),

  CONSTRAINT setores_pkey PRIMARY KEY (id),
  CONSTRAINT setores_nome_key UNIQUE (nome)
);

ALTER TABLE mapeamento.celulas
ADD COLUMN setor_id UUID NULL;

ALTER TABLE mapeamento.celulas
ADD CONSTRAINT celulas_setor_id_fkey
FOREIGN KEY (setor_id)
REFERENCES mapeamento.setores (id)
ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_celulas_setor_id
ON mapeamento.celulas (setor_id);
