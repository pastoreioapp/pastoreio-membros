import { MemberForm } from "@/components/membros/member-form";
import { resolveLeaderRouteAccess } from "@/lib/mapeamento/rotas";

type LeaderCreateMemberPageProps = {
  params: Promise<{ codigo: string }>;
};

export default async function LeaderCreateMemberPage(
  props: LeaderCreateMemberPageProps
) {
  const { codigo } = await props.params;
  const access = await resolveLeaderRouteAccess(codigo);
  const celula = access?.celula ?? null;
  const accessCode = access?.access.code ?? decodeURIComponent(codigo);

  return (
    <section className="space-y-5">
      <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(26,28,31,0.08)] sm:p-6">
        <span className="inline-flex rounded-full bg-[#D8E2FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#17305E]">
          Cadastro de membro
        </span>
        <h2 className="font-heading mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#1A1C1F]">
          Novo membro para {celula?.nome ?? "a célula"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#444750]">
          Preencha o formulário abaixo para adicionar um novo membro à célula vinculada ao código informado.
        </p>
      </div>

      <MemberForm
        celulas={celula ? [celula] : []}
        lockedAccessCode={accessCode}
        backHref={`/lider/${encodeURIComponent(accessCode)}`}
      />
    </section>
  );
}
