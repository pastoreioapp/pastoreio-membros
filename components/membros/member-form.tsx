"use client";

import { useActionState, useMemo, useState } from "react";

import { saveLeaderMemberAction } from "@/app/actions/membros";
import type { PassoTrajetoria } from "@/lib/mapeamento/trajetoria";
import { MemberInputIcon } from "@/components/membros/member-form-icons";
import { CelulaSelector } from "@/components/membros/celula-selector";
import { MemberPersonalFields } from "@/components/membros/member-personal-fields";
import { MemberTrajectoryFields } from "@/components/membros/member-trajectory-fields";
import { SubmitButton } from "@/components/membros/submit-button";
import { MEMBER_FORM_FIELDS } from "@/lib/mapeamento/constants";
import {
  initialSaveMemberState,
  type CelulaOption,
  type MemberFormValues,
  type SaveMemberState,
} from "@/lib/mapeamento/types";

type MemberFormProps = {
  celulas: CelulaOption[];
  initialValues?: MemberFormValues;
  loadError?: string | null;
  lockedAccessCode?: string;
  backHref?: string;
  backLabel?: string;
  showLockedContextCard?: boolean;
  formAction?: (
    prevState: SaveMemberState,
    formData: FormData
  ) => Promise<SaveMemberState>;
  submitLabel?: string;
  resetLabel?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  title?: string;
  description?: string;
};

export function MemberForm({
  celulas,
  initialValues,
  loadError = null,
  lockedAccessCode,
  backHref = "/",
  backLabel = "Voltar",
  showLockedContextCard = false,
  formAction: serverAction = saveLeaderMemberAction,
  submitLabel,
  resetLabel,
  nameLabel = "Nome do Membro",
  namePlaceholder = "Digite o nome completo",
  title = "Trajetoria de Crescimento",
  description,
}: MemberFormProps) {
  const lockedCelulaId = lockedAccessCode ? (celulas[0]?.id ?? "") : "";
  const isLockedToSingleCelula = Boolean(lockedAccessCode);

  const [state, formAction, pending] = useActionState(
    serverAction,
    initialSaveMemberState
  );

  const initialNome = initialValues?.nome ?? "";
  const initialCelulaId = initialValues?.celulaId ?? "";
  const initialEstadoCivil = initialValues?.estadoCivil ?? "";
  const initialTelefone = initialValues?.telefone ?? "";
  const initialDataNascimento = initialValues?.dataNascimento ?? "";
  const initialDiscipuladorNome = initialValues?.discipuladorNome ?? "";
  const initialMinisterios = initialValues?.ministerios ?? "";
  const initialPassos = initialValues?.passosConcluidos ?? [];

  const [nome, setNome] = useState(initialNome);
  const [selectedCelulaId, setSelectedCelulaId] = useState(initialCelulaId);
  const [estadoCivil, setEstadoCivil] = useState(initialEstadoCivil);
  const [telefone, setTelefone] = useState(initialTelefone);
  const [dataNascimento, setDataNascimento] = useState(initialDataNascimento);
  const [discipuladorNome, setDiscipuladorNome] = useState(initialDiscipuladorNome);
  const [ministerios, setMinisterios] = useState(initialMinisterios);
  const [selectedPassos, setSelectedPassos] = useState<PassoTrajetoria[]>(initialPassos);

  const formState = state ?? initialSaveMemberState;
  const fieldErrors = formState.fieldErrors ?? {};
  const formStatus = formState.status ?? "idle";
  const formMessage = formState.message ?? null;

  const isUnavailable = Boolean(loadError) || celulas.length === 0;
  const celulaId = isLockedToSingleCelula ? lockedCelulaId : selectedCelulaId;
  const selectedCelula = useMemo(
    () => celulas.find((celula) => celula.id === celulaId) ?? null,
    [celulaId, celulas]
  );

  function togglePasso(passo: PassoTrajetoria) {
    setSelectedPassos((current) =>
      current.includes(passo)
        ? current.filter((item) => item !== passo)
        : [...current, passo]
    );
  }

  return (
    <form
      action={formAction}
      onReset={() => {
        setNome(initialNome);
        setSelectedCelulaId(initialCelulaId);
        setEstadoCivil(initialEstadoCivil);
        setTelefone(initialTelefone);
        setDataNascimento(initialDataNascimento);
        setDiscipuladorNome(initialDiscipuladorNome);
        setMinisterios(initialMinisterios);
        setSelectedPassos(initialPassos);
      }}
      className="space-y-8 pb-32"
    >
      <input
        type="hidden"
        name={MEMBER_FORM_FIELDS.id}
        value={initialValues?.id ?? ""}
      />
      <input
        type="hidden"
        name={MEMBER_FORM_FIELDS.codigoAcesso}
        value={lockedAccessCode ?? ""}
      />
      <input
        type="hidden"
        name={MEMBER_FORM_FIELDS.celulaId}
        value={celulaId}
      />

      <CelulaSelector
        celulas={celulas}
        celulaId={celulaId}
        selectedCelula={selectedCelula}
        isLockedToSingleCelula={isLockedToSingleCelula}
        showLockedContextCard={showLockedContextCard}
        lockedAccessCode={lockedAccessCode ?? ""}
        backHref={backHref}
        backLabel={backLabel}
        disabled={isUnavailable || pending}
        onSelectCelula={setSelectedCelulaId}
        fieldErrors={fieldErrors}
      />

      <section className="space-y-3 mt-10">
        <label className="block">
          <span className="mb-3 block text-sm font-bold text-[#444750]">
            {nameLabel}
          </span>
          <div className="relative">
            <input
              type="text"
              name={MEMBER_FORM_FIELDS.nome}
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              disabled={isUnavailable || pending}
              placeholder={namePlaceholder}
              className="min-h-[68px] w-full rounded-xl border-2 border-transparent bg-[#E2E2E6] px-6 pr-18 text-[1.25rem] font-medium text-[#1A1C1F] outline-none transition placeholder:text-[#444750]/40 focus:border-[#5974AD] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            />
            <span className="pointer-events-none absolute inset-y-0 right-6 flex items-center">
              <MemberInputIcon className="h-6 w-[22px]" alt="" />
            </span>
          </div>
        </label>
        {fieldErrors.nome ? (
          <p className="px-1 text-sm font-medium text-rose-700">
            {fieldErrors.nome}
          </p>
        ) : null}
      </section>

      <MemberPersonalFields
        estadoCivil={estadoCivil}
        telefone={telefone}
        dataNascimento={dataNascimento}
        discipuladorNome={discipuladorNome}
        ministerios={ministerios}
        disabled={isUnavailable || pending}
        fieldErrors={fieldErrors}
        onEstadoCivilChange={setEstadoCivil}
        onTelefoneChange={setTelefone}
        onDataNascimentoChange={setDataNascimento}
        onDiscipuladorNomeChange={setDiscipuladorNome}
        onMinisteriosChange={setMinisterios}
      />

      <MemberTrajectoryFields
        selectedPassos={selectedPassos}
        onTogglePasso={togglePasso}
        title={title}
        description={description}
        fieldError={fieldErrors.passos}
      />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 top-20 z-40 flex justify-center sm:inset-x-auto sm:right-6 sm:top-24">
        {formMessage ? (
          <div
            className={`pointer-events-auto w-full max-w-md rounded-2xl border px-4 py-3 text-sm font-medium shadow-[0_16px_40px_rgba(26,28,31,0.12)] backdrop-blur sm:w-[24rem] ${
              formStatus === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
                : "border-rose-200 bg-rose-50/95 text-rose-800"
            }`}
            role={formStatus === "success" ? "status" : "alert"}
          >
            {formMessage}
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-4 z-20">
        <div className="rounded-4xl bg-linear-to-t from-[#F9F9FD] via-[#F9F9FD]/92 to-transparent p-3 pt-8">
          <div className="rounded-[1.4rem] bg-white/95 p-3 shadow-[0_-4px_24px_rgba(26,28,31,0.06)] backdrop-blur">
            {resetLabel ? (
              <button
                type="reset"
                disabled={isUnavailable || pending}
                className="mb-3 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-[#D4D9E4] px-4 text-sm font-bold uppercase tracking-[0.08em] text-[#444750] transition hover:bg-[#F4F6FB] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {resetLabel}
              </button>
            ) : null}
            <SubmitButton disabled={isUnavailable} label={submitLabel} />
          </div>
        </div>
      </div>
    </form>
  );
}
