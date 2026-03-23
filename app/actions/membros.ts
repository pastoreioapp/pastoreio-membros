"use server";

import { revalidatePath } from "next/cache";

import { TodosPassosTrajetoria } from "@/app/types/trajetoria";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PASSOS_VALIDOS = new Set<string>(TodosPassosTrajetoria);

export type SaveMemberState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: {
    nome?: string;
    celulaId?: string;
    passos?: string;
  };
};

export const initialSaveMemberState: SaveMemberState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

function readTrimmedString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getSelectedPassos(formData: FormData) {
  const selected = formData
    .getAll("passos_concluidos")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim());

  return [...new Set(selected)];
}

export async function saveMemberAction(
  _prevState: SaveMemberState,
  formData: FormData
): Promise<SaveMemberState> {
  const nome = readTrimmedString(formData.get("nome"));
  const celulaId = readTrimmedString(formData.get("celula_id"));
  const passosConcluidos = getSelectedPassos(formData);

  const fieldErrors: SaveMemberState["fieldErrors"] = {};

  if (!nome) {
    fieldErrors.nome = "Informe o nome do membro.";
  } else if (nome.length > 120) {
    fieldErrors.nome = "Use um nome com no maximo 120 caracteres.";
  }

  if (!celulaId) {
    fieldErrors.celulaId = "Selecione a celula que o membro frequenta.";
  } else if (!UUID_REGEX.test(celulaId)) {
    fieldErrors.celulaId = "A celula selecionada e invalida.";
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
      status: "error",
      message: "Revise os campos destacados e tente novamente.",
      fieldErrors,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .schema("mapeamento")
      .from("membros")
      .insert({
        nome,
        celula_id: celulaId,
        passos_concluidos: passosConcluidos,
      });

    if (error) {
      return {
        status: "error",
        message:
          "Nao foi possivel salvar o membro agora. Verifique a conexao com o Supabase e tente novamente.",
        fieldErrors: {},
      };
    }

    revalidatePath("/");

    return {
      status: "success",
      message: "Membro salvo com sucesso.",
      fieldErrors: {},
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Ocorreu um erro inesperado ao salvar o membro.",
      fieldErrors: {},
    };
  }
}
