CREATE TABLE IF NOT EXISTS mapeamento.tipos_unidade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL UNIQUE,
    nivel INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mapeamento.unidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nome TEXT NOT NULL,
    descricao TEXT,
    lideres TEXT,

    tipo_id UUID NOT NULL REFERENCES mapeamento.tipos_unidade(id),

    parent_id UUID NULL REFERENCES mapeamento.unidades(id) ON DELETE SET NULL,

    codigo_acesso TEXT UNIQUE,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE mapeamento.celulas
ADD COLUMN unidade_id UUID;

ALTER TABLE mapeamento.celulas
ADD CONSTRAINT celulas_unidade_fk
FOREIGN KEY (unidade_id)
REFERENCES mapeamento.unidades(id)
ON DELETE SET NULL;


-- Seed reference data and migrate existing setores into unidades

INSERT INTO mapeamento.tipos_unidade (id, nome, nivel) VALUES
('11111111-1111-1111-1111-111111111111', 'SEDE', 5),
('22222222-2222-2222-2222-222222222222', 'REDE', 4),
('33333333-3333-3333-3333-333333333333', 'DISTRITO', 3),
('44444444-4444-4444-4444-444444444444', 'AREA', 2),
('55555555-5555-5555-5555-555555555555', 'SETOR', 1)
ON CONFLICT (nome) DO NOTHING;

INSERT INTO mapeamento.unidades (
    id, nome, lideres, tipo_id, parent_id, codigo_acesso
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Sede Fortaleza',
    'Pastor Sandro e Pastora Albea',
    '11111111-1111-1111-1111-111111111111',
    NULL,
    'SEDE001'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO mapeamento.unidades (
    id, nome, lideres, tipo_id, parent_id, codigo_acesso
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Rede Amarela',
    'Pastor Jean e Pastora Paizinha',
    '22222222-2222-2222-2222-222222222222',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'REDE001'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO mapeamento.unidades (
    id,
    nome,
    lideres,
    tipo_id,
    parent_id,
    codigo_acesso
)
SELECT
    s.id,
    s.nome,
    s.lideres,
    '55555555-5555-5555-5555-555555555555',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    s.codigo_acesso
FROM mapeamento.setores s
ON CONFLICT (id) DO NOTHING;


-- Backfill celulas.unidade_id now that unidades is populated

UPDATE mapeamento.celulas c
SET unidade_id = u.id
FROM mapeamento.unidades u
WHERE c.setor_id = u.id;


-- Performance indexes

CREATE INDEX IF NOT EXISTS idx_celulas_unidade_id
ON mapeamento.celulas(unidade_id);

CREATE INDEX IF NOT EXISTS idx_unidades_parent_id
ON mapeamento.unidades(parent_id);