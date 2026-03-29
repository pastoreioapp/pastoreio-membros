import "server-only";

import { CELULA_FORM_FIELDS } from "@/lib/constants";
import type {
  CreateCelulaInput,
  SaveCelulaFieldErrors,
  SaveCelulaState,
} from "@/lib/types";
import { initialSaveCelulaState } from "@/lib/types";
import {
  readTrimmedString,
  readOptionalTrimmedString,
  normalizeAccessCode,
} from "@/lib/form-helpers";

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
  const { loadUnidadeByAccessCode } = await import("@/lib/unidades");

  const nome = readTrimmedString(formData.get(CELULA_FORM_FIELDS.nome));
  const lideres = readOptionalTrimmedString(formData.get(CELULA_FORM_FIELDS.lideres));
  const diaSemana = readOptionalTrimmedString(formData.get(CELULA_FORM_FIELDS.diaSemana));
  const horario = readOptionalTrimmedString(formData.get(CELULA_FORM_FIELDS.horario));
  const codigoAcesso = readOptionalTrimmedString(formData.get(CELULA_FORM_FIELDS.codigoAcesso));
  const unidadeCodigoAcesso = readTrimmedString(
    formData.get(CELULA_FORM_FIELDS.unidadeCodigoAcesso)
  );

  const fieldErrors: SaveCelulaFieldErrors = {};
  const resolvedUnidade = await loadUnidadeByAccessCode(unidadeCodigoAcesso);

  if (!unidadeCodigoAcesso) {
    fieldErrors.unidadeCodigoAcesso = "Codigo de acesso da unidade e obrigatorio.";
  } else if (!resolvedUnidade) {
    fieldErrors.unidadeCodigoAcesso = "Codigo de acesso da unidade invalido.";
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
      unidadeId: resolvedUnidade!.unidadeId,
      lideres,
      diaSemana,
      horario,
      codigoAcesso: codigoAcesso ? normalizeAccessCode(codigoAcesso) : null,
    },
  };
}
