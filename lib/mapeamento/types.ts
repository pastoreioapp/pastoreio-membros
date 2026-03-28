import type { PassoTrajetoria } from "@/lib/mapeamento/trajetoria";

export type CelulaOption = {
  id: string;
  nome: string;
  setor: string | null;
  setorId: string | null;
  lideres: string | null;
  diaSemana: string | null;
  horario: string | null;
  fotoUrl: string | null;
  codigoAcesso: string | null;
};

export type SetorOption = {
  id: string;
  nome: string;
  descricao: string | null;
  lideres: string | null;
  codigoAcesso: string | null;
};

export type LoadCelulasResult = {
  celulas: CelulaOption[];
  loadError: string | null;
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

export type SaveCelulaFieldErrors = {
  nome?: string;
  lideres?: string;
  diaSemana?: string;
  horario?: string;
  codigoAcesso?: string;
  setorCodigoAcesso?: string;
};

export type SaveCelulaState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: SaveCelulaFieldErrors;
};

export const initialSaveCelulaState: SaveCelulaState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type CreateCelulaInput = {
  nome: string;
  setorId: string;
  lideres: string | null;
  diaSemana: string | null;
  horario: string | null;
  codigoAcesso: string | null;
};

export type CategoryInsight = {
  name: string;
  description: string;
  completedCount: number;
  totalPossible: number;
  percentage: number;
};

export type TrajectoryInsights = {
  totalMembers: number;
  totalCompletedSteps: number;
  totalPossibleSteps: number;
  overallPercentage: number;
  membersWithFullTrajectory: number;
  membersWithDiscipulador: number;
  categories: CategoryInsight[];
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
