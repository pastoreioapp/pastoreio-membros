ALTER TABLE mapeamento.membros
DROP COLUMN serve_ministerio;

ALTER TABLE mapeamento.membros
ADD COLUMN ministerios TEXT[];
