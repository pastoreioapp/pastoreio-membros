import { connection } from "next/server";

import {
  MemberForm,
  type CelulaOption,
} from "@/components/membros/member-form";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

async function loadCelulas(): Promise<{
  celulas: CelulaOption[];
  loadError: string | null;
}> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return {
      celulas: [],
      loadError: configError,
    };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .schema("mapeamento")
      .from("celulas")
      .select("id, nome, setor, dia_semana, horario")
      .order("nome", { ascending: true });

    if (error) {
      throw error;
    }

    return {
      celulas: (data ?? []).map((celula) => ({
        id: celula.id,
        nome: celula.nome,
        setor: celula.setor,
        diaSemana: celula.dia_semana,
        horario: celula.horario,
      })),
      loadError: null,
    };
  } catch {
    return {
      celulas: [],
      loadError:
        "Nao foi possivel carregar as celulas agora. Verifique a conexao com o Supabase.",
    };
  }
}

export default async function Home() {
  await connection();

  const { celulas, loadError } = await loadCelulas();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-6 sm:px-6 sm:py-8">
      <section className="rounded-[2rem] bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-950/20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
          Mapeamento de membros
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Cadastro simples para acompanhar a trajetoria da celula.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
          Selecione a celula, informe o nome do membro e marque os passos
          concluidos para salvar o registro com clareza e rapidez.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-sm text-slate-300">Etapas</p>
            <p className="mt-1 text-lg font-semibold">4 blocos</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-sm text-slate-300">Passos</p>
            <p className="mt-1 text-lg font-semibold">19 checkpoints</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-sm text-slate-300">Celulas ativas</p>
            <p className="mt-1 text-lg font-semibold">{celulas.length}</p>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <MemberForm celulas={celulas} loadError={loadError} />
      </section>
    </main>
  );
}
