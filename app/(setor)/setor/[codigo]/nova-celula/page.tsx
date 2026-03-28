import { notFound } from "next/navigation";

import { CelulaForm } from "@/components/membros/celula-form";
import { resolveSetorRouteAccess } from "@/lib/mapeamento/rotas";

type SetorNewCelulaPageProps = {
  params: Promise<{ codigo: string }>;
};

export default async function SetorNewCelulaPage({
  params,
}: SetorNewCelulaPageProps) {
  const { codigo } = await params;
  const access = await resolveSetorRouteAccess(codigo);

  if (!access) {
    notFound();
  }

  return (
    <CelulaForm
      setorAccessCode={access.access.code}
      setorNome={access.setor.nome}
    />
  );
}
