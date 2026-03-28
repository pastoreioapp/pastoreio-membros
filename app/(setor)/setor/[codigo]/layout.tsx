import { connection } from "next/server";
import Image from "next/image";
import { notFound } from "next/navigation";

import { BackButton } from "@/components/membros/back-button";
import { SetorContextCard } from "@/components/membros/setor-context";
import { resolveSetorRouteAccess } from "@/lib/mapeamento/rotas";

type SetorAreaLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ codigo: string }>;
};

export default async function SetorAreaLayout({
  children,
  params,
}: SetorAreaLayoutProps) {
  await connection();

  const { codigo } = await params;
  const access = await resolveSetorRouteAccess(codigo);

  if (!access) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F9F9FD] text-[#1A1C1F]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#F9F9FD]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[816px] items-center px-6 py-4">
          <BackButton />
          <div className="flex flex-1 justify-center">
            <Image
              src="/figma/pastoreio-logo.png"
              alt="Pastore.io"
              width={320}
              height={70}
              priority
              className="h-11 w-auto sm:h-14"
            />
          </div>
          <div className="min-w-11" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[816px] px-4 py-8 sm:px-6 sm:py-10">
        <div className="space-y-6">
          <SetorContextCard
            setor={access.setor}
            accessCode={access.access.code}
          />
          {children}
        </div>
      </div>
    </main>
  );
}
