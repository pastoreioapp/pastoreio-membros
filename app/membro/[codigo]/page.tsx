import Image from "next/image";
import { notFound } from "next/navigation";

import { saveSelfRegisterMemberAction } from "@/app/actions/membros";
import { CelulaAvatar } from "@/components/membros/celula-context";
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
          <section className="relative overflow-hidden rounded-[24px] bg-linear-to-br from-[#2D4E8A] via-[#3F5B93] to-[#6B8AC4] shadow-[0_18px_50px_rgba(23,48,94,0.18)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.10),transparent_60%)]" />
            <div className="relative p-6">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm">
                Auto-cadastro
              </span>

              <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
                <CelulaAvatar
                  celula={access.celula}
                  className="h-20 w-20 shrink-0"
                  imageSizes="80px"
                />
                <div className="min-w-0 flex-1">
                  <h1 className="font-heading text-[1.75rem] font-extrabold leading-tight tracking-[-0.04em] text-white">
                    Complete seu cadastro em {access.celula.nome}
                  </h1>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Informe seus dados para entrar no mapeamento desta célula. A célula já está definida neste link e não pode ser alterada.
                  </p>
                </div>
              </div>
            </div>
          </section>

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
