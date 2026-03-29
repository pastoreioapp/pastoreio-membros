import "server-only";

import { cache } from "react";

import { normalizeAccessCode } from "@/lib/form-helpers";
import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES } from "@/lib/constants";
import type { UnidadeOption } from "@/lib/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const UNIDADES_SELECT_COLUMNS =
  "id, nome, descricao, lideres, codigo_acesso, tipos_unidade(nome)";

type TipoUnidadeJoin = { nome: string };

type UnidadeRow = {
  id: string;
  nome: string;
  descricao: string | null;
  lideres: string | null;
  codigo_acesso: string | null;
  tipos_unidade: TipoUnidadeJoin | TipoUnidadeJoin[] | null;
};

function extractTipoNome(join: UnidadeRow["tipos_unidade"]): string {
  if (Array.isArray(join)) {
    return join[0]?.nome ?? "SETOR";
  }
  return join?.nome ?? "SETOR";
}

function mapUnidadeRowToOption(row: UnidadeRow): UnidadeOption {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    lideres: row.lideres,
    codigoAcesso: row.codigo_acesso,
    tipo: extractTipoNome(row.tipos_unidade),
  };
}

export type ResolvedUnidadeAccess = {
  code: string;
  unidadeId: string;
  unidade: UnidadeOption;
};

export const loadUnidadeByAccessCode = cache(
  async (rawCode: string | null | undefined): Promise<ResolvedUnidadeAccess | null> => {
    const normalized = normalizeAccessCode(rawCode);

    if (!normalized) {
      return null;
    }

    const configError = getSupabaseConfigError();

    if (configError) {
      return null;
    }

    try {
      const supabase = getSupabaseServerClient();
      const { data, error } = await supabase
        .schema(MAPEAMENTO_SCHEMA)
        .from(MAPEAMENTO_TABLES.unidades)
        .select(UNIDADES_SELECT_COLUMNS)
        .eq("codigo_acesso", normalized)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      const unidade = mapUnidadeRowToOption(data as UnidadeRow);

      return {
        code: normalized,
        unidadeId: unidade.id,
        unidade,
      };
    } catch {
      return null;
    }
  }
);
