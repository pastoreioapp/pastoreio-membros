export function buildLeaderMembersRoute(accessCode: string) {
  return `/lider/${encodeURIComponent(accessCode)}`;
}

export function buildLeaderNewMemberRoute(accessCode: string) {
  return `${buildLeaderMembersRoute(accessCode)}/novo`;
}

export function buildLeaderEditMemberRoute(accessCode: string, memberId: string) {
  return `${buildLeaderMembersRoute(accessCode)}/membro/${encodeURIComponent(memberId)}`;
}

export function buildMemberSelfRegistrationRoute(accessCode: string) {
  return `/membro/${encodeURIComponent(accessCode)}`;
}

export function buildUnidadeRoute(accessCode: string) {
  return `/setor/${encodeURIComponent(accessCode)}`;
}

export function buildUnidadeNewCelulaRoute(accessCode: string) {
  return `${buildUnidadeRoute(accessCode)}/nova-celula`;
}

/** @deprecated Use `buildUnidadeRoute` */
export const buildSetorCelulasRoute = buildUnidadeRoute;

/** @deprecated Use `buildUnidadeNewCelulaRoute` */
export const buildSetorNewCelulaRoute = buildUnidadeNewCelulaRoute;
