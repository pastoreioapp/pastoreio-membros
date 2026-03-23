"use client";

import Link from "next/link";

import { MemberSelfRegisterShare } from "@/components/membros/member-self-register-share";
import { TotalPassosTrajetoria } from "@/app/types/trajetoria";
import type { CelulaOption, MemberListItem } from "@/lib/mapeamento/types";
import { buildMemberSelfRegistrationRoute } from "@/lib/mapeamento/routes";

type MemberListProps = {
  accessCode: string;
  celula: CelulaOption;
  members: MemberListItem[];
};

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function MemberList({ accessCode, celula, members }: MemberListProps) {
  return (
    <section className="space-y-5">
      <MemberSelfRegisterShare
        href={buildMemberSelfRegistrationRoute(accessCode)}
      />

      <div className="flex flex-col gap-3 rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(26,28,31,0.08)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <span className="inline-flex rounded-full bg-[#D8E2FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#17305E]">
            Membros da célula
          </span>
          <h2 className="font-heading mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#1A1C1F]">
            {members.length} {members.length === 1 ? "membro cadastrado" : "membros cadastrados"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#444750]">
            Acompanhe os membros cadastrados em {celula.nome} e adicione novos registros quando precisar.
          </p>
        </div>

        <Link
          href={`/lider/${accessCode}/novo`}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-linear-to-b from-[#3F5B93] to-[#5974AD] px-5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_18px_40px_rgba(63,91,147,0.22)] transition hover:brightness-105"
        >
          Cadastrar membro
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-[#C9D4E9] bg-white px-6 py-10 text-center shadow-[0_18px_50px_rgba(26,28,31,0.04)]">
          <h3 className="font-heading text-2xl font-extrabold tracking-[-0.03em] text-[#1A1C1F]">
            Nenhum membro cadastrado ainda
          </h3>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#444750]">
            Use o botão de cadastro para registrar o primeiro membro desta célula.
          </p>
          <Link
            href={`/lider/${accessCode}/novo`}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#5974AD] px-5 text-sm font-bold uppercase tracking-widest text-[#3F5B93] transition hover:bg-[#EEF3FF]"
          >
            Cadastrar membro
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {members.map((member) => {
            const completedSteps = member.passosConcluidos.length;
            const progressPercentage = Math.round(
              (completedSteps / TotalPassosTrajetoria) * 100
            );

            return (
              <article
                key={member.id}
                className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(26,28,31,0.08)] sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#5974AD]">
                      Membro
                    </p>
                    <h3 className="font-heading mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#1A1C1F]">
                      {member.nome}
                    </h3>
                    <p className="mt-2 text-sm text-[#5C6070]">
                      Cadastrado em {formatCreatedAt(member.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#F3F6FD] px-4 py-3 text-sm font-semibold text-[#17305E]">
                    {completedSteps} / {TotalPassosTrajetoria} passos
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-sm font-medium text-[#444750]">
                    <span>Trajetória concluída</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-[#E7EAF3]">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#3F5B93] to-[#7B97D1]"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {member.passosConcluidos.length > 0 ? (
                    member.passosConcluidos.slice(0, 4).map((step) => (
                      <span
                        key={step}
                        className="inline-flex rounded-full bg-[#EEF3FF] px-3 py-1.5 text-xs font-semibold text-[#17305E]"
                      >
                        {step}
                      </span>
                    ))
                  ) : (
                    <span className="inline-flex rounded-full bg-[#F4F4F6] px-3 py-1.5 text-xs font-semibold text-[#5C6070]">
                      Nenhum passo marcado ainda
                    </span>
                  )}

                  {member.passosConcluidos.length > 4 ? (
                    <span className="inline-flex rounded-full bg-[#F4F4F6] px-3 py-1.5 text-xs font-semibold text-[#5C6070]">
                      +{member.passosConcluidos.length - 4} passos
                    </span>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
