import "server-only";

import { TodosPassosTrajetoria, type PassoTrajetoria } from "@/lib/mapeamento/trajetoria";
import { loadCelulaByAccessCode } from "@/lib/mapeamento/celulas";
import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES, MEMBER_FORM_FIELDS } from "@/lib/mapeamento/constants";
import {
  initialSaveMemberState,
  type CreateMemberInput,
  type MemberFormValues,
  type MemberListItem,
  type SaveMemberFieldErrors,
  type SaveMemberState,
  type UpdateMemberInput,
} from "@/lib/mapeamento/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PASSOS_VALIDOS = new Set<string>(TodosPassosTrajetoria);
const SAVE_MEMBER_ERROR_MESSAGE =
  "Nao foi possivel salvar o membro agora. Verifique a conexao com o Supabase e tente novamente.";
export const SAVE_MEMBER_SUCCESS_MESSAGE = "Membro salvo com sucesso.";
export const UPDATE_MEMBER_SUCCESS_MESSAGE = "Membro atualizado com sucesso.";

type ValidateMemberFormResult =
  | { success: true; data: CreateMemberInput }
  | { success: false; state: SaveMemberState };

type ValidateUpdateMemberFormResult =
  | { success: true; data: UpdateMemberInput }
  | { success: false; state: SaveMemberState };

type PersistMemberResult =
  | { success: true }
  | { success: false; message: string };

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

function createSaveMemberState(
  status: SaveMemberState["status"],
  message: string | null,
  fieldErrors: SaveMemberFieldErrors = {}
): SaveMemberState {
  return {
    ...initialSaveMemberState,
    status,
    message,
    fieldErrors,
  };
}

function readTrimmedString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalTrimmedString(value: FormDataEntryValue | null) {
  const trimmed = readTrimmedString(value);
  return trimmed ? trimmed : null;
}

function normalizePhone(value: string | null) {
  if (!value) {
    return null;
  }

  const digits = value.replace(/\D/g, "");

  return digits ? digits : null;
}

function normalizeMinisterios(value: string | null) {
  if (!value) {
    return [];
  }

  return [...new Set(
    value
      .split(/[\n,;]/)
      .map((item) => item.trim())
      .filter(Boolean)
  )];
}

function isValidBirthDate(value: string | null) {
  if (!value) {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed.toISOString().slice(0, 10) === value;
}

function getSelectedPassos(formData: FormData) {
  const selected = formData
    .getAll(MEMBER_FORM_FIELDS.passosConcluidos)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim());

  return [...new Set(selected)];
}

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

async function validateMemberPayload(
  formData: FormData
): Promise<{
  fieldErrors: SaveMemberFieldErrors;
  payload: CreateMemberInput;
}> {
  const codigoAcesso = readTrimmedString(
    formData.get(MEMBER_FORM_FIELDS.codigoAcesso)
  );
  const nome = readTrimmedString(formData.get(MEMBER_FORM_FIELDS.nome));
  const celulaId = readTrimmedString(formData.get(MEMBER_FORM_FIELDS.celulaId));
  const estadoCivil = readOptionalTrimmedString(
    formData.get(MEMBER_FORM_FIELDS.estadoCivil)
  );
  const telefone = normalizePhone(
    readOptionalTrimmedString(formData.get(MEMBER_FORM_FIELDS.telefone))
  );
  const dataNascimento = readOptionalTrimmedString(
    formData.get(MEMBER_FORM_FIELDS.dataNascimento)
  );
  const discipuladorNome = readOptionalTrimmedString(
    formData.get(MEMBER_FORM_FIELDS.discipuladorNome)
  );
  const ministerios = normalizeMinisterios(
    readOptionalTrimmedString(formData.get(MEMBER_FORM_FIELDS.ministerios))
  );
  const passosConcluidos = getSelectedPassos(formData);
  const fieldErrors: SaveMemberFieldErrors = {};
  const resolvedAccess = await loadCelulaByAccessCode(codigoAcesso);

  if (!codigoAcesso) {
    fieldErrors.codigoAcesso = "Informe o codigo de acesso da celula.";
  } else if (!resolvedAccess) {
    fieldErrors.codigoAcesso =
      "Codigo de acesso invalido. Volte e informe um codigo valido.";
  }

  if (!nome) {
    fieldErrors.nome = "Informe o nome do membro.";
  } else if (nome.length > 120) {
    fieldErrors.nome = "Use um nome com no maximo 120 caracteres.";
  }

  if (estadoCivil && estadoCivil.length > 60) {
    fieldErrors.estadoCivil = "Use um estado civil com no maximo 60 caracteres.";
  }

  if (telefone && (telefone.length < 10 || telefone.length > 11)) {
    fieldErrors.telefone = "Informe um telefone com DDD valido.";
  }

  if (!isValidBirthDate(dataNascimento)) {
    fieldErrors.dataNascimento = "Informe uma data de nascimento valida.";
  }

  if (discipuladorNome && discipuladorNome.length > 120) {
    fieldErrors.discipuladorNome =
      "Use um nome de discipulador com no maximo 120 caracteres.";
  }

  const ministerioInvalido = ministerios.find((ministerio) => ministerio.length > 80);

  if (ministerioInvalido) {
    fieldErrors.ministerios =
      "Use nomes de ministerios com no maximo 80 caracteres cada.";
  }

  if (!celulaId) {
    fieldErrors.celulaId = "Selecione a celula que o membro frequenta.";
  } else if (!UUID_REGEX.test(celulaId)) {
    fieldErrors.celulaId = "A celula selecionada e invalida.";
  } else if (resolvedAccess && resolvedAccess.celulaId !== celulaId) {
    fieldErrors.celulaId =
      "A celula enviada nao corresponde ao codigo de acesso informado.";
  }

  const possuiPassoInvalido = passosConcluidos.some(
    (passo) => !PASSOS_VALIDOS.has(passo)
  );

  if (possuiPassoInvalido) {
    fieldErrors.passos =
      "Encontramos um passo invalido. Atualize a pagina e tente novamente.";
  }

  return {
    fieldErrors,
    payload: {
      nome,
      celulaId,
      estadoCivil,
      telefone,
      dataNascimento,
      discipuladorNome,
      ministerios,
      passosConcluidos: passosConcluidos as PassoTrajetoria[],
    },
  };
}

export async function validateCreateMemberFormData(
  formData: FormData
): Promise<ValidateMemberFormResult> {
  const { fieldErrors, payload } = await validateMemberPayload(formData);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: createSaveMemberState(
        "error",
        "Revise os campos destacados e tente novamente.",
        fieldErrors
      ),
    };
  }

  return {
    success: true,
    data: payload,
  };
}

export async function validateUpdateMemberFormData(
  formData: FormData
): Promise<ValidateUpdateMemberFormResult> {
  const memberId = readTrimmedString(formData.get(MEMBER_FORM_FIELDS.id));
  const { fieldErrors, payload } = await validateMemberPayload(formData);

  if (!memberId) {
    fieldErrors.id = "Nao identificamos o membro que sera atualizado.";
  } else if (!UUID_REGEX.test(memberId)) {
    fieldErrors.id = "O identificador do membro e invalido.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      state: createSaveMemberState(
        "error",
        "Revise os campos destacados e tente novamente.",
        fieldErrors
      ),
    };
  }

  return {
    success: true,
    data: {
      ...payload,
      id: memberId,
    },
  };
}

export async function createMember(
  input: CreateMemberInput
): Promise<PersistMemberResult> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return {
      success: false,
      message: configError,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.membros)
      .insert({
        nome: input.nome,
        celula_id: input.celulaId,
        estado_civil: input.estadoCivil,
        telefone: input.telefone,
        data_nascimento: input.dataNascimento,
        discipulador_nome: input.discipuladorNome,
        ministerios: input.ministerios,
        passos_concluidos: input.passosConcluidos,
      });

    if (error) {
      return {
        success: false,
        message: SAVE_MEMBER_ERROR_MESSAGE,
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: SAVE_MEMBER_ERROR_MESSAGE,
    };
  }
}

export async function updateMember(
  input: UpdateMemberInput
): Promise<PersistMemberResult> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return {
      success: false,
      message: configError,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.membros)
      .update({
        nome: input.nome,
        celula_id: input.celulaId,
        estado_civil: input.estadoCivil,
        telefone: input.telefone,
        data_nascimento: input.dataNascimento,
        discipulador_nome: input.discipuladorNome,
        ministerios: input.ministerios,
        passos_concluidos: input.passosConcluidos,
      })
      .eq("id", input.id)
      .eq("celula_id", input.celulaId)
      .select("id");

    if (error || (data?.length ?? 0) !== 1) {
      return {
        success: false,
        message: SAVE_MEMBER_ERROR_MESSAGE,
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: SAVE_MEMBER_ERROR_MESSAGE,
    };
  }
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
      .select(
        "id, nome, celula_id, estado_civil, telefone, data_nascimento, discipulador_nome, ministerios, passos_concluidos, created_at"
      )
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
      loadError: SAVE_MEMBER_ERROR_MESSAGE,
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
      .select(
        "id, nome, celula_id, estado_civil, telefone, data_nascimento, discipulador_nome, ministerios, passos_concluidos, created_at"
      )
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
      loadError: SAVE_MEMBER_ERROR_MESSAGE,
    };
  }
}

export async function loadMembersBySetorId(
  setorId: string
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
      .eq("setor_id", setorId);

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
      .select(
        "id, nome, celula_id, estado_civil, telefone, data_nascimento, discipulador_nome, ministerios, passos_concluidos, created_at"
      )
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
    return { members: [], loadError: SAVE_MEMBER_ERROR_MESSAGE };
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

export function buildSaveMemberErrorState(message: string): SaveMemberState {
  return createSaveMemberState("error", message);
}

export function buildSaveMemberSuccessState(): SaveMemberState {
  return createSaveMemberState("success", SAVE_MEMBER_SUCCESS_MESSAGE);
}

export function buildUpdateMemberSuccessState(): SaveMemberState {
  return createSaveMemberState("success", UPDATE_MEMBER_SUCCESS_MESSAGE);
}
