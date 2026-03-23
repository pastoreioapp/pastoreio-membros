"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  LeaderChipIcon,
  ScheduleChipIcon,
} from "@/components/membros/member-form-icons";
import type { CelulaOption } from "@/lib/mapeamento/types";

type CelulaAvatarProps = {
  celula: CelulaOption | null;
  className: string;
  imageSizes: string;
};

type CelulaContextCardProps = {
  celula: CelulaOption | null;
  accessCode: string;
  actionHref?: string;
  actionLabel?: string;
  badgeLabel?: string;
};

function getCelulaInitials(nome: string | null | undefined) {
  return (nome ?? "PM")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase() ?? "")
    .join("");
}

function getCelulaSchedule(celula: CelulaOption | null) {
  return [celula?.diaSemana, celula?.horario].filter(Boolean).join(", ");
}

export function CelulaAvatar({
  celula,
  className,
  imageSizes,
}: CelulaAvatarProps) {
  const initials = getCelulaInitials(celula?.nome);
  const [failedPhotoUrl, setFailedPhotoUrl] = useState<string | null>(null);
  const photoUrl = celula?.fotoUrl ?? null;
  const shouldShowImage = Boolean(photoUrl && failedPhotoUrl !== photoUrl);

  return (
    <div
      className={`relative overflow-hidden rounded-full border-4 border-[#EDEDF1] bg-[#D8E2FF] ${className}`}
    >
      {shouldShowImage ? (
        <Image
          src={photoUrl!}
          alt=""
          fill
          sizes={imageSizes}
          className="object-cover"
          onError={() => setFailedPhotoUrl(photoUrl)}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.85),rgba(255,255,255,0)_55%),linear-gradient(135deg,rgba(63,91,147,0.18),rgba(89,116,173,0.45))]" />
          <div className="absolute inset-0 rounded-full bg-[#3F5B93]/10" />
          <span className="font-heading absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#3F5B93]">
            {initials || "PM"}
          </span>
        </>
      )}
    </div>
  );
}

export function CelulaContextCard({
  celula,
  accessCode,
  actionHref,
  actionLabel,
  badgeLabel = "Celula liberada por codigo",
}: CelulaContextCardProps) {
  const scheduleLabel = getCelulaSchedule(celula);
  const contextEyebrow = celula?.setor ? `SETOR ${celula.setor}` : "CELULA";
  const contextTitle = celula?.nome ?? "Celula indisponivel";
  const contextPrimaryChip = celula?.lideres
    ? `Lideres: ${celula.lideres}`
    : "Lideres nao informados";
  const contextSecondaryChip = scheduleLabel || "Horario a confirmar";

  return (
    <section className="rounded-[24px] bg-[#5974AD] p-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="overflow-hidden rounded-[22px] bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex rounded-full bg-[#D8E2FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#17305E]">
            {badgeLabel}
          </span>
          {actionHref && actionLabel ? (
            <Link
              href={actionHref}
              className="text-sm font-bold text-[#3F5B93] underline underline-offset-4"
            >
              {actionLabel}
            </Link>
          ) : null}
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <CelulaAvatar
            celula={celula}
            className="h-24 w-24 shrink-0"
            imageSizes="96px"
          />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[#3F5B93]">
              {contextEyebrow}
            </p>
            <h2 className="font-heading mt-1 text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#1A1C1F]">
              {contextTitle}
            </h2>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F3F3F7] px-3 py-1.5 text-sm text-[#444750]">
                <LeaderChipIcon className="h-3 w-3 shrink-0" alt="" />
                {contextPrimaryChip}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F3F3F7] px-3 py-1.5 text-sm text-[#444750]">
                <ScheduleChipIcon className="h-3.5 w-3 shrink-0" alt="" />
                {contextSecondaryChip}
              </span>
              <span className="inline-flex items-center rounded-full bg-[#EEF3FF] px-3 py-1.5 text-sm font-semibold text-[#17305E]">
                Codigo: {accessCode}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CelulaContextContent({
  celula,
}: {
  celula: CelulaOption | null;
}) {
  const scheduleLabel = getCelulaSchedule(celula);
  const contextEyebrow = celula?.setor ? `SETOR ${celula.setor}` : "SELECAO DE CONTEXTO";
  const contextTitle = celula?.nome ?? "Selecione uma celula";
  const contextPrimaryChip = celula?.lideres
    ? `Lideres: ${celula.lideres}`
    : "Escolha uma celula para ver os lideres";
  const contextSecondaryChip =
    scheduleLabel || (celula ? "Horario a confirmar" : "Abra a lista para escolher");

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <CelulaAvatar
        celula={celula}
        className="h-24 w-24 shrink-0"
        imageSizes="96px"
      />

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-widest text-[#3F5B93]">
          {contextEyebrow}
        </p>
        <h2 className="font-heading mt-1 text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#1A1C1F]">
          {contextTitle}
        </h2>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F3F3F7] px-3 py-1.5 text-sm text-[#444750]">
            <LeaderChipIcon className="h-3 w-3 shrink-0" alt="" />
            {contextPrimaryChip}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#F3F3F7] px-3 py-1.5 text-sm text-[#444750]">
            <ScheduleChipIcon className="h-3.5 w-3 shrink-0" alt="" />
            {contextSecondaryChip}
          </span>
        </div>
      </div>
    </div>
  );
}
