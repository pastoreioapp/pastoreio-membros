import "server-only";

import { TodosPassosTrajetoria, type PassoTrajetoria } from "@/lib/trajetoria";
import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES } from "@/lib/constants";
import type { MemberFormValues, MemberListItem } from "@/lib/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const PASSOS_VALIDOS = new Set<string>(TodosPassosTrajetoria);

const MEMBERS_SELECT_COLUMNS =
  "id, nome, celula_id, estado_civil, telefone, data_nascimento, discipulador_nome, ministerios, passos_concluidos, created_at";

const LOAD_MEMBERS_ERROR_MESSAGE =
  "Nao foi possivel carregar os membros agora. Verifique a conexao com o Supabase e tente novamente.";

type MemberRow = {
  id: string;
  nome: string;
  celula_id: string | null;
  estado_civil: string | null;
  telefone: string | null;
  data_nascimento: string | null;
  discipulador_nome: string | null;
  ministerios: string[] | null;
  passos_concluidos: string[] | null;
  created_at: string | null;
};

function mapMemberRowToListItem(member: MemberRow): MemberListItem {
  const passosConcluidos = (member.passos_concluidos ?? []).filter((passo): passo is PassoTrajetoria =>
    PASSOS_VALIDOS.has(passo)
  ) as PassoTrajetoria[];

  return {
    id: member.id,
    nome: member.nome,
    celulaId: member.celula_id,
    estadoCivil: member.estado_civil,
    telefone: member.telefone,
    dataNascimento: member.data_nascimento,
    discipuladorNome: member.discipulador_nome,
    ministerios: member.ministerios ?? [],
    passosConcluidos,
    createdAt: member.created_at ?? new Date(0).toISOString(),
  };
}

export async function loadMembersByCelulaId(
  celulaId: string
): Promise<{ members: MemberListItem[]; loadError: string | null }> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return {
      members: [],
      loadError: configError,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.membros)
      .select(MEMBERS_SELECT_COLUMNS)
      .eq("celula_id", celulaId)
      .order("nome", { ascending: true });

    if (error) {
      throw error;
    }

    return {
      members: ((data ?? []) as MemberRow[]).map(mapMemberRowToListItem),
      loadError: null,
    };
  } catch {
    return {
      members: [],
      loadError: LOAD_MEMBERS_ERROR_MESSAGE,
    };
  }
}

export async function loadMemberByIdAndCelulaId(
  memberId: string,
  celulaId: string
): Promise<{ member: MemberListItem | null; loadError: string | null }> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return {
      member: null,
      loadError: configError,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.membros)
      .select(MEMBERS_SELECT_COLUMNS)
      .eq("id", memberId)
      .eq("celula_id", celulaId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return {
      member: data ? mapMemberRowToListItem(data as MemberRow) : null,
      loadError: null,
    };
  } catch {
    return {
      member: null,
      loadError: LOAD_MEMBERS_ERROR_MESSAGE,
    };
  }
}

export async function loadMembersByUnidadeId(
  unidadeId: string
): Promise<{ members: MemberListItem[]; loadError: string | null }> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return { members: [], loadError: configError };
  }

  try {
    const supabase = getSupabaseServerClient();

    const { data: celulas, error: celulasError } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.celulas)
      .select("id")
      .eq("unidade_id", unidadeId);

    if (celulasError) {
      throw celulasError;
    }

    const celulaIds = (celulas ?? []).map((c: { id: string }) => c.id);

    if (celulaIds.length === 0) {
      return { members: [], loadError: null };
    }

    const { data, error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.membros)
      .select(MEMBERS_SELECT_COLUMNS)
      .in("celula_id", celulaIds)
      .order("nome", { ascending: true });

    if (error) {
      throw error;
    }

    return {
      members: ((data ?? []) as MemberRow[]).map(mapMemberRowToListItem),
      loadError: null,
    };
  } catch {
    return { members: [], loadError: LOAD_MEMBERS_ERROR_MESSAGE };
  }
}

export function mapMemberToFormValues(member: MemberListItem): MemberFormValues {
  return {
    id: member.id,
    nome: member.nome,
    celulaId: member.celulaId ?? "",
    estadoCivil: member.estadoCivil ?? "",
    telefone: member.telefone ?? "",
    dataNascimento: member.dataNascimento ?? "",
    discipuladorNome: member.discipuladorNome ?? "",
    ministerios: member.ministerios.join(", "),
    passosConcluidos: member.passosConcluidos,
  };
}
