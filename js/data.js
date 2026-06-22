/* =====================================================================
   SISTEMA-CERNE2 · Dados de demonstração (Mockup CERNE I)
   ---------------------------------------------------------------------
   Modela apenas o que trata do CERNE Nível 1 (eixo Empreendimento).
   O fluxo de editais (US09 – Chamadas/Seleções/Contratações) NÃO é
   contemplado, conforme orientação do professor.
   ===================================================================== */

const DB = {
  /* ---------------- US01 – Incubadora ---------------- */
  incubadora: {
    nome: "Incubadora Espaço Empreendedor",
    sigla: "EE",
    cnpj: "12.345.678/0001-90",
    mantenedora: "Universidade Federal do Espírito Santo (UFES)",
    natureza: "Incubadora de base tecnológica",
    responsavel: "Profa. Ana Beatriz Furtado",
    email: "contato@espacoempreendedor.ufes.br",
    telefone: "(27) 3335-0000",
    cidade: "Vitória/ES",
    status: "Em operação",
    niveis: [1],
    criadaEm: "2026-02-10",
    ativadaEm: "2026-03-01",
  },

  /* ---------------- US01 · Visão do ADMINISTRADOR DA PLATAFORMA ----------------
     A configuração da incubadora representa o ponto de entrada para uso
     segregado por organização. O administrador inclui, ativa, suspende,
     configura e lista as incubadoras existentes no produto. */
  incubadoras: [
    { id: "INC1", nome: "Incubadora Espaço Empreendedor", mantenedora: "UFES", responsavel: "Ana Beatriz Furtado", cidade: "Vitória/ES", status: "Em operação", niveis: [1], usuarios: 5, empreendimentos: 5, criadaEm: "2026-02-10", ativadaEm: "2026-03-01" },
    { id: "INC2", nome: "Incubadora MetalTech", mantenedora: "IFES", responsavel: "Bruno Carvalho", cidade: "Serra/ES", status: "Em operação", niveis: [1], usuarios: 4, empreendimentos: 3, criadaEm: "2026-03-12", ativadaEm: "2026-04-02" },
    { id: "INC3", nome: "Incubadora AgroSul", mantenedora: "SENAR", responsavel: "Camila Reis", cidade: "Cachoeiro/ES", status: "Aguardando ativação", niveis: [1], usuarios: 2, empreendimentos: 0, criadaEm: "2026-05-28", ativadaEm: null },
    { id: "INC4", nome: "Incubadora NorteCriativa", mantenedora: "Prefeitura de Linhares", responsavel: "Diego Martins", cidade: "Linhares/ES", status: "Suspensa", niveis: [1], usuarios: 3, empreendimentos: 2, criadaEm: "2025-08-01", ativadaEm: "2025-09-10" },
  ],

  plataformaUsuarios: [
    { nome: "Ana Beatriz Furtado", email: "ana.furtado@espacoempreendedor.br", papel: "Gestor da Incubadora", incubadoras: ["Incubadora Espaço Empreendedor"], status: "Ativo" },
    { nome: "Bruno Carvalho", email: "bruno@metaltech.br", papel: "Gestor da Incubadora", incubadoras: ["Incubadora MetalTech"], status: "Ativo" },
    { nome: "Camila Reis", email: "camila@agrosul.br", papel: "Gestor da Incubadora", incubadoras: ["Incubadora AgroSul"], status: "Ativo" },
    { nome: "Carlos Eduardo Lima", email: "carlos.lima@espacoempreendedor.br", papel: "Responsável pelo acompanhamento", incubadoras: ["Incubadora Espaço Empreendedor"], status: "Ativo" },
    { nome: "Rafael Tavares", email: "rafael.tavares@espacoempreendedor.br", papel: "Responsável pelo acompanhamento", incubadoras: ["Incubadora Espaço Empreendedor"], status: "Suspenso" },
    { nome: "Roberto Alvim", email: "roberto.alvim@cerne2.gov", papel: "Administrador da plataforma", incubadoras: ["—"], status: "Ativo" },
    { nome: "Sérgio Quadros", email: "sergio.quadros@externo.org", papel: "Usuário externo", incubadoras: ["Incubadora Espaço Empreendedor"], status: "Ativo" },
  ],

  plataformaEventos: [
    { tipo: "green", titulo: "IncubadoraIncluida · AgroSul", data: "2026-05-28", desc: "Roberto Alvim incluiu a incubadora e associou o responsável inicial." },
    { tipo: "blue", titulo: "UsuarioVinculadoIncubadora · MetalTech", data: "2026-04-15", desc: "Bruno Carvalho vinculado como gestor." },
    { tipo: "amber", titulo: "IncubadoraSuspensa · NorteCriativa", data: "2026-01-20", desc: "Suspensa por inatividade — registros preservados." },
    { tipo: "green", titulo: "IncubadoraAtivada · MetalTech", data: "2026-04-02", desc: "Liberada para uso operacional." },
  ],

  equipe: [
    { nome: "Ana Beatriz Furtado", papel: "Gestor da Incubadora", email: "ana.furtado@espacoempreendedor.br", status: "Ativo" },
    { nome: "Carlos Eduardo Lima", papel: "Responsável pelo acompanhamento", email: "carlos.lima@espacoempreendedor.br", status: "Ativo" },
    { nome: "Marina Salles", papel: "Responsável pelo acompanhamento", email: "marina.salles@espacoempreendedor.br", status: "Ativo" },
    { nome: "Rafael Tavares", papel: "Responsável pelo acompanhamento", email: "rafael.tavares@espacoempreendedor.br", status: "Ativo" },
    { nome: "Júlia Antunes", papel: "Responsável pelo acompanhamento", email: "julia.antunes@espacoempreendedor.br", status: "Ativo" },
  ],

  ciclos: [
    { id: "C-2026", nome: "Ciclo Anual 2026", tipo: "Anual", inicio: "2026-01-01", fim: "2026-12-31", status: "Ativo" },
    { id: "C-2025", nome: "Ciclo Anual 2025", tipo: "Anual", inicio: "2025-01-01", fim: "2025-12-31", status: "Encerrado" },
  ],

  /* ---------------- US02 – Metodologia CERNE (Nível 1) ----------------
     CERNE 1 = eixo Empreendimento. Processos-chave do modelo. */
  niveisCerne: [
    { nivel: 1, nome: "CERNE 1 – Empreendimento", adotado: true, foco: "Desenvolvimento de cada empreendimento individualmente", processos: 7 },
    { nivel: 2, nome: "CERNE 2 – Incubadora", adotado: false, foco: "Gestão da incubadora como organização", processos: 0 },
    { nivel: 3, nome: "CERNE 3 – Rede de Parceiros", adotado: false, foco: "Articulação com a rede de parceiros", processos: 0 },
    { nivel: 4, nome: "CERNE 4 – Melhoria Contínua", adotado: false, foco: "Avaliação e melhoria contínua", processos: 0 },
  ],

  processos: [
    { id: "P1", ordem: 1, nivel: 1, nome: "Sensibilização e Prospecção", desc: "Atração e identificação de potenciais empreendimentos.", status: "Ativo" },
    { id: "P2", ordem: 2, nivel: 1, nome: "Seleção", desc: "Avaliação e seleção dos empreendimentos a serem apoiados.", status: "Ativo" },
    { id: "P3", ordem: 3, nivel: 1, nome: "Planejamento", desc: "Elaboração do plano de desenvolvimento de cada empreendimento.", status: "Ativo" },
    { id: "P4", ordem: 4, nivel: 1, nome: "Qualificação", desc: "Capacitação e desenvolvimento de competências dos empreendedores.", status: "Ativo" },
    { id: "P5", ordem: 5, nivel: 1, nome: "Agregação de Valor", desc: "Acesso a mercado, infraestrutura, networking e recursos.", status: "Ativo" },
    { id: "P6", ordem: 6, nivel: 1, nome: "Monitoramento", desc: "Acompanhamento da evolução e dos indicadores do empreendimento.", status: "Ativo" },
    { id: "P7", ordem: 7, nivel: 1, nome: "Graduação e Relacionamento", desc: "Graduação dos empreendimentos e relacionamento com graduados.", status: "Ativo" },
  ],

  praticas: [
    { id: "PR1", processo: "P1", nome: "Ações de sensibilização empreendedora", desc: "Palestras, eventos e divulgação para atrair empreendedores.", evidencias: 2, indicadores: 1 },
    { id: "PR2", processo: "P1", nome: "Prospecção ativa de empreendimentos", desc: "Mapeamento e abordagem de potenciais incubados.", evidencias: 2, indicadores: 1 },
    { id: "PR3", processo: "P2", nome: "Critérios e processo de seleção", desc: "Definição de critérios e condução da avaliação.", evidencias: 2, indicadores: 1 },
    { id: "PR4", processo: "P3", nome: "Plano de desenvolvimento do empreendimento (PDE)", desc: "Elaboração do plano individual de cada incubado.", evidencias: 1, indicadores: 1 },
    { id: "PR5", processo: "P4", nome: "Trilha de capacitação", desc: "Oferta de cursos, oficinas e mentorias.", evidencias: 2, indicadores: 2 },
    { id: "PR6", processo: "P5", nome: "Acesso a mercado e parcerias", desc: "Conexões comerciais, rodadas e infraestrutura.", evidencias: 1, indicadores: 1 },
    { id: "PR7", processo: "P6", nome: "Monitoramento de indicadores do incubado", desc: "Coleta periódica de resultados do empreendimento.", evidencias: 1, indicadores: 2 },
    { id: "PR8", processo: "P7", nome: "Processo de graduação", desc: "Avaliação de prontidão e formalização da graduação.", evidencias: 1, indicadores: 1 },
  ],

  evidenciasEsperadas: [
    { id: "EE1", pratica: "PR1", nome: "Lista de presença de evento de sensibilização", tipo: "Documento", obrig: true },
    { id: "EE2", pratica: "PR1", nome: "Material de divulgação publicado", tipo: "Arquivo", obrig: false },
    { id: "EE3", pratica: "PR2", nome: "Planilha de prospecção preenchida", tipo: "Planilha", obrig: true },
    { id: "EE4", pratica: "PR2", nome: "Registro de contato com empreendedor", tipo: "Documento", obrig: false },
    { id: "EE5", pratica: "PR3", nome: "Ata da banca de seleção", tipo: "Documento", obrig: true },
    { id: "EE6", pratica: "PR3", nome: "Ficha de avaliação dos candidatos", tipo: "Formulário", obrig: true },
    { id: "EE7", pratica: "PR4", nome: "PDE assinado pelo empreendimento", tipo: "Documento", obrig: true },
    { id: "EE8", pratica: "PR5", nome: "Certificado / registro de capacitação", tipo: "Documento", obrig: true },
    { id: "EE9", pratica: "PR5", nome: "Relatório de mentoria", tipo: "Documento", obrig: false },
    { id: "EE10", pratica: "PR6", nome: "Registro de conexão comercial", tipo: "Documento", obrig: true },
    { id: "EE11", pratica: "PR7", nome: "Relatório de monitoramento do incubado", tipo: "Relatório", obrig: true },
    { id: "EE12", pratica: "PR8", nome: "Termo de graduação", tipo: "Documento", obrig: true },
  ],

  indicadoresMetodologia: [
    { id: "IM1", processo: "P1", nome: "Nº de empreendimentos prospectados", unidade: "un.", periodicidade: "Trimestral" },
    { id: "IM2", processo: "P2", nome: "Taxa de aprovação na seleção", unidade: "%", periodicidade: "Por ciclo" },
    { id: "IM3", processo: "P3", nome: "Nº de PDEs elaborados", unidade: "un.", periodicidade: "Mensal" },
    { id: "IM4", processo: "P4", nome: "Horas de capacitação ofertadas", unidade: "h", periodicidade: "Mensal" },
    { id: "IM5", processo: "P5", nome: "Nº de conexões de mercado geradas", unidade: "un.", periodicidade: "Trimestral" },
    { id: "IM6", processo: "P6", nome: "Faturamento médio dos incubados", unidade: "R$", periodicidade: "Trimestral" },
    { id: "IM7", processo: "P7", nome: "Nº de empreendimentos graduados", unidade: "un.", periodicidade: "Por ciclo" },
  ],

  metodologiaPublicada: { versao: "1.2", publicadaEm: "2026-03-05", por: "Carlos Eduardo Lima" },

  // US02.6 Cenário 3: ao publicar uma nova versão, a anterior deixa de ser vigente
  // mas é PRESERVADA para consulta histórica (não é descartada).
  versoesMetodologia: [
    { versao: "1.2", publicadaEm: "2026-03-05", por: "Carlos Eduardo Lima", situacao: "Vigente", resumo: "7 processos · 8 práticas · 9 evidências · 7 indicadores" },
    { versao: "1.1", publicadaEm: "2025-11-18", por: "Carlos Eduardo Lima", situacao: "Histórica", resumo: "7 processos · 7 práticas · 8 evidências · 6 indicadores" },
    { versao: "1.0", publicadaEm: "2025-08-02", por: "Ana Beatriz Rocha", situacao: "Histórica", resumo: "7 processos · 6 práticas · 6 evidências · 5 indicadores" },
  ],

  /* ---------------- US03 – Modelos de Planejamento ---------------- */
  modelos: [
    {
      id: "M1", nome: "Modelo Anual de Incubação · CERNE 1", periodicidade: "Anual",
      status: "Publicado", versao: "2.0", processos: 7, atividades: 9, publicadoEm: "2026-03-08",
      desc: "Estrutura padrão reutilizável para ciclos anuais de incubação, baseada nos 7 processos do CERNE 1.",
    },
    {
      id: "M2", nome: "Modelo de Pré-incubação · 6 meses", periodicidade: "Semestral",
      status: "Rascunho", versao: "0.3", processos: 4, atividades: 5, publicadoEm: null,
      desc: "Modelo enxuto para trilhas de pré-incubação focadas em validação.",
    },
  ],

  /* Cada atividade padrão é OBRIGATORIAMENTE vinculada a uma prática CERNE
     presente no modelo (US03.2). A prática vem da metodologia (US02);
     a atividade é o detalhamento operacional dessa prática no modelo. */
  atividadesModelo: [
    { id: "AM1", modelo: "M1", processo: "P1", pratica: "PR1", nome: "Realizar evento de sensibilização", marco: "1º trimestre", responsavel: "Rafael Tavares" },
    { id: "AM2", modelo: "M1", processo: "P1", pratica: "PR2", nome: "Executar campanha de prospecção", marco: "1º trimestre", responsavel: "Rafael Tavares" },
    { id: "AM3", modelo: "M1", processo: "P2", pratica: "PR3", nome: "Conduzir banca de seleção", marco: "1º trimestre", responsavel: "Carlos Eduardo Lima" },
    { id: "AM4", modelo: "M1", processo: "P3", pratica: "PR4", nome: "Elaborar PDE de cada incubado", marco: "2º trimestre", responsavel: "Marina Salles" },
    { id: "AM5", modelo: "M1", processo: "P4", pratica: "PR5", nome: "Executar trilha de capacitação", marco: "Contínuo", responsavel: "Carlos Eduardo Lima" },
    { id: "AM6", modelo: "M1", processo: "P5", pratica: "PR6", nome: "Promover rodada de negócios", marco: "3º trimestre", responsavel: "Ana Beatriz Furtado" },
    { id: "AM7", modelo: "M1", processo: "P6", pratica: "PR7", nome: "Coletar indicadores trimestrais", marco: "Trimestral", responsavel: "Júlia Antunes" },
    { id: "AM8", modelo: "M1", processo: "P6", pratica: "PR7", nome: "Reunião de monitoramento", marco: "Mensal", responsavel: "Marina Salles" },
    { id: "AM9", modelo: "M1", processo: "P7", pratica: "PR8", nome: "Avaliar prontidão para graduação", marco: "4º trimestre", responsavel: "Carlos Eduardo Lima" },
  ],

  /* ---------------- US04 – Planejamento Institucional ---------------- */
  planejamentos: [
    {
      id: "PL-2026", nome: "Planejamento Institucional 2026", ciclo: "C-2026", modelo: "M1",
      status: "Publicado", inicio: "2026-03-15", fim: "2026-12-31", progresso: 58, atividades: 12,
      publicadoEm: "2026-03-15", responsavel: "Ana Beatriz Furtado",
    },
    {
      id: "PL-2025", nome: "Planejamento Institucional 2025", ciclo: "C-2025", modelo: "M1",
      status: "Encerrado", inicio: "2025-03-10", fim: "2025-12-31", progresso: 100, atividades: 8,
      publicadoEm: "2025-03-10", responsavel: "Ana Beatriz Furtado",
    },
  ],

  /* Geradas a partir das atividades padrão do modelo (US04.2) — herdam
     processo e prática, e recebem responsável e prazo do ciclo. */
  atividadesPlanejadas: [
    { id: "AP1", plano: "PL-2026", origem: "AM1", processo: "P1", pratica: "PR1", nome: "Realizar evento de sensibilização", responsavel: "Rafael Tavares", prazo: "2026-04-10", status: "Concluída" },
    { id: "AP2", plano: "PL-2026", origem: "AM2", processo: "P1", pratica: "PR2", nome: "Executar campanha de prospecção", responsavel: "Rafael Tavares", prazo: "2026-04-30", status: "Concluída" },
    { id: "AP3", plano: "PL-2026", origem: "AM3", processo: "P2", pratica: "PR3", nome: "Conduzir banca de seleção", responsavel: "Carlos Eduardo Lima", prazo: "2026-05-20", status: "Concluída" },
    { id: "AP4", plano: "PL-2026", origem: "AM4", processo: "P3", pratica: "PR4", nome: "Elaborar PDE dos incubados", responsavel: "Marina Salles", prazo: "2026-06-15", status: "Em andamento" },
    { id: "AP5", plano: "PL-2026", origem: "AM5", processo: "P4", pratica: "PR5", nome: "Executar trilha de capacitação", responsavel: "Carlos Eduardo Lima", prazo: "2026-11-30", status: "Em andamento" },
    { id: "AP6", plano: "PL-2026", origem: "AM6", processo: "P5", pratica: "PR6", nome: "Promover rodada de negócios", responsavel: "Ana Beatriz Furtado", prazo: "2026-09-10", status: "Planejada" },
    { id: "AP7", plano: "PL-2026", origem: "AM7", processo: "P6", pratica: "PR7", nome: "Coletar indicadores do 2º trimestre", responsavel: "Júlia Antunes", prazo: "2026-07-05", status: "Atrasada" },
    { id: "AP8", plano: "PL-2026", origem: "AM8", processo: "P6", pratica: "PR7", nome: "Reunião mensal de monitoramento", responsavel: "Marina Salles", prazo: "2026-06-30", status: "Em andamento" },
    { id: "AP9", plano: "PL-2026", origem: "AM9", processo: "P7", pratica: "PR8", nome: "Avaliar prontidão para graduação", responsavel: "Carlos Eduardo Lima", prazo: "2026-12-10", status: "Planejada" },
    /* Atividade COMPLEMENTAR incluída direto no ciclo (US04.3) — não veio do modelo */
    { id: "AP10", plano: "PL-2026", origem: "Complementar", processo: "P4", pratica: "PR5", nome: "Workshop extra de pitch — turma 2026", responsavel: "Carlos Eduardo Lima", prazo: "2026-08-20", status: "Planejada" },
    /* Atividades do plano institucional REFERENTES a uma incubada específica (campo
       incubadaRef = empreendimento). O rótulo exibe o NOME da incubada. O responsável
       pode ser um usuário da incubada (que anexa a evidência pela sua visão, US06) ou
       o responsável da incubadora (ex.: monitoramento preenchido em nome da incubada). */
    { id: "AP11", plano: "PL-2026", origem: "Complementar", processo: "P3", pratica: "PR4", nome: "Anexar PDE assinado — Nuvix Saúde", responsavel: "Helena Prado", incubadaRef: "E1", prazo: "2026-06-20", status: "Em andamento" },
    { id: "AP12", plano: "PL-2026", origem: "Complementar", processo: "P5", pratica: "PR6", nome: "Anexar evidência de agregação de valor — Nuvix Saúde", responsavel: "Helena Prado", incubadaRef: "E1", prazo: "2026-09-30", status: "Planejada" },
    /* Histórico do ciclo 2025 (encerrado) — todas concluídas */
    { id: "AP1-25", plano: "PL-2025", origem: "AM1", processo: "P1", pratica: "PR1", nome: "Realizar evento de sensibilização", responsavel: "Rafael Tavares", prazo: "2025-04-08", status: "Concluída" },
    { id: "AP2-25", plano: "PL-2025", origem: "AM2", processo: "P1", pratica: "PR2", nome: "Executar campanha de prospecção", responsavel: "Rafael Tavares", prazo: "2025-04-28", status: "Concluída" },
    { id: "AP3-25", plano: "PL-2025", origem: "AM3", processo: "P2", pratica: "PR3", nome: "Conduzir banca de seleção", responsavel: "Carlos Eduardo Lima", prazo: "2025-05-18", status: "Concluída" },
    { id: "AP4-25", plano: "PL-2025", origem: "AM4", processo: "P3", pratica: "PR4", nome: "Elaborar PDE dos incubados", responsavel: "Marina Salles", prazo: "2025-06-12", status: "Concluída" },
    { id: "AP5-25", plano: "PL-2025", origem: "AM5", processo: "P4", pratica: "PR5", nome: "Executar trilha de capacitação", responsavel: "Carlos Eduardo Lima", prazo: "2025-11-25", status: "Concluída" },
    { id: "AP6-25", plano: "PL-2025", origem: "AM6", processo: "P5", pratica: "PR6", nome: "Promover rodada de negócios", responsavel: "Ana Beatriz Furtado", prazo: "2025-09-08", status: "Concluída" },
    { id: "AP7-25", plano: "PL-2025", origem: "AM8", processo: "P6", pratica: "PR7", nome: "Reunião de monitoramento", responsavel: "Marina Salles", prazo: "2025-06-28", status: "Concluída" },
    { id: "AP8-25", plano: "PL-2025", origem: "AM9", processo: "P7", pratica: "PR8", nome: "Avaliar prontidão para graduação", responsavel: "Carlos Eduardo Lima", prazo: "2025-12-05", status: "Concluída" },
  ],

  /* ---------------- US05 – Execução (acompanhamento) ---------------- */
  execucaoTimeline: [
    { ciclo: "C-2026", tipo: "green", titulo: "Atividade concluída · Banca de seleção", data: "2026-05-20", desc: "Carlos Lima registrou a execução com 2 evidências anexadas." },
    { ciclo: "C-2026", tipo: "blue", titulo: "Observação registrada · PDE dos incubados", data: "2026-06-05", desc: "Marina Salles: 'Aguardando assinatura de 2 empreendimentos'." },
    { ciclo: "C-2026", tipo: "amber", titulo: "Atraso identificado · Coleta de indicadores 2º tri", data: "2026-06-08", desc: "Prazo 05/07 em risco — responsável notificado." },
    { ciclo: "C-2026", tipo: "blue", titulo: "Encaminhamento · Rodada de negócios", data: "2026-06-07", desc: "Ana Furtado solicitou apoio do parceiro SEBRAE." },
    { ciclo: "C-2025", tipo: "green", titulo: "Ciclo encerrado · Planejamento 2025", data: "2025-12-31", desc: "Todas as 8 atividades concluídas; resultados consolidados." },
    { ciclo: "C-2025", tipo: "green", titulo: "Atividade concluída · Graduação 2025", data: "2025-12-05", desc: "Carlos Lima registrou a execução com termo de graduação anexado." },
  ],

  /* ---------------- US06 – Evidências e Documentos ---------------- */
  evidencias: [
    { id: "EV1", titulo: "Lista de presença — Meetup de Inovação", atividade: "AP1", processo: "P1", pratica: "PR1", arquivo: "presenca-meetup.pdf", status: "Validada", registradoPor: "Rafael Tavares", data: "2026-04-11" },
    { id: "EV2", titulo: "Planilha de prospecção Q1", atividade: "AP2", processo: "P1", pratica: "PR2", arquivo: "prospeccao-q1.xlsx", status: "Validada", registradoPor: "Rafael Tavares", data: "2026-04-29" },
    { id: "EV3", titulo: "Registros de contato (12 empresas)", atividade: "AP2", processo: "P1", pratica: "PR2", arquivo: "contatos-q1.pdf", status: "Validada", registradoPor: "Rafael Tavares", data: "2026-04-30" },
    { id: "EV4", titulo: "Ata da banca de seleção 2026", atividade: "AP3", processo: "P2", pratica: "PR3", arquivo: "ata-selecao-2026.pdf", status: "Validada", registradoPor: "Carlos Lima", data: "2026-05-20" },
    { id: "EV5", titulo: "Fichas de avaliação dos candidatos", atividade: "AP3", processo: "P2", pratica: "PR3", arquivo: "fichas-avaliacao.zip", status: "Em validação", registradoPor: "Carlos Lima", data: "2026-05-21" },
    { id: "EV6", titulo: "PDE — Nuvix Saúde", atividade: "AP4", processo: "P3", pratica: "PR4", arquivo: "pde-nuvix.pdf", status: "Validada", registradoPor: "Marina Salles", data: "2026-06-02" },
    { id: "EV7", titulo: "PDE — AgroSense", atividade: "AP4", processo: "P3", pratica: "PR4", arquivo: "pde-agrosense.docx", status: "Correção solicitada", registradoPor: "Marina Salles", data: "2026-06-04" },
    { id: "EV8", titulo: "Certificado — Oficina de Pitch", atividade: "AP5", processo: "P4", pratica: "PR5", arquivo: "cert-pitch.pdf", status: "Validada", registradoPor: "Carlos Lima", data: "2026-05-28" },
    { id: "EV9", titulo: "Relatório de mentoria — finanças", atividade: "AP5", processo: "P4", pratica: "PR5", arquivo: "mentoria-financas.pdf", status: "Em validação", registradoPor: "Carlos Lima", data: "2026-06-06" },
    { id: "EV10", titulo: "Ata reunião de monitoramento — maio", atividade: "AP8", processo: "P6", pratica: "PR7", arquivo: "ata-monitoramento-mai.pdf", status: "Validada", registradoPor: "Marina Salles", data: "2026-05-31" },
    /* Histórico do ciclo 2025 (encerrado) — todas validadas */
    { id: "EV1-25", titulo: "Lista de presença — Sensibilização 2025", atividade: "AP1-25", processo: "P1", pratica: "PR1", arquivo: "presenca-2025.pdf", status: "Validada", registradoPor: "Rafael Tavares", data: "2025-04-09" },
    { id: "EV2-25", titulo: "Planilha de prospecção 2025", atividade: "AP2-25", processo: "P1", pratica: "PR2", arquivo: "prospeccao-2025.xlsx", status: "Validada", registradoPor: "Rafael Tavares", data: "2025-04-28" },
    { id: "EV3-25", titulo: "Ata da banca de seleção 2025", atividade: "AP3-25", processo: "P2", pratica: "PR3", arquivo: "ata-selecao-2025.pdf", status: "Validada", registradoPor: "Carlos Lima", data: "2025-05-18" },
    { id: "EV4-25", titulo: "PDE — turma 2025", atividade: "AP4-25", processo: "P3", pratica: "PR4", arquivo: "pde-turma-2025.pdf", status: "Validada", registradoPor: "Marina Salles", data: "2025-06-12" },
    { id: "EV5-25", titulo: "Termo de graduação 2025", atividade: "AP8-25", processo: "P7", pratica: "PR8", arquivo: "graduacao-2025.pdf", status: "Validada", registradoPor: "Carlos Lima", data: "2025-12-05" },
  ],

  /* ---------------- US07 – Indicadores, Metas e Resultados ----------------
     Três responsabilidades distintas, conforme a especificação:
     - US07.2 DEFINIR META: a meta pode ser GLOBAL do ciclo (tipoMeta:"global",
       campo metaGlobal) ou POR PERÍODO de apuração (tipoMeta:"periodica",
       campo metas:{Q1,Q2,...}). Indicador sem meta = metas/metaGlobal nulos.
     - US07.3 REGISTRAR RESULTADO: realizado por período (resultados:{Q1,...}).
       Períodos ausentes = ainda não registrados.
     - US07.6/07.7 PAINEL: exibição consolidada (meta × realizado × atingimento). */
  /* Os períodos de apuração dependem da PERIODICIDADE do indicador: um
     indicador trimestral apura em Q1..Q4; um mensal apura em Jan..Dez. */
  periodosPorTipo: {
    Trimestral: [
      { id: "Q1", nome: "1º trimestre", inicio: "2026-01-01", fim: "2026-03-31" },
      { id: "Q2", nome: "2º trimestre", inicio: "2026-04-01", fim: "2026-06-30" },
      { id: "Q3", nome: "3º trimestre", inicio: "2026-07-01", fim: "2026-09-30" },
      { id: "Q4", nome: "4º trimestre", inicio: "2026-10-01", fim: "2026-12-31" },
    ],
    Mensal: [
      { id: "Jan", nome: "Janeiro", inicio: "2026-01-01", fim: "2026-01-31" },
      { id: "Fev", nome: "Fevereiro", inicio: "2026-02-01", fim: "2026-02-28" },
      { id: "Mar", nome: "Março", inicio: "2026-03-01", fim: "2026-03-31" },
      { id: "Abr", nome: "Abril", inicio: "2026-04-01", fim: "2026-04-30" },
      { id: "Mai", nome: "Maio", inicio: "2026-05-01", fim: "2026-05-31" },
      { id: "Jun", nome: "Junho", inicio: "2026-06-01", fim: "2026-06-30" },
      { id: "Jul", nome: "Julho", inicio: "2026-07-01", fim: "2026-07-31" },
      { id: "Ago", nome: "Agosto", inicio: "2026-08-01", fim: "2026-08-31" },
      { id: "Set", nome: "Setembro", inicio: "2026-09-01", fim: "2026-09-30" },
      { id: "Out", nome: "Outubro", inicio: "2026-10-01", fim: "2026-10-31" },
      { id: "Nov", nome: "Novembro", inicio: "2026-11-01", fim: "2026-11-30" },
      { id: "Dez", nome: "Dezembro", inicio: "2026-12-01", fim: "2026-12-31" },
    ],
  },

  // US07.1: indicadores DEFINIDOS PARA O CICLO. Cada um fica vinculado a um
  // processo/prática CERNE (atributos da US07.1: vínculo metodológico, unidade,
  // periodicidade e situação no ciclo). NÃO há responsável pré-atribuído: como
  // nas evidências (US06), o responsável é quem registra o resultado e fica
  // gravado no lançamento, não atribuído antes pelo gestor. Isso vive no mapa
  // `registros: { <periodo>: { por, data } }`, espelhando o registradoPor da
  // evidência; resultados[] continua só com o valor numérico de cada período.
  indicadores: [
    { id: "IN1", nome: "Empreendimentos prospectados", origem: "Metodologia CERNE", processo: "P1", pratica: "PR2", unidade: "un.",
      periodicidade: "Trimestral", tipoMeta: "periodica", situacao: "Ativo", ciclo: "C-2026",
      metas: { Q1: 10, Q2: 10, Q3: 10, Q4: 10 }, resultados: { Q1: 22, Q2: 24 },
      // US07.2 · janela de apuração por período (quando o resultado pode ser registrado) — sobrepõe as datas-padrão do período
      janelas: { Q1: { inicio: "2026-04-01", fim: "2026-04-15" }, Q2: { inicio: "2026-07-01", fim: "2026-07-15" }, Q3: { inicio: "2026-10-01", fim: "2026-10-15" }, Q4: { inicio: "2027-01-02", fim: "2027-01-16" } },
      registros: { Q1: { por: "Rafael Tavares", data: "2026-04-02" }, Q2: { por: "Rafael Tavares", data: "2026-07-03" } } },
    { id: "IN2", nome: "Taxa de aprovação na seleção", origem: "Metodologia CERNE", processo: "P2", pratica: "PR3", unidade: "%",
      periodicidade: "Por ciclo", tipoMeta: "global", situacao: "Ativo", ciclo: "C-2026",
      metaGlobal: 30, resultados: {} },
    { id: "IN3", nome: "PDEs elaborados", origem: "Metodologia CERNE", processo: "P3", pratica: "PR4", unidade: "un.",
      periodicidade: "Trimestral", tipoMeta: "periodica", situacao: "Ativo", ciclo: "C-2026",
      metas: { Q1: 3, Q2: 3, Q3: 3, Q4: 3 }, resultados: { Q2: 4 },
      registros: { Q2: { por: "Marina Salles", data: "2026-07-04" } } },
    { id: "IN4", nome: "Horas de capacitação ofertadas", origem: "Metodologia CERNE", processo: "P4", pratica: "PR5", unidade: "h",
      periodicidade: "Trimestral", tipoMeta: "periodica", situacao: "Ativo", ciclo: "C-2026",
      metas: { Q1: 30, Q2: 30, Q3: 30, Q4: 30 }, resultados: { Q1: 32, Q2: 56 },
      registros: { Q1: { por: "Carlos Eduardo Lima", data: "2026-04-05" }, Q2: { por: "Carlos Eduardo Lima", data: "2026-07-02" } } },
    { id: "IN5", nome: "Conexões de mercado geradas", origem: "Metodologia CERNE", processo: "P5", pratica: "PR6", unidade: "un.",
      periodicidade: "Trimestral", tipoMeta: "periodica", situacao: "Ativo", ciclo: "C-2026",
      metas: { Q1: 4, Q2: 4, Q3: 4, Q4: 3 }, resultados: { Q1: 2 } },
    { id: "IN6", nome: "Empreendimentos graduados", origem: "Metodologia CERNE", processo: "P7", pratica: "PR8", unidade: "un.",
      periodicidade: "Por ciclo", tipoMeta: "global", situacao: "Ativo", ciclo: "C-2026",
      metaGlobal: 5, resultados: {} },
    { id: "IN7", nome: "Eventos de sensibilização realizados", origem: "Metodologia CERNE", processo: "P1", pratica: "PR1", unidade: "un.",
      periodicidade: "Trimestral", tipoMeta: "periodica", situacao: "Ativo", ciclo: "C-2026",
      metas: null, resultados: {} },
    /* Exemplo de indicador com apuração MENSAL: a meta e os resultados são
       definidos mês a mês. Jan–Abr preenchidos; Maio encerrado e PENDENTE;
       Junho ainda em apuração; Jul–Dez são períodos futuros. */
    { id: "IN8", nome: "Atendimentos de mentoria realizados", origem: "Metodologia CERNE", processo: "P4", pratica: "PR5", unidade: "un.",
      periodicidade: "Mensal", tipoMeta: "periodica", situacao: "Ativo", ciclo: "C-2026",
      metas: { Jan: 8, Fev: 8, Mar: 8, Abr: 8, Mai: 8, Jun: 8, Jul: 8, Ago: 8, Set: 8, Out: 8, Nov: 8, Dez: 8 },
      resultados: { Jan: 7, Fev: 9, Mar: 8, Abr: 6 },
      registros: { Jan: { por: "Carlos Eduardo Lima", data: "2026-02-03" }, Fev: { por: "Carlos Eduardo Lima", data: "2026-03-04" }, Mar: { por: "Marina Salles", data: "2026-04-02" }, Abr: { por: "Carlos Eduardo Lima", data: "2026-05-05" } } },
    /* Indicador do ciclo vinculado ao processo de Monitoramento (P6/PR7). */
    { id: "IN9", nome: "Satisfação dos incubados (NPS)", origem: "Complementar", processo: "P6", pratica: "PR7", unidade: "pts",
      periodicidade: "Por ciclo", tipoMeta: "global", situacao: "Ativo", ciclo: "C-2026",
      metaGlobal: 70, resultados: {} },
    /* ---- Ciclo anterior (C-2025, ENCERRADO): indicadores preservados como
       histórico, com metas e resultados completos do ano. Demonstram o vínculo
       do indicador ao ciclo institucional (US07.1) — cada ciclo tem o seu. */
    { id: "IN1-25", nome: "Empreendimentos prospectados", origem: "Metodologia CERNE", processo: "P1", pratica: "PR2", unidade: "un.",
      periodicidade: "Trimestral", tipoMeta: "periodica", situacao: "Ativo", ciclo: "C-2025",
      metas: { Q1: 8, Q2: 8, Q3: 8, Q4: 8 }, resultados: { Q1: 9, Q2: 11, Q3: 7, Q4: 10 },
      registros: { Q1: { por: "Rafael Tavares", data: "2025-04-03" }, Q2: { por: "Rafael Tavares", data: "2025-07-02" }, Q3: { por: "Rafael Tavares", data: "2025-10-03" }, Q4: { por: "Rafael Tavares", data: "2026-01-08" } } },
    { id: "IN2-25", nome: "Taxa de aprovação na seleção", origem: "Metodologia CERNE", processo: "P2", pratica: "PR3", unidade: "%",
      periodicidade: "Por ciclo", tipoMeta: "global", situacao: "Ativo", ciclo: "C-2025",
      metaGlobal: 28, resultados: { Ciclo: 31 }, registros: { Ciclo: { por: "Carlos Eduardo Lima", data: "2026-01-10" } } },
    { id: "IN6-25", nome: "Empreendimentos graduados", origem: "Metodologia CERNE", processo: "P7", pratica: "PR8", unidade: "un.",
      periodicidade: "Por ciclo", tipoMeta: "global", situacao: "Ativo", ciclo: "C-2025",
      metaGlobal: 4, resultados: { Ciclo: 4 }, registros: { Ciclo: { por: "Carlos Eduardo Lima", data: "2026-01-12" } } },
  ],

  /* ---------------- US08 – Oportunidades (funil) ---------------- */
  oportunidades: [
    { id: "OP1", ciclo: "C-2026", titulo: "Startup HealthIA — interesse em incubação", tipo: "Incubação", origem: "Evento", publico: "Base tecnológica", etapa: "Qualificada", responsavel: "Rafael Tavares", data: "2026-05-12" },
    { id: "OP2", ciclo: "C-2026", titulo: "Parceria com aceleradora B2Mind", tipo: "Conexão", origem: "Parceiro", publico: "Rede", etapa: "Registrada", responsavel: "Ana Furtado", data: "2026-05-22" },
    { id: "OP3", ciclo: "C-2026", titulo: "AgroSense — pré-incubação", tipo: "Pré-incubação", origem: "Prospecção ativa", publico: "Agtech", etapa: "Convertida", responsavel: "Rafael Tavares", data: "2026-04-18" },
    { id: "OP4", ciclo: "C-2026", titulo: "Demanda de mentoria — Nuvix Saúde", tipo: "Atendimento", origem: "Empreendimento", publico: "Healthtech", etapa: "Em atendimento", responsavel: "Carlos Lima", data: "2026-06-01" },
    { id: "OP5", ciclo: "C-2026", titulo: "Edtech FoxLearn — interesse", tipo: "Incubação", origem: "Indicação", publico: "Edtech", etapa: "Registrada", responsavel: "Rafael Tavares", data: "2026-06-05" },
    { id: "OP6", ciclo: "C-2026", titulo: "Serviço de prototipagem — FabLab", tipo: "Conexão", origem: "Parceiro", publico: "Rede", etapa: "Qualificada", responsavel: "Ana Furtado", data: "2026-05-30" },
    /* Histórico do ciclo 2025 (encerrado) */
    { id: "OP7", ciclo: "C-2025", titulo: "GreenFlow — interesse em incubação", tipo: "Incubação", origem: "Evento", publico: "Cleantech", etapa: "Convertida", responsavel: "Rafael Tavares", data: "2025-03-20" },
    { id: "OP8", ciclo: "C-2025", titulo: "Parceria com SEBRAE — capacitação", tipo: "Conexão", origem: "Parceiro", publico: "Rede", etapa: "Convertida", responsavel: "Ana Furtado", data: "2025-04-05" },
    { id: "OP9", ciclo: "C-2025", titulo: "Demanda de prototipagem — turma 2025", tipo: "Atendimento", origem: "Empreendimento", publico: "Healthtech", etapa: "Em atendimento", responsavel: "Carlos Lima", data: "2025-08-14" },
  ],
  // Situações do funil conforme vocabulário da US08.5 (estado da oportunidade).
  funilEtapas: ["Registrada", "Qualificada", "Em atendimento", "Convertida"],

  /* ---------------- US10 – Empreendimentos Apoiados ---------------- */
  /* responsavel = responsável INTERNO pelo acompanhamento (equipe da incubadora, US10.1 c6).
     pessoas  = equipe/sócios/responsáveis DO empreendimento (US10.2); um deles é o
     CONTATO PRINCIPAL perante a incubadora (principal:true, US10.2 c3). */
  empreendimentos: [
    { id: "E1", ciclo: "C-2026", nome: "Nuvix Saúde", setor: "Healthtech", modalidade: "Incubação", modalidadeFisica: "Residente", estagio: "Tração", situacao: "Ativo", responsavel: "Marina Salles", entrada: "2026-05-25",
      pessoas: [
        { nome: "Helena Prado", papel: "Sócia-fundadora", principal: true, contato: "helena@nuvix.health", situacao: "Ativo" },
        { nome: "Thiago Nunes", papel: "Responsável técnico (CTO)", contato: "thiago@nuvix.health", situacao: "Ativo" },
        { nome: "Bianca Rocha", papel: "Responsável operacional", contato: "bianca@nuvix.health", situacao: "Ativo" },
        { nome: "Léo Martins", papel: "Membro da equipe", contato: "leo@nuvix.health", situacao: "Ativo" },
      ] },
    { id: "E2", ciclo: "C-2026", nome: "AgroSense", setor: "Agtech", modalidade: "Incubação", modalidadeFisica: "Não residente", estagio: "Validação", situacao: "Ativo", responsavel: "Marina Salles", entrada: "2026-05-25",
      pessoas: [
        { nome: "Paulo Vasques", papel: "Sócio-fundador", principal: true, contato: "paulo@agrosense.ag", situacao: "Ativo" },
        { nome: "Rita Camargo", papel: "Representante legal", contato: "rita@agrosense.ag", situacao: "Ativo" },
        { nome: "Igor Sá", papel: "Responsável técnico", contato: "igor@agrosense.ag", situacao: "Ativo" },
      ] },
    { id: "E3", ciclo: "C-2026", nome: "FoxLearn", setor: "Edtech", modalidade: "Incubação", modalidadeFisica: "Virtual", estagio: "Ideação", situacao: "Em análise", responsavel: "Carlos Lima", entrada: "2026-06-05",
      pessoas: [
        { nome: "Marcela Dias", papel: "Sócia-fundadora", principal: true, contato: "marcela@foxlearn.io", situacao: "Ativo" },
        { nome: "Bruno Teles", papel: "Membro da equipe", contato: "bruno@foxlearn.io", situacao: "Ativo" },
      ] },
    /* Histórico do ciclo 2025 (encerrado) */
    { id: "E4", ciclo: "C-2025", nome: "GreenFlow", setor: "Cleantech", modalidade: "Incubação", modalidadeFisica: "Residente", estagio: "Operação", situacao: "Ativo", responsavel: "Marina Salles", entrada: "2025-04-10",
      pessoas: [
        { nome: "Sofia Lemos", papel: "Sócia-fundadora", principal: true, contato: "sofia@greenflow.eco", situacao: "Ativo" },
        { nome: "André Pires", papel: "Representante legal", contato: "andre@greenflow.eco", situacao: "Ativo" },
        { nome: "Carla Mendes", papel: "Responsável técnica", contato: "carla@greenflow.eco", situacao: "Ativo" },
        { nome: "Diego Alves", papel: "Responsável operacional", contato: "diego@greenflow.eco", situacao: "Ativo" },
        { nome: "Tânia Reis", papel: "Membro da equipe", contato: "tania@greenflow.eco", situacao: "Ativo" },
        { nome: "Otávio Lima", papel: "Membro da equipe", contato: "otavio@greenflow.eco", situacao: "Ativo" },
      ] },
    { id: "E5", ciclo: "C-2025", nome: "DataMare", setor: "Analytics", modalidade: "Incubação", modalidadeFisica: "Não residente", estagio: "Graduação", situacao: "Graduado", responsavel: "Carlos Lima", entrada: "2024-03-15",
      pessoas: [
        { nome: "Renata Bastos", papel: "Sócia-fundadora", principal: true, contato: "renata@datamare.io", situacao: "Ativo" },
        { nome: "Felipe Aragão", papel: "Sócio", contato: "felipe@datamare.io", situacao: "Ativo" },
        { nome: "Lucas Vidal", papel: "Responsável técnico", contato: "lucas@datamare.io", situacao: "Ativo" },
        { nome: "Ney Costa", papel: "Contato principal", contato: "ney@datamare.io", situacao: "Ativo" },
        { nome: "Paula Khoury", papel: "Membro da equipe", contato: "paula@datamare.io", situacao: "Inativo" },
      ] },
  ],

  /* =====================================================================
     RECOMENDAÇÕES PARTE 2 — novos épicos do CERNE 1 (eixo Empreendimento)
     ===================================================================== */

  /* ---------------- US11 – Gerenciar Monitoramentos das Incubadas ----------------
     Rodadas de monitoramento (US11.1), diagnóstico inicial (US11.2), aplicação de
     instrumento periódico (US11.3) com pontuação por dimensão/eixo CERNE (US11.4),
     recomendações e encaminhamentos (US11.5), evidências (US11.6), radar e evolução
     (US11.7) e consolidação por ciclo/dimensão/resultado (US11.8).
     Vocabulário: PlanejarRodadaMonitoramento, AplicarInstrumentoMonitoramento,
     RegistrarPontuacaoDimensaoMonitoramento, RegistrarRecomendacaoMonitoramento,
     ConsultarRadarEvolucaoIncubada, ConsolidarMonitoramentosPorEixoCerne. */
  monitoramento: {
    // Dimensões avaliadas = eixos CERNE (US11.4); escala 0–5
    dimensoes: ["Empreendedor", "Tecnologia", "Capital", "Mercado", "Gestão"],
    escalaMax: 5,
    // Recomendações possíveis ao fim do monitoramento (US11.5)
    recomendacoes: ["Continuidade", "Replanejamento", "Graduação", "Desligamento"],
    // Instrumentos/modelos de avaliação (US11.1 · DefinirInstrumentoMonitoramento)
    instrumentos: [
      { id: "IM1", nome: "Radar CERNE de maturidade", dimensoes: ["Empreendedor", "Tecnologia", "Capital", "Mercado", "Gestão"], situacao: "Ativo" },
      { id: "IM2", nome: "Pulso trimestral simplificado", dimensoes: ["Mercado", "Capital", "Gestão"], situacao: "Ativo" },
    ],
    // Rodadas de monitoramento (US11.1)
    rodadas: [
      { id: "RM1", nome: "Diagnóstico de entrada 2026", tipo: "Diagnóstico inicial", ciclo: "C-2026", instrumento: "IM1", periodo: "Março/2026", responsavel: "Marina Salles", prazo: "2026-03-31", status: "Concluída", incubadas: ["E1", "E2"] },
      { id: "RM2", nome: "Monitoramento semestral — 1º/2026", tipo: "Periódico", ciclo: "C-2026", instrumento: "IM1", periodo: "Junho/2026", responsavel: "Carlos Eduardo Lima", prazo: "2026-06-30", status: "Em andamento", incubadas: ["E1", "E2", "E3"] },
    ],
    // Aplicações do instrumento por incubada, com pontuação por dimensão (US11.3/11.4) e recomendação (US11.5)
    avaliacoes: [
      { id: "AV1", rodada: "RM1", empreendimento: "E1", status: "Concluída", data: "2026-03-15", pontuacoes: { Empreendedor: 3, Tecnologia: 4, Capital: 2, Mercado: 2, Gestão: 3 }, recomendacao: "Continuidade", observacao: "Equipe técnica forte; tração comercial incipiente." },
      { id: "AV2", rodada: "RM1", empreendimento: "E2", status: "Concluída", data: "2026-03-16", pontuacoes: { Empreendedor: 2, Tecnologia: 3, Capital: 2, Mercado: 2, Gestão: 2 }, recomendacao: "Continuidade", observacao: "Estágio inicial; necessidade de estruturação de gestão." },
      { id: "AV3", rodada: "RM2", empreendimento: "E1", status: "Concluída", data: "2026-06-15", pontuacoes: { Empreendedor: 4, Tecnologia: 4, Capital: 3, Mercado: 4, Gestão: 4 }, recomendacao: "Continuidade", observacao: "Evolução consistente em mercado e gestão após mentorias." },
      { id: "AV4", rodada: "RM2", empreendimento: "E2", status: "Concluída", data: "2026-06-16", pontuacoes: { Empreendedor: 3, Tecnologia: 3, Capital: 2, Mercado: 3, Gestão: 2 }, recomendacao: "Replanejamento", observacao: "Capital e gestão abaixo do esperado; revisar PDE." },
      { id: "AV5", rodada: "RM2", empreendimento: "E3", status: "Em andamento", data: null, pontuacoes: {}, recomendacao: null, observacao: null },
    ],
    // Encaminhamentos derivados das recomendações (US11.5)
    encaminhamentos: [
      { id: "EN1", avaliacao: "AV4", descricao: "Agendar mentoria de gestão financeira (SV1)", responsavel: "Carlos Eduardo Lima", prazo: "2026-07-15", status: "Pendente" },
      { id: "EN2", avaliacao: "AV3", descricao: "Manter plano de internacionalização no PDE", responsavel: "Ana Beatriz Furtado", prazo: "2026-08-01", status: "Pendente" },
    ],
  },

  /* ---------------- US16 – Usuários, Papéis e Permissões ----------------
     Consulta de usuários, configuração de papéis e atribuição de permissões
     por recurso/escopo (inclusão/convite/suspensão ficam com o admin · US01).
     Vocabulário: ConfigurarPapelAutorizacao, DefinirPermissoesDoPapel,
     AtribuirPapelAoUsuario, VincularUsuarioAoEscopoOperacional. */
  acessos: {
    // Recursos do produto usados nas permissões dos papéis
    recursos: ["Metodologia", "Planejamento", "Acompanhar Execução", "Evidências e Documentos", "Indicadores e Metas", "Apuração de Indicadores", "Empreendimentos", "Usuários"],
    // Papéis de autorização configurados (US16.2)
    papeis: [
      { id: "PA1", nome: "Gestor da incubadora", situacao: "Ativo", escopo: "Incubadora", usuarios: 1,
        permissoes: { Metodologia: "Total", Planejamento: "Total", "Acompanhar Execução": "Total", "Evidências e Documentos": "Total", "Indicadores e Metas": "Total", "Apuração de Indicadores": "Total", Empreendimentos: "Total", "Usuários": "Total" } },
      { id: "PA2", nome: "Responsável pelo acompanhamento", situacao: "Ativo", escopo: "Empreendimentos atribuídos", usuarios: 4,
        permissoes: { Metodologia: "Leitura", Planejamento: "Leitura", "Acompanhar Execução": "Edição", "Evidências e Documentos": "Edição", "Indicadores e Metas": "Leitura", "Apuração de Indicadores": "Edição", Empreendimentos: "Edição", "Usuários": "—" } },
      // Usuário externo (mentor/consultor/avaliador): acesso restrito SOMENTE à edição de evidências (US06)
      { id: "PA5", nome: "Usuário externo", situacao: "Ativo", escopo: "Evidências designadas", usuarios: 1,
        permissoes: { Metodologia: "—", Planejamento: "—", "Acompanhar Execução": "—", "Evidências e Documentos": "Edição", "Indicadores e Metas": "—", "Apuração de Indicadores": "—", Empreendimentos: "—", "Usuários": "—" } },
    ],
    // Usuários, vínculo a papel/escopo e situação da conta (US16.1/16.4/16.5/16.6/16.8)
    usuarios: [
      { nome: "Ana Beatriz Furtado", email: "ana.furtado@espacoempreendedor.br", papel: "Gestor da incubadora", escopo: "Incubadora Espaço Empreendedor", situacao: "Ativo", ultimoAcesso: "2026-06-18" },
      { nome: "Carlos Eduardo Lima", email: "carlos.lima@espacoempreendedor.br", papel: "Responsável pelo acompanhamento", escopo: "3 empreendimentos", situacao: "Ativo", ultimoAcesso: "2026-06-17" },
      { nome: "Marina Salles", email: "marina.salles@espacoempreendedor.br", papel: "Responsável pelo acompanhamento", escopo: "4 empreendimentos", situacao: "Ativo", ultimoAcesso: "2026-06-18" },
      { nome: "Rafael Tavares", email: "rafael.tavares@espacoempreendedor.br", papel: "Responsável pelo acompanhamento", escopo: "2 empreendimentos", situacao: "Suspenso", ultimoAcesso: "2026-05-30" },
      { nome: "Júlia Antunes", email: "julia.antunes@espacoempreendedor.br", papel: "Responsável pelo acompanhamento", escopo: "2 empreendimentos", situacao: "Convidado", ultimoAcesso: null },
      { nome: "Sérgio Quadros", email: "sergio.quadros@externo.org", papel: "Usuário externo", escopo: "Evidências designadas", situacao: "Convidado", ultimoAcesso: null },
    ],
  },

  /* ---------------- US25 – Encerramento do Ciclo Anual ----------------
     Prévia de encerramento: consolidação de indicadores, atividades e
     pendências remanescentes; encerramento com possibilidade de reabertura
     justificada. Vocabulário: ConsultarPreviaEncerramento,
     ConsolidarIndicadoresCicloAnual, RegistrarPendenciasRemanescentes,
     EncerrarCicloAnual, ReabrirCicloAnualComJustificativa. */
  encerramentoCiclo: {
    // Pendências remanescentes detectadas na prévia (US25 cenário de pendências)
    pendencias: [
      { tipo: "Indicador", descricao: "Conexões de mercado — Q2 sem resultado registrado", responsavel: "Não atribuído", situacao: "Vencido" },
      { tipo: "Indicador", descricao: "PDEs elaborados — Q1 sem resultado registrado", responsavel: "Não atribuído", situacao: "Vencido" },
      { tipo: "Indicador", descricao: "Faturamento médio dos incubados — Q2 sem resultado", responsavel: "Não atribuído", situacao: "Vencido" },
      { tipo: "Atividade", descricao: "Coleta de indicadores do 2º trimestre — atrasada", responsavel: "Júlia Antunes", situacao: "Vencido" },
      { tipo: "Atividade", descricao: "Workshop extra de pitch (turma 2026) — não realizado", responsavel: "Carlos Eduardo Lima", situacao: "Próximo" },
      { tipo: "Atividade", descricao: "Avaliar prontidão para graduação — planejada (Q4)", responsavel: "Carlos Eduardo Lima", situacao: "Aberto" },
      { tipo: "Evidência", descricao: "PDE — AgroSense aguardando correção", responsavel: "Marina Salles", situacao: "Aberto" },
      { tipo: "Evidência", descricao: "Fichas de avaliação dos candidatos — em validação", responsavel: "Carlos Lima", situacao: "Aberto" },
      { tipo: "Monitoramento", descricao: "Aplicação de monitoramento (FoxLearn) não concluída na rodada RM2", responsavel: "Carlos Eduardo Lima", situacao: "Próximo" },
    ],
  },
};

/* Helpers de domínio */
const NUM = (id) => DB.processos.find((p) => p.id === id);
const procNome = (id) => (NUM(id) ? NUM(id).nome : "—");
const PRAT = (id) => DB.praticas.find((p) => p.id === id);
const pratNome = (id) => (PRAT(id) ? PRAT(id).nome : "—");

/* US04 · Ciclo de planejamento institucional (US04.1/US04.2). A operação corre
   sobre o ciclo ATIVO; ciclos encerrados permanecem como histórico (US04.1,
   cenário 5). O planejamento (US04.2) e os indicadores (US07) são "do ciclo". */
const cicloAtivo = () => DB.ciclos.find((c) => c.status === "Ativo") || DB.ciclos[0];
const planoDoCicloAtivo = () =>
  DB.planejamentos.find((p) => p.ciclo === cicloAtivo().id) || DB.planejamentos[0];
/* US07.1 · indicadores definidos para um ciclo institucional (vínculo i.ciclo) */
const indicadoresDoCiclo = (cicloId) => DB.indicadores.filter((i) => i.ciclo === cicloId);

/* Vínculos de evidências (relações reais, não números soltos):
   - No MODELO, a atividade padrão é um template — não possui evidências
     registradas; o que ela tem são as EVIDÊNCIAS ESPERADAS da sua prática
     (definidas na metodologia, US02). Derivadas por prática.
   - No PLANEJAMENTO, a atividade do ciclo ACUMULA evidências de fato
     registradas (US06), ligadas por evidencias[].atividade. */
const evidEsperadasDaPratica = (pratId) =>
  DB.evidenciasEsperadas.filter((e) => e.pratica === pratId);
const evidenciasDaAtividade = (apId) =>
  DB.evidencias.filter((e) => e.atividade === apId);

/* US07 · Indicadores, metas e resultados */
const HOJE = "2026-06-10"; // data de referência do mockup (currentDate)
const periodoEncerrado = (p) => p.fim < HOJE;        // apuração já devida
const periodoFuturo = (p) => p.inicio > HOJE;        // ainda não começou
const temMeta = (ind) =>
  ind.tipoMeta === "global" ? ind.metaGlobal != null : !!ind.metas;
const metaTotal = (ind) =>
  ind.tipoMeta === "global"
    ? (ind.metaGlobal || 0)
    : Object.values(ind.metas || {}).reduce((s, v) => s + v, 0);
const resultadoTotal = (ind) =>
  Object.values(ind.resultados || {}).reduce((s, v) => s + v, 0);
const atingimento = (ind) => {
  const m = metaTotal(ind);
  return m ? Math.round((resultadoTotal(ind) / m) * 100) : 0;
};
/* Períodos de apuração do indicador, conforme sua periodicidade */
const periodosDe = (ind) => DB.periodosPorTipo[ind.periodicidade] || [];
/* Janela de apuração efetiva de um período: override do indicador (ind.janelas[pid])
   ou, na ausência, as próprias datas do período. Define quando o resultado pode ser
   registrado; o FIM da janela é o prazo que aciona a pendência (US07.2/07.3). */
const janelaDe = (ind, p) => (ind.janelas && ind.janelas[p.id]) || { inicio: p.inicio, fim: p.fim };
/* Localiza um período por id em qualquer periodicidade */
const findPeriodo = (id) => {
  for (const tipo of Object.keys(DB.periodosPorTipo)) {
    const p = DB.periodosPorTipo[tipo].find((x) => x.id === id);
    if (p) return p;
  }
  return null;
};
/* Períodos com apuração já encerrada e sem resultado registrado
   (US07.3 · ListarIndicadoresComResultadoPendente) */
const periodosPendentes = (ind) => {
  if (ind.tipoMeta !== "periodica" || !temMeta(ind)) return [];
  return periodosDe(ind).filter(
    (p) => periodoEncerrado(janelaDe(ind, p)) && (ind.resultados || {})[p.id] == null
  );
};
const indicadoresSemMeta = (lista = DB.indicadores) => lista.filter((i) => !temMeta(i));
const totalPendencias = (lista = DB.indicadores) =>
  lista.reduce((s, i) => s + periodosPendentes(i).length, 0);

/* ---- Helpers Recomendações Parte 2 ---- */
const empNome = (id) => { const e = DB.empreendimentos.find((x) => x.id === id); return e ? e.nome : "—"; };
const empById = (id) => DB.empreendimentos.find((x) => x.id === id);

/* US16 · Acesso / permissões */
const usuariosPorSituacao = (sit) => DB.acessos.usuarios.filter((u) => u.situacao === sit);

/* US11 · Monitoramento das incubadas */
const monitDimensoes = () => DB.monitoramento.dimensoes;
const instrumentoMonitById = (id) => DB.monitoramento.instrumentos.find((i) => i.id === id);
const rodadasDoCicloFoco = () => DB.monitoramento.rodadas.filter((r) => r.ciclo === cicloEmFoco().id);
const avaliacoesDaRodada = (rid) => DB.monitoramento.avaliacoes.filter((a) => a.rodada === rid);
const avaliacaoMonitById = (id) => DB.monitoramento.avaliacoes.find((a) => a.id === id);
// Avaliações concluídas de uma incubada, em ordem cronológica (para evolução/radar — US11.7)
const avaliacoesConcluidasIncubada = (emp) =>
  DB.monitoramento.avaliacoes
    .filter((a) => a.empreendimento === emp && a.status === "Concluída")
    .sort((x, y) => (x.data || "").localeCompare(y.data || ""));
// Média geral de uma aplicação (0–escalaMax)
const mediaAvaliacaoMonit = (a) => {
  const v = Object.values(a.pontuacoes || {});
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : 0;
};

/* US25 · Prévia de encerramento do ciclo em foco */
const previaEncerramento = (cicloId) => {
  const plano = DB.planejamentos.find((p) => p.ciclo === cicloId);
  const ativs = DB.atividadesPlanejadas.filter((a) => plano && a.plano === plano.id);
  const concl = ativs.filter((a) => a.status === "Concluída").length;
  const inds = indicadoresDoCiclo(cicloId);
  return {
    atividades: ativs.length,
    atividadesConcluidas: concl,
    indicadores: inds.length,
    indicadoresComMeta: inds.filter((i) => temMeta(i)).length,
    pendencias: DB.encerramentoCiclo.pendencias,
  };
};
