import { connection } from "next/server";
import Image from "next/image";
import { redirect } from "next/navigation";

import { AccessCodeGate } from "@/components/membros/access-code-gate";
import { resolveCelulaAccess } from "@/lib/mapeamento/acesso";
import { ACCESS_CODE_SEARCH_PARAM } from "@/lib/mapeamento/constants";
import { buildLeaderMembersRoute } from "@/lib/mapeamento/routes";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParamValue(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({ searchParams }: HomePageProps) {
  await connection();

  const params = await searchParams;
  const rawCode = readSearchParamValue(params[ACCESS_CODE_SEARCH_PARAM]);
  const resolvedAccess = resolveCelulaAccess(rawCode);

  if (resolvedAccess) {
    redirect(buildLeaderMembersRoute(resolvedAccess.code));
  }

  const hasProvidedCode = Boolean(rawCode?.trim());
  const accessError = hasProvidedCode && !resolvedAccess
    ? "Codigo invalido. Confira o codigo da sua celula e tente novamente."
    : null;

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
        <AccessCodeGate
          defaultValue={rawCode ?? ""}
          errorMessage={accessError}
        />
      </div>
    </main>
  );
}
