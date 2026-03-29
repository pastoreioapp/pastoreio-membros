import "server-only";

import { cache } from "react";

import { loadCelulaByAccessCode } from "@/lib/celulas";
import { loadUnidadeByAccessCode } from "@/lib/unidades";

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

export const resolveUnidadeRouteAccess = cache(async (code: string) => {
  const resolved = await loadUnidadeByAccessCode(code);

  if (!resolved) {
    return null;
  }

  return {
    access: {
      code: resolved.code,
      unidadeId: resolved.unidadeId,
    },
    unidade: resolved.unidade,
  };
});
