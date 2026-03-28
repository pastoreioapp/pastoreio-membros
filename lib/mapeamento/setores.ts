import "server-only";

import { cache } from "react";

import { normalizeAccessCode } from "@/lib/mapeamento/celulas";
import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES } from "@/lib/mapeamento/constants";
import type { SetorOption } from "@/lib/mapeamento/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const SETORES_SELECT_COLUMNS = "id, nome, descricao, lideres, codigo_acesso";

type SetorRow = {
  id: string;
  nome: string;
  descricao: string | null;
  lideres: string | null;
  codigo_acesso: string | null;
};

function mapSetorRowToOption(row: SetorRow): SetorOption {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    lideres: row.lideres,
    codigoAcesso: row.codigo_acesso,
  };
}

export type ResolvedSetorAccess = {
  code: string;
  setorId: string;
  setor: SetorOption;
};

export const loadSetorByAccessCode = cache(
  async (rawCode: string | null | undefined): Promise<ResolvedSetorAccess | null> => {
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
        .from(MAPEAMENTO_TABLES.setores)
        .select(SETORES_SELECT_COLUMNS)
        .eq("codigo_acesso", normalized)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      const setor = mapSetorRowToOption(data as SetorRow);

      return {
        code: normalized,
        setorId: setor.id,
        setor,
      };
    } catch {
      return null;
    }
  }
);
