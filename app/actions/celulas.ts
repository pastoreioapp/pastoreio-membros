"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  buildSaveCelulaErrorState,
  createCelula,
  validateCreateCelulaFormData,
} from "@/lib/celulas";
import { buildSetorCelulasRoute } from "@/lib/routes";
import { CELULA_FORM_FIELDS } from "@/lib/constants";
import type { SaveCelulaState } from "@/lib/types";

function readUnidadeAccessCode(formData: FormData) {
  return typeof formData.get(CELULA_FORM_FIELDS.unidadeCodigoAcesso) === "string"
    ? (formData.get(CELULA_FORM_FIELDS.unidadeCodigoAcesso) as string)
    : "";
}

export async function saveSetorCelulaAction(
  _prevState: SaveCelulaState,
  formData: FormData
): Promise<SaveCelulaState> {
  const unidadeAccessCode = readUnidadeAccessCode(formData);
  const validation = await validateCreateCelulaFormData(formData);

  if (!validation.success) {
    return validation.state;
  }

  const result = await createCelula(validation.data);

  if (result.success) {
    revalidatePath(buildSetorCelulasRoute(unidadeAccessCode));
    redirect(buildSetorCelulasRoute(unidadeAccessCode));
  }

  return buildSaveCelulaErrorState(result.message);
}
