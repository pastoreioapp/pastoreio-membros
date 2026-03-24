import { notFound } from "next/navigation";

import { MemberList } from "@/components/membros/member-list";
import { loadMembersByCelulaId } from "@/lib/mapeamento/membros";
import { resolveLeaderRouteAccess } from "@/lib/mapeamento/rotas";

type LiderMembersPageProps = {
  params: Promise<{ codigo: string }>;
};

export default async function LiderMembersPage({
  params,
}: LiderMembersPageProps) {
  const { codigo } = await params;
  const access = await resolveLeaderRouteAccess(codigo);

  if (!access) {
    notFound();
  }

  const { members, loadError } = await loadMembersByCelulaId(access.celula.id);

  if (loadError) {
    return (
      <section className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-8 text-rose-900">
        <h2 className="font-heading text-2xl font-extrabold tracking-[-0.03em]">
          Nao foi possivel carregar os membros
        </h2>
        <p className="mt-3 text-sm leading-6">{loadError}</p>
      </section>
    );
  }

  return (
    <MemberList
      accessCode={access.access.code}
      celula={access.celula}
      members={members}
    />
  );
}
