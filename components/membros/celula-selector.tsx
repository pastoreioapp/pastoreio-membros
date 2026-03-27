"use client";

import { useEffect, useRef, useState } from "react";

import {
  CelulaAvatar,
  CelulaContextCard,
  CelulaContextContent,
} from "@/components/membros/celula-context";
import type { CelulaOption } from "@/lib/mapeamento/types";

type CelulaSelectorProps = {
  celulas: CelulaOption[];
  celulaId: string;
  selectedCelula: CelulaOption | null;
  isLockedToSingleCelula: boolean;
  showLockedContextCard: boolean;
  lockedAccessCode: string;
  backHref: string;
  backLabel: string;
  disabled: boolean;
  onSelectCelula: (celulaId: string) => void;
  fieldErrors: {
    codigoAcesso?: string;
    celulaId?: string;
  };
};

export function CelulaSelector({
  celulas,
  celulaId,
  selectedCelula,
  isLockedToSingleCelula,
  showLockedContextCard,
  lockedAccessCode,
  backHref,
  backLabel,
  disabled,
  onSelectCelula,
  fieldErrors,
}: CelulaSelectorProps) {
  const selectorRef = useRef<HTMLDivElement>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

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

  function handleSelectCelula(nextCelulaId: string) {
    onSelectCelula(nextCelulaId);
    setIsSelectorOpen(false);
  }

  if (isLockedToSingleCelula && !showLockedContextCard) {
    return null;
  }

  return (
    <section className="rounded-[24px] bg-[#5974AD] p-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="relative" ref={selectorRef}>
        {isLockedToSingleCelula && showLockedContextCard ? (
          <CelulaContextCard
            celula={selectedCelula}
            accessCode={lockedAccessCode}
            actionHref={backHref}
            actionLabel={backLabel}
          />
        ) : !isLockedToSingleCelula ? (
          <>
            <button
              type="button"
              disabled={disabled}
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
  );
}
