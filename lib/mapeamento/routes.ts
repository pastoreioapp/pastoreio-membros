export function buildLeaderMembersRoute(accessCode: string) {
  return `/lider/${encodeURIComponent(accessCode)}`;
}

export function buildLeaderNewMemberRoute(accessCode: string) {
  return `${buildLeaderMembersRoute(accessCode)}/novo`;
}

export function buildMemberSelfRegistrationRoute(accessCode: string) {
  return `/membro/${encodeURIComponent(accessCode)}`;
}
