import { notFound } from "next/navigation";

import { CelulaList } from "@/components/membros/celula-list";
import { loadCelulasBySetorId } from "@/lib/mapeamento/celulas";
import { resolveSetorRouteAccess } from "@/lib/mapeamento/rotas";

type SetorCelulasPageProps = {
  params: Promise<{ codigo: string }>;
};

export default async function SetorCelulasPage({
  params,
}: SetorCelulasPageProps) {
  const { codigo } = await params;
  const access = await resolveSetorRouteAccess(codigo);

  if (!access) {
    notFound();
  }

  const { celulas, loadError } = await loadCelulasBySetorId(access.access.setorId);

  if (loadError) {
    return (
      <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-8 text-rose-900">
        <h2 className="font-heading text-2xl font-extrabold tracking-[-0.03em]">
          Nao foi possivel carregar as celulas
        </h2>
        <p className="mt-3 text-sm leading-6">{loadError}</p>
      </section>
    );
  }

  return (
    <CelulaList
      celulas={celulas}
      setorNome={access.setor.nome}
      setorAccessCode={access.access.code}
    />
  );
}
