"use client";

import {
  LeaderChipIcon,
} from "@/components/membros/member-form-icons";
import type { SetorOption } from "@/lib/mapeamento/types";

type SetorContextCardProps = {
  setor: SetorOption;
  accessCode: string;
};

export function SetorContextCard({ setor, accessCode }: SetorContextCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[24px] bg-linear-to-br from-[#2D4E8A] via-[#3F5B93] to-[#6B8AC4] shadow-[0_18px_50px_rgba(23,48,94,0.18)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.10),transparent_60%)]" />

      <div className="relative p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm">
            Painel do setor
          </span>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white/15 bg-white/10">
            <span className="font-heading text-3xl font-bold text-white">
              {setor.nome
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase() ?? "")
                .join("")}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">
              SETOR
            </p>
            <h2 className="font-heading mt-1 text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-white">
              {setor.nome}
            </h2>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/80">
                <LeaderChipIcon className="h-3 w-3 shrink-0 brightness-0 invert" alt="" />
                {setor.lideres
                  ? `Supervisores: ${setor.lideres}`
                  : "Supervisores nao informados"}
              </span>
              {setor.descricao ? (
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 text-sm text-white/80">
                  {setor.descricao}
                </span>
              ) : null}
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white">
                Codigo: {accessCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
