"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import {
  initialSaveMemberState,
  saveMemberAction,
} from "@/app/actions/membros";
import { CategoriasTrajetoria } from "@/app/types/trajetoria";
import { SubmitButton } from "@/components/membros/submit-button";
import { TrajetoriaSection } from "@/components/membros/trajetoria-section";

export type CelulaOption = {
  id: string;
  nome: string;
  setor: string | null;
  diaSemana: string | null;
  horario: string | null;
};

type MemberFormProps = {
  celulas: CelulaOption[];
  loadError?: string | null;
};

export function MemberForm({
  celulas,
  loadError = null,
}: MemberFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    saveMemberAction,
    initialSaveMemberState
  );
  const [nome, setNome] = useState("");
  const [celulaId, setCelulaId] = useState("");
  const [selectedPassos, setSelectedPassos] = useState<string[]>([]);
  const formState = state ?? initialSaveMemberState;
  const fieldErrors = formState.fieldErrors ?? {};
  const formStatus = formState.status ?? "idle";
  const formMessage = formState.message ?? null;

  const isUnavailable = Boolean(loadError) || celulas.length === 0;

  useEffect(() => {
    if (formStatus === "success") {
      formRef.current?.reset();
    }
  }, [formStatus]);

  function togglePasso(passo: string) {
    setSelectedPassos((current) =>
      current.includes(passo)
        ? current.filter((item) => item !== passo)
        : [...current, passo]
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onReset={() => {
        setNome("");
        setCelulaId("");
        setSelectedPassos([]);
      }}
      className="space-y-6 pb-28"
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Contexto atual
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              Escolha a celula
            </h2>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
            {celulas.length} opcoes
          </span>
        </div>

        <label className="mt-5 block text-sm font-medium text-slate-700">
          Celula
          <select
            name="celula_id"
            value={celulaId}
            onChange={(event) => setCelulaId(event.target.value)}
            disabled={isUnavailable || pending}
            className="mt-2 min-h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">Selecione uma celula</option>
            {celulas.map((celula) => (
              <option key={celula.id} value={celula.id}>
                {celula.nome}
                {celula.setor ? ` · ${celula.setor}` : ""}
              </option>
            ))}
          </select>
        </label>

        {fieldErrors.celulaId ? (
          <p className="mt-2 text-sm font-medium text-rose-700">
            {fieldErrors.celulaId}
          </p>
        ) : null}

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {loadError
            ? loadError
            : "A celula selecionada sera usada no cadastro deste membro."}
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Cadastro
        </p>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Nome do membro
          <input
            type="text"
            name="nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            disabled={isUnavailable || pending}
            placeholder="Ex.: Ana Carolina"
            className="mt-2 min-h-16 w-full rounded-2xl border border-slate-300 bg-white px-4 text-lg font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </label>

        {fieldErrors.nome ? (
          <p className="mt-2 text-sm font-medium text-rose-700">
            {fieldErrors.nome}
          </p>
        ) : (
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Use o nome completo para facilitar a busca futura.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Trajetoria
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              Marque os passos ja concluidos
            </h2>
          </div>
          <span className="rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white">
            {selectedPassos.length} de 19
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-600">
          Os passos estao separados por etapa para manter a leitura simples no
          celular.
        </p>

        {Object.entries(CategoriasTrajetoria).map(([categoria, passos]) => (
          <TrajetoriaSection
            key={categoria}
            categoria={categoria}
            passos={passos}
            selectedPassos={selectedPassos}
            onTogglePasso={togglePasso}
          />
        ))}

        {fieldErrors.passos ? (
          <p className="text-sm font-medium text-rose-700">
            {fieldErrors.passos}
          </p>
        ) : null}
      </section>

      <div aria-live="polite">
        {formMessage ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
              formStatus === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {formMessage}
          </div>
        ) : null}
      </div>

      <div className="sticky bottom-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/95 p-3 shadow-xl shadow-slate-950/10 backdrop-blur">
          <SubmitButton disabled={isUnavailable} />
        </div>
      </div>
    </form>
  );
}
