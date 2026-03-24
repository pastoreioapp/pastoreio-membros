import type { PassoTrajetoria } from "@/app/types/trajetoria";

export type CelulaOption = {
  id: string;
  nome: string;
  setor: string | null;
  lideres: string | null;
  diaSemana: string | null;
  horario: string | null;
  fotoUrl: string | null;
};

export type LoadCelulasResult = {
  celulas: CelulaOption[];
  loadError: string | null;
};

export type CelulaAccessView = {
  code: string;
  celulaId: string;
  celulaNome: string;
};

export type MemberListItem = {
  id: string;
  nome: string;
  celulaId: string | null;
  passosConcluidos: PassoTrajetoria[];
  createdAt: string;
};

export type SaveMemberFieldErrors = {
  codigoAcesso?: string;
  nome?: string;
  celulaId?: string;
  passos?: string;
};

export type SaveMemberState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: SaveMemberFieldErrors;
};

export const initialSaveMemberState: SaveMemberState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type CreateMemberInput = {
  nome: string;
  celulaId: string;
  passosConcluidos: PassoTrajetoria[];
};
