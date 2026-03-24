"use client";

import { useFormStatus } from "react-dom";

import { SaveMemberIcon } from "@/components/membros/member-form-icons";

type SubmitButtonProps = {
  disabled?: boolean;
  label?: string;
  pendingLabel?: string;
};

export function SubmitButton({
  disabled = false,
  label = "Salvar membro",
  pendingLabel = "Salvando membro...",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="flex min-h-15 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-linear-to-b from-[#3F5B93] to-[#5974AD] px-5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_-4px_24px_rgba(26,28,31,0.06)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <SaveMemberIcon className="h-5 w-5 shrink-0 text-white" />
      {pending ? pendingLabel : label}
    </button>
  );
}
