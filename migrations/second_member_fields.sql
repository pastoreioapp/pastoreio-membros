ALTER TABLE mapeamento.membros
ADD COLUMN estado_civil TEXT,
ADD COLUMN telefone TEXT,
ADD COLUMN data_nascimento DATE,
ADD COLUMN discipulador_nome TEXT,
ADD COLUMN serve_ministerio BOOLEAN DEFAULT FALSE;
