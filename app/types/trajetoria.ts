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
    APROVACAO_PASTOR = "Aprovação do Pastor de Rede"
  }
  
  // Helper para organizar por categorias na UI
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
    "DISCIPULADO": [
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

export const TodosPassosTrajetoria = Object.values(PassoTrajetoria);