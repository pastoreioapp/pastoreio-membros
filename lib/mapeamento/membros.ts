import "server-only";

import { TodosPassosTrajetoria, type PassoTrajetoria } from "@/app/types/trajetoria";
import { resolveCelulaAccess } from "@/lib/mapeamento/acesso";
import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES, MEMBER_FORM_FIELDS } from "@/lib/mapeamento/constants";
import {
  initialSaveMemberState,
  type CreateMemberInput,
  type MemberListItem,
  type SaveMemberFieldErrors,
  type SaveMemberState,
} from "@/lib/mapeamento/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PASSOS_VALIDOS = new Set<string>(TodosPassosTrajetoria);
const SAVE_MEMBER_ERROR_MESSAGE =
  "Nao foi possivel salvar o membro agora. Verifique a conexao com o Supabase e tente novamente.";
export const SAVE_MEMBER_SUCCESS_MESSAGE = "Membro salvo com sucesso.";

type ValidateMemberFormResult =
  | { success: true; data: CreateMemberInput }
  | { success: false; state: SaveMemberState };

type PersistMemberResult =
  | { success: true }
  | { success: false; message: string };

type MemberRow = {
  id: string;
  nome: string;
  celula_id: string | null;
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
    passosConcluidos,
    createdAt: member.created_at ?? new Date(0).toISOString(),
  };
}

export function validateCreateMemberFormData(
  formData: FormData
): ValidateMemberFormResult {
  const codigoAcesso = readTrimmedString(
    formData.get(MEMBER_FORM_FIELDS.codigoAcesso)
  );
  const nome = readTrimmedString(formData.get(MEMBER_FORM_FIELDS.nome));
  const celulaId = readTrimmedString(formData.get(MEMBER_FORM_FIELDS.celulaId));
  const passosConcluidos = getSelectedPassos(formData);
  const fieldErrors: SaveMemberFieldErrors = {};
  const resolvedAccess = resolveCelulaAccess(codigoAcesso);

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
      nome,
      celulaId,
      passosConcluidos: passosConcluidos as PassoTrajetoria[],
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
      .select("id, nome, celula_id, passos_concluidos, created_at")
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

export function buildSaveMemberErrorState(message: string): SaveMemberState {
  return createSaveMemberState("error", message);
}

export function buildSaveMemberSuccessState(): SaveMemberState {
  return createSaveMemberState("success", SAVE_MEMBER_SUCCESS_MESSAGE);
}
