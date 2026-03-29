import "server-only";

import { MAPEAMENTO_SCHEMA, MAPEAMENTO_TABLES } from "@/lib/constants";
import type { CreateCelulaInput } from "@/lib/types";
import { getSupabaseConfigError, getSupabaseServerClient } from "@/lib/supabase/server";

const SAVE_CELULA_ERROR_MESSAGE =
  "Nao foi possivel salvar a celula agora. Verifique a conexao com o Supabase e tente novamente.";

type PersistCelulaResult =
  | { success: true }
  | { success: false; message: string };

export async function createCelula(
  input: CreateCelulaInput
): Promise<PersistCelulaResult> {
  const configError = getSupabaseConfigError();

  if (configError) {
    return { success: false, message: configError };
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .schema(MAPEAMENTO_SCHEMA)
      .from(MAPEAMENTO_TABLES.celulas)
      .insert({
        nome: input.nome,
        unidade_id: input.unidadeId,
        lideres: input.lideres,
        dia_semana: input.diaSemana,
        horario: input.horario,
        codigo_acesso: input.codigoAcesso,
      });

    if (error) {
      if (error.code === "23505" && error.message?.includes("codigo_acesso")) {
        return {
          success: false,
          message: "Ja existe uma celula com esse codigo de acesso. Escolha outro codigo.",
        };
      }
      return { success: false, message: SAVE_CELULA_ERROR_MESSAGE };
    }

    return { success: true };
  } catch {
    return { success: false, message: SAVE_CELULA_ERROR_MESSAGE };
  }
}
