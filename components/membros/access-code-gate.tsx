"use client";

import { useState } from "react";

import { ACCESS_CODE_SEARCH_PARAM } from "@/lib/mapeamento/constants";

type AccessCodeGateProps = {
  defaultValue: string;
  errorMessage: string | null;
};

export function AccessCodeGate({
  defaultValue,
  errorMessage,
}: AccessCodeGateProps) {
  const [code, setCode] = useState(defaultValue);
  const [dismissedError, setDismissedError] = useState(false);
  const visibleError = dismissedError ? null : errorMessage;

  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_50px_rgba(26,28,31,0.08)] sm:p-8">
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-[#D8E2FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#17305E]">
            Acesso do lider
          </span>
          <h1 className="font-heading text-3xl font-extrabold tracking-[-0.04em] text-[#1A1C1F] sm:text-[2.4rem]">
            Informe o codigo da sua celula
          </h1>
          <p className="text-sm leading-6 text-[#444750] sm:text-base">
            O cadastro de membros so e liberado para a celula vinculada ao
            codigo informado.
          </p>
        </div>

        <form method="get" className="space-y-4 text-left">
          <label className="block space-y-3">
            <span className="block text-sm font-bold text-[#444750]">
              Codigo de acesso
            </span>
            <input
              type="text"
              name={ACCESS_CODE_SEARCH_PARAM}
              value={code}
              autoComplete="one-time-code"
              autoCapitalize="characters"
              spellCheck={false}
              required
              placeholder="Ex.: CEL-1001"
              onChange={(event) => {
                setCode(event.target.value);

                if (!dismissedError && errorMessage) {
                  setDismissedError(true);
                }
              }}
              className={`min-h-[64px] w-full rounded-2xl border bg-[#F7F8FC] px-5 text-lg font-semibold uppercase tracking-[0.08em] text-[#1A1C1F] outline-none transition placeholder:text-[#7A7F8C] focus:bg-white ${
                visibleError
                  ? "border-rose-300 focus:border-rose-500"
                  : "border-[#D9DCE4] focus:border-[#5974AD]"
              }`}
            />
          </label>

          {visibleError ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
              {visibleError}
            </p>
          ) : null}

          <button
            type="submit"
            className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-linear-to-b from-[#3F5B93] to-[#5974AD] px-5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_18px_40px_rgba(63,91,147,0.22)] transition hover:brightness-105"
          >
            Entrar na celula
          </button>
        </form>
      </div>
    </section>
  );
}
