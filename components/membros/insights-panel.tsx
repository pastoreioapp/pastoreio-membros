"use client";

import { useMemo } from "react";

import {
  computeTrajectoryInsights,
  TotalPassosTrajetoria,
} from "@/lib/mapeamento/trajetoria";
import type { CelulaOption, MemberListItem } from "@/lib/mapeamento/types";

type InsightsPanelProps = {
  members: MemberListItem[];
  totalCelulas?: number;
  celulas?: CelulaOption[];
};

function StatCard({
  value,
  label,
  accent = false,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        accent
          ? "bg-linear-to-br from-[#3F5B93] to-[#5974AD] text-white"
          : "bg-white border border-[#E7EAF3]"
      }`}
    >
      <p
        className={`font-heading text-2xl font-extrabold tracking-[-0.03em] ${
          accent ? "text-white" : "text-[#1A1C1F]"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1 text-xs font-semibold uppercase tracking-wide ${
          accent ? "text-white/70" : "text-[#5C6070]"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function ProgressBar({
  label,
  percentage,
  description,
}: {
  label: string;
  percentage: number;
  description?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1A1C1F]">{label}</span>
        <span className="text-sm font-bold text-[#3F5B93]">{percentage}%</span>
      </div>
      {description ? (
        <p className="mt-0.5 text-xs text-[#5C6070]">{description}</p>
      ) : null}
      <div className="mt-2 h-2.5 rounded-full bg-[#E7EAF3]">
        <div
          className="h-full rounded-full bg-linear-to-r from-[#3F5B93] to-[#7B97D1] transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

type CelulaRanking = {
  id: string;
  nome: string;
  memberCount: number;
  completedSteps: number;
  totalSteps: number;
  percentage: number;
};

function computeCelulaRankings(
  celulas: CelulaOption[],
  members: MemberListItem[]
): CelulaRanking[] {
  const membersByCelula = new Map<string, MemberListItem[]>();

  for (const member of members) {
    if (!member.celulaId) continue;
    const list = membersByCelula.get(member.celulaId) ?? [];
    list.push(member);
    membersByCelula.set(member.celulaId, list);
  }

  const rankings: CelulaRanking[] = celulas.map((celula) => {
    const celulaMembers = membersByCelula.get(celula.id) ?? [];
    const completedSteps = celulaMembers.reduce(
      (sum, m) => sum + m.passosConcluidos.length,
      0
    );
    const totalSteps = celulaMembers.length * TotalPassosTrajetoria;

    return {
      id: celula.id,
      nome: celula.nome,
      memberCount: celulaMembers.length,
      completedSteps,
      totalSteps,
      percentage:
        totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
    };
  });

  rankings.sort((a, b) => b.percentage - a.percentage || b.memberCount - a.memberCount);

  return rankings;
}

const RANK_STYLES: Record<number, string> = {
  0: "bg-[#FFF8E1] border-[#F9E07F] text-[#8B6E00]",
  1: "bg-[#F5F5F5] border-[#D6D6D6] text-[#5C5C5C]",
  2: "bg-[#FFF3E8] border-[#F0C9A0] text-[#8B5E2F]",
};

function CelulaRankingList({ rankings }: { rankings: CelulaRanking[] }) {
  if (rankings.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {rankings.map((celula, index) => {
        const rankBadge =
          RANK_STYLES[index] ??
          "bg-[#F4F6FB] border-[#E2E5ED] text-[#5C6070]";

        return (
          <div
            key={celula.id}
            className="flex items-center gap-3 rounded-2xl border border-[#E7EAF3] bg-white px-4 py-3 sm:gap-4"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold ${rankBadge}`}
            >
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-bold text-[#1A1C1F]">
                  {celula.nome}
                </span>
                <span className="shrink-0 text-sm font-extrabold text-[#3F5B93]">
                  {celula.percentage}%
                </span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-[#E7EAF3]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#3F5B93] to-[#7B97D1] transition-all duration-500"
                  style={{ width: `${celula.percentage}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-[#5C6070]">
                {celula.memberCount}{" "}
                {celula.memberCount === 1 ? "membro" : "membros"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function InsightsPanel({
  members,
  totalCelulas,
  celulas,
}: InsightsPanelProps) {
  const insights = useMemo(
    () => computeTrajectoryInsights(members),
    [members]
  );

  const rankings = useMemo(
    () => (celulas ? computeCelulaRankings(celulas, members) : []),
    [celulas, members]
  );

  if (insights.totalMembers === 0 && rankings.length === 0) {
    return null;
  }

  const showRankings = rankings.length > 0;

  return (
    <section className="space-y-4">
      <div className="rounded-[24px] bg-white border border-[#E7EAF3] p-5 sm:p-6">
        <h3 className="font-heading text-lg font-extrabold tracking-[-0.03em] text-[#1A1C1F]">
          Panorama geral
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            value={`${insights.overallPercentage}%`}
            label="Trajetoria geral"
            accent
          />
          <StatCard
            value={String(insights.totalMembers)}
            label={insights.totalMembers === 1 ? "Membro" : "Membros"}
          />
          {totalCelulas !== undefined ? (
            <StatCard
              value={String(totalCelulas)}
              label={totalCelulas === 1 ? "Celula" : "Celulas"}
            />
          ) : null}
          <StatCard
            value={String(insights.membersWithFullTrajectory)}
            label="Trajetoria completa"
          />
          {totalCelulas === undefined ? (
            <StatCard
              value={String(insights.membersWithDiscipulador)}
              label="Com discipulador"
            />
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#5C6070]">
            Progresso por etapa
          </h4>
          {insights.categories.map((cat) => (
            <ProgressBar
              key={cat.name}
              label={cat.name}
              percentage={cat.percentage}
              description={cat.description}
            />
          ))}
        </div>
      </div>

      {showRankings ? (
        <div className="rounded-[24px] bg-white border border-[#E7EAF3] p-5 sm:p-6">
          <h3 className="font-heading text-lg font-extrabold tracking-[-0.03em] text-[#1A1C1F]">
            Trajetoria por celula
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#444750]">
            Comparativo de progresso entre as celulas do setor.
          </p>

          <div className="mt-4">
            <CelulaRankingList rankings={rankings} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
