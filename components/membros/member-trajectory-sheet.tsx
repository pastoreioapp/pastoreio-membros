"use client";

import Link from "next/link";
import { useEffect } from "react";

import {
  CategoriaTrajetoriaDescriptions,
  CategoriasTrajetoriaEntries,
  TotalPassosTrajetoria,
  type PassoTrajetoria,
} from "@/app/types/trajetoria";
import { buildLeaderEditMemberRoute } from "@/lib/mapeamento/routes";
import type { MemberListItem } from "@/lib/mapeamento/types";

type MemberTrajectorySheetProps = {
  accessCode: string;
  member: MemberListItem | null;
  onClose: () => void;
};

function formatPhone(value: string | null) {
  if (!value) {
    return "Nao informado";
  }

  const digits = value.replace(/\D/g, "");

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return value;
}

function formatBirthDate(value: string | null) {
  if (!value) {
    return "Nao informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function isStepCompleted(
  selectedSteps: PassoTrajetoria[],
  step: PassoTrajetoria
) {
  return selectedSteps.includes(step);
}

export function MemberTrajectorySheet({
  accessCode,
  member,
  onClose,
}: MemberTrajectorySheetProps) {
  useEffect(() => {
    if (!member) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [member, onClose]);

  if (!member) {
    return null;
  }

  const completedSteps = member.passosConcluidos.length;
  const completionPercentage = Math.round(
    (completedSteps / TotalPassosTrajetoria) * 100
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#1A1C1F]/45 px-3 pb-3 pt-10 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-trajectory-title"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_rgba(26,28,31,0.24)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-black/5 px-5 pb-5 pt-4 sm:px-6">
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-[#DCE3F1] sm:hidden" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full bg-[#D8E2FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#17305E]">
                Trajetória completa
              </span>
              <h2
                id="member-trajectory-title"
                className="font-heading mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#1A1C1F]"
              >
                {member.nome}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#444750]">
                {completedSteps} de {TotalPassosTrajetoria} passos concluídos (
                {completionPercentage}%).
              </p>
              <Link
                href={buildLeaderEditMemberRoute(accessCode, member.id)}
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl border border-[#5974AD] px-4 text-sm font-bold uppercase tracking-[0.08em] text-[#3F5B93] transition hover:bg-[#EEF3FF]"
              >
                Editar dados
              </Link>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#D9DCE4] text-xl text-[#444750] transition hover:bg-[#F7F9FD]"
              aria-label={`Fechar trajetória de ${member.nome}`}
            >
              ×
            </button>
          </div>
        </div>

        <div className="max-h-[calc(88vh-132px)] overflow-y-auto px-5 py-5 sm:px-6">
          <div className="space-y-4">
            <section className="rounded-[28px] border border-[#E5E9F2] bg-[#FBFCFE] p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-heading text-xl font-extrabold tracking-[-0.03em] text-[#1A1C1F]">
                    Dados do membro
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#5C6070]">
                    Informacoes pessoais registradas no cadastro.
                  </p>
                </div>

                <span className="inline-flex rounded-full bg-[#EEF3FF] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#17305E]">
                  Perfil
                </span>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#E6E8EF] bg-white px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-[#5C6070]">
                    Estado civil
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium leading-6 text-[#1A1C1F]">
                    {member.estadoCivil ?? "Nao informado"}
                  </dd>
                </div>

                <div className="rounded-2xl border border-[#E6E8EF] bg-white px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-[#5C6070]">
                    Telefone
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium leading-6 text-[#1A1C1F]">
                    {formatPhone(member.telefone)}
                  </dd>
                </div>

                <div className="rounded-2xl border border-[#E6E8EF] bg-white px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-[#5C6070]">
                    Data de nascimento
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium leading-6 text-[#1A1C1F]">
                    {formatBirthDate(member.dataNascimento)}
                  </dd>
                </div>

                <div className="rounded-2xl border border-[#E6E8EF] bg-white px-4 py-3">
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-[#5C6070]">
                    Discipulador
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium leading-6 text-[#1A1C1F]">
                    {member.discipuladorNome ?? "Nao informado"}
                  </dd>
                </div>

                <div className="rounded-2xl border border-[#E6E8EF] bg-white px-4 py-3 sm:col-span-2">
                  <dt className="text-xs font-bold uppercase tracking-[0.08em] text-[#5C6070]">
                    Serve em ministerio
                  </dt>
                  <dd className="mt-1 text-[15px] font-medium leading-6 text-[#1A1C1F]">
                    {member.serveMinisterio ? "Sim" : "Nao"}
                  </dd>
                </div>
              </dl>
            </section>

            {CategoriasTrajetoriaEntries.map(([categoria, passos]) => {
              const completedCount = passos.filter((step) =>
                isStepCompleted(member.passosConcluidos, step)
              ).length;

              return (
                <section
                  key={categoria}
                  className="rounded-[28px] border border-[#E5E9F2] bg-[#FBFCFE] p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-heading text-xl font-extrabold tracking-[-0.03em] text-[#1A1C1F]">
                        {categoria}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#5C6070]">
                        {CategoriaTrajetoriaDescriptions[categoria]}
                      </p>
                    </div>

                    <span className="inline-flex rounded-full bg-[#EEF3FF] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#17305E]">
                      {completedCount}/{passos.length} concluídos
                    </span>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {passos.map((step) => {
                      const isCompleted = isStepCompleted(
                        member.passosConcluidos,
                        step
                      );

                      return (
                        <div
                          key={step}
                          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
                            isCompleted
                              ? "border-[#C9D8F7] bg-[#EEF3FF]"
                              : "border-[#E6E8EF] bg-white"
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 text-xs font-bold ${
                              isCompleted
                                ? "border-[#5974AD] bg-[#5974AD] text-white"
                                : "border-[#C7CCD8] bg-white text-[#C7CCD8]"
                            }`}
                            aria-hidden="true"
                          >
                            {isCompleted ? "✓" : ""}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-medium leading-6 text-[#1A1C1F]">
                              {step}
                            </p>
                            <p className="mt-1 text-xs font-medium uppercase tracking-[0.08em] text-[#5C6070]">
                              {isCompleted ? "Concluído" : "Pendente"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
