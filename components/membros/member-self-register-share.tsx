"use client";

import { useState } from "react";

type MemberSelfRegisterShareProps = {
  href: string;
};

export function MemberSelfRegisterShare({
  href,
}: MemberSelfRegisterShareProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window === "undefined"
      ? href
      : new URL(href, window.location.origin).toString();

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(26,28,31,0.08)] sm:p-6">
      <span className="inline-flex rounded-full bg-[#D8E2FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#17305E]">
        Auto-cadastro do membro
      </span>
      <h2 className="font-heading mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#1A1C1F]">
        Compartilhe o link da sua célula
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#444750]">
        Use este link para que o próprio membro preencha os dados diretamente na
        célula correta, sem poder alterá-la.
      </p>

      <div className="mt-5 rounded-2xl border border-[#DCE3F1] bg-[#F7F9FD] p-3 sm:p-4">
        <p className="break-all text-sm font-medium text-[#1A1C1F]">
          {shareUrl}
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => void handleCopyLink()}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-linear-to-b from-[#3F5B93] to-[#5974AD] px-5 text-sm font-bold uppercase tracking-widest text-white shadow-[0_18px_40px_rgba(63,91,147,0.22)] transition hover:brightness-105"
        >
          {copied ? "Link copiado" : "Copiar link"}
        </button>
        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#5974AD] px-5 text-sm font-bold uppercase tracking-widest text-[#3F5B93] transition hover:bg-[#EEF3FF]"
        >
          Abrir link
        </a>
      </div>
    </section>
  );
}
