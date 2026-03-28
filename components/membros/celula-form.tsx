"use client";

import { useActionState, useState } from "react";

import { saveSetorCelulaAction } from "@/app/actions/celulas";
import { SubmitButton } from "@/components/membros/submit-button";
import { CELULA_FORM_FIELDS } from "@/lib/mapeamento/constants";
import { initialSaveCelulaState } from "@/lib/mapeamento/types";

type CelulaFormProps = {
  setorAccessCode: string;
  setorNome: string;
};

export function CelulaForm({ setorAccessCode, setorNome }: CelulaFormProps) {
  const [state, formAction, pending] = useActionState(
    saveSetorCelulaAction,
    initialSaveCelulaState
  );

  const [nome, setNome] = useState("");
  const [lideres, setLideres] = useState("");
  const [diaSemana, setDiaSemana] = useState("");
  const [horario, setHorario] = useState("");
  const [codigoAcesso, setCodigoAcesso] = useState("");

  const formState = state ?? initialSaveCelulaState;
  const fieldErrors = formState.fieldErrors ?? {};
  const formStatus = formState.status ?? "idle";
  const formMessage = formState.message ?? null;

  return (
    <form
      action={formAction}
      onReset={() => {
        setNome("");
        setLideres("");
        setDiaSemana("");
        setHorario("");
        setCodigoAcesso("");
      }}
      className="space-y-6 pb-32"
    >
      <input
        type="hidden"
        name={CELULA_FORM_FIELDS.setorCodigoAcesso}
        value={setorAccessCode}
      />

      <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(26,28,31,0.08)] sm:p-6">
        <div className="space-y-5">
          <div>
            <span className="inline-flex rounded-full bg-[#D8E2FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#17305E]">
              Nova celula
            </span>
            <h2 className="font-heading mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#1A1C1F]">
              Cadastrar celula em {setorNome}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#444750]">
              Preencha os dados da nova celula para o setor.
            </p>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#444750]">
              Nome da celula *
            </span>
            <input
              type="text"
              name={CELULA_FORM_FIELDS.nome}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={pending}
              placeholder="Ex: Renovo, Kadosh..."
              className={`min-h-[56px] w-full rounded-xl border bg-[#F7F8FC] px-5 text-base font-medium text-[#1A1C1F] outline-none transition placeholder:text-[#7A7F8C] focus:bg-white ${
                fieldErrors.nome
                  ? "border-rose-300 focus:border-rose-500"
                  : "border-[#D9DCE4] focus:border-[#5974AD]"
              }`}
            />
            {fieldErrors.nome ? (
              <p className="mt-1.5 px-1 text-sm font-medium text-rose-700">
                {fieldErrors.nome}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#444750]">
              Lideres
            </span>
            <input
              type="text"
              name={CELULA_FORM_FIELDS.lideres}
              value={lideres}
              onChange={(e) => setLideres(e.target.value)}
              disabled={pending}
              placeholder="Ex: João e Maria"
              className="min-h-[56px] w-full rounded-xl border border-[#D9DCE4] bg-[#F7F8FC] px-5 text-base font-medium text-[#1A1C1F] outline-none transition placeholder:text-[#7A7F8C] focus:border-[#5974AD] focus:bg-white"
            />
            {fieldErrors.lideres ? (
              <p className="mt-1.5 px-1 text-sm font-medium text-rose-700">
                {fieldErrors.lideres}
              </p>
            ) : null}
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#444750]">
                Dia da semana
              </span>
              <input
                type="text"
                name={CELULA_FORM_FIELDS.diaSemana}
                value={diaSemana}
                onChange={(e) => setDiaSemana(e.target.value)}
                disabled={pending}
                placeholder="Ex: Terça-feira"
                className="min-h-[56px] w-full rounded-xl border border-[#D9DCE4] bg-[#F7F8FC] px-5 text-base font-medium text-[#1A1C1F] outline-none transition placeholder:text-[#7A7F8C] focus:border-[#5974AD] focus:bg-white"
              />
              {fieldErrors.diaSemana ? (
                <p className="mt-1.5 px-1 text-sm font-medium text-rose-700">
                  {fieldErrors.diaSemana}
                </p>
              ) : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#444750]">
                Horario
              </span>
              <input
                type="text"
                name={CELULA_FORM_FIELDS.horario}
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
                disabled={pending}
                placeholder="Ex: 20:00"
                className="min-h-[56px] w-full rounded-xl border border-[#D9DCE4] bg-[#F7F8FC] px-5 text-base font-medium text-[#1A1C1F] outline-none transition placeholder:text-[#7A7F8C] focus:border-[#5974AD] focus:bg-white"
              />
              {fieldErrors.horario ? (
                <p className="mt-1.5 px-1 text-sm font-medium text-rose-700">
                  {fieldErrors.horario}
                </p>
              ) : null}
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#444750]">
              Codigo de acesso da celula
            </span>
            <input
              type="text"
              name={CELULA_FORM_FIELDS.codigoAcesso}
              value={codigoAcesso}
              onChange={(e) => setCodigoAcesso(e.target.value)}
              disabled={pending}
              autoCapitalize="characters"
              placeholder="Ex: CEL1031"
              className={`min-h-[56px] w-full rounded-xl border bg-[#F7F8FC] px-5 text-base font-semibold uppercase tracking-[0.06em] text-[#1A1C1F] outline-none transition placeholder:text-[#7A7F8C] placeholder:normal-case placeholder:tracking-normal focus:bg-white ${
                fieldErrors.codigoAcesso
                  ? "border-rose-300 focus:border-rose-500"
                  : "border-[#D9DCE4] focus:border-[#5974AD]"
              }`}
            />
            <p className="mt-1.5 px-1 text-xs text-[#5C6070]">
              Opcional. Se informado, os lideres poderao acessar a celula com esse codigo.
            </p>
            {fieldErrors.codigoAcesso ? (
              <p className="mt-1.5 px-1 text-sm font-medium text-rose-700">
                {fieldErrors.codigoAcesso}
              </p>
            ) : null}
          </label>
        </div>
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
            <SubmitButton
              label="Cadastrar celula"
              pendingLabel="Salvando celula..."
            />
          </div>
        </div>
      </div>
    </form>
  );
}
