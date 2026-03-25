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
  estadoCivil: string | null;
  telefone: string | null;
  dataNascimento: string | null;
  discipuladorNome: string | null;
  ministerios: string[];
  passosConcluidos: PassoTrajetoria[];
  createdAt: string;
};

export type SaveMemberFieldErrors = {
  id?: string;
  codigoAcesso?: string;
  nome?: string;
  celulaId?: string;
  estadoCivil?: string;
  telefone?: string;
  dataNascimento?: string;
  discipuladorNome?: string;
  ministerios?: string;
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
  estadoCivil: string | null;
  telefone: string | null;
  dataNascimento: string | null;
  discipuladorNome: string | null;
  ministerios: string[];
  passosConcluidos: PassoTrajetoria[];
};

export type UpdateMemberInput = CreateMemberInput & {
  id: string;
};

export type MemberFormValues = {
  id?: string;
  nome: string;
  celulaId: string;
  estadoCivil: string;
  telefone: string;
  dataNascimento: string;
  discipuladorNome: string;
  ministerios: string;
  passosConcluidos: PassoTrajetoria[];
};
