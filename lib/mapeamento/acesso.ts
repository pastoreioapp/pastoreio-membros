import "server-only";

type CelulaAccessEntry = {
  code: string;
  celulaId: string;
  celulaNome: string;
};

// Atualize os codigos abaixo sempre que redistribuir o acesso dos lideres.
const CELULA_ACCESS_CODE_ENTRIES: CelulaAccessEntry[] = [
  { code: "CEL-1001", celulaId: "cc8a39f5-aa83-4990-a3b4-2900494ff463", celulaNome: "Avivamento" },
  { code: "CEL-1002", celulaId: "1c081a15-4322-4197-9d35-a19165a64dc0", celulaNome: "Bondade de Deus" },
  { code: "CEL-1003", celulaId: "65b6ff59-f057-46fb-806d-05e97166fe57", celulaNome: "Casa de bênção" },
  { code: "CEL-1004", celulaId: "ebd54db2-a5fe-4d67-ae3e-a67e6e7a36dc", celulaNome: "Dádiva" },
  { code: "CEL-1005", celulaId: "9e698755-3fcd-4708-87d3-091d0e49ad6a", celulaNome: "Dalet" },
  { code: "CEL-1006", celulaId: "b1610395-199f-4a61-ab96-2905caa5a3b7", celulaNome: "Deus conosco" },
  { code: "CEL-1007", celulaId: "058604f0-7c38-4cf6-a27d-d029ddb27ea4", celulaNome: "Efraim" },
  { code: "CEL-1008", celulaId: "1b5fd016-508c-4594-91ee-a17d58a65e6e", celulaNome: "Em busca do Reino de Deus" },
  { code: "CEL-1009", celulaId: "73842ebb-3b9c-469e-994f-939de4059014", celulaNome: "Frutos da Videira" },
  { code: "CEL-1010", celulaId: "8a5743c6-f527-440a-b864-6b07a3e8174c", celulaNome: "Hallel" },
  { code: "CEL-1011", celulaId: "1f372038-fb64-42fa-994a-7994b23ead2e", celulaNome: "Hebrom" },
  { code: "CEL-1012", celulaId: "b768de97-79b4-425c-923f-85661a863d71", celulaNome: "HENANI" },
  { code: "CEL-1013", celulaId: "4b762a9c-b157-42ce-ab5b-ff8d0c414dab", celulaNome: "Herdeiro da promessa kids" },
  { code: "CEL-1014", celulaId: "464b935b-f82e-4ca3-9039-81fa20e5d955", celulaNome: "Kadosh" },
  { code: "CEL-1015", celulaId: "aeb7169f-03ad-4717-946d-fa79c98e4ab5", celulaNome: "Kerygma" },
  { code: "CEL-1016", celulaId: "f5224238-00c9-48a5-996a-8a22a850fcb5", celulaNome: "Koinonia" },
  { code: "CEL-1017", celulaId: "0e176458-7d6e-407c-b10f-e814b778b645", celulaNome: "Lamed" },
  { code: "CEL-1018", celulaId: "85cdda18-9bbd-4b6a-85ae-eb682ac447b2", celulaNome: "Leão da tribo de Judá" },
  { code: "CEL-1019", celulaId: "f7fef946-ebbb-4bd7-9a69-563b58b1c53d", celulaNome: "Malta" },
  { code: "CEL-1020", celulaId: "3f99042b-323a-493a-89d6-039e4644131b", celulaNome: "Noah" },
  { code: "CEL-1021", celulaId: "7d01f504-ac5b-442c-96fe-ff6fd25597e6", celulaNome: "Novo Tempo" },
  { code: "CEL-1022", celulaId: "a63760c4-f39b-48c5-84e1-84cfeee1814d", celulaNome: "Odre Novo" },
  { code: "CEL-1023", celulaId: "d9985c15-46a0-451c-bcc3-ea0b762bd97b", celulaNome: "Pequenos atos" },
  { code: "CEL-1024", celulaId: "fc35e3e7-f5bf-4869-86b5-d4eff0c4aab1", celulaNome: "Pequenos Guerreiros de Cristo" },
  { code: "CEL-1025", celulaId: "56d93dd4-1393-4830-9871-3dcb4c784f73", celulaNome: "Renovo" },
  { code: "CEL-1026", celulaId: "3d7a4c9e-a4ed-4f33-9713-386887aad11b", celulaNome: "Renovo kids" },
  { code: "CEL-1027", celulaId: "7ac8fe99-0423-473b-8515-ddbe20b82906", celulaNome: "Rios de água viva" },
  { code: "CEL-1028", celulaId: "debd0306-146b-46c8-9244-e09c0d2d65be", celulaNome: "Siloé" },
  { code: "CEL-1029", celulaId: "1e1700c6-c2eb-484a-a03f-4397942c43e9", celulaNome: "Talmidim" },
  { code: "CEL-1030", celulaId: "7825f968-f04d-4702-ad66-003f72b0d12e", celulaNome: "Vitória em Cristo" },
];

function normalizeAccessCodeValue(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

const ACCESS_CODE_INDEX = new Map(
  CELULA_ACCESS_CODE_ENTRIES.map((entry) => [
    normalizeAccessCodeValue(entry.code),
    entry,
  ])
);

export type ResolvedCelulaAccess = CelulaAccessEntry & {
  normalizedCode: string;
};

export function normalizeAccessCode(code: string | null | undefined) {
  return typeof code === "string" ? normalizeAccessCodeValue(code) : "";
}

export function resolveCelulaAccess(
  code: string | null | undefined
): ResolvedCelulaAccess | null {
  const normalizedCode = normalizeAccessCode(code);

  if (!normalizedCode) {
    return null;
  }

  const entry = ACCESS_CODE_INDEX.get(normalizedCode);

  if (!entry) {
    return null;
  }

  return {
    ...entry,
    normalizedCode,
  };
}
