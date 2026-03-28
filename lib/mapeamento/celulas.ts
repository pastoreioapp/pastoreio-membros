import "server-only";

import { cache } from "react";

import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES } from "@/lib/mapeamento/constants";
import type { CelulaOption, LoadCelulasResult } from "@/lib/mapeamento/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const CELULAS_SELECT_COLUMNS =
  "id, nome, setor_id, lideres, dia_semana, horario, foto_url, codigo_acesso, setores(nome)";
const DEFAULT_CELULA_PHOTOS_BUCKET = "celulas";
const LOAD_CELULAS_ERROR_MESSAGE =
  "Nao foi possivel carregar as celulas agora. Verifique a conexao com o Supabase.";

type SetorJoin = { nome: string };

type CelulaRow = {
  id: string;
  nome: string;
  setor_id: string | null;
  lideres: string | null;
  dia_semana: string | null;
  horario: string | null;
  foto_url: string | null;
  codigo_acesso: string | null;
  setores: SetorJoin | SetorJoin[] | null;
};

function isAbsoluteUrl(value: string) {
  try {
    new URL(value);

    return true;
  } catch {
    return false;
  }
}

function resolveCelulaPhotoUrl(
  fotoUrl: string | null,
  supabaseUrl: string,
  bucket: string,
  getPublicUrl: (path: string) => string
) {
  if (!fotoUrl) {
    return null;
  }

  if (isAbsoluteUrl(fotoUrl)) {
    return fotoUrl;
  }

  if (fotoUrl.startsWith("/storage/")) {
    return new URL(fotoUrl, supabaseUrl).toString();
  }

  const normalizedPath = fotoUrl.replace(/^\/+/, "");
  const pathWithoutBucket = normalizedPath.startsWith(`${bucket}/`)
    ? normalizedPath.slice(bucket.length + 1)
    : normalizedPath;

  return getPublicUrl(pathWithoutBucket);
}

function mapCelulaRowToOption(
  celula: CelulaRow,
  resolvePhotoUrl: (fotoUrl: string | null) => string | null
): CelulaOption {
  return {
    id: celula.id,
    nome: celula.nome,
    setor: Array.isArray(celula.setores)
      ? celula.setores[0]?.nome ?? null
      : celula.setores?.nome ?? null,
    setorId: celula.setor_id,
    lideres: celula.lideres,
    diaSemana: celula.dia_semana,
    horario: celula.horario,
    fotoUrl: resolvePhotoUrl(celula.foto_url),
    codigoAcesso: celula.codigo_acesso,
  };
}

export async function loadCelulaOptions(): Promise<LoadCelulasResult> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return {
      celulas: [],
      loadError: configError,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const celulaPhotosBucket =
      process.env.NEXT_PUBLIC_SUPABASE_CELULAS_BUCKET ?? DEFAULT_CELULA_PHOTOS_BUCKET;
    const { data, error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.celulas)
      .select(CELULAS_SELECT_COLUMNS)
      .order("nome", { ascending: true });

    if (error) {
      throw error;
    }

    const celulas = ((data ?? []) as CelulaRow[]).map((celula) =>
      mapCelulaRowToOption(celula, (fotoUrl) =>
        supabaseUrl
          ? resolveCelulaPhotoUrl(
              fotoUrl,
              supabaseUrl,
              celulaPhotosBucket,
              (path) =>
                supabase.storage.from(celulaPhotosBucket).getPublicUrl(path).data.publicUrl
            )
          : null
      )
    );

    return {
      celulas,
      loadError: null,
    };
  } catch {
    return {
      celulas: [],
      loadError: LOAD_CELULAS_ERROR_MESSAGE,
    };
  }
}

export async function loadCelulaOptionById(
  celulaId: string
): Promise<LoadCelulasResult> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return {
      celulas: [],
      loadError: configError,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const celulaPhotosBucket =
      process.env.NEXT_PUBLIC_SUPABASE_CELULAS_BUCKET ?? DEFAULT_CELULA_PHOTOS_BUCKET;
    const { data, error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.celulas)
      .select(CELULAS_SELECT_COLUMNS)
      .eq("id", celulaId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return {
        celulas: [],
        loadError:
          "Nao foi possivel localizar a celula vinculada a este codigo. Atualize os codigos cadastrados.",
      };
    }

    const celula = mapCelulaRowToOption(data as CelulaRow, (fotoUrl) =>
      supabaseUrl
        ? resolveCelulaPhotoUrl(
            fotoUrl,
            supabaseUrl,
            celulaPhotosBucket,
            (path) =>
              supabase.storage.from(celulaPhotosBucket).getPublicUrl(path).data.publicUrl
          )
        : null
    );

    return {
      celulas: [celula],
      loadError: null,
    };
  } catch {
    return {
      celulas: [],
      loadError: LOAD_CELULAS_ERROR_MESSAGE,
    };
  }
}

export async function loadCelulasBySetorId(
  setorId: string
): Promise<LoadCelulasResult> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return {
      celulas: [],
      loadError: configError,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const celulaPhotosBucket =
      process.env.NEXT_PUBLIC_SUPABASE_CELULAS_BUCKET ?? DEFAULT_CELULA_PHOTOS_BUCKET;
    const { data, error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.celulas)
      .select(CELULAS_SELECT_COLUMNS)
      .eq("setor_id", setorId)
      .order("nome", { ascending: true });

    if (error) {
      throw error;
    }

    const celulas = ((data ?? []) as CelulaRow[]).map((celula) =>
      mapCelulaRowToOption(celula, (fotoUrl) =>
        supabaseUrl
          ? resolveCelulaPhotoUrl(
              fotoUrl,
              supabaseUrl,
              celulaPhotosBucket,
              (path) =>
                supabase.storage.from(celulaPhotosBucket).getPublicUrl(path).data.publicUrl
            )
          : null
      )
    );

    return {
      celulas,
      loadError: null,
    };
  } catch {
    return {
      celulas: [],
      loadError: LOAD_CELULAS_ERROR_MESSAGE,
    };
  }
}

function normalizeAccessCodeValue(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function normalizeAccessCode(code: string | null | undefined) {
  return typeof code === "string" ? normalizeAccessCodeValue(code) : "";
}

export type ResolvedCelulaAccess = {
  code: string;
  celulaId: string;
  celulaNome: string;
  celula: CelulaOption;
};

export const loadCelulaByAccessCode = cache(
  async (rawCode: string | null | undefined): Promise<ResolvedCelulaAccess | null> => {
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
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const celulaPhotosBucket =
        process.env.NEXT_PUBLIC_SUPABASE_CELULAS_BUCKET ?? DEFAULT_CELULA_PHOTOS_BUCKET;
      const { data, error } = await supabase
        .schema(MAPEAMENTO_SCHEMA)
        .from(MAPEAMENTO_TABLES.celulas)
        .select(CELULAS_SELECT_COLUMNS)
        .eq("codigo_acesso", normalized)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      const row = data as CelulaRow;
      const celula = mapCelulaRowToOption(row, (fotoUrl) =>
        supabaseUrl
          ? resolveCelulaPhotoUrl(
              fotoUrl,
              supabaseUrl,
              celulaPhotosBucket,
              (path) =>
                supabase.storage.from(celulaPhotosBucket).getPublicUrl(path).data.publicUrl
            )
          : null
      );

      return {
        code: normalized,
        celulaId: celula.id,
        celulaNome: celula.nome,
        celula,
      };
    } catch {
      return null;
    }
  }
);
