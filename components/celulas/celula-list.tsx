"use client";

import Link from "next/link";

import { CelulaAvatar } from "@/components/celulas/celula-context";
import {
  LeaderChipIcon,
  ScheduleChipIcon,
} from "@/components/ui/icons";
import type { CelulaOption } from "@/lib/types";
import {
  buildLeaderMembersRoute,
  buildSetorNewCelulaRoute,
} from "@/lib/routes";

type CelulaListProps = {
  celulas: CelulaOption[];
  unidadeNome: string;
  unidadeAccessCode: string;
};

function getCelulaSchedule(celula: CelulaOption) {
  return [celula.diaSemana, celula.horario].filter(Boolean).join(", ");
}

export function CelulaList({ celulas, unidadeNome, unidadeAccessCode }: CelulaListProps) {
  return (
    <section className="space-y-5">
      <div className="mt-15 flex flex-col gap-4 pb-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-baseline gap-2.5">
            <span className="font-heading text-[2rem] font-extrabold leading-none tracking-[-0.04em] text-text-primary">
              {celulas.length}{" "}
              {celulas.length === 1 ? "célula vinculada" : "células vinculadas"}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-text-secondary">
            Células de {unidadeNome}. Clique para acessar os membros.
          </p>
        </div>

        <Link
          href={buildSetorNewCelulaRoute(unidadeAccessCode)}
          className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl bg-brand-dark px-6 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#2D4E8A]"
        >
          Cadastrar celula
        </Link>
      </div>

      <hr className="border-[#E2E5ED]" />

      {celulas.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#C9D4E9] bg-white px-6 py-10 text-center">
          <h3 className="font-heading text-2xl font-extrabold tracking-[-0.03em] text-text-primary">
            Nenhuma célula vinculada
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">
            As células serão exibidas aqui assim que forem associadas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {celulas.map((celula) => {
            const scheduleLabel = getCelulaSchedule(celula);

            return (
              <article
                key={celula.id}
                className="rounded-[24px] border border-border-default bg-white p-5 transition hover:border-[#C9D4E9] sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <CelulaAvatar
                    celula={celula}
                    className="h-16 w-16 shrink-0"
                    imageSizes="64px"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading text-xl font-extrabold tracking-[-0.03em] text-text-primary">
                      {celula.nome}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F6FB] px-3 py-1.5 text-xs font-semibold text-text-secondary">
                        <LeaderChipIcon className="h-3 w-3 shrink-0" alt="" />
                        {celula.lideres
                          ? `Líderes: ${celula.lideres}`
                          : "Líderes não informados"}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F6FB] px-3 py-1.5 text-xs font-semibold text-text-secondary">
                        <ScheduleChipIcon className="h-3.5 w-3 shrink-0" alt="" />
                        {scheduleLabel || "Horário a confirmar"}
                      </span>
                      {celula.codigoAcesso ? (
                        <span className="inline-flex items-center rounded-full bg-[#EEF8F1] px-3 py-1.5 text-xs font-semibold text-[#11643A]">
                          Código: {celula.codigoAcesso}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {celula.codigoAcesso ? (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <Link
                      href={buildLeaderMembersRoute(celula.codigoAcesso)}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#F0F4FE] px-4 text-sm font-semibold text-badge-text transition hover:bg-[#DCE7FF]"
                    >
                      Ver membros
                    </Link>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
