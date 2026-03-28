import "server-only";

import { cache } from "react";

import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES, CELULA_FORM_FIELDS } from "@/lib/mapeamento/constants";
import type {
  CelulaOption,
  CreateCelulaInput,
  LoadCelulasResult,
  SaveCelulaFieldErrors,
  SaveCelulaState,
} from "@/lib/mapeamento/types";
import { initialSaveCelulaState } from "@/lib/mapeamento/types";
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

const SAVE_CELULA_ERROR_MESSAGE =
  "Nao foi possivel salvar a celula agora. Verifique a conexao com o Supabase e tente novamente.";

function readTrimmedString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalTrimmedString(value: FormDataEntryValue | null) {
  const trimmed = readTrimmedString(value);
  return trimmed ? trimmed : null;
}

function createSaveCelulaState(
  status: SaveCelulaState["status"],
  message: string | null,
  fieldErrors: SaveCelulaFieldErrors = {}
): SaveCelulaState {
  return { ...initialSaveCelulaState, status, message, fieldErrors };
}

export function buildSaveCelulaErrorState(message: string): SaveCelulaState {
  return createSaveCelulaState("error", message);
}

type ValidateCreateCelulaResult =
  | { success: true; data: CreateCelulaInput }
  | { success: false; state: SaveCelulaState };

export async function validateCreateCelulaFormData(
  formData: FormData
): Promise<ValidateCreateCelulaResult> {
  const { loadSetorByAccessCode } = await import("@/lib/mapeamento/setores");

  const nome = readTrimmedString(formData.get(CELULA_FORM_FIELDS.nome));
  const lideres = readOptionalTrimmedString(formData.get(CELULA_FORM_FIELDS.lideres));
  const diaSemana = readOptionalTrimmedString(formData.get(CELULA_FORM_FIELDS.diaSemana));
  const horario = readOptionalTrimmedString(formData.get(CELULA_FORM_FIELDS.horario));
  const codigoAcesso = readOptionalTrimmedString(formData.get(CELULA_FORM_FIELDS.codigoAcesso));
  const setorCodigoAcesso = readTrimmedString(
    formData.get(CELULA_FORM_FIELDS.setorCodigoAcesso)
  );

  const fieldErrors: SaveCelulaFieldErrors = {};
  const resolvedSetor = await loadSetorByAccessCode(setorCodigoAcesso);

  if (!setorCodigoAcesso) {
    fieldErrors.setorCodigoAcesso = "Codigo de acesso do setor e obrigatorio.";
  } else if (!resolvedSetor) {
    fieldErrors.setorCodigoAcesso = "Codigo de acesso do setor invalido.";
  }

  if (!nome) {
    fieldErrors.nome = "Informe o nome da celula.";
  } else if (nome.length > 120) {
    fieldErrors.nome = "Use um nome com no maximo 120 caracteres.";
  }

  if (lideres && lideres.length > 200) {
    fieldErrors.lideres = "Use nomes de lideres com no maximo 200 caracteres.";
  }

  if (diaSemana && diaSemana.length > 60) {
    fieldErrors.diaSemana = "Use um dia da semana com no maximo 60 caracteres.";
  }

  if (horario && horario.length > 60) {
    fieldErrors.horario = "Use um horario com no maximo 60 caracteres.";
  }

  if (codigoAcesso) {
    const normalizedCelulaCode = normalizeAccessCode(codigoAcesso);
    if (normalizedCelulaCode.length < 3) {
      fieldErrors.codigoAcesso = "O codigo de acesso deve ter pelo menos 3 caracteres.";
    } else if (normalizedCelulaCode.length > 20) {
      fieldErrors.codigoAcesso = "O codigo de acesso deve ter no maximo 20 caracteres.";
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: createSaveCelulaState(
        "error",
        "Revise os campos destacados e tente novamente.",
        fieldErrors
      ),
    };
  }

  return {
    success: true,
    data: {
      nome,
      setorId: resolvedSetor!.setorId,
      lideres,
      diaSemana,
      horario,
      codigoAcesso: codigoAcesso ? normalizeAccessCode(codigoAcesso) : null,
    },
  };
}

type PersistCelulaResult =
  | { success: true }
  | { success: false; message: string };

export async function createCelula(
  input: CreateCelulaInput
): Promise<PersistCelulaResult> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return { success: false, message: configError };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.celulas)
      .insert({
        nome: input.nome,
        setor_id: input.setorId,
        lideres: input.lideres,
        dia_semana: input.diaSemana,
        horario: input.horario,
        codigo_acesso: input.codigoAcesso,
      });

    if (error) {
      if (error.code === "23505" && error.message?.includes("codigo_acesso")) {
        return {
          success: false,
          message: "Ja existe uma celula com esse codigo de acesso. Escolha outro codigo.",
        };
      }
      return { success: false, message: SAVE_CELULA_ERROR_MESSAGE };
    }

    return { success: true };
  } catch {
    return { success: false, message: SAVE_CELULA_ERROR_MESSAGE };
  }
}
