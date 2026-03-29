export const MAPEAMENTO_SCHEMA = "mapeamento";

export const MAPEAMENTO_TABLES = {
  celulas: "celulas",
  membros: "membros",
  setores: "setores",
  unidades: "unidades",
  tipos_unidade: "tipos_unidade",
} as const;

export const MEMBER_FORM_FIELDS = {
  id: "id",
  nome: "nome",
  estadoCivil: "estado_civil",
  telefone: "telefone",
  dataNascimento: "data_nascimento",
  discipuladorNome: "discipulador_nome",
  ministerios: "ministerios",
  celulaId: "celula_id",
  passosConcluidos: "passos_concluidos",
  codigoAcesso: "codigo_acesso",
} as const;

export const CELULA_FORM_FIELDS = {
  nome: "nome",
  lideres: "lideres",
  diaSemana: "dia_semana",
  horario: "horario",
  codigoAcesso: "codigo_acesso",
  unidadeCodigoAcesso: "unidade_codigo_acesso",
} as const;

export const ACCESS_CODE_SEARCH_PARAM = "codigo";
export const ACCESS_TYPE_SEARCH_PARAM = "tipo";

export type AccessType = "celula" | "setor";
export const ACCESS_TYPE_CELULA: AccessType = "celula";
export const ACCESS_TYPE_SETOR: AccessType = "setor";
export const ACCESS_TYPE_UNIDADE = ACCESS_TYPE_SETOR;
