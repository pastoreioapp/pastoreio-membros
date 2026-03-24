"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  buildSaveMemberErrorState,
  buildSaveMemberSuccessState,
  createMember,
  validateCreateMemberFormData,
} from "@/lib/mapeamento/membros";
import {
  buildLeaderMembersRoute,
  buildMemberSelfRegistrationRoute,
} from "@/lib/mapeamento/routes";
import { MEMBER_FORM_FIELDS } from "@/lib/mapeamento/constants";
import type { SaveMemberState } from "@/lib/mapeamento/types";

function readAccessCode(formData: FormData) {
  return typeof formData.get(MEMBER_FORM_FIELDS.codigoAcesso) === "string"
    ? (formData.get(MEMBER_FORM_FIELDS.codigoAcesso) as string)
    : "";
}

export async function saveLeaderMemberAction(
  _prevState: SaveMemberState,
  formData: FormData
): Promise<SaveMemberState> {
  const accessCode = readAccessCode(formData);
  const validation = validateCreateMemberFormData(formData);

  if (!validation.success) {
    return validation.state;
  }

  const result = await createMember(validation.data);

  if (result.success) {
    revalidatePath("/");
    revalidatePath(buildLeaderMembersRoute(accessCode));
    redirect(buildLeaderMembersRoute(accessCode));
  }

  return buildSaveMemberErrorState(result.message);
}

export async function saveSelfRegisterMemberAction(
  _prevState: SaveMemberState,
  formData: FormData
): Promise<SaveMemberState> {
  const accessCode = readAccessCode(formData);
  const validation = validateCreateMemberFormData(formData);

  if (!validation.success) {
    return validation.state;
  }

  const result = await createMember(validation.data);

  if (result.success) {
    revalidatePath(buildMemberSelfRegistrationRoute(accessCode));
    return buildSaveMemberSuccessState();
  }

  return buildSaveMemberErrorState(result.message);
}
