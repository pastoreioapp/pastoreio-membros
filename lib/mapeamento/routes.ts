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

export function buildSetorCelulasRoute(accessCode: string) {
  return `/setor/${encodeURIComponent(accessCode)}`;
}
