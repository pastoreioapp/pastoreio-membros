import type { ComponentType } from "react";

import {
  type CategoriaTrajetoria,
  type PassoTrajetoria,
} from "@/app/types/trajetoria";
import {
  AccordionChevronIcon,
  DiscipuladoIcon,
  type IconProps,
  LiderCelulaIcon,
  PastoreioOneIcon,
  PastoreioTwoIcon,
} from "@/components/membros/member-form-icons";
import { MEMBER_FORM_FIELDS } from "@/lib/mapeamento/constants";

type TrajetoriaSectionProps = {
  categoria: CategoriaTrajetoria;
  passos: readonly PassoTrajetoria[];
  selectedPassos: PassoTrajetoria[];
  onTogglePasso: (passo: PassoTrajetoria) => void;
  defaultOpen?: boolean;
};

const SECTION_ICONS: Record<CategoriaTrajetoria, ComponentType<IconProps>> = {
  "PASTOREIO 01": PastoreioOneIcon,
  "PASTOREIO 02": PastoreioTwoIcon,
  DISCIPULADO: DiscipuladoIcon,
  "LÍDER DE CÉLULA": LiderCelulaIcon,
};

export function TrajetoriaSection({
  categoria,
  passos,
  selectedPassos,
  onTogglePasso,
  defaultOpen = false,
}: TrajetoriaSectionProps) {
  const SectionIcon = SECTION_ICONS[categoria];
  const selectedCount = passos.filter((passo) =>
    selectedPassos.includes(passo)
  ).length;

  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-2xl bg-[#F3F3F7]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <SectionIcon className="h-11 w-11 shrink-0" />
          <div className="min-w-0">
            <p className="font-heading truncate text-base font-bold text-[#1A1C1F]">
              {categoria}
            </p>
            <p className="mt-1 text-sm text-slate-600">
            {selectedCount} de {passos.length} concluidos
          </p>
        </div>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white transition-transform group-open:rotate-180">
          <AccordionChevronIcon className="h-2 w-3" />
        </span>
      </summary>

      <div className="border-t border-black/5 bg-white px-5 py-5 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {passos.map((passo) => {
            const checked = selectedPassos.includes(passo);

            return (
              <label
                key={passo}
                className={`flex min-h-14 cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 text-left transition ${
                  checked
                    ? "border-[#5974AD] bg-[#EEF3FF]"
                    : "border-[#E2E2E6] bg-white hover:border-[#CAD3E4]"
                }`}
              >
                <input
                  type="checkbox"
                  name={MEMBER_FORM_FIELDS.passosConcluidos}
                  value={passo}
                  checked={checked}
                  onChange={() => onTogglePasso(passo)}
                  className="sr-only"
                />
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 ${
                    checked
                      ? "border-[#5974AD] bg-[#5974AD] text-white"
                      : "border-[#3F5B93] bg-white text-transparent"
                  }`}
                >
                  <span className="text-xs font-bold leading-none">✓</span>
                </span>
                <span className="text-[15px] font-medium leading-6 text-[#1A1C1F]">
                  {passo}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </details>
  );
}
