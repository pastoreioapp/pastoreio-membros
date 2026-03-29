"use client";

import { type ReactNode, useState } from "react";

type Tab = "unidades" | "rankings";

type UnidadeTabPanelProps = {
  unidades: ReactNode;
  rankings: ReactNode;
};

const TAB_CONFIG: { id: Tab; label: string }[] = [
  { id: "unidades", label: "Unidades" },
  { id: "rankings", label: "Classificacao de celulas" },
];

export function UnidadeTabPanel({ unidades, rankings }: UnidadeTabPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("unidades");

  return (
    <div className="space-y-5">
      <div className="flex rounded-full border border-[#E2E5ED] bg-[#F7F8FC] p-1">
        {TAB_CONFIG.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex-1 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.06em] transition ${
              activeTab === id
                ? "bg-badge-bg text-badge-text shadow-sm"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "unidades" ? unidades : rankings}
    </div>
  );
}
