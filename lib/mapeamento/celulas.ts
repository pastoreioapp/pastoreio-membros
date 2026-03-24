import "server-only";

import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES } from "@/lib/mapeamento/constants";
import type { CelulaOption, LoadCelulasResult } from "@/lib/mapeamento/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const CELULAS_SELECT_COLUMNS =
  "id, nome, setor, lideres, dia_semana, horario, foto_url";
const DEFAULT_CELULA_PHOTOS_BUCKET = "celulas";
const LOAD_CELULAS_ERROR_MESSAGE =
  "Nao foi possivel carregar as celulas agora. Verifique a conexao com o Supabase.";

type CelulaRow = {
  id: string;
  nome: string;
  setor: string | null;
  lideres: string | null;
  dia_semana: string | null;
  horario: string | null;
  foto_url: string | null;
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
    setor: celula.setor,
    lideres: celula.lideres,
    diaSemana: celula.dia_semana,
    horario: celula.horario,
    fotoUrl: resolvePhotoUrl(celula.foto_url),
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
  const result = await loadCelulaOptions();

  if (result.loadError) {
    return result;
  }

  const celula = result.celulas.find((item) => item.id === celulaId);

  if (!celula) {
    return {
      celulas: [],
      loadError:
        "Nao foi possivel localizar a celula vinculada a este codigo. Atualize os codigos cadastrados.",
    };
  }

  return {
    celulas: [celula],
    loadError: null,
  };
}
