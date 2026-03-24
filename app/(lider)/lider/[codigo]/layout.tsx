import { connection } from "next/server";
import Image from "next/image";
import { notFound } from "next/navigation";

import { CelulaContextCard } from "@/components/membros/celula-context";
import { LeaderPageRefresh } from "@/components/membros/leader-page-refresh";
import { resolveLeaderRouteAccess } from "@/lib/mapeamento/rotas";

export default async function LeaderAreaLayout({
  children,
  params,
}: LayoutProps<"/lider/[codigo]">) {
  await connection();

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
        <LeaderPageRefresh />
        <div className="space-y-6">
          <CelulaContextCard
            celula={access.celula}
            accessCode={access.access.code}
            actionHref="/"
            actionLabel="Trocar codigo"
          />
          {children}
        </div>
      </div>
    </main>
  );
}
