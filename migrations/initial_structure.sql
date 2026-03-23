-- Criar o schema caso não exista
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Criar o schema caso não exista
CREATE SCHEMA IF NOT EXISTS mapeamento;

-- Tabela de Células
CREATE TABLE IF NOT EXISTS mapeamento.celulas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    setor TEXT,
    lideres TEXT,
    dia_semana TEXT,
    horario TEXT,
    foto_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Membros
CREATE TABLE IF NOT EXISTS mapeamento.membros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    celula_id UUID REFERENCES mapeamento.celulas(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    -- Lista de strings que correspondem aos valores do Enum TS
    passos_concluidos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mapeamento_membros_celula_id
    ON mapeamento.membros(celula_id);