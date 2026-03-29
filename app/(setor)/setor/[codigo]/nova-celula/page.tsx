import { notFound } from "next/navigation";

import { CelulaForm } from "@/components/celulas/celula-form";
import { resolveUnidadeRouteAccess } from "@/lib/rotas";

type SetorNewCelulaPageProps = {
  params: Promise<{ codigo: string }>;
};

export default async function SetorNewCelulaPage({
  params,
}: SetorNewCelulaPageProps) {
  const { codigo } = await params;
  const access = await resolveUnidadeRouteAccess(codigo);

  if (!access) {
    notFound();
  }

  return (
    <CelulaForm
      unidadeAccessCode={access.access.code}
      unidadeNome={access.unidade.nome}
    />
  );
}
