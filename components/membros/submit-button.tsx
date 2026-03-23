"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  disabled?: boolean;
};

export function SubmitButton({ disabled = false }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 text-base font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {pending ? "Salvando membro..." : "Salvar membro"}
    </button>
  );
}
