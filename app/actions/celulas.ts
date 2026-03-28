"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  buildSaveCelulaErrorState,
  createCelula,
  validateCreateCelulaFormData,
} from "@/lib/mapeamento/celulas";
import { buildSetorCelulasRoute } from "@/lib/mapeamento/routes";
import { CELULA_FORM_FIELDS } from "@/lib/mapeamento/constants";
import type { SaveCelulaState } from "@/lib/mapeamento/types";

function readSetorAccessCode(formData: FormData) {
  return typeof formData.get(CELULA_FORM_FIELDS.setorCodigoAcesso) === "string"
    ? (formData.get(CELULA_FORM_FIELDS.setorCodigoAcesso) as string)
    : "";
}

export async function saveSetorCelulaAction(
  _prevState: SaveCelulaState,
  formData: FormData
): Promise<SaveCelulaState> {
  const setorAccessCode = readSetorAccessCode(formData);
  const validation = await validateCreateCelulaFormData(formData);

  if (!validation.success) {
    return validation.state;
  }

  const result = await createCelula(validation.data);

  if (result.success) {
    revalidatePath(buildSetorCelulasRoute(setorAccessCode));
    redirect(buildSetorCelulasRoute(setorAccessCode));
  }

  return buildSaveCelulaErrorState(result.message);
}
