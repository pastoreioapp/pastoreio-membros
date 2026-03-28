export enum PassoTrajetoria {
  // PASTOREIO 01
  ASSIDUO_CULTO = "Assíduo no Culto",
  ASSIDUO_CELULA = "Assíduo na Célula/Life",
  LIVRO_ACOMPANHAMENTO = "Livro Acompanhamento Inicial",
  CAFE_PASTOR = "Café com Pastor",
  ESTACAO_DNA = "Estação DNA",
  CURSO_NOVA_CRIATURA = "Curso Nova Criatura",
  BATISMO = "Batismo nas águas",

  // PASTOREIO 02
  CURSO_VIDA_DEVOCIONAL = "Curso Vida Devocional",
  CURSO_AUTORIDADE_SUBMISSAO = "Curso Autoridade e Submissão",
  CURSO_FAMILIA_CRISTIA = "Curso Família Cristã",
  SERVIR_MINISTERIO = "Servir em algum ministério",
  ENCONTRO_DEUS = "Encontro com Deus",

  // DISCIPULADO
  ASSIDUO_TADEL = "Assíduo no Tadel",
  CURSO_IDE_FAZEI_DISCIPULOS = "Curso Ide e Fazei Discípulos",
  EXPRESSO_01 = "Expresso 01",

  // LÍDER DE CÉLULA
  CURSO_TREINAMENTO_LIDERES = "Curso Treinamento de Líderes de Lifes",
  EXPRESSO_02 = "Expresso 02",
  VIDA_CRISTA_EXEMPLAR = "Vida Cristã Exemplar",
  APROVACAO_PASTOR = "Aprovação do Pastor de Rede",
}

export const CategoriasTrajetoria = {
  "PASTOREIO 01": [
    PassoTrajetoria.ASSIDUO_CULTO,
    PassoTrajetoria.ASSIDUO_CELULA,
    PassoTrajetoria.LIVRO_ACOMPANHAMENTO,
    PassoTrajetoria.CAFE_PASTOR,
    PassoTrajetoria.ESTACAO_DNA,
    PassoTrajetoria.CURSO_NOVA_CRIATURA,
    PassoTrajetoria.BATISMO,
  ],
  "PASTOREIO 02": [
    PassoTrajetoria.CURSO_VIDA_DEVOCIONAL,
    PassoTrajetoria.CURSO_AUTORIDADE_SUBMISSAO,
    PassoTrajetoria.CURSO_FAMILIA_CRISTIA,
    PassoTrajetoria.SERVIR_MINISTERIO,
    PassoTrajetoria.ENCONTRO_DEUS,
  ],
  DISCIPULADO: [
    PassoTrajetoria.ASSIDUO_TADEL,
    PassoTrajetoria.CURSO_IDE_FAZEI_DISCIPULOS,
    PassoTrajetoria.EXPRESSO_01,
  ],
  "LÍDER DE CÉLULA": [
    PassoTrajetoria.CURSO_TREINAMENTO_LIDERES,
    PassoTrajetoria.EXPRESSO_02,
    PassoTrajetoria.VIDA_CRISTA_EXEMPLAR,
    PassoTrajetoria.APROVACAO_PASTOR,
  ],
} as const satisfies Record<string, readonly PassoTrajetoria[]>;

export type CategoriaTrajetoria = keyof typeof CategoriasTrajetoria;

export const CategoriaTrajetoriaDescriptions: Record<
  CategoriaTrajetoria,
  string
> = {
  "PASTOREIO 01": "Fundamentos da fé e integração",
  "PASTOREIO 02": "Crescimento espiritual e maturidade",
  DISCIPULADO: "Preparação para o envio",
  "LÍDER DE CÉLULA": "Capacitação ministerial plena",
};

export const TodosPassosTrajetoria = Object.values(PassoTrajetoria);
export const TotalCategoriasTrajetoria =
  Object.keys(CategoriasTrajetoria).length;
export const TotalPassosTrajetoria = TodosPassosTrajetoria.length;
export const CategoriasTrajetoriaEntries = Object.entries(
  CategoriasTrajetoria
) as [CategoriaTrajetoria, readonly PassoTrajetoria[]][];

export function computeTrajectoryInsights(
  members: { passosConcluidos: PassoTrajetoria[]; discipuladorNome: string | null }[]
) {
  const totalMembers = members.length;

  if (totalMembers === 0) {
    return {
      totalMembers: 0,
      totalCompletedSteps: 0,
      totalPossibleSteps: 0,
      overallPercentage: 0,
      membersWithFullTrajectory: 0,
      membersWithDiscipulador: 0,
      categories: CategoriasTrajetoriaEntries.map(([name]) => ({
        name,
        description: CategoriaTrajetoriaDescriptions[name],
        completedCount: 0,
        totalPossible: 0,
        percentage: 0,
      })),
    };
  }

  const totalPossibleSteps = totalMembers * TotalPassosTrajetoria;
  let totalCompletedSteps = 0;
  let membersWithFullTrajectory = 0;
  let membersWithDiscipulador = 0;

  for (const member of members) {
    totalCompletedSteps += member.passosConcluidos.length;
    if (member.passosConcluidos.length === TotalPassosTrajetoria) {
      membersWithFullTrajectory++;
    }
    if (member.discipuladorNome) {
      membersWithDiscipulador++;
    }
  }

  const overallPercentage = Math.round(
    (totalCompletedSteps / totalPossibleSteps) * 100
  );

  const categories = CategoriasTrajetoriaEntries.map(([name, steps]) => {
    const totalPossible = totalMembers * steps.length;
    let completedCount = 0;

    for (const member of members) {
      for (const passo of member.passosConcluidos) {
        if ((steps as readonly string[]).includes(passo)) {
          completedCount++;
        }
      }
    }

    return {
      name,
      description: CategoriaTrajetoriaDescriptions[name],
      completedCount,
      totalPossible,
      percentage: totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0,
    };
  });

  return {
    totalMembers,
    totalCompletedSteps,
    totalPossibleSteps,
    overallPercentage,
    membersWithFullTrajectory,
    membersWithDiscipulador,
    categories,
  };
}
