"use client";

import { type ReactNode, useState } from "react";

type Tab = "primary" | "rankings";

type UnidadeTabPanelProps = {
  primaryLabel: string;
  primaryContent: ReactNode;
  rankings: ReactNode;
};

export function UnidadeTabPanel({
  primaryLabel,
  primaryContent,
  rankings,
}: UnidadeTabPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("primary");

  const tabs: { id: Tab; label: string }[] = [
    { id: "primary", label: primaryLabel },
    { id: "rankings", label: "Classificacao de celulas" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex rounded-full border border-[#E2E5ED] bg-[#F7F8FC] p-1">
        {tabs.map(({ id, label }) => (
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

      {activeTab === "primary" ? primaryContent : rankings}
    </div>
  );
}
