"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";

import { saveLeaderMemberAction } from "@/app/actions/membros";
import {
  CategoriasTrajetoriaEntries,
  type PassoTrajetoria,
  TotalPassosTrajetoria,
} from "@/app/types/trajetoria";
import {
  MemberInputIcon,
} from "@/components/membros/member-form-icons";
import {
  CelulaAvatar,
  CelulaContextCard,
  CelulaContextContent,
} from "@/components/membros/celula-context";
import { SubmitButton } from "@/components/membros/submit-button";
import { TrajetoriaSection } from "@/components/membros/trajetoria-section";
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
  const selectorRef = useRef<HTMLDivElement>(null);
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
  const initialServeMinisterio = initialValues?.serveMinisterio ?? false;
  const initialPassos = initialValues?.passosConcluidos ?? [];
  const [nome, setNome] = useState(initialNome);
  const [selectedCelulaId, setSelectedCelulaId] = useState(initialCelulaId);
  const [estadoCivil, setEstadoCivil] = useState(initialEstadoCivil);
  const [telefone, setTelefone] = useState(initialTelefone);
  const [dataNascimento, setDataNascimento] = useState(initialDataNascimento);
  const [discipuladorNome, setDiscipuladorNome] = useState(initialDiscipuladorNome);
  const [serveMinisterio, setServeMinisterio] = useState(initialServeMinisterio);
  const [selectedPassos, setSelectedPassos] = useState<PassoTrajetoria[]>(initialPassos);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
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

  useEffect(() => {
    if (!isSelectorOpen || isLockedToSingleCelula) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!selectorRef.current?.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSelectorOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLockedToSingleCelula, isSelectorOpen]);

  function togglePasso(passo: PassoTrajetoria) {
    setSelectedPassos((current) =>
      current.includes(passo)
        ? current.filter((item) => item !== passo)
        : [...current, passo]
    );
  }

  function handleSelectCelula(nextCelulaId: string) {
    setSelectedCelulaId(nextCelulaId);
    setIsSelectorOpen(false);
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
        setServeMinisterio(initialServeMinisterio);
        setSelectedPassos(initialPassos);
        setIsSelectorOpen(false);
      }}
      className="space-y-8 pb-32"
    >
      <section className="rounded-[24px] bg-[#5974AD] p-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="relative" ref={selectorRef}>
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

          {isLockedToSingleCelula && showLockedContextCard ? (
            <CelulaContextCard
              celula={selectedCelula}
              accessCode={lockedAccessCode ?? ""}
              actionHref={backHref}
              actionLabel={backLabel}
            />
          ) : !isLockedToSingleCelula ? (
            <>
              <button
                type="button"
                disabled={isUnavailable || pending}
                aria-expanded={isSelectorOpen}
                aria-haspopup="listbox"
                aria-controls="celula-selector-options"
                onClick={() => setIsSelectorOpen((current) => !current)}
                className="relative w-full cursor-pointer overflow-hidden rounded-[22px] bg-white p-6 text-left transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                <CelulaContextContent celula={selectedCelula} />
              </button>

              {isSelectorOpen ? (
                <div
                  id="celula-selector-options"
                  role="listbox"
                  aria-label="Lista de celulas disponiveis"
                  className="absolute inset-x-0 top-[calc(100%+12px)] z-30 rounded-[24px] border border-[#E3E8F3] bg-white p-3 shadow-[0_24px_48px_rgba(26,28,31,0.12)]"
                >
                  <div className="max-h-112 space-y-2 overflow-y-auto pr-1">
                    {celulas.map((celula) => {
                      const isSelected = celula.id === celulaId;

                      return (
                        <button
                          key={celula.id}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => handleSelectCelula(celula.id)}
                          className={`w-full cursor-pointer rounded-[20px] border p-4 text-left transition ${
                            isSelected
                              ? "border-[#5974AD] bg-[#EEF3FF]"
                              : "border-[#E7E8EE] bg-[#FBFBFE] hover:border-[#C8D3EA] hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <CelulaAvatar
                              celula={celula}
                              className="h-16 w-16 shrink-0"
                              imageSizes="64px"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold uppercase tracking-widest text-[#3F5B93]">
                                {celula.setor ? `SETOR ${celula.setor}` : "CELULA"}
                              </p>
                              <p className="font-heading mt-1 text-lg font-extrabold tracking-[-0.03em] text-[#1A1C1F]">
                                {celula.nome}
                              </p>
                            </div>

                            <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#B8C5E0]">
                              {isSelected ? (
                                <span className="h-2.5 w-2.5 rounded-full bg-[#5974AD]" />
                              ) : null}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        {fieldErrors.codigoAcesso ? (
          <p className="mt-3 px-1 text-sm font-medium text-rose-100">
            {fieldErrors.codigoAcesso}
          </p>
        ) : null}

        {fieldErrors.celulaId ? (
          <p className="mt-3 px-1 text-sm font-medium text-rose-100">
            {fieldErrors.celulaId}
          </p>
        ) : null}
      </section>

      <section className="space-y-3">
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

      <section className="space-y-5">
        <div className="px-1">
          <h2 className="font-heading text-2xl font-extrabold tracking-[-0.03em] text-[#1A1C1F] sm:text-[1.9rem]">
            Dados do membro
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#444750]">
            Registre as informações pessoais para facilitar o acompanhamento desta pessoa.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-3 block text-sm font-bold text-[#444750]">
              Estado civil
            </span>
            <input
              type="text"
              name={MEMBER_FORM_FIELDS.estadoCivil}
              value={estadoCivil}
              onChange={(event) => setEstadoCivil(event.target.value)}
              disabled={isUnavailable || pending}
              placeholder="Ex.: Solteiro(a)"
              className="min-h-14 w-full rounded-xl border-2 border-transparent bg-[#E2E2E6] px-5 text-base font-medium text-[#1A1C1F] outline-none transition placeholder:text-[#444750]/40 focus:border-[#5974AD] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            />
            {fieldErrors.estadoCivil ? (
              <p className="px-1 pt-2 text-sm font-medium text-rose-700">
                {fieldErrors.estadoCivil}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-bold text-[#444750]">
              Telefone
            </span>
            <input
              type="tel"
              name={MEMBER_FORM_FIELDS.telefone}
              value={telefone}
              onChange={(event) => setTelefone(event.target.value)}
              disabled={isUnavailable || pending}
              placeholder="(00) 00000-0000"
              className="min-h-14 w-full rounded-xl border-2 border-transparent bg-[#E2E2E6] px-5 text-base font-medium text-[#1A1C1F] outline-none transition placeholder:text-[#444750]/40 focus:border-[#5974AD] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            />
            {fieldErrors.telefone ? (
              <p className="px-1 pt-2 text-sm font-medium text-rose-700">
                {fieldErrors.telefone}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-bold text-[#444750]">
              Data de nascimento
            </span>
            <input
              type="date"
              name={MEMBER_FORM_FIELDS.dataNascimento}
              value={dataNascimento}
              onChange={(event) => setDataNascimento(event.target.value)}
              disabled={isUnavailable || pending}
              className="min-h-14 w-full rounded-xl border-2 border-transparent bg-[#E2E2E6] px-5 text-base font-medium text-[#1A1C1F] outline-none transition focus:border-[#5974AD] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            />
            {fieldErrors.dataNascimento ? (
              <p className="px-1 pt-2 text-sm font-medium text-rose-700">
                {fieldErrors.dataNascimento}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-3 block text-sm font-bold text-[#444750]">
              Discipulador
            </span>
            <input
              type="text"
              name={MEMBER_FORM_FIELDS.discipuladorNome}
              value={discipuladorNome}
              onChange={(event) => setDiscipuladorNome(event.target.value)}
              disabled={isUnavailable || pending}
              placeholder="Nome de quem discipula"
              className="min-h-14 w-full rounded-xl border-2 border-transparent bg-[#E2E2E6] px-5 text-base font-medium text-[#1A1C1F] outline-none transition placeholder:text-[#444750]/40 focus:border-[#5974AD] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            />
            {fieldErrors.discipuladorNome ? (
              <p className="px-1 pt-2 text-sm font-medium text-rose-700">
                {fieldErrors.discipuladorNome}
              </p>
            ) : null}
          </label>
        </div>

        <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-[#D8E2FF] bg-white px-4 py-4 transition hover:border-[#5974AD]">
          <input
            type="checkbox"
            name={MEMBER_FORM_FIELDS.serveMinisterio}
            value="true"
            checked={serveMinisterio}
            onChange={(event) => setServeMinisterio(event.target.checked)}
            disabled={isUnavailable || pending}
            className="mt-1 h-5 w-5 rounded border-[#B8C5E0] text-[#5974AD] focus:ring-[#5974AD] disabled:cursor-not-allowed"
          />
          <div>
            <p className="text-sm font-bold text-[#1A1C1F]">
              Serve em algum ministério
            </p>
            <p className="mt-1 text-sm leading-6 text-[#5C6070]">
              Marque esta opção se o membro já participa ativamente de algum ministério.
            </p>
          </div>
        </label>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4 px-1">
          <div>
            <h2 className="font-heading text-2xl font-extrabold tracking-[-0.03em] text-[#1A1C1F] sm:text-[1.9rem]">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-sm leading-6 text-[#444750]">
                {description}
              </p>
            ) : null}
            <p className="mt-2 text-sm leading-6 text-[#444750]">
              {selectedPassos.length} de {TotalPassosTrajetoria} passos marcados
            </p>
          </div>
          <span className="rounded-full bg-[#D8E2FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[#001A42]">
            Passo a Passo
          </span>
        </div>

        {CategoriasTrajetoriaEntries.map(([categoria, passos], index) => (
          <TrajetoriaSection
            key={categoria}
            categoria={categoria}
            passos={passos}
            selectedPassos={selectedPassos}
            onTogglePasso={togglePasso}
            defaultOpen={index === 0}
          />
        ))}

        {selectedPassos.map((passo) => (
          <input
            key={passo}
            type="hidden"
            name={MEMBER_FORM_FIELDS.passosConcluidos}
            value={passo}
          />
        ))}

        {fieldErrors.passos ? (
          <p className="px-1 text-sm font-medium text-rose-700">
            {fieldErrors.passos}
          </p>
        ) : null}
      </section>

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
