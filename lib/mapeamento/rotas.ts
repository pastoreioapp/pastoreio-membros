import "server-only";

import { resolveCelulaAccess } from "@/lib/mapeamento/acesso";
import { loadCelulaOptionById } from "@/lib/mapeamento/celulas";

export async function resolveLeaderRouteAccess(code: string) {
  const access = resolveCelulaAccess(code);

  if (!access) {
    return null;
  }

  const { celulas, loadError } = await loadCelulaOptionById(access.celulaId);

  if (loadError || celulas.length === 0) {
    return null;
  }

  return {
    access,
    celula: celulas[0],
  };
}
