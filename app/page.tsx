import { connection } from "next/server";
import Image from "next/image";
import { redirect } from "next/navigation";

import { AccessCodeGate } from "@/components/membros/access-code-gate";
import { loadCelulaByAccessCode } from "@/lib/mapeamento/celulas";
import { loadSetorByAccessCode } from "@/lib/mapeamento/setores";
import {
  ACCESS_CODE_SEARCH_PARAM,
  ACCESS_TYPE_SEARCH_PARAM,
  ACCESS_TYPE_CELULA,
  ACCESS_TYPE_SETOR,
  type AccessType,
} from "@/lib/mapeamento/constants";
import {
  buildLeaderMembersRoute,
  buildSetorCelulasRoute,
} from "@/lib/mapeamento/routes";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function readSearchParamValue(
  value: string | string[] | undefined
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseAccessType(value: string | undefined): AccessType {
  return value === ACCESS_TYPE_SETOR ? ACCESS_TYPE_SETOR : ACCESS_TYPE_CELULA;
}

export default async function Home({ searchParams }: HomePageProps) {
  await connection();

  const params = await searchParams;
  const rawCode = readSearchParamValue(params[ACCESS_CODE_SEARCH_PARAM]);
  const accessType = parseAccessType(
    readSearchParamValue(params[ACCESS_TYPE_SEARCH_PARAM])
  );

  const hasProvidedCode = Boolean(rawCode?.trim());

  if (hasProvidedCode) {
    if (accessType === ACCESS_TYPE_SETOR) {
      const resolved = await loadSetorByAccessCode(rawCode);

      if (resolved) {
        redirect(buildSetorCelulasRoute(resolved.code));
      }
    } else {
      const resolved = await loadCelulaByAccessCode(rawCode);

      if (resolved) {
        redirect(buildLeaderMembersRoute(resolved.code));
      }
    }
  }

  const accessError = hasProvidedCode
    ? accessType === ACCESS_TYPE_SETOR
      ? "Codigo invalido. Confira o codigo do seu setor e tente novamente."
      : "Codigo invalido. Confira o codigo da sua celula e tente novamente."
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
          defaultType={accessType}
          errorMessage={accessError}
        />
      </div>
    </main>
  );
}
