"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { TotalPassosTrajetoria } from "@/lib/mapeamento/trajetoria";
import { InsightsPanel } from "@/components/membros/insights-panel";
import { MemberTrajectorySheet } from "@/components/membros/member-trajectory-sheet";
import { MemberSelfRegisterShare } from "@/components/membros/member-self-register-share";
import { formatCreatedAt, formatPhone } from "@/lib/mapeamento/formatting";
import type { CelulaOption, MemberListItem } from "@/lib/mapeamento/types";
import {
  buildLeaderEditMemberRoute,
  buildLeaderNewMemberRoute,
  buildMemberSelfRegistrationRoute,
} from "@/lib/mapeamento/routes";

type MemberListProps = {
  accessCode: string;
  celula: CelulaOption;
  members: MemberListItem[];
};

export function MemberList({ accessCode, celula, members }: MemberListProps) {
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const expandedMember = useMemo(
    () => members.find((member) => member.id === expandedMemberId) ?? null,
    [expandedMemberId, members]
  );

  return (
    <>
      <section className="space-y-5">
        <MemberSelfRegisterShare
          href={buildMemberSelfRegistrationRoute(accessCode)}
        />

        <InsightsPanel members={members} />

        <div className="mt-15 flex flex-col gap-4 pb-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-[2rem] font-extrabold leading-none tracking-[-0.04em] text-[#1A1C1F]">
                {members.length} {members.length === 1 ? "membro cadastrado" : "membros cadastrados"}
              </span>
            </div>
            <p className="mt-1.5 text-sm leading-6 text-[#444750]">
              Acompanhe os membros em {celula.nome} e adicione novos registros.
            </p>
          </div>

          <Link
            href={buildLeaderNewMemberRoute(accessCode)}
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl bg-[#3F5B93] px-6 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#2D4E8A]"
          >
            Cadastrar membro
          </Link>
        </div>

        <hr className="border-[#E2E5ED]" />

        {members.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#C9D4E9] bg-white px-6 py-10 text-center">
            <h3 className="font-heading text-2xl font-extrabold tracking-[-0.03em] text-[#1A1C1F]">
              Nenhum membro cadastrado ainda
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#444750]">
              Use o botão acima para registrar o primeiro membro desta célula.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => {
              const completedSteps = member.passosConcluidos.length;
              const progressPercentage = Math.round(
                (completedSteps / TotalPassosTrajetoria) * 100
              );

              return (
                <article
                  key={member.id}
                  className="rounded-[24px] border border-[#E7EAF3] bg-white p-5 transition hover:border-[#C9D4E9] sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-heading text-xl font-extrabold tracking-[-0.03em] text-[#1A1C1F]">
                        {member.nome}
                      </h3>
                      <p className="mt-1 text-sm text-[#5C6070]">
                        Cadastrado em {formatCreatedAt(member.createdAt)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {member.telefone ? (
                          <span className="inline-flex rounded-full bg-[#F4F6FB] px-3 py-1.5 text-xs font-semibold text-[#444750]">
                            {formatPhone(member.telefone)}
                          </span>
                        ) : null}
                        {member.estadoCivil ? (
                          <span className="inline-flex rounded-full bg-[#F4F6FB] px-3 py-1.5 text-xs font-semibold text-[#444750]">
                            {member.estadoCivil}
                          </span>
                        ) : null}
                        {member.ministerios.map((ministerio) => (
                          <span
                            key={ministerio}
                            className="inline-flex rounded-full bg-[#EEF8F1] px-3 py-1.5 text-xs font-semibold text-[#11643A]"
                          >
                            {ministerio}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#F3F6FD] px-3.5 py-2.5 text-sm font-semibold text-[#17305E]">
                      {completedSteps}/{TotalPassosTrajetoria} passos
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-[#444750]">
                      <span className="font-semibold uppercase tracking-wide text-[#5C6070]">Trajetória</span>
                      <span className="font-bold text-[#3F5B93]">{progressPercentage}%</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-[#E7EAF3]">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-[#3F5B93] to-[#7B97D1]"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <button
                      type="button"
                      onClick={() => setExpandedMemberId(member.id)}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[#D0D8EA] px-4 text-sm font-semibold text-[#3F5B93] transition hover:border-[#5974AD] hover:bg-[#F4F7FE]"
                    >
                      Ver trajetória
                    </button>
                    <Link
                      href={buildLeaderEditMemberRoute(accessCode, member.id)}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl bg-[#F0F4FE] px-4 text-sm font-semibold text-[#17305E] transition hover:bg-[#DCE7FF]"
                    >
                      Editar
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <MemberTrajectorySheet
        accessCode={accessCode}
        member={expandedMember}
        onClose={() => setExpandedMemberId(null)}
      />
    </>
  );
}
