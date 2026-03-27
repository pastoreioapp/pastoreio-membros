"use client";

import { useState } from "react";

type MemberSelfRegisterShareProps = {
  href: string;
};

export function MemberSelfRegisterShare({
  href,
}: MemberSelfRegisterShareProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    try {
      const absoluteUrl = new URL(href, window.location.origin).toString();
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="rounded-[20px] border border-[#C9D4E9] border-l-[3px] border-l-[#5974AD] bg-[#F0F4FE] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl leading-none" aria-hidden="true">🔗</span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-lg font-extrabold tracking-[-0.02em] text-[#17305E]">
            Compartilhe o link da sua célula
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#444750]">
            Use este link para que o próprio membro preencha os dados diretamente na
            célula correta, sem poder alterá-la.
          </p>

          <div className="mt-4 rounded-xl border border-[#D8E2FF] bg-white/70 p-3 sm:p-4">
            <p className="break-all text-sm font-medium text-[#1A1C1F]">
              {href}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleCopyLink()}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#3F5B93] px-5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-[#2D4E8A]"
            >
              {copied ? "Link copiado" : "Copiar link"}
            </button>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#5974AD] px-5 text-sm font-bold uppercase tracking-widest text-[#3F5B93] transition hover:bg-[#E2EAFF]"
            >
              Abrir link
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
