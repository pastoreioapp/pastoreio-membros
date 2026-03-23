import Image from "next/image";
import { notFound } from "next/navigation";

import { saveSelfRegisterMemberAction } from "@/app/actions/membros";
import { MemberForm } from "@/components/membros/member-form";
import { resolveLeaderRouteAccess } from "@/lib/mapeamento/rotas";

type MemberSelfRegistrationPageProps = {
  params: Promise<{ codigo: string }>;
};

export default async function MemberSelfRegistrationPage({
  params,
}: MemberSelfRegistrationPageProps) {
  const { codigo } = await params;
  const access = await resolveLeaderRouteAccess(codigo);

  if (!access) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F9F9FD] text-[#1A1C1F]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#F9F9FD]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[816px] items-center justify-center px-6 py-4">
          <Image
            src="/figma/pastoreio-logo.png"
            alt="Pastore.io"
            width={320}
            height={70}
            priority
            className="h-11 w-auto sm:h-14"
          />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[816px] px-4 py-8 sm:px-6 sm:py-10">
        <section className="space-y-5">
          <div className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(26,28,31,0.08)] sm:p-6">
            <span className="inline-flex rounded-full bg-[#D8E2FF] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#17305E]">
              Auto-cadastro
            </span>
            <h1 className="font-heading mt-3 text-3xl font-extrabold tracking-[-0.04em] text-[#1A1C1F]">
              Complete seu cadastro em {access.celula.nome}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#444750]">
              Informe seus dados para entrar no mapeamento desta célula. A célula já está definida neste link e não pode ser alterada.
            </p>
          </div>

          <MemberForm
            celulas={[access.celula]}
            lockedAccessCode={access.access.code}
            formAction={saveSelfRegisterMemberAction}
            submitLabel="Enviar cadastro"
            title="Trajetoria de Crescimento"
            description="Marque os passos que ja fazem parte da sua caminhada."
          />
        </section>
      </div>
    </main>
  );
}
