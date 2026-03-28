import "server-only";

import { cache } from "react";

import { loadCelulaByAccessCode } from "@/lib/mapeamento/celulas";
import { loadSetorByAccessCode } from "@/lib/mapeamento/setores";

export const resolveLeaderRouteAccess = cache(async (code: string) => {
  const resolved = await loadCelulaByAccessCode(code);

  if (!resolved) {
    return null;
  }

  return {
    access: {
      code: resolved.code,
      celulaId: resolved.celulaId,
      celulaNome: resolved.celulaNome,
    },
    celula: resolved.celula,
  };
});

export const resolveSetorRouteAccess = cache(async (code: string) => {
  const resolved = await loadSetorByAccessCode(code);

  if (!resolved) {
    return null;
  }

  return {
    access: {
      code: resolved.code,
      setorId: resolved.setorId,
    },
    setor: resolved.setor,
  };
});
