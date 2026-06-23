/* =====================================================================
   SISTEMA-CERNE2 · App do Mockup (vanilla JS, SPA com hash routing)
   ===================================================================== */

/* ---------- Navegação (por perfil) ---------- */
const NAV_GESTOR = [
  { group: "Visão geral" },
  { id: "dashboard", icon: "▦", label: "Painel", us: "", crumb: "Painel" },
  { id: "painelOperacional", icon: "🧭", label: "Painel Operacional", us: "", crumb: "Painel Operacional da Incubadora" },
  { group: "Empreendimentos" },
  // { id: "oportunidades", icon: "🔎", label: "Oportunidades", us: "", crumb: "Oportunidades" }, // desabilitado
  { id: "empreendimentos", icon: "🚀", label: "Empreendimentos Apoiados", us: "", crumb: "Empreendimentos Apoiados" },
  { id: "monitoramento", icon: "📡", label: "Monitoramento das Incubadas", us: "", crumb: "Monitoramento das Incubadas" },
  { group: "Operação" },
  { id: "planejamento", icon: "🗓", label: "Planejamento Institucional", us: "", crumb: "Planejamento Institucional" },
  { id: "execucao", icon: "✅", label: "Acompanhar Execução", us: "", crumb: "Acompanhar Execução" },
  { id: "evidencias", icon: "📎", label: "Evidências e Documentos", us: "", crumb: "Evidências e Documentos" },
  { id: "indicadores", icon: "📊", label: "Indicadores e Metas", us: "", crumb: "Indicadores e Metas" },
  { id: "registroResultados", icon: "📝", label: "Apuração de Indicadores", us: "", crumb: "Apuração de Indicadores" },
  { group: "Administração" },
  { id: "usuarios", icon: "🔐", label: "Usuários e Permissões", us: "", crumb: "Usuários, Papéis e Permissões" },
  { id: "encerramento", icon: "📦", label: "Encerrar Ciclo Anual", us: "", crumb: "Encerramento do Ciclo Anual" },
  { group: "Configuração" },
  { id: "incubadora", icon: "🏛", label: "Minha Incubadora", us: "", crumb: "Minha Incubadora" },
  { id: "metodologia", icon: "🧩", label: "Metodologia CERNE", us: "", crumb: "Metodologia CERNE" },
  { id: "modelos", icon: "🗂", label: "Modelos de Planejamento", us: "", crumb: "Modelos de Planejamento" },
];

const NAV_ADMIN = [
  { group: "Plataforma" },
  { id: "adminDashboard", icon: "▦", label: "Painel da plataforma", us: "", crumb: "Painel da plataforma" },
  { id: "adminIncubadoras", icon: "🏛", label: "Incubadoras", us: "", crumb: "Incubadoras" },
  { id: "adminUsuarios", icon: "👥", label: "Usuários da plataforma", us: "", crumb: "Usuários da plataforma" },
];

let ROLE = "gestor"; // 'gestor' (gestor da incubadora — perfil padrão) | 'admin' (administrador da plataforma)
const NAV_BY_ROLE = { admin: NAV_ADMIN, gestor: NAV_GESTOR };
const currentNav = () => NAV_BY_ROLE[ROLE] || NAV_GESTOR;
const homeFor = (role) => (role === "admin" ? "adminDashboard": "dashboard");

/* ---------- Ciclo institucional EM FOCO (escopo global de navegação) ----------
   Um único "ciclo em foco" guia TODAS as telas dependentes de ciclo (Planejamento e
   Indicadores). É trocado num ponto central — Minha Incubadora — e não por tela.
   Diferente do ciclo ATIVO (status operacional do ciclo de vida): o foco diz
   "qual ciclo estou olhando"; o ativo diz "qual ciclo está aberto para operação". */
let cicloFoco = null;
const cicloEmFoco = () => {
  if (!cicloFoco || !DB.ciclos.find((c) => c.id === cicloFoco)) cicloFoco = cicloAtivo().id;
  return DB.ciclos.find((c) => c.id === cicloFoco);
};
const planoDoCicloFoco = () => DB.planejamentos.find((p) => p.ciclo === cicloEmFoco().id) || DB.planejamentos[0];
// Atividades/evidências do ciclo em foco (seguem o mesmo escopo de ciclo)
const atividadesDoCicloFoco = () => DB.atividadesPlanejadas.filter((a) => a.plano === planoDoCicloFoco().id);
const evidenciasDoCicloFoco = () => { const ids = atividadesDoCicloFoco().map((a) => a.id); return DB.evidencias.filter((e) => ids.includes(e.atividade)); };
// também é "do ciclo" (vínculo/consolidação por ciclo)
// const oportunidadesDoCicloFoco = () => DB.oportunidades.filter((o) => o.ciclo === cicloEmFoco().id); // desabilitado
const empreendimentosDoCicloFoco = () => DB.empreendimentos.filter((e) => e.ciclo === cicloEmFoco().id);
const setCicloFoco = (id) => { if (DB.ciclos.find((c) => c.id === id)) { cicloFoco = id; route(); } };

/* ---------- Util ---------- */
const $ = (s, r = document) => r.querySelector(s);
const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstChild; };
const fmtDate = (d) => d ? new Date(d + "T00:00").toLocaleDateString("pt-BR"): "—";

const STATUS_BADGE = {
  "Em operação": "green", "Ativo": "green", "Ativa": "green", "Concluída": "green",
  "Validada": "green", "Publicado": "green", "Atingida": "green", "Convertida": "green", "Graduado": "green",
  "Em andamento": "blue", "Em curso": "blue", "Em validação": "blue", "Qualificada": "blue", "Em atendimento": "amber",
  "Planejada": "slate", "Rascunho": "slate", "Encerrado": "slate", "Registrada": "slate",
  "Atrasada": "red", "Abaixo": "red", "Correção solicitada": "amber", "Em análise": "amber", "Suspensa": "red",
  "Aguardando ativação": "amber", "Sem meta": "slate", "Sem resultado": "amber",
  // Recomendações Parte 2 (e demais status operacionais)
  "Concluído": "green", "Aprovado": "green", "Em execução": "blue", "Pendente": "amber",
  "Pendente alocação": "amber", "Rejeitado": "red", "Inativo": "slate", "Suspenso": "red",
  "Convidado": "amber", "Ativo no mercado": "green",
  "Crítico": "red", "Aviso": "amber", "Info": "blue",
};
const badge = (txt) => `<span class="badge badge-${STATUS_BADGE[txt] || "slate"}"><span class="bdot"></span>${txt}</span>`;
// Célula "Incubada" da atividade: nome da incubada referente (texto normal, igual às demais
// células). A demanda pode ser preenchida pelo usuário da incubada ou pelo responsável da
// incubadora (ex.: monitoramento) — por isso fica em coluna própria, não acoplada ao responsável.
// Sem incubada vinculada, a atividade é da incubadora como um todo → "Institucional".
const incubadaCell = (a) => a && a.incubadaRef ? empNome(a.incubadaRef): '<span class="badge badge-slate">Institucional</span>';

function toast(msg) {
  const t = $("#toast");
  t.innerHTML = `<span class="ok">✔</span>${msg}`;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- Modal ---------- */
function openModal({ title, body, footer, wide }) {
  $("#modalTitle").innerHTML = title;
  $("#modalBody").innerHTML = body;
  $("#modalFoot").innerHTML = footer || `<button class="btn" data-close>Fechar</button>`;
  $("#modal").classList.toggle("wide", !!wide);
  $("#modalOverlay").classList.add("show");
}
function closeModal() { $("#modalOverlay").classList.remove("show"); }

/* ---------- Sidebar render ---------- */
function renderNav() {
  const nav = $("#nav");
  nav.innerHTML = currentNav().map((n) => {
    if (n.group) return `<div class="nav-group">${n.group}</div>`;
    return `<a href="#/${n.id}" data-id="${n.id}">
      <span class="ic">${n.icon}</span>${n.label}</a>`;
  }).join("");

  // Rodapé e marca conforme o perfil
  const foot = $("#orgName").closest(".org-pill");
  if (ROLE === "admin") {
    foot.querySelector("strong").textContent = "Plataforma CERNE2";
    foot.querySelector("small").textContent = DB.incubadoras.length + " incubadoras · multi-organização";
    $("#avatar").textContent = "AP";
    $("#avatar").title = "Administrador da plataforma";
  } else {
    foot.querySelector("strong").textContent = DB.incubadora.nome;
    foot.querySelector("small").textContent = "Nível CERNE 1 · Em operação";
    $("#avatar").textContent = "GI";
    $("#avatar").title = "Gestor da incubadora";
  }
}

function setRole(role) {
  if (ROLE === role) return;
  ROLE = role;
  $$("#roleSwitch.role-opt").forEach((b) => b.classList.toggle("active", b.dataset.role === role));
  renderNav();
  location.hash = "#/" + homeFor(role);
}

/* =====================================================================
   VIEWS
   ===================================================================== */
const VIEWS = {};

/* ---- Header helper ---- */
const head = (us, title, desc) => `
  <div class="page-head">
    <h1>${title}</h1>
    <p>${desc}</p>
  </div>`;

/* =================== PAINEL =================== */
VIEWS.dashboard = () => {
  const ativos = DB.empreendimentos.filter((e) => e.situacao === "Ativo").length;
  const evid = DB.evidencias.length;
  const concl = DB.atividadesPlanejadas.filter((a) => a.status === "Concluída").length;
  const flow = DB.processos.map((p, i) => {
    const cls = i < 3 ? "done": i === 3 ? "active": "";
    const c = { 0:"Concluído",1:"Concluído",2:"Concluído",3:"Em andamento",4:"Em andamento",5:"Pendente",6:"Pendente" }[i];
    return `<div class="flow-step ${cls}"><div class="fn">${p.ordem}</div><div class="ft">${p.nome}</div><div class="fc">${c}</div></div>`;
  }).join("");

  return head("", "Painel da incubadora", "Visão geral do fluxo CERNE 1 (eixo Empreendimento). Este protótipo demonstra a jornada da incubadora — da configuração da metodologia ao acompanhamento dos empreendimentos apoiados.")
  + `
  <div class="grid cols-3" style="margin-bottom:18px">
    ${stat("Empreendimentos ativos", ativos, "+2 no ciclo", "🚀", "blue")}
    ${stat("Atividades concluídas", concl + "/" + DB.atividadesPlanejadas.length, planoDoCicloAtivo().nome, "✅", "green")}
    ${stat("Evidências registradas", evid, "8 validadas", "📎", "purple")}
  </div>
  <!-- (Oportunidades no funil) desabilitado -->

  <div class="card" style="margin-bottom:18px">
    <div class="card-head"><h3>Fluxo CERNE 1 — eixo Empreendimento</h3><span class="sub">7 processos metodológicos</span></div>
    <div class="card-pad"><div class="flow">${flow}</div></div>
  </div>

  <div class="card">
    <div class="card-head"><h3>Andamento do ${planoDoCicloAtivo().nome}</h3>
      <div class="right"><a class="btn btn-sm" href="#/planejamento">Abrir</a></div></div>
    <div class="card-pad">
      ${DB.atividadesPlanejadas.slice(0,5).map(a=>`
        <div style="display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--line)">
          <div style="flex:1"><div class="t-main">${a.nome}</div><div class="t-sub">${procNome(a.processo)} · ${a.responsavel}</div></div>
          ${badge(a.status)}
        </div>`).join("")}
    </div>
  </div>

  <div class="note" style="margin-top:18px">
    <span>ℹ️</span>
    <div><b>Escopo deste mockup</b> contempla apenas o <b>CERNE Nível 1 (Empreendimento)</b>.</div>
  </div>`;
};

function stat(lbl, val, delta, ic, color) {
  return `<div class="stat">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div class="lbl">${lbl}</div>
      <div class="ic2 badge-${color}">${ic}</div>
    </div>
    <div class="val">${val}</div>
    <div class="delta" style="color:var(--muted)">${delta}</div>
  </div>`;
}

/* =====================================================================
   VISÃO DO ADMINISTRADOR DA PLATAFORMA
   ===================================================================== */

/* ---- Painel da plataforma ---- */
VIEWS.adminDashboard = () => {
  const incs = DB.incubadoras;
  const ativas = incs.filter((i) => i.status === "Em operação").length;
  const pend = incs.filter((i) => i.status === "Aguardando ativação").length;
  const susp = incs.filter((i) => i.status === "Suspensa").length;
  const usuarios = incs.reduce((s, i) => s + i.usuarios, 0);
  return head("", "Painel da plataforma", "Visão do <b>administrador da plataforma</b>. Cada incubadora é uma organização usuária do produto, com dados, usuários e operação <b>segregados</b>. A configuração da incubadora é o ponto de entrada para os demais recursos.")
  + `
  <div class="grid cols-4" style="margin-bottom:18px">
    ${stat("Incubadoras", incs.length, "no produto", "🏛", "blue")}
    ${stat("Em operação", ativas, "ativas", "🟢", "green")}
    ${stat("Aguardando ativação", pend, "requer responsável", "⏳", "amber")}
    ${stat("Suspensas", susp, "registros preservados", "⏸", "red")}
  </div>
  <div class="card">
    <div class="card-head"><h3>Incubadoras no produto</h3>
      <div class="right"><a class="btn btn-sm" href="#/adminIncubadoras">Gerenciar</a></div></div>
    <div class="table-wrap"><table class="tbl">
      <thead><tr><th>Incubadora</th><th>Mantenedora</th><th>Status</th></tr></thead>
      <tbody>${incs.map(i=>`<tr>
        <td><div class="t-main">${i.nome}</div><div class="t-sub">${i.cidade} · ${i.usuarios} usuários</div></td>
        <td>${i.mantenedora}</td><td>${badge(i.status)}</td></tr>`).join("")}</tbody>
    </table></div>
  </div>
  <div class="note" style="margin-top:18px"><span>🔐</span><div>O administrador prepara a incubadora institucionalmente. A partir daí, o <b>gestor da incubadora</b> assume a operação — use o seletor <b>“Perfil”</b> no topo para alternar.</div></div>`;
};

/* ---- Lista / gestão de incubadoras (ListarIncubadoras) ---- */
let incFilter = "Todas";
VIEWS.adminIncubadoras = () => {
  return head("", "Incubadoras", "Inclusão e configuração de incubadoras como organizações usuárias do produto. O administrador pode incluir, configurar, vincular responsável, <b>ativar</b> e <b>suspender</b> cada incubadora, além de consultá-las por nome, mantenedora, status e responsável.")
  + `
  <div class="toolbar">
    <div class="search">🔎<input id="incSearch" placeholder="Buscar por nome, mantenedora ou responsável…"></div>
    <div class="chips" id="incChips">
      ${["Todas","Em operação","Aguardando ativação","Suspensa"].map(f=>`<span class="chip ${f===incFilter?'active':''}" data-f="${f}">${f}</span>`).join("")}
    </div>
    <span class="spacer"></span>
    <button class="btn btn-primary" onclick="act.incluirIncubadora()">+ Incluir incubadora</button>
  </div>
  <div class="card"><div class="table-wrap"><table class="tbl">
    <thead><tr><th>Incubadora</th><th>Mantenedora</th><th>Responsável inicial</th><th>Usuários</th><th>Status</th><th></th></tr></thead>
    <tbody id="incRows"></tbody>
  </table></div></div>`;
};
VIEWS.adminIncubadoras.after = () => {
  const render = () => {
    const q = ($("#incSearch").value || "").toLowerCase();
    const rows = DB.incubadoras.filter(i =>
      (incFilter === "Todas" || i.status === incFilter) &&
      (i.nome + i.mantenedora + i.responsavel).toLowerCase().includes(q));
    $("#incRows").innerHTML = rows.length ? rows.map(i=>`<tr>
      <td><div class="t-main">${i.nome}</div><div class="t-sub">${i.cidade} · ${i.empreendimentos} empreend.<span class="badge badge-blue">CERNE 1</span></div></td>
      <td>${i.mantenedora}</td><td>${i.responsavel}</td><td>${i.usuarios}</td><td>${badge(i.status)}</td>
      <td style="white-space:nowrap">
        <button class="btn btn-sm" onclick="act.verIncubadora('${i.id}')">Consultar</button>
        <button class="btn btn-sm" onclick="act.configurarIncubadora('${i.id}')">Configurar</button>
        ${i.status==="Em operação"
          ? `<button class="btn btn-sm btn-danger" onclick="act.suspenderIncubadora('${i.id}')">Suspender</button>`
: `<button class="btn btn-sm btn-primary" onclick="act.ativarIncubadora('${i.id}')">Ativar</button>`}
      </td></tr>`).join(""): `<tr><td colspan="6" class="empty"><div class="ico">🔍</div>Nenhuma incubadora encontrada.</td></tr>`;
  };
  $("#incChips").addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    incFilter = c.dataset.f; $$("#incChips.chip").forEach(x => x.classList.toggle("active", x === c)); render();
  });
  $("#incSearch").addEventListener("input", render);
  render();
};

/* ---- Usuários da plataforma ---- */
VIEWS.adminUsuarios = () => {
  return head("", "Usuários da plataforma", "Usuários identificados no produto e seus vínculos com incubadoras. O <b>administrador da plataforma</b> adiciona um usuário (identidade) e o <b>vincula</b> a uma incubadora com um papel (comando VincularUsuarioIncubadora). O gestor apenas <b>consulta</b> sua equipe.")
  + `
  <div class="toolbar"><span class="spacer"></span><button class="btn btn-primary" onclick="act.adicionarUsuario()">+ Adicionar usuário</button></div>
  <div class="card"><div class="table-wrap"><table class="tbl">
    <thead><tr><th>Usuário</th><th>Papel</th><th>Incubadora(s) vinculada(s)</th><th>Status</th><th></th></tr></thead>
    <tbody>${DB.plataformaUsuarios.map(u=>`<tr>
      <td><div class="t-main">${u.nome}</div><div class="t-sub">${u.email}</div></td>
      <td>${u.papel}</td>
      <td>${u.incubadoras.map(n=>n==="—"?'<span class="t-sub"></span>':`<span class="badge badge-slate">${n}</span>`).join(" ")}</td>
      <td>${badge(u.status)}</td>
      <td style="white-space:nowrap">${u.status==="Suspenso"
        ? `<button class="btn btn-sm btn-primary" onclick="act.reativarUsuario('${u.email}')">Reativar</button>`
: `<button class="btn btn-sm btn-danger" onclick="act.suspenderUsuario('${u.email}')">Suspender</button>`}</td></tr>`).join("")}</tbody>
  </table></div></div>`;
};

/* =================== INCUBADORA (visão do gestor) =================== */
VIEWS.incubadora = () => {
  const i = DB.incubadora;
  const foco = cicloEmFoco().id;
  return head("", "Minha Incubadora", "Configuração institucional da incubadora em que o gestor atua. A <b>inclusão, ativação e suspensão</b> são feitas pelo administrador da plataforma; o gestor consulta os dados e mantém a operação (equipe e ciclos).")
  + `
  <div class="note" style="margin-bottom:16px"><span>ℹ️</span><div>Status institucional <b>(${DB.incubadora.status})</b> e ativação/suspensão são controlados pelo <b>administrador da plataforma</b> — alterne para a visão de administrador no topo para gerenciá-los.</div></div>
  <div class="grid cols-2">
    <div class="card">
      <div class="card-head"><h3>Dados institucionais</h3>${badge(i.status)}</div>
      <div class="card-pad">
        <dl class="kv">
          <dt>Nome</dt><dd>${i.nome}</dd>
          <dt>CNPJ</dt><dd>${i.cnpj}</dd>
          <dt>Natureza</dt><dd>${i.natureza}</dd>
          <dt>Organização mantenedora</dt><dd>${i.mantenedora}</dd>
          <dt>Responsável inicial</dt><dd>${i.responsavel}</dd>
          <dt>Contato</dt><dd>${i.email} · ${i.telefone}</dd>
          <dt>Localização</dt><dd>${i.cidade}</dd>
          <dt>Níveis CERNE adotados</dt><dd><span class="badge badge-blue">CERNE 1</span></dd>
          <dt>Ativada em</dt><dd>${fmtDate(i.ativadaEm)}</dd>
        </dl>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:16px">
      <div class="card">
        <div class="card-head"><h3>Ciclos institucionais</h3>
          <span class="sub">ponto central — manter e pôr em foco; reflete em <a href="#/planejamento">Planejamento</a>, <a href="#/indicadores">Indicadores</a>, Execução e Evidências</span>
          <div class="right"><button class="btn btn-sm btn-primary" onclick="act.manterCiclo()">+ Novo ciclo</button></div></div>
        <div class="card-pad" style="padding-bottom:0"><div class="note" style="margin:0 0 12px"><span>🎯</span><div>Este é o <b>ponto central</b> de manutenção (incluir/editar/encerrar) e de troca do <b>ciclo em foco</b>. Trocar o foco aqui — por ex. de <b>2026</b> para <b>2025</b> — faz <b>Planejamento</b>, <b>Indicadores</b>, <b>Execução</b> e <b>Evidências</b> refletirem o ciclo escolhido. Só o ciclo <b>ativo</b> é editável; encerrados ficam como <b>consulta histórica</b>.</div></div></div>
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th>Ciclo</th><th>Período</th><th>Status</th><th></th></tr></thead>
          <tbody>${DB.ciclos.map(c=>`<tr>
            <td><div class="t-main">${c.nome} ${c.status==="Ativo"?'<span class="badge badge-green" style="margin-left:4px">ativo</span>':""}${c.id===foco?'<span class="badge badge-blue" style="margin-left:4px">em foco</span>':""}</div><div class="t-sub">${c.tipo}</div></td>
            <td>${fmtDate(c.inicio)} – ${fmtDate(c.fim)}</td>
            <td>${badge(c.status)}</td>
            <td style="white-space:nowrap">
              ${c.id===foco?"":`<button class="btn btn-sm" onclick="act.focarCiclo('${c.id}')">Pôr em foco</button>`}
              <button class="btn btn-sm" onclick="act.manterCiclo('${c.id}')">Editar</button>
              ${c.status==="Ativo"?`<button class="btn btn-sm" onclick="act.encerrarCiclo('${c.id}')">Encerrar</button>`:`<button class="btn btn-sm" disabled title="Ciclo encerrado — preservado para histórico">Encerrar</button>`}
            </td></tr>`).join("")}</tbody>
        </table></div>
      </div>

      <div class="card">
        <div class="card-head"><h3>Equipe vinculada</h3>
          <span class="sub">vínculo feito pelo administrador da plataforma</span></div>
        <div class="card-pad" style="padding-bottom:0"><div class="note" style="margin:0 0 12px"><span>👥</span><div>Estas <b>pessoas</b> são a <b>fonte única de responsáveis</b> usada em todo o sistema: responsável padrão nos <b>modelos</b>, responsável das <b>atividades do ciclo</b>, autor do <b>registro de evidências</b> e do <b>registro de resultados de indicadores</b>. O <b>papel</b> é apenas o cargo/função da pessoa na equipe.</div></div></div>
        <div class="table-wrap"><table class="tbl">
          <thead><tr><th>Pessoa</th><th>Papel</th><th>Situação</th></tr></thead>
          <tbody>${DB.equipe.map(p=>`<tr>
            <td><div class="t-main">${p.nome}</div><div class="t-sub">${p.email}</div></td>
            <td>${p.papel}</td><td>${badge(p.status)}</td></tr>`).join("")}</tbody>
        </table></div>
      </div>
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <div class="card-head"><h3>Empreendimentos apoiados</h3>
      <span class="sub">criação e edição — visualização completa em <a href="#/empreendimentos">Empreendimentos Apoiados</a></span>
      <div class="right"><button class="btn btn-sm btn-primary" onclick="act.manterEmpreendimento()">+ Empreendimento</button></div></div>
    <div class="card-pad" style="padding-bottom:0"><div class="note" style="margin:0 0 12px"><span>🚀</span><div>Empreendimentos do <b>ciclo em foco: ${cicloEmFoco().nome}</b>. Inclua e edite aqui; a tela <i>Empreendimentos Apoiados</i> é só visualização.<br><b>Gerenciar</b> abre a ficha completa — onde você <b>edita os dados</b>, gerencia <b>equipe e papéis</b> e vê o <b>monitoramento</b>.</div></div></div>
    <div class="table-wrap"><table class="tbl">
      <thead><tr><th>Empreendimento</th><th>Modalidade física</th><th>Estágio</th><th>Situação</th><th></th></tr></thead>
      <tbody>${empreendimentosDoCicloFoco().map(e=>`<tr>
        <td><div class="t-main">${e.nome}</div><div class="t-sub">${e.setor} · resp. ${e.responsavel.split(" ")[0]}</div></td>
        <td>${e.modalidadeFisica}</td><td><span class="badge badge-slate">${e.estagio}</span></td><td>${badge(e.situacao)}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-sm" onclick="act.verEmpreendimento('${e.id}',true)">Gerenciar</button>
        </td></tr>`).join("")||`<tr><td colspan="5"><div class="t-sub" style="padding:8px">Nenhum empreendimento neste ciclo.</div></td></tr>`}</tbody>
    </table></div>
  </div>`;
};

/* =================== METODOLOGIA CERNE =================== */
// Versão de metodologia em VISUALIZAÇÃO (vigente por padrão; históricas = consulta)
let metVersao = null;
const metVersaoSel = () => {
  if (!metVersao || !DB.versoesMetodologia.find((v) => v.versao === metVersao))
    metVersao = (DB.versoesMetodologia.find((v) => v.situacao === "Vigente") || DB.versoesMetodologia[0]).versao;
  return DB.versoesMetodologia.find((v) => v.versao === metVersao);
};
VIEWS.metodologia = () => {
  const sel = metVersaoSel();
  return head("", "Configurar Metodologia CERNE", "Estrutura metodológica da incubadora: níveis adotados, processos, práticas, evidências esperadas e indicadores. Após configurada, a metodologia é publicada para uso operacional.")
  + `
  <div class="toolbar" style="margin-bottom:12px">
    <span class="t-sub" style="margin-right:4px">Visualizando metodologia</span>
    <div class="chips" id="metVerChips">${DB.versoesMetodologia.map((v) => `<span class="chip ${v.versao===sel.versao?'active':''}" data-v="${v.versao}">v${v.versao} · ${v.situacao==="Vigente"?"vigente":"histórica"}</span>`).join("")}</div>
  </div>
  <div class="tabs" id="metTabs">
    <div class="tab active" data-t="niveis">Níveis adotados</div>
    <div class="tab" data-t="processos">Processos & Práticas</div>
    <div class="tab" data-t="evidencias">Evidências esperadas</div>
    <div class="tab" data-t="indicadores">Indicadores</div>
    <div class="tab" data-t="publicar">Publicação</div>
  </div>
  <div id="metBody"></div>`;
};
VIEWS.metodologia.after = () => {
  const body = $("#metBody");
  const render = (t) => {
    const sel = metVersaoSel();
    const vig = sel.situacao === "Vigente";
    if (t === "publicar") { body.innerHTML = metPublicar(); return; }
    if (!vig) { body.innerHTML = metHistorica(t, sel); return; }
    const banner = `<div class="note" style="margin-bottom:14px"><span>✅</span><div>Visualizando a <b>versão vigente v${sel.versao}</b> — referência operacional atual (editável). Versões históricas ficam disponíveis só para <b>consulta</b> e podem ser selecionadas acima.</div></div>`;
    if (t === "niveis") body.innerHTML = banner + metNiveis();
    if (t === "processos") { body.innerHTML = banner + metProcessos(); bindTree(); }
    if (t === "evidencias") body.innerHTML = banner + metEvidencias();
    if (t === "indicadores") body.innerHTML = banner + metIndicadores();
  };
  $("#metTabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".tab"); if (!tab) return;
    $$(".tab", $("#metTabs")).forEach((x) => x.classList.remove("active"));
    tab.classList.add("active");
    render(tab.dataset.t);
  });
  $("#metVerChips").addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    metVersao = c.dataset.v; route();
  });
  render("niveis");
};
// Consulta de versão HISTÓRICA (snapshot preservado); estrutura detalhada só na vigente
function metHistorica(t, v) {
  const titulos = { niveis: "Níveis adotados", processos: "Processos & Práticas", evidencias: "Evidências esperadas", indicadores: "Indicadores" };
  return `<div class="note warn" style="margin-bottom:16px"><span>📚</span><div>Você está visualizando a <b>versão histórica v${v.versao}</b> (publicada em ${fmtDate(v.publicadaEm)} por ${v.por})<b>somente consulta</b>. Versões históricas são <b>snapshots preservados</b>: não compõem novos planejamentos, metas ou registros. Para configurar/operar, selecione a <b>versão vigente</b> acima.</div></div>
  <div class="card card-pad">
    <h3 style="margin:0 0 8px">${titulos[t] || "Estrutura"} — v${v.versao} <span class="badge badge-slate">histórica</span></h3>
    <dl class="kv"><dt>Publicada em</dt><dd>${fmtDate(v.publicadaEm)}</dd><dt>Publicada por</dt><dd>${v.por}</dd><dt>Conteúdo do snapshot</dt><dd>${v.resumo}</dd></dl>
    <p class="t-sub" style="margin-top:10px">O detalhamento desta versão é preservado como referência histórica. Nesta demonstração, a estrutura detalhada (${(titulos[t]||"itens").toLowerCase()}) é exibida apenas para a <b>versão vigente</b>.</p>
  </div>`;
}
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function metNiveis() {
  return `<div class="note" style="margin-bottom:16px"><span>🧩</span><div>A incubadora adota o <b>CERNE 1</b>. Os níveis 2 a 4 ficam disponíveis para adoção futura — neste mockup permanecem desabilitados.</div></div>
  <div class="grid cols-2">${DB.niveisCerne.map(n=>`
    <label class="check ${n.adotado?'sel':''}">
      <input type="checkbox" ${n.adotado?'checked':''} ${n.nivel!==1?'disabled':''} onchange="act.toggleNivel(${n.nivel})">
      <div><div class="ct">${n.nome}</div><div class="cd">${n.foco}</div>
      ${n.adotado?`<div style="margin-top:6px">${badge("Ativo")} <span class="t-sub">${n.processos} processos</span></div>`:`<div style="margin-top:6px"><span class="badge badge-slate">Não adotado</span></div>`}</div>
    </label>`).join("")}</div>`;
}

function metProcessos() {
  return `<div class="note" style="margin-bottom:14px"><span>📘</span><div>Esta é a <b>referência metodológica</b>: define os <b>processos</b> e <b>práticas</b> do CERNE 1, com suas evidências esperadas e indicadores. <b>Não há atividades aqui</b> — as práticas são detalhadas em <b>atividades padrão</b> dentro dos <a href="#/modelos">Modelos de Planejamento</a>.</div></div>
    <div class="toolbar"><div class="t-sub">${DB.processos.length} processos · ${DB.praticas.length} práticas vinculadas ao CERNE 1</div>
    <span class="spacer"></span><button class="btn btn-sm btn-primary" onclick="act.novoProcesso()">+ Processo</button></div>
    <div class="list-tree">${DB.processos.map(p=>{
      const prs = DB.praticas.filter(x=>x.processo===p.id);
      return `<div class="tree-node"><div class="tree-head">
        <div class="num">${p.ordem}</div>
        <div style="flex:1"><div class="t-main">${p.nome}</div><div class="t-sub">${p.desc}</div></div>
        <span class="badge badge-slate">${prs.length} práticas</span>
        <button class="btn btn-sm" onclick="event.stopPropagation();act.desativarProcesso('${p.id}')">Desativar</button>
        <span class="caret">▸</span></div>
        <div class="tree-body">${prs.length?prs.map(pr=>`
          <div class="subitem"><span class="si-ic">▸</span>
            <div style="flex:1"><div class="t-main">${pr.nome}</div><div class="t-sub">${pr.desc}</div></div>
            <span class="badge badge-purple">${pr.evidencias} evid.</span>
            <span class="badge badge-blue">${pr.indicadores} ind.</span>
            <button class="btn btn-sm" onclick="act.desativarPratica('${pr.id}')">Desativar</button>
          </div>`).join(""):'<div class="t-sub">Sem práticas cadastradas.</div>'}
          <button class="btn btn-sm btn-ghost" style="margin-top:8px" onclick="act.novaPratica('${p.id}')">+ Prática</button>
        </div></div>`;
    }).join("")}</div>`;
}

function metEvidencias() {
  return `<div class="note" style="margin-bottom:14px"><span>📎</span><div>Cada <b>evidência esperada</b> é a comprovação prevista de uma <b>prática</b> CERNE. É a referência que orienta o registro de evidências na execução — não confundir com as evidências de fato registradas.</div></div>
  <div class="toolbar"><div class="t-sub">${DB.evidenciasEsperadas.length} evidências esperadas vinculadas às práticas</div>
    <span class="spacer"></span><button class="btn btn-sm btn-primary" onclick="act.novaEvidenciaEsperada()">+ Evidência esperada</button></div>
  <div class="card"><div class="table-wrap"><table class="tbl">
    <thead><tr><th>Evidência esperada</th><th>Prática</th><th>Tipo</th><th>Obrigatória</th><th></th></tr></thead>
    <tbody>${DB.evidenciasEsperadas.map(e=>{
      const pr = DB.praticas.find(p=>p.id===e.pratica);
      return `<tr><td class="t-main">${e.nome}</td><td>${pr?pr.nome:'—'}</td>
        <td><span class="badge badge-slate">${e.tipo}</span></td>
        <td>${e.obrig?'<span class="badge badge-green">Sim</span>':'<span class="badge badge-slate">Não</span>'}</td>
        <td style="white-space:nowrap"><button class="btn btn-sm" onclick="act.novaEvidenciaEsperada('${e.id}')">Editar</button>
        <button class="btn btn-sm" onclick="act.desativarEvidenciaEsperada('${e.id}')">Desativar</button></td></tr>`;
    }).join("")}</tbody></table></div></div>`;
}

function metIndicadores() {
  return `<div class="note" style="margin-bottom:14px"><span>📐</span><div>Indicadores <b>de referência metodológica</b>: vinculados a nível, processo ou prática. Servem de base para definir <b>metas e resultados</b> nos ciclos.</div></div>
  <div class="toolbar"><div class="t-sub">${DB.indicadoresMetodologia.length} indicadores associados à metodologia</div>
    <span class="spacer"></span><button class="btn btn-sm btn-primary" onclick="act.novoIndicadorMetodologia()">+ Indicador</button></div>
  <div class="card"><div class="table-wrap"><table class="tbl">
    <thead><tr><th>Indicador</th><th>Vínculo metodológico</th><th>Unidade</th><th>Periodicidade</th><th></th></tr></thead>
    <tbody>${DB.indicadoresMetodologia.map(i=>`<tr>
      <td class="t-main">${i.nome}</td><td>${procNome(i.processo)}</td>
      <td>${i.unidade}</td><td><span class="badge badge-blue">${i.periodicidade}</span></td>
      <td style="white-space:nowrap"><button class="btn btn-sm" onclick="act.novoIndicadorMetodologia('${i.id}')">Editar</button>
      <button class="btn btn-sm" onclick="act.desativarIndicadorMetodologia('${i.id}')">Desativar</button></td></tr>`).join("")}</tbody>
  </table></div></div>`;
}

function metPublicar() {
  const m = DB.metodologiaPublicada;
  const vigente = DB.versoesMetodologia.find((v) => v.situacao === "Vigente") || DB.versoesMetodologia[0];
  const historicas = DB.versoesMetodologia.filter((v) => v.situacao !== "Vigente");
  return `<div class="grid cols-2">
    <div class="card card-pad">
      <h3 style="margin:0 0 4px">Metodologia vigente</h3>
      <p class="t-sub" style="margin:0 0 14px">Apenas a versão <b>vigente</b> é referência operacional — compõe modelos de planejamento, ciclos, evidências esperadas, metas e resultados.</p>
      <dl class="kv">
        <dt>Versão vigente</dt><dd>${badge("Publicado")} v${vigente.versao}</dd>
        <dt>Publicada em</dt><dd>${fmtDate(vigente.publicadaEm)}</dd>
        <dt>Publicada por</dt><dd>${vigente.por}</dd>
        <dt>Conteúdo</dt><dd>${DB.processos.length} processos · ${DB.praticas.length} práticas · ${DB.evidenciasEsperadas.length} evidências · ${DB.indicadoresMetodologia.length} indicadores</dd>
      </dl>
      <div class="note" style="margin-top:12px"><span>ℹ️</span><div>Não há <b>"responsável pela metodologia"</b> atribuído à parte. A metodologia é publicada pelo <b>gestor autenticado</b> e o produto grava <b>quem publicou</b> a versão — como o <i>registradoPor</i> da <a href="#/evidencias">evidência</a>. Cada versão guarda seu próprio autor.</div></div>
    </div>
    <div class="card card-pad">
      <h3 style="margin:0 0 4px">Nova publicação</h3>
      <p class="t-sub" style="margin:0 0 14px">Publicar gera uma nova versão que <b>substitui a vigente</b> como referência operacional — a anterior é <b>preservada para consulta histórica</b>, não descartada (cenário 3).</p>
      <div class="note" style="margin-bottom:14px"><span>⚠️</span><div>Há alterações não publicadas na aba <b>Processos &amp; Práticas</b>.</div></div>
      <button class="btn btn-primary" onclick="act.publicarMetodologia()">⬆ Publicar metodologia (v1.3)</button>
    </div>
  </div>
  <div class="card" style="margin-top:16px">
    <div class="card-pad" style="padding-bottom:0"><h3 style="margin:0 0 4px">Histórico de versões</h3>
      <p class="t-sub" style="margin:0 0 4px">Cada publicação fica preservada para consulta histórica. Somente uma versão é <b>vigente</b> por vez.</p></div>
    <table class="tbl"><thead><tr><th>Versão</th><th>Publicada em</th><th>Publicada por</th><th>Conteúdo</th><th>Situação</th><th></th></tr></thead><tbody>
      ${DB.versoesMetodologia.map((v) => `<tr>
        <td><b>v${v.versao}</b></td><td>${fmtDate(v.publicadaEm)}</td><td>${v.por}</td><td class="t-sub">${v.resumo}</td>
        <td>${v.situacao === "Vigente" ? badge("Publicado"): '<span class="badge badge-slate">Histórica</span>'}</td>
        <td><button class="btn btn-sm" onclick="act.verVersaoMetodologia('${v.versao}')">Consultar</button></td>
      </tr>`).join("")}
    </tbody></table>
  </div>`;
}

function bindTree() {
  $$(".tree-head").forEach((h) => h.addEventListener("click", (e) => {
    if (e.target.closest("button")) return;
    h.parentElement.classList.toggle("open");
  }));
}
// Liga um botão "Recolher tudo / Expandir tudo" a todos os tree-nodes da tela.
function bindToggleAll(btnId) {
  const btn = $("#" + btnId);
  if (!btn) return;
  btn.addEventListener("click", () => {
    const collapse = btn.textContent.includes("Recolher");
    $$(".tree-node").forEach((n) => n.classList.toggle("open", !collapse));
    btn.textContent = collapse ? "Expandir tudo": "Recolher tudo";
  });
}

/* =================== MODELOS =================== */
VIEWS.modelos = () => {
  const m1 = DB.atividadesModelo.filter(a => a.modelo === "M1");
  const procs = DB.processos.filter(p => m1.some(a => a.processo === p.id));
  return head("", "Configurar Modelos de Processo e Planejamento", "Estrutura <b>reutilizável</b> composta a partir da metodologia CERNE publicada. O modelo seleciona processos e práticas da metodologia e os <b>detalha em atividades padrão</b> (com marcos, responsáveis e evidências) para gerar novos ciclos de planejamento sem refazer tudo a cada período.")
  + `
  <div class="note" style="margin-bottom:18px"><span>🧭</span><div>
    <b>Metodologia CERNE × Modelo de Planejamento</b><br>
    • A <b>metodologia</b> é a <i>referência</i> — define <b>o que</b> existe: Nível → Processo → <b>Prática</b> → Evidências esperadas e Indicadores. Ela <b>não contém atividades</b>.<br>
    • O <b>modelo</b> é o <i>plano reutilizável</i> — define <b>como será executado</b>: seleciona práticas da metodologia e cria <b>atividades padrão</b> ligadas a elas. Toda atividade padrão <b>nasce de uma prática</b> que existe na metodologia.
  </div></div>

  <div class="toolbar"><span class="spacer"></span><button class="btn btn-primary" onclick="act.novoModelo()">+ Novo modelo</button></div>
  <div class="grid cols-2" style="margin-bottom:18px">
    ${DB.modelos.map(m=>`<div class="card card-pad">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="flex:1"><h3 style="margin:0 0 5px;font-size:15px">${m.nome}</h3>
          <div class="t-sub">${m.desc}</div></div>
        ${badge(m.status)}
      </div>
      <div class="t-sub" style="margin-top:10px">Base metodológica<span class="badge badge-blue">Metodologia CERNE v${DB.metodologiaPublicada.versao}</span></div>
      <div style="display:flex;gap:8px;margin:12px 0;flex-wrap:wrap">
        <span class="badge badge-slate">${m.periodicidade}</span>
        <span class="badge badge-blue">v${m.versao}</span>
        <span class="badge badge-purple">${m.processos} processos</span>
        <span class="badge badge-slate">${m.atividades} atividades padrão</span>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-sm" onclick="act.verModelo('${m.id}')">Ver estrutura</button>
        ${m.status==='Rascunho'?`<button class="btn btn-sm btn-primary" onclick="act.publicarModelo('${m.id}')">Publicar</button>`:`<span class="t-sub" style="align-self:center">Publicado em ${fmtDate(m.publicadoEm)}</span>`}
      </div>
    </div>`).join("")}
  </div>

  <div class="card">
    <div class="card-head"><h3>Estrutura do modelo · Modelo Anual de Incubação</h3><span class="sub">atividades padrão por processo e prática</span><div class="right"><button class="btn btn-sm" id="modToggleAll">Recolher tudo</button></div></div>
    <div class="card-pad">
      <p class="t-sub" style="margin:0 0 14px">Cada atividade padrão (modelo) deriva de uma prática (metodologia). A coluna da esquerda vem da metodologia publicada; a da direita é o detalhamento criado no modelo. As <b>evidências esperadas</b> mostradas em cada prática <b>vêm da metodologia</b> — no modelo a atividade ainda é um template e <b>não possui evidências registradas</b>; estas só surgem no planejamento, quando a atividade é executada.</p>
      ${procs.map(p => {
        const prats = DB.praticas.filter(pr => pr.processo === p.id && m1.some(a => a.pratica === pr.id));
        return `<div class="tree-node open"><div class="tree-head">
          <div class="num">${p.ordem}</div>
          <div style="flex:1"><div class="t-main">${p.nome}</div><div class="t-sub">Processo CERNE (metodologia)</div></div>
          <span class="caret">▸</span></div>
          <div class="tree-body">
            ${prats.map(pr => {
              const ats = m1.filter(a => a.pratica === pr.id);
              const esperadas = evidEsperadasDaPratica(pr.id);
              return `<div style="margin-bottom:12px">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;flex-wrap:wrap">
                  <span class="badge badge-purple">Prática · metodologia</span>
                  <b style="font-size:13px">${pr.nome}</b>
                  <span class="badge badge-slate" title="${esperadas.map(e => e.nome).join('; ')}">${esperadas.length} evid. esperadas</span>
                  <span style="color:#b6c1d6">⟶</span><span class="t-sub">atividades padrão do modelo</span>
                </div>
                ${ats.map(a => `<div class="subitem" style="padding-left:8px">
                  <span class="si-ic" style="color:var(--brand)">▸</span>
                  <div style="flex:1"><div class="t-main">${a.nome}</div><div class="t-sub">Responsável padrão: ${a.responsavel}</div></div>
                  <span class="badge badge-slate">${a.marco}</span>
                  <button class="btn btn-sm" onclick="act.desativarAtividadePadrao('${a.id}')">Desativar</button>
                </div>`).join("")}
                <button class="btn btn-sm btn-ghost" style="margin-top:6px" onclick="act.novaAtividadePadrao('${pr.id}')">+ Atividade padrão nesta prática</button>
              </div>`;
            }).join("")}
          </div></div>`;
      }).join("")}
    </div>
  </div>`;
};
VIEWS.modelos.after = () => { bindTree(); bindToggleAll("modToggleAll"); };

/* =================== PLANEJAMENTO =================== */
VIEWS.planejamento = () => {
  const ciclo = cicloEmFoco();
  const ed = true; // ações sempre disponíveis
  const p = planoDoCicloFoco();
  const byProc = {};
  DB.atividadesPlanejadas.filter(a=>a.plano===p.id).forEach(a=>{ (byProc[a.processo]=byProc[a.processo]||[]).push(a); });
  return head("", "Gerenciar Planejamento Institucional", "Ciclos de planejamento gerados a partir de um modelo publicado. Permite manter os <b>ciclos institucionais</b>, ajustar atividades, atribuir responsáveis, definir prazos e publicar o planejamento do ciclo para acompanhamento operacional.")
  + `
  <div class="note" style="margin-bottom:16px"><span>🎯</span><div>Mostrando o <b>ciclo em foco: ${ciclo.nome}</b> ${ciclo.status==="Ativo"?'<span class="badge badge-green">ativo</span>':'<span class="badge badge-slate">encerrado</span>'} — a manutenção de ciclos (incluir/editar/encerrar) e a troca de foco ficam em <a href="#/incubadora">Minha Incubadora</a>.</div></div>
  <div class="note" style="margin-bottom:16px"><span>⟳</span><div>O planejamento do <b>${ciclo.nome}</b> (${ciclo.status==="Ativo"?"ativo":"encerrado — histórico"}) foi <b>gerado do modelo “${DB.modelos[0].nome}”</b>: as atividades padrão do modelo viraram atividades do ciclo, herdando processo e prática, e recebendo <b>responsável e prazo</b> reais. Cadeia<b>Prática</b> (metodologia) → <b>Atividade padrão</b> (modelo) → <b>Atividade do ciclo</b> (planejamento).</div></div>
  <div class="toolbar">
    <span class="t-sub">Planejamento do ciclo em foco<b>${ciclo.nome}</b> ${ciclo.status==="Ativo"?'<span class="badge badge-green">ativo</span>':'<span class="badge badge-slate">encerrado</span>'}</span>
    <span class="spacer"></span>
    ${ed?`<button class="btn" onclick="act.gerarDeModelo()">⟳ Gerar de modelo</button>`:""}
    <button class="btn btn-primary" onclick="act.consultarPlano()">Consultar publicação</button>
  </div>

  <div class="grid cols-4" style="margin-bottom:18px">
    ${stat("Status", p.status, "Publicado em "+fmtDate(p.publicadoEm), "🗓", "green")}
    ${stat("Progresso", p.progresso+"%", "do ciclo concluído", "📈", "blue")}
    ${stat("Atividades", p.atividades, "planejadas", "📋", "purple")}
    ${stat("Responsável", "5 pessoas", "equipe vinculada", "👥", "amber")}
  </div>
  <div class="card card-pad" style="margin-bottom:18px">
    <div style="display:flex;justify-content:space-between;margin-bottom:8px"><b>${p.nome}</b><span class="t-sub">${fmtDate(p.inicio)} – ${fmtDate(p.fim)}</span></div>
    <div class="progress"><i style="width:${p.progresso}%"></i></div>
  </div>

  <div class="toolbar"><span class="t-sub">Atividades por processo CERNE</span><span class="spacer"></span>${ed?`<button class="btn btn-sm btn-primary" onclick="act.incluirAtividadePlanejada()">+ Incluir atividade complementar</button>`:""}<button class="btn btn-sm" id="planToggleAll">Recolher tudo</button></div>
  ${DB.processos.filter(pr=>byProc[pr.id]).map(pr=>`
    <div class="tree-node open">
      <div class="tree-head">
        <div class="num">${pr.ordem}</div>
        <div style="flex:1"><div class="t-main">${pr.nome}</div><div class="t-sub">${byProc[pr.id].length} atividade(s) planejada(s)</div></div>
        <span class="caret">▸</span>
      </div>
      <div class="tree-body" style="padding:0 0 6px">
      <div class="table-wrap"><table class="tbl">
        <thead><tr><th>Atividade planejada</th><th>Responsável</th><th>Escopo</th><th>Prazo</th><th>Status</th><th>Evid.</th><th></th></tr></thead>
        <tbody>${byProc[pr.id].map(a=>{
          const evs = evidenciasDaAtividade(a.id);
          const evCell = evs.length
            ? `<button class="btn btn-sm" style="padding:2px 9px" title="Ver evidências vinculadas" onclick="act.verEvidenciasAtividade('${a.id}')"><span class="badge badge-purple" style="margin:0">📎 ${evs.length}</span></button>`
: `<span class="t-sub"></span>`;
          const doModelo = /^AM/.test(a.origem || "");
          return `<tr>
          <td><div class="t-main">${a.nome} ${doModelo?'<span class="badge badge-slate" style="margin-left:4px">do modelo</span>':'<span class="badge badge-purple" style="margin-left:4px">complementar</span>'}</div><div class="t-sub">Prática: ${pratNome(a.pratica)}</div></td><td>${a.responsavel}</td><td>${incubadaCell(a)}</td><td>${fmtDate(a.prazo)}</td>
          <td>${badge(a.status)}</td><td>${evCell}</td>
          <td>${ed?`<button class="btn btn-sm" onclick="act.ajustarAtividade('${a.id}')">Ajustar</button>`:`<span class="t-sub">histórico</span>`}</td></tr>`;
        }).join("")}</tbody>
      </table></div>
      </div>
    </div>`).join("")}`;
};
VIEWS.planejamento.after = () => { bindTree(); bindToggleAll("planToggleAll"); };

/* =================== EXECUÇÃO =================== */
let execFilter = "Todas";
VIEWS.execucao = () => {
  const ciclo = cicloEmFoco();
  const ed = true; // ações sempre disponíveis
  const atividades = atividadesDoCicloFoco();
  const pend = atividades.filter(a=>a.status==="Atrasada");
  return head("", "Acompanhar Execução das Práticas CERNE", "Acompanhamento operacional do planejamento publicado: registrar execução de atividades, atualizar situações, registrar observações e encaminhamentos, consultar pendências e atrasos e consolidar a execução por processo e prática.")
  + `
  <div class="note" style="margin-bottom:16px"><span>🎯</span><div>Acompanhando o <b>ciclo em foco: ${ciclo.nome}</b> ${ciclo.status==="Ativo"?'<span class="badge badge-green">ativo</span>':'<span class="badge badge-slate">encerrado</span>'} — para trocar de ciclo, use o <b>ponto central</b> em <a href="#/incubadora">Minha Incubadora</a>.</div></div>
  <div class="grid cols-4" style="margin-bottom:18px">
    ${stat("Concluídas", atividades.filter(a=>a.status==="Concluída").length, "", "✅", "green")}
    ${stat("Em andamento", atividades.filter(a=>a.status==="Em andamento").length, "", "⏳", "blue")}
    ${stat("Planejadas", atividades.filter(a=>a.status==="Planejada").length, "", "📋", "slate")}
    ${stat("Atrasadas", pend.length, "requer atenção", "⚠️", "amber")}
  </div>

  ${pend.length?`<div class="note warn" style="margin-bottom:18px"><span>⚠️</span><div><b>Pendências e atrasos</b> ${pend.map(a=>a.nome+" (vence "+fmtDate(a.prazo)+")").join("; ")}.</div></div>`:""}

  <div class="card" style="margin-bottom:18px">
    <div class="card-head"><h3>Registro de execução por atividade</h3><span class="sub" id="execCount"></span></div>
    <div class="card-pad" style="padding-bottom:0">
      <div class="toolbar" style="margin-bottom:4px">
        <div class="search">🔎<input id="execSearch" placeholder="Buscar atividade ou responsável…"></div>
        <div class="chips" id="execChips">
          ${["Todas","Atrasada","Em andamento","Planejada","Concluída"].map(f=>`<span class="chip ${f===execFilter?'active':''}" data-f="${f}">${f}</span>`).join("")}
        </div>
        <span class="spacer"></span>
        <button class="btn btn-sm" id="execToggleAll">Recolher tudo</button>
      </div>
    </div>
    <div class="card-pad" style="padding-top:8px"><div class="list-tree" id="execList"></div></div>
  </div>

  <div class="grid cols-2">
    <div class="card">
      <div class="card-head"><h3>Observações e encaminhamentos</h3>
        ${ed?`<div class="right"><button class="btn btn-sm" onclick="act.novaObservacao()">+ Observação</button></div>`:""}</div>
      <div class="card-pad"><div class="timeline">
        ${(() => { const tl = DB.execucaoTimeline.filter(t=>t.ciclo===ciclo.id); return tl.length?tl.map(t=>`<div class="tl-item ${t.tipo}"><div class="tlt">${t.titulo}</div><div class="tld">${fmtDate(t.data)} · ${t.desc}</div></div>`).join(""):'<div class="t-sub">Sem observações registradas neste ciclo.</div>'; })()}
      </div></div>
    </div>
    <div class="card">
      <div class="card-head"><h3>Consolidação por processo CERNE</h3><span class="sub"></span></div>
      <div class="card-pad">
        ${DB.processos.map(pr=>{
          const at = atividades.filter(a=>a.processo===pr.id);
          if(!at.length) return "";
          const done = at.filter(a=>a.status==="Concluída").length;
          const pct = Math.round(done/at.length*100);
          return `<div style="display:flex;align-items:center;gap:14px;padding:8px 0">
            <div style="width:190px" class="t-main">${pr.nome}</div>
            <div style="flex:1"><div class="progress ${pct===100?'green':''}"><i style="width:${pct}%"></i></div></div>
            <div class="t-sub" style="width:74px;text-align:right">${done}/${at.length} (${pct}%)</div>
          </div>`;
        }).join("")}
      </div>
    </div>
  </div>`;
};
VIEWS.execucao.after = () => {
  const list = $("#execList");
  let allOpen = true;
  const ed = true;
  const render = () => {
    const ATIV = atividadesDoCicloFoco();
    const q = ($("#execSearch").value || "").toLowerCase();
    const filtered = ATIV.filter(a =>
      (execFilter === "Todas" || a.status === execFilter) &&
      (a.nome + a.responsavel).toLowerCase().includes(q));
    const total = ATIV.length;
    $("#execCount").textContent = filtered.length === total
      ? `${total} atividades`: `${filtered.length} de ${total} atividades`;
    const active = execFilter !== "Todas" || q !== "";
    const procs = DB.processos.filter(p => filtered.some(a => a.processo === p.id));
    list.innerHTML = procs.length ? procs.map(p => {
      const items = filtered.filter(a => a.processo === p.id);
      const all = ATIV.filter(a => a.processo === p.id);
      const done = all.filter(a => a.status === "Concluída").length;
      const pct = Math.round(done / all.length * 100);
      const late = items.some(a => a.status === "Atrasada");
      // Abre se há filtro ativo, se há atraso no grupo, ou se ainda não está 100% concluído
      const open = active || late || pct < 100;
      return `<div class="tree-node ${open ? 'open': ''}">
        <div class="tree-head">
          <div class="num">${p.ordem}</div>
          <div style="flex:1"><div class="t-main">${p.nome}</div>
            <div class="t-sub">${items.length} atividade(s)${late ? '<b style="color:var(--red)">contém atraso</b>': ''}</div></div>
          <div style="width:110px"><div class="progress ${pct === 100 ? 'green': ''}"><i style="width:${pct}%"></i></div></div>
          <span class="badge badge-slate">${done}/${all.length}</span>
          <span class="caret">▸</span>
        </div>
        <div class="tree-body">
          <table class="tbl"><tbody>${items.map(a => {
            const evs = evidenciasDaAtividade(a.id);
            return `<tr>
              <td><div class="t-main">${a.nome}</div><div class="t-sub">Prática: ${pratNome(a.pratica)}</div></td>
              <td>${a.responsavel}</td>
              <td>${incubadaCell(a)}</td>
              <td>${fmtDate(a.prazo)}</td>
              <td>${evs.length ? `<span class="badge badge-purple">📎 ${evs.length}</span>`: '<span class="t-sub"></span>'}</td>
              <td>${badge(a.status)}</td>
              <td>${ed?`<button class="btn btn-sm" onclick="act.registrarExecucao('${a.id}')">Registrar</button>`:`<span class="t-sub">histórico</span>`}</td>
            </tr>`;
          }).join("")}</tbody></table>
        </div></div>`;
    }).join(""): `<div class="empty"><div class="ico">🔍</div>Nenhuma atividade encontrada com esse filtro.</div>`;
    $$(".tree-head", list).forEach(h => h.addEventListener("click", (e) => {
      if (e.target.closest("button")) return;
      h.parentElement.classList.toggle("open");
    }));
  };
  $("#execChips").addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    execFilter = c.dataset.f; $$("#execChips.chip").forEach(x => x.classList.toggle("active", x === c)); render();
  });
  $("#execSearch").addEventListener("input", render);
  $("#execToggleAll").addEventListener("click", (e) => {
    allOpen = !allOpen;
    $$(".tree-node", list).forEach(n => n.classList.toggle("open", allOpen));
    e.target.textContent = allOpen ? "Recolher tudo": "Expandir tudo";
  });
  render();
};

/* =================== EVIDÊNCIAS =================== */
let evFilter = "Todas";
VIEWS.evidencias = () => {
  const ciclo = cicloEmFoco();
  const ed = true; // ações de evidência sempre disponíveis
  const evs = evidenciasDoCicloFoco();
  return head("", "Gerenciar Evidências e Documentos", "Registro de evidências de execução, anexação e versionamento de documentos, classificação por processo/prática/atividade, validação documental e solicitação de complementação ou correção.")
  + `
  <div class="note" style="margin-bottom:16px"><span>🎯</span><div>Exibindo evidências do <b>ciclo em foco: ${ciclo.nome}</b> ${ciclo.status==="Ativo"?'<span class="badge badge-green">ativo</span>':'<span class="badge badge-slate">encerrado</span>'} — para trocar de ciclo, use o <b>ponto central</b> em <a href="#/incubadora">Minha Incubadora</a>.</div></div>
  <div class="grid cols-4" style="margin-bottom:18px">
    ${stat("Total", evs.length, "", "📎", "purple")}
    ${stat("Validadas", evs.filter(e=>e.status==="Validada").length, "", "✔", "green")}
    ${stat("Em validação", evs.filter(e=>e.status==="Em validação").length, "", "⏳", "blue")}
    ${stat("Correções", evs.filter(e=>e.status==="Correção solicitada").length, "pendentes", "✎", "amber")}
  </div>
  <div class="toolbar">
    <div class="chips" id="evChips">
      ${["Todas","Validada","Em validação","Correção solicitada"].map(f=>`<span class="chip ${f===evFilter?'active':''}" data-f="${f}">${f}</span>`).join("")}
    </div>
    <span class="spacer"></span>
    ${ed?`<button class="btn btn-primary" onclick="act.registrarEvidencia()">+ Registrar evidência</button>`:""}
  </div>
  <div class="card"><div class="table-wrap"><table class="tbl">
    <thead><tr><th>Evidência</th><th>Classificação CERNE</th><th>Arquivo</th><th>Status</th><th></th></tr></thead>
    <tbody id="evRows"></tbody>
  </table></div></div>`;
};
VIEWS.evidencias.after = () => {
  const ed = true;
  const render = () => {
    const rows = evidenciasDoCicloFoco().filter(e=>evFilter==="Todas"||e.status===evFilter);
    $("#evRows").innerHTML = rows.length ? rows.map(e=>{
      const pr = DB.praticas.find(p=>p.id===e.pratica);
      return `<tr>
        <td><div class="t-main">${e.titulo}</div><div class="t-sub">${e.registradoPor} · ${fmtDate(e.data)}</div></td>
        <td><div class="t-sub">${procNome(e.processo)}</div><div class="t-sub">${pr?pr.nome:''}</div></td>
        <td><span class="badge badge-slate">📄 ${e.arquivo}</span></td>
        <td>${badge(e.status)}</td>
        <td style="white-space:nowrap">
          <button class="btn btn-sm" onclick="act.verEvidencia('${e.id}')">Abrir</button>
          ${!ed?"":e.status!=="Validada"?`<button class="btn btn-sm btn-primary" onclick="act.validarEvidencia('${e.id}')">Validar</button>
          ${e.status!=="Correção solicitada"?`<button class="btn btn-sm" onclick="act.rejeitarEvidencia('${e.id}')">Rejeitar</button>`:""}
          <button class="btn btn-sm" onclick="act.removerEvidencia('${e.id}')">Remover</button>`
:`<button class="btn btn-sm" onclick="act.cancelarValidacaoEvidencia('${e.id}')" title="Reabre a evidência para correção">Cancelar validação</button>
          <button class="btn btn-sm" disabled title="Evidência validada/consolidada — não pode ser removida">Remover</button>`}
        </td></tr>`;
    }).join(""): `<tr><td colspan="5"><div class="t-sub" style="padding:10px">Nenhuma evidência neste ciclo${evFilter!=="Todas"?` com o filtro “${evFilter}”`:""}.</div></td></tr>`;
  };
  $("#evChips").addEventListener("click",(ev)=>{
    const c=ev.target.closest(".chip"); if(!c)return;
    evFilter=c.dataset.f; $$("#evChips.chip").forEach(x=>x.classList.toggle("active",x===c)); render();
  });
  render();
};

/* =================== INDICADORES =================== */
let indTab = "definicao";
function statusIndicador(i) {
  if (!temMeta(i)) return "Sem meta";
  if (resultadoTotal(i) === 0) return "Sem resultado";
  const pct = atingimento(i);
  return pct >= 100 ? "Atingida": pct >= 60 ? "Em curso": "Abaixo";
}
// Ciclo em foco é editável só quando ATIVO; encerrado = somente consulta
const indCicloEditavel = () => true;
VIEWS.indicadores = () => {
  if (indTab === "registro") indTab = "definicao";
  const foco = cicloEmFoco();
  return head("", "Gerenciar Indicadores e Metas", "Visão de <b>gestão</b> do ciclo de indicadores<b>definir quais indicadores</b> compõem o ciclo, <b>definir metas</b> e <b>consultar o painel</b> consolidado. Cada indicador é <b>vinculado a um ciclo institucional</b>. O <b>registro de resultados</b> é feito na tela <a href=\"#/registroResultados\">Apuração de Indicadores</a>.")
  + `
  <div class="note" style="margin-bottom:12px"><span>🎯</span><div>Exibindo o <b>ciclo em foco: ${foco.nome}</b> ${foco.status==="Ativo"?'<span class="badge badge-green">ativo</span>':'<span class="badge badge-slate">encerrado</span>'} — para trocar de ciclo, use o <b>ponto central</b> em <a href="#/incubadora">Minha Incubadora</a>. A troca reflete também no Planejamento.</div></div>
  <div class="tabs" id="indTabs">
    <div class="tab ${indTab==='definicao'?'active':''}" data-t="definicao">Indicadores do ciclo</div>
    <div class="tab ${indTab==='metas'?'active':''}" data-t="metas">Metas do ciclo</div>
    <div class="tab ${indTab==='painel'?'active':''}" data-t="painel">Painel</div>
  </div>
  <div id="indBody"></div>`;
};
VIEWS.indicadores.after = () => {
  const body = $("#indBody");
  const render = (t) => {
    indTab = t;
    if (t === "definicao") body.innerHTML = indDefinicao();
    if (t === "painel") body.innerHTML = indPainel();
    if (t === "metas") body.innerHTML = indMetas();
  };
  $("#indTabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".tab"); if (!tab) return;
    $$(".tab", $("#indTabs")).forEach((x) => x.classList.remove("active"));
    tab.classList.add("active");
    render(tab.dataset.t);
  });
  render(indTab);
};
// Aviso de ciclo encerrado (somente consulta), reutilizado nas abas editáveis
const notaCicloEncerrado = () => indCicloEditavel() ? "":
  `<div class="note warn" style="margin-bottom:16px"><span>🔒</span><div><b>Ciclo encerrado — somente consulta.</b> Os indicadores, metas e resultados deste ciclo são <b>histórico preservado</b> e não podem ser alterados. Para manter indicadores, coloque o <b>ciclo ativo</b> em foco em <a href="#/incubadora">Minha Incubadora</a>.</div></div>`;

/* ---- Indicadores do ciclo (definição) ---- */
const indDerivado = (i) => i.origem === "Metodologia CERNE";
const tipoIndBadge = (i) => indDerivado(i)
  ? `<span class="badge badge-blue">Da metodologia</span>`
: `<span class="badge badge-purple">Complementar</span>`;
function indDefinicao() {
  const inds = indicadoresDoCiclo(cicloEmFoco().id);
  const daMet = inds.filter(indDerivado).length;
  const ed = indCicloEditavel();
  const ciclo = cicloEmFoco();
  return `
  <div class="note" style="margin-bottom:16px"><span>🧭</span><div>O gestor define <b>quais indicadores serão acompanhados neste ciclo</b>. Eles entram por <b>dois caminhos</b><b>adotados do catálogo da metodologia</b> (herdam nome, vínculo, unidade e periodicidade) ou <b>complementares</b>, criados para uma necessidade gerencial. A <b>meta</b> e os <b>resultados</b> ficam nas outras abas. O <b>responsável não é atribuído aqui</b>: como nas evidências, fica registrado quem lançar cada resultado.</div></div>
  ${notaCicloEncerrado()}
  <div class="grid cols-4" style="margin-bottom:16px">
    ${stat("Indicadores no ciclo", inds.length, ciclo.nome, "📊", "blue")}
    ${stat("Da metodologia", daMet, "adotados do catálogo", "📐", "slate")}
    ${stat("Complementares", inds.length - daMet, "necessidade gerencial", "✨", "purple")}
    ${stat("Com meta definida", inds.filter(temMeta).length + "/" + inds.length, "", "🎯", "green")}
  </div>
  <div class="toolbar"><span class="t-sub">Definição de indicadores do ciclo — comando <i>DefinirIndicadorDoCiclo</i></span>
    <span class="spacer"></span>
    ${ed?`<button class="btn btn-sm" onclick="act.gerarIndicadoresDoCiclo()">⟳ Gerar indicadores do ciclo</button>
    <button class="btn btn-sm btn-primary" onclick="act.definirIndicadorComplementar()">+ Definir complementar</button>`:""}</div>
  <div class="card"><div class="table-wrap"><table class="tbl">
    <thead><tr><th>Indicador</th><th>Tipo</th><th>Vínculo CERNE</th><th>Unidade · periodicidade</th><th>Situação</th><th></th></tr></thead>
    <tbody>${inds.map((i) => `<tr>
      <td class="t-main">${i.nome}</td>
      <td>${tipoIndBadge(i)}</td>
      <td><div class="t-sub">${procNome(i.processo)}</div><div class="t-sub">${pratNome(i.pratica)}</div></td>
      <td><div class="t-sub">${i.unidade}</div><div class="t-sub">${i.periodicidade}</div></td>
      <td>${badge(i.situacao)}</td>
      <td style="white-space:nowrap">${ed
        ? `<button class="btn btn-sm" onclick="act.${indDerivado(i) ? "adotarIndicadorMetodologia": "definirIndicadorComplementar"}('${i.id}')">Editar</button>
      <button class="btn btn-sm" onclick="act.desativarIndicadorCiclo('${i.id}')">Desativar</button>`
: `<span class="t-sub">histórico</span>`}</td>
    </tr>`).join("")}</tbody>
  </table></div></div>`;
}

/* ---- Painel (somente exibição) ---- */
function indPainel() {
  const inds = indicadoresDoCiclo(cicloEmFoco().id);
  const ciclo = cicloEmFoco();
  const comMeta = inds.filter(temMeta);
  const medio = comMeta.length ? Math.round(comMeta.reduce((s, i) => s + Math.min(atingimento(i), 100), 0) / comMeta.length): 0;
  const pend = totalPendencias(inds);
  return `
  <div class="note" style="margin-bottom:18px"><span>👁️</span><div>Esta aba é <b>somente consulta</b> do <b>${ciclo.nome}</b>. A <b>definição de metas</b> e o <b>registro de resultados</b> ficam nas abas <b>Metas do ciclo</b> e <b>Registro de resultados</b>.</div></div>
  <div class="grid cols-4" style="margin-bottom:18px">
    ${stat("Indicadores no ciclo", inds.length, ciclo.nome, "📊", "blue")}
    ${stat("Com meta definida", comMeta.length + "/" + inds.length, "", "🎯", "purple")}
    ${stat("Atingimento médio", medio + "%", "metas com resultado", "📈", "green")}
    ${stat("Resultados pendentes", pend, "períodos encerrados", "⏳", pend ? "amber": "slate")}
  </div>
  <div class="card" style="margin-bottom:18px">
    <div class="card-head"><h3>Painel de indicadores, metas e resultados</h3><span class="sub">meta, realizado, atingimento e cumprimento (acumulado do ciclo)</span></div>
    <div class="table-wrap"><table class="tbl">
      <thead><tr><th>Indicador</th><th>Processo</th><th>Periodicidade</th><th>Meta</th><th>Realizado</th><th>Atingimento</th><th>Situação</th></tr></thead>
      <tbody>${inds.map((i) => {
        const st = statusIndicador(i);
        const pct = Math.min(atingimento(i), 100);
        const cls = st === "Atingida" ? "green": st === "Abaixo" ? "amber": "";
        return `<tr>
        <td><div class="t-main">${i.nome}</div><div class="t-sub">${pratNome(i.pratica)}</div></td>
        <td>${procNome(i.processo)}</td><td><span class="badge badge-slate">${i.periodicidade}</span></td>
        <td>${temMeta(i) ? `${metaTotal(i)} ${i.unidade}`: "—"}</td>
        <td>${resultadoTotal(i)} ${i.unidade}</td>
        <td style="min-width:150px">${temMeta(i)
          ? `<div style="display:flex;align-items:center;gap:8px"><div class="progress ${cls}" style="flex:1"><i style="width:${pct}%"></i></div><b style="width:42px;text-align:right">${atingimento(i)}%</b></div>`
: '<span class="t-sub">meta não definida</span>'}</td>
        <td>${badge(st)}</td></tr>`;
      }).join("")}</tbody>
    </table></div>
  </div>
  <div class="card">
    <div class="card-head"><h3>Consolidação por processo CERNE</h3><span class="sub"></span></div>
    <div class="card-pad">
      ${DB.processos.map((pr) => {
        const list = inds.filter((i) => i.processo === pr.id && temMeta(i));
        if (!list.length) return "";
        const pct = Math.round(list.reduce((s, i) => s + Math.min(atingimento(i), 100), 0) / list.length);
        return `<div style="display:flex;align-items:center;gap:14px;padding:8px 0">
          <div style="width:200px" class="t-main">${pr.nome}</div>
          <div style="flex:1"><div class="progress ${pct >= 100 ? "green": pct < 60 ? "amber": ""}"><i style="width:${pct}%"></i></div></div>
          <div class="t-sub" style="width:60px;text-align:right">${pct}%</div>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

/* ---- Metas do ciclo (definição) ---- */
function indMetas() {
  const inds = indicadoresDoCiclo(cicloEmFoco().id);
  const ed = indCicloEditavel();
  const semMeta = indicadoresSemMeta(inds);
  const metaCell = (i) => {
    if (!temMeta(i)) return `<span class="badge badge-amber">Não definida</span>`;
    if (i.tipoMeta === "global") return `<span class="badge badge-blue">${i.metaGlobal} ${i.unidade}</span> <span class="t-sub">· todo o ciclo</span>`;
    const ps = periodosDe(i);
    const todasIguais = ps.every((p) => i.metas[p.id] === i.metas[ps[0].id]);
    if (todasIguais) return `<span class="badge badge-slate">${i.metas[ps[0].id]} ${i.unidade}/período</span> <span class="t-sub">· ${ps.length} períodos (${i.periodicidade.toLowerCase()})</span>`;
    return ps.map((p) => `<span class="badge badge-slate" style="margin:1px">${p.id}: ${i.metas[p.id]}</span>`).join(" ");
  };
  return `
  <div class="note" style="margin-bottom:16px"><span>🎯</span><div>Defina o <b>valor esperado</b> de cada indicador no ciclo. A meta pode ser <b>global</b> (um valor para todo o ciclo) ou <b>por período de apuração</b>. <b>Indicadores sem meta não recebem resultados.</b></div></div>
  ${notaCicloEncerrado()}
  ${semMeta.length ? `<div class="note warn" style="margin-bottom:16px"><span>⚠️</span><div><b>${semMeta.length} indicador(es) sem meta definida</b> (consulta <i>ListarIndicadoresSemMetaDefinida</i>): ${semMeta.map((i) => i.nome).join("; ")}.</div></div>`: ""}
  <div class="card"><div class="table-wrap"><table class="tbl">
    <thead><tr><th>Indicador</th><th>Vínculo CERNE</th><th>Tipo de meta</th><th>Meta definida</th><th></th></tr></thead>
    <tbody>${inds.map((i) => `<tr>
      <td><div class="t-main">${i.nome}</div><div class="t-sub">${i.unidade} · ${i.periodicidade}</div></td>
      <td><div class="t-sub">${procNome(i.processo)}</div><div class="t-sub">${pratNome(i.pratica)}</div></td>
      <td><span class="badge badge-${i.tipoMeta === "global" ? "blue": "purple"}">${i.tipoMeta === "global" ? "Global do ciclo": "Por período"}</span></td>
      <td>${metaCell(i)}</td>
      <td style="white-space:nowrap">${!ed
        ? `<span class="t-sub">histórico</span>`
: temMeta(i)
        ? `<button class="btn btn-sm" onclick="act.definirMeta('${i.id}')">Editar meta</button>`
: `<button class="btn btn-sm btn-primary" onclick="act.definirMeta('${i.id}')">Definir meta</button>`}</td>
    </tr>`).join("")}</tbody>
  </table></div></div>`;
}

/* ---- Registro de resultados (por período) ---- */
// Resumo de apuração de um indicador (para a lista): quantos períodos já foram
// preenchidos e quantos estão pendentes (apuração encerrada e sem resultado).
function resumoApuracao(i) {
  if (!temMeta(i)) return `<span class="badge badge-amber">sem meta</span>`;
  if (i.tipoMeta === "global") {
    return resultadoTotal(i) > 0
      ? `<span class="badge badge-green">✓ apurado (${resultadoTotal(i)} ${i.unidade})</span>`
: `<span class="t-sub">a apurar no encerramento do ciclo</span>`;
  }
  const ps = periodosDe(i);
  const feitos = ps.filter((p) => (i.resultados || {})[p.id] != null).length;
  const pendN = periodosPendentes(i).length;
  return `<span class="t-sub">${feitos}/${ps.length} períodos apurados</span>`
    + (pendN ? ` <span class="badge badge-amber">${pendN} pendente${pendN > 1 ? "s": ""}</span>`: "");
}
/* =================== REGISTRO DE RESULTADOS ===================
   Espelha o fluxo de EVIDÊNCIAS: NÃO há responsável pré-atribuído nem
   fila por pessoa. Qualquer responsável autorizado no ciclo registra o
   resultado de qualquer indicador, e o lançamento guarda QUEM registrou
   (registradoPor), exatamente como a evidência guarda quem a registrou. */
VIEWS.registroResultados = () => {
  const foco = cicloEmFoco();
  return head("", "Apuração de Indicadores", "Registro dos resultados periódicos dos indicadores do ciclo. Como nas <b>evidências</b>, o lançamento guarda <b>quem registrou</b> o resultado e pode vincular evidências/atividades; a validação ocorre na.")
  + `
  <div class="note" style="margin-bottom:12px"><span>🎯</span><div>Apurando o <b>ciclo em foco: ${foco.nome}</b> ${foco.status==="Ativo"?'<span class="badge badge-green">ativo</span>':'<span class="badge badge-slate">encerrado</span>'} — para trocar de ciclo, use o <b>ponto central</b> em <a href="#/incubadora">Minha Incubadora</a>.</div></div>
  <div class="note" style="margin-bottom:16px"><span>🔐</span><div>O registro é uma operação <b>autorizada por papel</b> no escopo da incubadora/ciclo. <b>Não há responsável pré-atribuído</b> ao indicador — quem registra fica gravado no lançamento, como nas <a href="#/evidencias">evidências</a>. A <b>definição</b> de indicadores e <b>metas</b> é do gestor, na tela <a href="#/indicadores">Indicadores e Metas</a>.</div></div>
  <div id="acompBody"></div>`;
};
VIEWS.registroResultados.after = () => {
  $("#acompBody").innerHTML = acompWorklist();
};
function acompWorklist() {
  const ciclo = cicloEmFoco();
  const ed = true; // ações sempre disponíveis
  const inds = indicadoresDoCiclo(ciclo.id);
  const pend = totalPendencias(inds);
  const semMeta = inds.filter((i) => !temMeta(i)).length;
  return `
  <div class="grid cols-3" style="margin-bottom:16px">
    ${stat("Indicadores no ciclo", inds.length, ciclo.nome, "📊", "blue")}
    ${stat("Períodos pendentes", pend, ed ? "apuração encerrada": "sem registro no histórico", pend ? "amber": "slate")}
    ${stat("Aguardando meta", semMeta, "definição do gestor", "🚧", semMeta ? "amber": "slate")}
  </div>
  ${pend && ed ? `<div class="note warn" style="margin-bottom:16px"><span>⚠️</span><div><b>${pend} período(s) com apuração encerrada e sem resultado</b> no ciclo (consulta <i>ListarIndicadoresComResultadoPendente</i>).</div></div>`: ""}
  <div class="card"><div class="table-wrap"><table class="tbl">
    <thead><tr><th>Indicador</th><th>Vínculo CERNE</th><th>Periodicidade</th><th>Apuração</th><th></th></tr></thead>
    <tbody>${inds.map((i) => {
      const semM = !temMeta(i);
      const pendN = periodosPendentes(i).length;
      return `<tr>
      <td class="t-main">${i.nome}</td>
      <td class="t-sub">${procNome(i.processo)} · ${pratNome(i.pratica)}</td>
      <td><span class="badge badge-slate">${i.periodicidade}</span></td>
      <td>${resumoApuracao(i)}</td>
      <td style="white-space:nowrap">${!ed
        ? `<button class="btn btn-sm" onclick="act.registrarResultadosIndicador('${i.id}')">Ver histórico</button>`
: semM
        ? `<span class="t-sub" title="A meta é definida pelo gestor">aguardando meta do gestor</span>`
: `<button class="btn btn-sm ${pendN ? "btn-warn": "btn-primary"}" onclick="act.registrarResultadosIndicador('${i.id}')">Registrar resultados</button>`}</td>
    </tr>`;
    }).join("")}</tbody>
  </table></div></div>`;
}

/* =================== OPORTUNIDADES — DESABILITADO ===================
VIEWS.oportunidades = () => {
  const ciclo = cicloEmFoco();
  const ed = true; // ações sempre disponíveis
  const ofoco = oportunidadesDoCicloFoco();
  return head("", "Gerenciar Oportunidades de Incubação e Conexão", "Registro, classificação e qualificação de oportunidades de incubação, pré-incubação e conexão. Acompanhamento do funil e conversão em atendimento, conexão ou registro de empreendimento (processo de Sensibilização e Prospecção do CERNE 1).")
  + `
  <div class="note" style="margin-bottom:16px"><span>🎯</span><div>Funil do <b>ciclo em foco: ${ciclo.nome}</b> ${ciclo.status==="Ativo"?'<span class="badge badge-green">ativo</span>':'<span class="badge badge-slate">encerrado</span>'} — oportunidades são vinculadas ao ciclo institucional (<i>ListarOportunidadesPorCicloInstitucional</i>). Para trocar de ciclo, use o <b>ponto central</b> em <a href="#/incubadora">Minha Incubadora</a>.</div></div>
  <div class="toolbar"><span class="spacer"></span>${ed?`<button class="btn btn-primary" onclick="act.novaOportunidade()">+ Registrar oportunidade</button>`:""}</div>
  <div class="grid cols-4" style="margin-bottom:18px;align-items:stretch">
    ${DB.funilEtapas.map(etapa=>{
      const ops = ofoco.filter(o=>o.etapa===etapa);
      return `<div class="card" style="display:flex;flex-direction:column">
        <div class="card-head" style="padding:12px 14px"><h3 style="font-size:13.5px">${etapa}</h3><span class="badge badge-slate" style="margin-left:auto">${ops.length}</span></div>
        <div class="card-pad" style="display:flex;flex-direction:column;gap:9px;flex:1">
          ${ops.length?ops.map(o=>`<div style="border:1px solid var(--line);border-radius:10px;padding:10px;cursor:pointer" onclick="act.verOportunidade('${o.id}')">
            <div class="t-main" style="font-size:12.5px;line-height:1.3">${o.titulo}</div>
            <div style="display:flex;gap:5px;margin-top:7px;flex-wrap:wrap"><span class="badge badge-blue">${o.tipo}</span><span class="badge badge-slate">${o.origem}</span></div>
            <div class="t-sub" style="margin-top:6px">${o.responsavel} · ${fmtDate(o.data)}</div>
          </div>`).join(""):'<div class="empty" style="padding:18px"><div class="t-sub">Vazio</div></div>'}
        </div>
      </div>`;
    }).join("")}
  </div>
  <div class="note"><span>🔁</span><div>Clique numa oportunidade para avançá-la no funil por <b>comando</b><b>Qualificar</b> → <b>Atualizar situação/encaminhamento</b> → <b>Converter</b>. As <b>colunas</b> são a <b>situação</b> (onde está); os badges azul/cinza são o <b>tipo</b> (o que é — incubação, conexão, atendimento). Mentoria/atendimento são tipos válidos de oportunidade; a entrega do serviço em si é outro fluxo.</div></div>`;
};
*/

/* =================== EMPREENDIMENTOS =================== */
VIEWS.empreendimentos = () => {
  const ciclo = cicloEmFoco();
  const ed = true; // ações sempre disponíveis
  const emps = empreendimentosDoCicloFoco();
  return head("", "Empreendimentos Apoiados", "Portfólio dos empreendimentos apoiados para <b>visualização</b>: dados, equipe/sócios, classificação por modalidade física/estágio/setor/situação, vínculo com ciclos e o <b>último monitoramento</b> (eixos CERNE + recomendação). A <b>criação e edição</b> ficam em <a href='#/incubadora'>Minha Incubadora</a>.")
  + `
  <div class="note" style="margin-bottom:16px"><span>🎯</span><div>Portfólio do <b>ciclo em foco: ${ciclo.nome}</b> ${ciclo.status==="Ativo"?'<span class="badge badge-green">ativo</span>':'<span class="badge badge-slate">encerrado</span>'} — empreendimentos têm vínculo com ciclos de apoio e são consolidados por ciclo. Para trocar de ciclo, use o <b>ponto central</b> em <a href="#/incubadora">Minha Incubadora</a>.</div></div>
  <div class="grid cols-4" style="margin-bottom:18px">
    ${stat("No portfólio", emps.length, "", "🚀", "blue")}
    ${stat("Ativos", emps.filter(e=>e.situacao==="Ativo").length, "", "🟢", "green")}
    ${stat("Em análise", emps.filter(e=>e.situacao==="Em análise").length, "", "🔎", "amber")}
    ${stat("Graduados", emps.filter(e=>e.situacao==="Graduado").length, "no histórico", "🎓", "purple")}
  </div>
  <div class="toolbar">
    <div class="chips"><span class="chip active">Todos</span><span class="chip">Residente</span><span class="chip">Não residente</span><span class="chip">Virtual</span></div>
    <span class="spacer"></span><span class="t-sub">✏️ Criação e edição em <a href="#/incubadora">Minha Incubadora</a></span>
  </div>
  <div class="grid cols-3">
    ${emps.length?emps.map(e=>`<div class="card card-pad">
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px">
        <div class="brand-logo" style="background:linear-gradient(135deg,#7c3aed,#2f6df6);width:40px;height:40px;font-size:14px">${e.nome.substring(0,2).toUpperCase()}</div>
        <div style="flex:1"><div class="t-main">${e.nome}</div><div class="t-sub">${e.setor} · ${e.modalidadeFisica}</div></div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
        <span class="badge badge-slate">${e.estagio}</span>${badge(e.situacao)}
      </div>
      ${monitSnapshotEmp(e.id)}
      <div class="t-sub" style="margin-top:10px">👥 ${e.pessoas.length} · resp. interno ${e.responsavel.split(" ")[0]} · entrada ${fmtDate(e.entrada)}</div>
      <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:10px">
        <button class="btn btn-sm" onclick="act.verEmpreendimento('${e.id}')">Abrir</button>
      </div>
    </div>`).join(""):`<div class="empty" style="grid-column:1/-1"><div class="t-sub">Nenhum empreendimento vinculado a este ciclo.</div></div>`}
  </div>

  ${consolidacaoPortfolio(emps)}`;
};

/* / Consultar portfólio e consolidar por modalidade, setor,
   estágio e situação (visão gerencial; não altera dados). */
function consolidacaoPortfolio(emps) {
  const por = (campo) => {
    const m = {};
    emps.forEach((e) => { m[e[campo]] = (m[e[campo]] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  };
  const bloco = (titulo, pares) => `
    <div class="card" style="flex:1;min-width:200px">
      <div class="card-head" style="padding:12px 14px"><h3 style="font-size:13px">${titulo}</h3></div>
      <div class="card-pad" style="padding-top:6px">
        ${pares.length ? pares.map(([k, n]) => `
          <div style="display:flex;align-items:center;gap:8px;padding:5px 0">
            <span class="badge badge-slate">${k}</span>
            <span class="spacer" style="flex:1"></span>
            <b>${n}</b>
          </div>`).join(""): '<div class="t-sub"></div>'}
      </div>
    </div>`;
  return `
  <div class="card" style="margin-top:18px">
    <div class="card-head"><h3>Consolidação do portfólio</h3>
      <span class="sub">visão gerencial por modalidade física, setor, estágio e situação</span>
      <div class="right"><button class="btn btn-sm" onclick="act.consultarPortfolio()">Consultar portfólio</button></div></div>
    <div class="card-pad">
      <div class="note" style="margin:0 0 12px"><span>📊</span><div>A consolidação <b>não altera</b> empreendimentos — agrega o portfólio do <b>ciclo em foco</b> mantendo rastreabilidade com ciclos, modalidades físicas, setores, estágios e situações (consulta <i>ConsolidarEmpreendimentosApoiados</i>).</div></div>
      <div style="display:flex;gap:14px;flex-wrap:wrap">
        ${bloco("Por modalidade física", por("modalidadeFisica"))}
        ${bloco("Por setor", por("setor"))}
        ${bloco("Por estágio", por("estagio"))}
        ${bloco("Por situação", por("situacao"))}
      </div>
    </div>
  </div>`;
}

/* =================== MONITORAMENTO DAS INCUBADAS =================== */
// Radar SVG sobre as dimensões (eixos CERNE) — 1+ séries (atual/anterior). 
function radarSVG(dims, max, series) {
  const n = dims.length, cx = 140, cy = 130, R = 92;
  const ang = (i) => -Math.PI / 2 + i * 2 * Math.PI / n;
  const pt = (i, val) => [cx + R * (val / max) * Math.cos(ang(i)), cy + R * (val / max) * Math.sin(ang(i))];
  const polyAt = (lv) => dims.map((_, i) => pt(i, lv).map((x) => x.toFixed(1)).join(",")).join(" ");
  let grid = "";
  [max, max * 2 / 3, max / 3].forEach((lv) => { grid += `<polygon points="${polyAt(lv)}" fill="none" stroke="#e2e8f0" stroke-width="1"/>`; });
  let axes = "", labels = "";
  dims.forEach((d, i) => {
    const [x, y] = pt(i, max);
    axes += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/>`;
    const [lx, ly] = pt(i, max * 1.2);
    const anchor = Math.abs(lx - cx) < 8 ? "middle": (lx > cx ? "start": "end");
    labels += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="10.5" fill="#475569" text-anchor="${anchor}" dominant-baseline="middle">${d}</text>`;
  });
  let polys = "";
  series.forEach((s) => {
    const pts = dims.map((d, i) => pt(i, s.valores[d] || 0).map((x) => x.toFixed(1)).join(",")).join(" ");
    polys += `<polygon points="${pts}" fill="${s.fill}" stroke="${s.color}" stroke-width="2"/>`;
  });
  return `<svg viewBox="0 0 280 250" width="280" height="250" role="img">${grid}${axes}${polys}${labels}</svg>`;
}
const recBadge = (r) => ({ "Continuidade": "badge-green", "Replanejamento": "badge-amber", "Graduação": "badge-purple", "Desligamento": "badge-red" }[r] || "badge-slate");
function monitDimGauge(d, val, max) {
  const v = val == null ? 0: val, pct = Math.round(v / max * 100);
  return `<div style="min-width:110px;flex:1;margin-bottom:8px">
    <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted)"><span>${d}</span><span><b>${v}</b>/${max}</span></div>
    <div style="height:7px;background:#eef2f7;border-radius:5px;margin-top:3px;overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#2f6df6,#7c3aed)"></div></div>
  </div>`;
}
function monitRodadas() {
  const rs = rodadasDoCicloFoco();
  return `<div class="toolbar"><div class="t-sub">${rs.length} rodada(s) no ciclo ${cicloEmFoco().nome}</div><span class="spacer"></span><button class="btn btn-primary" onclick="act.planejarRodada()">+ Planejar rodada</button></div>
  <div class="card"><div class="table-wrap"><table class="tbl">
    <thead><tr><th>Rodada</th><th>Tipo</th><th>Instrumento</th><th>Período</th><th>Responsável</th><th>Aplicações</th><th>Situação</th><th></th></tr></thead>
    <tbody>${rs.map((r) => { const avs = avaliacoesDaRodada(r.id); const ok = avs.filter((a) => a.status === "Concluída").length;
      return `<tr><td class="t-main">${r.nome}</td><td><span class="badge badge-soft">${r.tipo}</span></td><td class="t-sub">${(instrumentoMonitById(r.instrumento) || {}).nome || "—"}</td><td>${r.periodo}</td><td>${r.responsavel}</td><td>${ok}/${r.incubadas.length}</td><td>${badge(r.status)}</td><td style="white-space:nowrap"><button class="btn btn-sm" onclick="act.verRodadaMonitoramento('${r.id}')">Abrir</button></td></tr>`;
    }).join("") || `<tr><td colspan="8"><div class="t-sub" style="padding:10px">Nenhuma rodada neste ciclo.</div></td></tr>`}</tbody>
  </table></div></div>`;
}
function monitAvaliacoes() {
  const rodadas = rodadasDoCicloFoco();
  const dims = monitDimensoes(), max = DB.monitoramento.escalaMax;
  if (!rodadas.length) return `<div class="t-sub">Nenhuma rodada neste ciclo.</div>`;
  const cardAvaliacao = (a) => { const done = a.status === "Concluída";
    return `<div class="card card-pad" style="margin-bottom:10px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:${done ? "12px": "0"}">
        <div style="flex:1"><div class="t-main">${empNome(a.empreendimento)}</div><div class="t-sub">${a.data ? fmtDate(a.data): "—"}</div></div>
        ${a.recomendacao ? `<span class="badge ${recBadge(a.recomendacao)}">${a.recomendacao}</span>`: ""}
        ${badge(a.status)}
        <button class="btn btn-sm btn-primary" onclick="act.aplicarInstrumento('${a.id}')">${done ? "Revisar": "Aplicar"}</button>
      </div>
      ${done ? `<div style="display:flex;gap:16px;flex-wrap:wrap">${dims.map((d) => monitDimGauge(d, a.pontuacoes[d], max)).join("")}</div>${a.observacao ? `<div class="t-sub" style="margin-top:6px">📝 ${a.observacao}</div>`: ""}`
: `<div class="t-sub" style="margin-top:6px">Aplicação pendente — clique em <b>Aplicar</b> para pontuar as dimensões.</div>`}
    </div>`;
  };
  return `<div class="t-sub" style="margin-bottom:12px">Aplicação do instrumento por incubada — pontuação por dimensão/eixo CERNE e recomendação, <b>agrupada por rodada</b>.</div>
  ${rodadas.map((r) => { const avs = avaliacoesDaRodada(r.id); const ok = avs.filter((a) => a.status === "Concluída").length;
    return `<div style="margin-bottom:22px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid var(--line)">
        <span style="font-size:16px">📡</span>
        <div style="flex:1"><div class="t-main">${r.nome}</div><div class="t-sub">${r.tipo} · ${r.periodo} · ${(instrumentoMonitById(r.instrumento) || {}).nome || "—"}</div></div>
        <span class="badge badge-soft">${ok}/${r.incubadas.length} concluídas</span>
        ${badge(r.status)}
      </div>
      ${avs.length ? avs.map(cardAvaliacao).join(""): `<div class="t-sub" style="padding:4px 0 8px">Nenhuma aplicação iniciada nesta rodada.</div>`}
    </div>`;
  }).join("")}`;
}
let monitRadarEmp = null;
function monitRadar() {
  const dims = monitDimensoes(), max = DB.monitoramento.escalaMax;
  const rids = rodadasDoCicloFoco().map((r) => r.id);
  const emps = [...new Set(DB.monitoramento.avaliacoes.filter((a) => rids.includes(a.rodada) && a.status === "Concluída").map((a) => a.empreendimento))];
  if (!emps.length) return `<div class="t-sub">Sem avaliações concluídas para exibir o radar.</div>`;
  if (!monitRadarEmp || !emps.includes(monitRadarEmp)) monitRadarEmp = emps[0];
  const hist = avaliacoesConcluidasIncubada(monitRadarEmp);
  const atual = hist[hist.length - 1], anterior = hist.length > 1 ? hist[0]: null;
  const series = [];
  if (anterior) series.push({ label: "Anterior (" + anterior.data.slice(0, 7) + ")", color: "#94a3b8", fill: "rgba(148,163,184,.15)", valores: anterior.pontuacoes });
  series.push({ label: "Atual (" + atual.data.slice(0, 7) + ")", color: "#2f6df6", fill: "rgba(47,109,246,.20)", valores: atual.pontuacoes });
  const med = (a) => mediaAvaliacaoMonit(a).toFixed(1);
  return `<div class="toolbar"><span class="t-sub" style="margin-right:6px">Incubada</span><div class="chips" id="monRadarChips">${emps.map((e) => `<span class="chip ${e === monitRadarEmp ? "active": ""}" data-e="${e}">${empNome(e)}</span>`).join("")}</div></div>
  <div class="grid cols-2" style="gap:18px">
    <div class="card card-pad" style="text-align:center">
      <h3 style="margin:0 0 2px">Radar por dimensão (eixos CERNE)</h3>
      <div class="t-sub" style="margin-bottom:4px">ConsultarRadarEvolucaoIncubada</div>
      ${radarSVG(dims, max, series)}
      <div style="display:flex;gap:14px;justify-content:center;margin-top:4px">${series.map((s) => `<span style="font-size:11px;color:var(--muted)"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${s.color};margin-right:4px"></span>${s.label}</span>`).join("")}</div>
    </div>
    <div class="card card-pad">
      <h3 style="margin:0 0 8px">Evolução das pontuações</h3>
      <table class="tbl"><thead><tr><th>Dimensão</th>${anterior ? "<th>Anterior</th>": ""}<th>Atual</th>${anterior ? "<th>Δ</th>": ""}</tr></thead>
      <tbody>${dims.map((d) => { const at = atual.pontuacoes[d] || 0; const an = anterior ? (anterior.pontuacoes[d] || 0): null; const dl = an != null ? at - an: null;
        return `<tr><td>${d}</td>${an != null ? `<td>${an}</td>`: ""}<td><b>${at}</b></td>${dl != null ? `<td><span class="badge ${dl > 0 ? "badge-green": dl < 0 ? "badge-red": "badge-slate"}">${dl > 0 ? "+": ""}${dl}</span></td>`: ""}</tr>`;
      }).join("")}
      <tr><td><b>Média</b></td>${anterior ? `<td>${med(anterior)}</td>`: ""}<td><b>${med(atual)}</b></td>${anterior ? `<td>${(mediaAvaliacaoMonit(atual) - mediaAvaliacaoMonit(anterior) >= 0 ? "+": "") + (mediaAvaliacaoMonit(atual) - mediaAvaliacaoMonit(anterior)).toFixed(1)}</td>`: ""}</tr>
      </tbody></table>
      ${atual.recomendacao ? `<div class="note" style="margin-top:12px"><span>🧭</span><div>Recomendação atual<b>${atual.recomendacao}</b>${atual.observacao ? ` — ${atual.observacao}`: ""}</div></div>`: ""}
    </div>
  </div>`;
}
function monitConsolidacao() {
  const dims = monitDimensoes(), max = DB.monitoramento.escalaMax;
  const rids = rodadasDoCicloFoco().map((r) => r.id);
  const avs = DB.monitoramento.avaliacoes.filter((a) => rids.includes(a.rodada) && a.status === "Concluída");
  if (!avs.length) return `<div class="t-sub">Sem avaliações concluídas para consolidar.</div>`;
  const mediaDim = {}; dims.forEach((d) => { const vs = avs.map((a) => a.pontuacoes[d]).filter((v) => v != null); mediaDim[d] = vs.length ? vs.reduce((s, x) => s + x, 0) / vs.length: 0; });
  const porRec = {}; DB.monitoramento.recomendacoes.forEach((r) => porRec[r] = 0); avs.forEach((a) => { if (a.recomendacao) porRec[a.recomendacao] = (porRec[a.recomendacao] || 0) + 1; });
  const pend = DB.monitoramento.avaliacoes.filter((a) => rids.includes(a.rodada) && a.status !== "Concluída").length;
  return `<div class="grid cols-2" style="gap:18px">
    <div class="card card-pad"><h3 style="margin:0 0 4px">Média por dimensão / eixo CERNE</h3><div class="t-sub" style="margin-bottom:12px">ConsolidarMonitoramentosPorEixoCerne (${avs.length} aplicações)</div>
      ${dims.map((d) => monitDimGauge(d, Math.round(mediaDim[d] * 10) / 10, max)).join("")}
    </div>
    <div class="card card-pad"><h3 style="margin:0 0 4px">Distribuição por recomendação</h3><div class="t-sub" style="margin-bottom:12px">ConsolidarMonitoramentosPorResultado</div>
      <table class="tbl"><tbody>${DB.monitoramento.recomendacoes.map((r) => `<tr><td><span class="badge ${recBadge(r)}">${r}</span></td><td style="text-align:right"><b>${porRec[r] || 0}</b></td></tr>`).join("")}
        <tr><td class="t-sub">Aplicações pendentes</td><td style="text-align:right">${pend}</td></tr></tbody></table>
    </div>
  </div>`;
}
// Snapshot do ÚLTIMO monitoramento de uma incubada (eixos + recomendação) — usado no empreendimento apoiado
function monitSnapshotEmp(empId) {
  const hist = avaliacoesConcluidasIncubada(empId);
  const dims = monitDimensoes(), max = DB.monitoramento.escalaMax;
  if (!hist.length) return `<div style="border:1px dashed var(--line);border-radius:10px;padding:12px;text-align:center;background:#fafbfe"><span class="t-sub">📡 Sem monitoramento concluído</span></div>`;
  const a = hist[hist.length - 1];
  return `<div style="border:1px solid #d7e3fb;border-radius:10px;padding:11px 12px;background:#f4f8ff">
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:9px">
      <span style="flex:1;font-weight:700;font-size:12.5px">📡 Monitoramento <span class="t-sub" style="font-weight:400">· ${fmtDate(a.data)}</span></span>
      ${a.recomendacao ? `<span class="badge ${recBadge(a.recomendacao)}">${a.recomendacao}</span>`: ""}
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">${dims.map((d) => monitDimGauge(d, a.pontuacoes[d], max)).join("")}</div>
  </div>`;
}
let monitTab = "rodadas";
VIEWS.monitoramento = () => {
  const rs = rodadasDoCicloFoco();
  const rids = rs.map((r) => r.id);
  const avs = DB.monitoramento.avaliacoes.filter((a) => rids.includes(a.rodada));
  const done = avs.filter((a) => a.status === "Concluída").length;
  const monitoradas = new Set(rs.flatMap((r) => r.incubadas)).size;
  return head("", "Monitoramento das Incubadas", "Acompanhamento da <b>evolução das incubadas</b> por rodadas de monitoramento: aplicação de instrumento periódico, <b>pontuação por dimensão (eixos CERNE)</b>, recomendações e encaminhamentos, <b>radar de evolução</b> e consolidação por ciclo, dimensão e resultado.")
  + `<div class="note" style="margin-bottom:16px"><span>🎯</span><div>Rodadas do <b>ciclo em foco: ${cicloEmFoco().nome}</b> — para trocar de ciclo, use o <b>ponto central</b> em <a href="#/incubadora">Minha Incubadora</a>.</div></div>
  <div class="grid cols-4" style="margin-bottom:18px">
    ${stat("Rodadas no ciclo", rs.length, "", "📡", "blue")}
    ${stat("Incubadas monitoradas", monitoradas, "", "🏢", "purple")}
    ${stat("Aplicações concluídas", done, "", "✔", "green")}
    ${stat("Pendentes", avs.length - done, "", "⏳", "amber")}
  </div>
  <div class="tabs" id="monTabs">
    <div class="tab" data-t="rodadas">Rodadas</div>
    <div class="tab" data-t="avaliacoes">Aplicações &amp; pontuação</div>
    <div class="tab" data-t="radar">Radar &amp; evolução</div>
    <div class="tab" data-t="consolidacao">Consolidação</div>
  </div>
  <div id="monBody"></div>`;
};
VIEWS.monitoramento.after = () => {
  const body = $("#monBody");
  const render = (t) => {
    monitTab = t;
    if (t === "rodadas") body.innerHTML = monitRodadas();
    else if (t === "avaliacoes") body.innerHTML = monitAvaliacoes();
    else if (t === "radar") { body.innerHTML = monitRadar(); const ch = $("#monRadarChips"); if (ch) ch.addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (!c) return; monitRadarEmp = c.dataset.e; render("radar"); }); }
    else if (t === "consolidacao") body.innerHTML = monitConsolidacao();
    $$(".tab", $("#monTabs")).forEach((x) => x.classList.toggle("active", x.dataset.t === t));
  };
  $("#monTabs").addEventListener("click", (e) => { const tab = e.target.closest(".tab"); if (!tab) return; render(tab.dataset.t); });
  render(monitTab);
};

/* =================== USUÁRIOS, PAPÉIS E PERMISSÕES =================== */
// Mapeia cada RECURSO das permissões dos papéis às TELAS do menu que ele controla,
// para deixar claro a que telas os papéis se referem.
const RECURSO_TELAS = {
  "Metodologia": ["Metodologia CERNE"],
  "Planejamento": ["Modelos de Planejamento", "Planejamento Institucional"],
  "Acompanhar Execução": ["Acompanhar Execução"],
  "Evidências e Documentos": ["Evidências e Documentos"],
  "Indicadores e Metas": ["Indicadores e Metas"],
  "Apuração de Indicadores": ["Apuração de Indicadores"],
  "Empreendimentos": ["Empreendimentos Apoiados", "Monitoramento das Incubadas"],
  "Usuários": ["Usuários e Permissões"],
};
VIEWS.usuarios = () => {
  const us = DB.acessos.usuarios;
  return head("", "Usuários, Papéis e Permissões", "<b>Consulta</b> dos usuários da incubadora e gestão de <b>papéis</b> e <b>permissões por recurso/escopo</b>. A <b>inclusão</b>, o <b>convite/ativação</b> e a <b>suspensão/reativação</b> de contas são do <b>administrador da plataforma</b>.")
  + `
  <div class="grid cols-4" style="margin-bottom:18px">
    ${stat("Usuários", us.length, "", "👥", "blue")}
    ${stat("Ativos", usuariosPorSituacao("Ativo").length, "", "🟢", "green")}
    ${stat("Convidados", usuariosPorSituacao("Convidado").length, "aguardando ativação", "✉", "amber")}
    ${stat("Papéis", DB.acessos.papeis.length, "perfis de autorização", "🔐", "purple")}
  </div>

  <div class="tabs" id="usTabs">
    <div class="tab active" data-t="usuarios">Usuários</div>
    <div class="tab" data-t="papeis">Papéis & Permissões</div>
  </div>
  <div id="usBody"></div>`;
};
VIEWS.usuarios.after = () => {
  const body = $("#usBody");
  const render = (t) => {
    if (t === "usuarios") {
      body.innerHTML = `
      <div class="note" style="margin:14px 0"><span>👤</span><div>O gestor pode <b>alterar o papel</b> (e o escopo) de um usuário já vinculado — comando <b>AtribuirPapelAoUsuario</b>. A <b>inclusão</b>, o <b>convite/ativação</b> e a <b>suspensão/reativação</b> de contas continuam sendo do <b>administrador da plataforma</b>.</div></div>
      <div class="card"><div class="table-wrap"><table class="tbl">
        <thead><tr><th>Usuário</th><th>Papel</th><th>Último acesso</th><th>Situação</th><th></th></tr></thead>
        <tbody>${DB.acessos.usuarios.map(u=>`<tr>
          <td><div class="t-main">${u.nome}</div><div class="t-sub">${u.email}</div></td>
          <td>${u.papel}</td>
          <td>${u.ultimoAcesso?fmtDate(u.ultimoAcesso):'<span class="t-sub">nunca</span>'}</td>
          <td>${badge(u.situacao)}</td>
          <td style="white-space:nowrap"><button class="btn btn-sm" onclick="act.alterarPapelUsuario('${u.email}')">Alterar papel</button></td></tr>`).join("")}</tbody>
      </table></div></div>`;
    }
    if (t === "papeis") {
      body.innerHTML = `
      <div class="note" style="margin:14px 0"><span>🔐</span><div>Cada <b>papel</b> reúne permissões por recurso e <b>escopos padrão</b>. Permissões efetivas de um usuário derivam do papel + escopo atribuído.</div></div>
      <div class="toolbar"><span class="spacer"></span><button class="btn btn-primary" onclick="act.configurarPapel()">+ Configurar papel</button></div>
      <div class="grid cols-2">${DB.acessos.papeis.map(p=>`
        <div class="card card-pad">
          <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px">
            <div style="flex:1"><h3 style="margin:0;font-size:14px">${p.nome}</h3>
              <div class="t-sub">Escopo: ${p.escopo} · ${p.usuarios} usuário(s)</div></div>
            ${badge(p.situacao)}
          </div>
          <div style="display:flex;gap:5px;flex-wrap:wrap">
            ${Object.entries(p.permissoes).filter(([,v])=>v!=="—").map(([r,v])=>`<span class="badge badge-${v==="Total"?"green":v==="Edição"?"blue":"slate"}" title="Telas: ${(RECURSO_TELAS[r]||[]).join(" · ")}">${r}: ${v}</span>`).join("")}
          </div>
          <div style="display:flex;gap:6px;justify-content:flex-end;margin-top:10px">
            <button class="btn btn-sm" onclick="act.configurarPapel('${p.id}')">Editar</button></div>
        </div>`).join("")}</div>
      <div class="card card-pad" style="margin-top:14px">
        <h4 style="margin:0 0 8px;font-size:13px">A que telas cada recurso se refere</h4>
        <dl class="kv" style="margin:0">${DB.acessos.recursos.map(r=>`<dt>${r}</dt><dd>${(RECURSO_TELAS[r]||["—"]).map(t=>`<span class="badge badge-slate">${t}</span>`).join(" ")}</dd>`).join("")}</dl>
      </div>`;
    }
  };
  $("#usTabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".tab"); if (!tab) return;
    $$(".tab", $("#usTabs")).forEach((x) => x.classList.remove("active"));
    tab.classList.add("active"); render(tab.dataset.t);
  });
  render("usuarios");
};

/* =================== PAINEL OPERACIONAL DA INCUBADORA =================== */
// Painel de EXECUÇÃO DIÁRIA — deriva pendências do estado real dos módulos (não dados estáticos).
const PAINEL_HOJE = new Date("2026-06-20T00:00");
function situacaoPrazo(prazo) {
  if (!prazo) return { sit: "Aberto", grav: "Baixa" };
  const diff = (new Date(prazo + "T00:00") - PAINEL_HOJE) / 86400000;
  if (diff < 0) return { sit: "Vencido", grav: "Alta" };
  if (diff <= 7) return { sit: "Próximo", grav: "Média" };
  return { sit: "Aberto", grav: "Baixa" };
}
const painelSitCls = (s) => ({ Vencido: "badge-red", "Correção solicitada": "badge-amber", Próximo: "badge-amber", Aberto: "badge-slate" }[s] || "badge-slate");
// Consolida pendências operacionais do ciclo em foco (ConsultarPainelOperacionalIncubadora)
function painelOperacionalItens() {
  const itens = [];
  atividadesDoCicloFoco().filter((a) => a.status !== "Concluída").forEach((a) => {
    let { sit, grav } = situacaoPrazo(a.prazo);
    if (a.status === "Atrasada") { sit = "Vencido"; grav = "Alta"; }
    itens.push({ tipo: "Atividade do ciclo", icon: "🗓", titulo: a.nome, responsavel: a.responsavel, prazo: a.prazo, sit, grav, us: "", rota: "#/execucao", acao: "Registrar execução / concluir" });
  });
  evidenciasDoCicloFoco().forEach((e) => {
    if (e.status === "Correção solicitada") itens.push({ tipo: "Evidência reprovada", icon: "✎", titulo: e.titulo, responsavel: e.registradoPor, prazo: null, sit: "Correção solicitada", grav: "Média", us: "", rota: "#/evidencias", acao: "Corrigir e reenviar" });
    else if (e.status === "Em validação") itens.push({ tipo: "Evidência a validar", icon: "📎", titulo: e.titulo, responsavel: e.registradoPor, prazo: null, sit: "Aberto", grav: "Baixa", us: "", rota: "#/evidencias", acao: "Validar evidência" });
  });
  indicadoresDoCiclo(cicloEmFoco().id).forEach((i) => {
    const pend = periodosPendentes(i);
    if (pend.length) itens.push({ tipo: "Indicador sem lançamento", icon: "📊", titulo: `${i.nome} — ${pend.length} período(s) sem resultado`, responsavel: "Não atribuído", prazo: null, sit: "Vencido", grav: "Média", us: "", rota: "#/registroResultados", acao: "Registrar resultado" });
  });
  rodadasDoCicloFoco().forEach((r) => {
    avaliacoesDaRodada(r.id).filter((a) => a.status !== "Concluída").forEach((a) => {
      const { sit, grav } = situacaoPrazo(r.prazo);
      itens.push({ tipo: "Monitoramento pendente", icon: "📡", titulo: `${empNome(a.empreendimento)} — aplicação não concluída (${r.nome})`, responsavel: r.responsavel, prazo: r.prazo, sit, grav, us: "", rota: "#/monitoramento", acao: "Aplicar instrumento" });
    });
  });
  const ordem = { Vencido: 0, Próximo: 1, "Correção solicitada": 2, Aberto: 3 };
  return itens.sort((x, y) => ordem[x.sit] - ordem[y.sit]);
}
let painelResp = "Todos", painelSit = "Todas";
VIEWS.painelOperacional = () => {
  const itens = painelOperacionalItens();
  const venc = itens.filter((i) => i.sit === "Vencido").length;
  const prox = itens.filter((i) => i.sit === "Próximo").length;
  const resps = ["Todos",...new Set(itens.map((i) => i.responsavel))];
  if (!resps.includes(painelResp)) painelResp = "Todos";
  return head("", "Painel Operacional da Incubadora", "Painel de <b>execução diária</b>: consolida o que <b>exige ação imediata</b> — atividades atrasadas, evidências pendentes, indicadores sem lançamento e monitoramentos pendentes. Não é painel analítico; é <b>apenas consulta</b> (não altera registros) e cada item permite <b>rastrear a origem</b>.")
  + `<div class="note" style="margin-bottom:16px"><span>🎯</span><div>Pendências do <b>ciclo em foco: ${cicloEmFoco().nome}</b>, agregadas de Execução, Evidências, Indicadores e Monitoramento.</div></div>
  <div class="grid cols-3" style="margin-bottom:18px">
    ${stat("Pendências", itens.length, "no ciclo", "🧭", "blue")}
    ${stat("Vencidas", venc, "", "⛔", venc ? "amber": "green")}
    ${stat("Próximas (≤7d)", prox, "", "⏳", "amber")}
  </div>
  <div class="toolbar">
    <div class="chips" id="painelSitChips">${["Todas", "Vencido", "Próximo", "Correção solicitada", "Aberto"].map((f) => `<span class="chip ${f === painelSit ? "active": ""}" data-f="${f}">${f}</span>`).join("")}</div>
    <span class="spacer"></span>
    <span class="t-sub" style="margin-right:6px">Responsável</span>
    <select id="painelResp">${resps.map((r) => `<option ${r === painelResp ? "selected": ""}>${r}</option>`).join("")}</select>
  </div>
  <div class="card"><div class="table-wrap"><table class="tbl">
    <thead><tr><th>Item</th><th>Responsável</th><th>Prazo</th><th>Situação</th><th>Ação recomendada</th><th></th></tr></thead>
    <tbody id="painelRows"></tbody>
  </table></div></div>`;
};
VIEWS.painelOperacional.after = () => {
  const render = () => {
    const rows = painelOperacionalItens().filter((i) => (painelResp === "Todos" || i.responsavel === painelResp) && (painelSit === "Todas" || i.sit === painelSit));
    $("#painelRows").innerHTML = rows.length ? rows.map((it) => `<tr>
      <td><div class="t-main">${it.icon} ${it.titulo}</div><div class="t-sub">${it.tipo} · ${it.acao}</div></td>
      <td>${it.responsavel}</td>
      <td>${it.prazo ? fmtDate(it.prazo): "—"}</td>
      <td><span class="badge ${painelSitCls(it.sit)}">${it.sit}</span></td>
      <td class="t-sub">${it.acao}</td>
      <td><button class="btn btn-sm" onclick="location.hash='${it.rota}'">Abrir origem</button></td>
    </tr>`).join(""): `<tr><td colspan="6"><div class="t-sub" style="padding:10px">Nenhuma pendência com os filtros atuais. 🎉</div></td></tr>`;
  };
  $("#painelSitChips").addEventListener("click", (e) => { const c = e.target.closest(".chip"); if (!c) return; painelSit = c.dataset.f; $$("#painelSitChips.chip").forEach((x) => x.classList.toggle("active", x === c)); render(); });
  $("#painelResp").addEventListener("change", (e) => { painelResp = e.target.value; render(); });
  render();
};

/* =================== ENCERRAMENTO DO CICLO ANUAL =================== */
const SIT_ORD = { Vencido: 0, Próximo: 1, Aberto: 2 };
const sitBadge = (s) => `<span class="badge ${painelSitCls(s)}">${s}</span>`;
const ENCERR_TOP = 5; // pendências exibidas por padrão; o resto fica em "Ver todas"
let encerrVerTodas = false;
VIEWS.encerramento = () => {
  const ciclo = cicloEmFoco();
  const ativo = ciclo.status === "Ativo";
  const p = previaEncerramento(ciclo.id);
  const pctAtiv = p.atividades ? Math.round((p.atividadesConcluidas / p.atividades) * 100): 0;
  const pend = [...p.pendencias].sort((a, b) => SIT_ORD[a.situacao] - SIT_ORD[b.situacao]);
  const cnt = (s) => pend.filter((x) => x.situacao === s).length;
  const porTipo = {}; pend.forEach((x) => { porTipo[x.tipo] = (porTipo[x.tipo] || 0) + 1; });
  const mostra = encerrVerTodas ? pend: pend.slice(0, ENCERR_TOP);
  return head("", "Encerrar Ciclo Anual da Incubadora", "Prévia de encerramento do ciclo: consolida indicadores e atividades, lista <b>pendências remanescentes</b> e permite encerrar o ciclo anual — com possibilidade de <b>reabertura justificada</b>. Ao encerrar, os registros são preservados como histórico.")
  + `
  <div class="note" style="margin-bottom:16px"><span>🎯</span><div>Ciclo em foco<b>${ciclo.nome}</b> ${ativo?'<span class="badge badge-green">ativo</span>':'<span class="badge badge-slate">encerrado</span>'} — troque no <b>ponto central</b> em <a href="#/incubadora">Minha Incubadora</a>.</div></div>
  <div class="grid cols-3" style="margin-bottom:18px">
    ${stat("Atividades", p.atividadesConcluidas + "/" + p.atividades, pctAtiv + "% concluídas", "✅", pctAtiv===100?"green":"amber")}
    ${stat("Indicadores", p.indicadoresComMeta + "/" + p.indicadores, "com meta definida", "📊", "blue")}
    ${stat("Pendências", p.pendencias.length, "remanescentes", "⚠️", p.pendencias.length?"red":"green")}
  </div>

  <div class="card" style="margin-bottom:18px">
    <div class="card-head"><h3>Pendências remanescentes</h3><span class="sub">RegistrarPendenciasRemanescentesCicloAnual</span></div>
    <div class="card-pad">
      <div class="note ${pend.length?'warn':''}" style="margin:0 0 14px"><span>${pend.length?'⚠️':'✔'}</span><div>${pend.length?`Há <b>${pend.length} pendências remanescentes</b>. Todas são <b>registradas e preservadas</b> no histórico ao encerrar — abaixo, resumidas por situação/tipo e ordenadas pelas mais urgentes (vencidas primeiro).`:'Sem pendências remanescentes — ciclo pronto para encerramento.'}</div></div>
      ${pend.length?`
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
        ${cnt("Vencido")?sitBadge("Vencido")+` ${cnt("Vencido")}`:""}
        ${cnt("Próximo")?sitBadge("Próximo")+` ${cnt("Próximo")}`:""}
        ${cnt("Aberto")?sitBadge("Aberto")+` ${cnt("Aberto")}`:""}
        <span class="t-sub" style="margin-left:auto">Por tipo: ${Object.entries(porTipo).map(([t,n])=>`${t} (${n})`).join(" · ")}</span>
      </div>
      <table class="tbl"><thead><tr><th>Tipo</th><th>Pendência</th><th>Responsável</th><th>Situação</th></tr></thead>
        <tbody>${mostra.map(pd=>`<tr>
          <td><span class="badge badge-slate">${pd.tipo}</span></td>
          <td>${pd.descricao}</td><td>${pd.responsavel}</td>
          <td>${sitBadge(pd.situacao)}</td></tr>`).join("")}</tbody>
      </table>
      ${pend.length>ENCERR_TOP?`<div style="text-align:center;margin-top:10px"><button class="btn btn-sm" onclick="act.toggleEncerrPendencias()">${encerrVerTodas?"Ver menos":`Ver todas (${pend.length})`}</button></div>`:""}
      `:""}
    </div>
  </div>

  <div class="card card-pad">
    <h3 style="margin:0 0 4px">Encerramento</h3>
    <p class="t-sub" style="margin:0 0 14px">Encerrar consolida os indicadores do ano (<i>ConsolidarIndicadoresCicloAnual</i>) e bloqueia novas operações. Um ciclo encerrado pode ser <b>reaberto com justificativa</b> (<i>ReabrirCicloAnualComJustificativa</i>).</p>
    <div style="display:flex;gap:8px">
      ${ativo
        ? `<button class="btn btn-primary" onclick="act.encerrarCicloAnual('${ciclo.id}')">📦 Encerrar ciclo anual</button>`
: `<button class="btn" onclick="act.reabrirCicloAnual('${ciclo.id}')">↩ Reabrir com justificativa</button>`}
      <button class="btn" onclick="act.consolidarIndicadoresAnual('${ciclo.id}')">Ver consolidação dos indicadores</button>
    </div>
  </div>`;
};

/* =====================================================================
   AÇÕES (todas demonstrativas — exibem modal/toast, sem backend)
   ===================================================================== */
const FORM_NOTE = `<div class="note" style="margin-top:4px"><span>🧪</span><div>Tela de demonstração. Em produção, a confirmação dispararia o comando e registraria o evento correspondente.</div></div>`;
const confirmFooter = (msg) => `<button class="btn" data-close>Cancelar</button><button class="btn btn-primary" data-close onclick="toast('${msg}')">Confirmar</button>`;
// Footer que, ao cancelar/confirmar, REABRE uma tela anterior (ex.: voltar ao modal do empreendimento)
const voltarFooter = (msg, voltar) => `<button class="btn" onclick="${voltar}">Cancelar</button><button class="btn btn-primary" onclick="toast('${msg}');${voltar}">Confirmar</button>`;

const act = {
  /* Administrador da plataforma */
  incluirIncubadora(){openModal({title:"Incluir incubadora no produto",wide:true,body:`
    <div class="form-row">
      <div class="field"><label>Nome institucional</label><input placeholder="Ex.: Incubadora InovaES"></div>
      <div class="field"><label>CNPJ</label><input placeholder="00.000.000/0001-00"></div>
    </div>
    <div class="field"><label>Organização mantenedora</label><input placeholder="Ex.: Universidade / Instituto"></div>
    <div class="form-row">
      <div class="field"><label>Responsável inicial</label><input placeholder="Nome do responsável institucional"></div>
      <div class="field"><label>E-mail de contato</label><input placeholder="contato@incubadora.br"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Cidade/UF</label><input placeholder="Vitória/ES"></div>
      <div class="field"><label>Níveis CERNE adotados</label><select><option>CERNE 1</option><option>CERNE 1 e 2</option></select></div>
    </div>
    <div class="note" style="margin-top:4px"><span>🧪</span><div>Ao confirmar, o produto inclui a incubadora, associa o responsável inicial e a apresenta como organização existente (evento <b>IncubadoraIncluida</b>). Ela nasce <b>Aguardando ativação</b>.</div></div>`,
    footer:confirmFooter('Incubadora incluída · evento IncubadoraIncluida')});},
  verIncubadora(id){const i=DB.incubadoras.find(x=>x.id===id);openModal({title:i.nome,wide:true,body:`
    <div style="display:flex;gap:8px;margin-bottom:14px">${badge(i.status)}<span class="badge badge-blue">CERNE 1</span></div>
    <dl class="kv">
      <dt>Organização mantenedora</dt><dd>${i.mantenedora}</dd>
      <dt>Responsável inicial</dt><dd>${i.responsavel}</dd>
      <dt>Localização</dt><dd>${i.cidade}</dd>
      <dt>Usuários vinculados</dt><dd>${i.usuarios}</dd>
      <dt>Empreendimentos</dt><dd>${i.empreendimentos}</dd>
      <dt>Incluída em</dt><dd>${fmtDate(i.criadaEm)}</dd>
      <dt>Ativada em</dt><dd>${fmtDate(i.ativadaEm)}</dd>
    </dl>
    <p class="t-sub" style="margin-top:12px">Consulta da configuração institucional (ConsultarConfiguracaoIncubadora).</p>`});},
  configurarIncubadora(id){const i=DB.incubadoras.find(x=>x.id===id);openModal({title:"Configurar incubadora",wide:true,body:`
    <div class="form-row">
      <div class="field"><label>Nome institucional</label><input value="${i.nome}"></div>
      <div class="field"><label>Mantenedora</label><input value="${i.mantenedora}"></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Responsável institucional</label><input value="${i.responsavel}"></div>
      <div class="field"><label>Cidade/UF</label><input value="${i.cidade}"></div>
    </div>${FORM_NOTE}`,footer:confirmFooter('Configuração alterada · evento ConfiguracaoIncubadoraAlterada')});},
  ativarIncubadora(id){const i=DB.incubadoras.find(x=>x.id===id);const semResp=i.usuarios===0;openModal({title:"Ativar incubadora",body:`
    <p>Liberar <b>${i.nome}</b> para uso operacional?</p>
    <div class="note ${semResp?'warn':''}" style="margin-top:8px"><span>${semResp?'⚠️':'✔'}</span><div>${semResp?'É necessário um responsável institucional vinculado antes de ativar.':'Responsável institucional vinculado. O status passará a <b>Em operação</b>.'}</div></div>`,
    footer:semResp?`<button class="btn" data-close>Fechar</button>`:confirmFooter('Incubadora ativada · evento IncubadoraAtivada')});},
  suspenderIncubadora(id){const i=DB.incubadoras.find(x=>x.id===id);openModal({title:"Suspender incubadora",body:`
    <p>Suspender a operação de <b>${i.nome}</b>?</p>
    <div class="note warn" style="margin-top:8px"><span>⏸</span><div>Novas operações institucionais ficam impedidas, mas <b>todos os registros já produzidos são preservados</b>.</div></div>`,
    footer:confirmFooter('Incubadora suspensa · evento IncubadoraSuspensa')});},

  /* Gestor da incubadora */
  editarInc(){openModal({title:"Alterar configuração da incubadora",wide:true,body:`
    <div class="form-row">
      <div class="field"><label>Nome institucional</label><input value="${DB.incubadora.nome}"></div>
      <div class="field"><label>CNPJ</label><input value="${DB.incubadora.cnpj}"></div>
    </div>
    <div class="field"><label>Organização mantenedora</label><input value="${DB.incubadora.mantenedora}"></div>
    <div class="form-row">
      <div class="field"><label>Responsável institucional</label><input value="${DB.incubadora.responsavel}"></div>
      <div class="field"><label>Status</label><select><option>Em operação</option><option>Suspensa</option></select></div>
    </div>${FORM_NOTE}`,footer:confirmFooter('Configuração alterada · evento ConfiguracaoIncubadoraAlterada')});},
  suspenderInc(){openModal({title:"Suspender incubadora",body:`<p>Confirmar a suspensão operacional da <b>${DB.incubadora.nome}</b>? Os registros existentes são preservados.</p>${FORM_NOTE}`,footer:confirmFooter('Incubadora suspensa · evento IncubadoraSuspensa')});},
  /* Pôr um ciclo EM FOCO (escopo global de navegação) — reflete em Planejamento e Indicadores */
  focarCiclo(id){const c=DB.ciclos.find(x=>x.id===id);if(!c)return;setCicloFoco(id);toast(`Ciclo em foco: ${c.nome}`);},
  /* Manter ciclo de planejamento institucional (incluir ou alterar) */
  manterCiclo(id){const c=id?DB.ciclos.find(x=>x.id===id):null;openModal({title:(c?"Editar":"Novo")+" ciclo de planejamento",body:`
    <div class="field"><label>Nome do ciclo</label><input value="${c?c.nome:""}" placeholder="Ex.: Ciclo Anual 2027"></div>
    <div class="form-row">
      <div class="field"><label>Tipo de ciclo</label><select>${["Anual","Semestral","Por programa","Por edital","Por turma"].map(t=>`<option ${c&&c.tipo===t?"selected":""}>${t}</option>`).join("")}</select></div>
      <div class="field"><label>Status</label><select><option ${c&&c.status==="Ativo"?"selected":""}>Ativo</option><option ${c&&c.status==="Encerrado"?"selected":""}>Encerrado</option></select></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Início do período</label><input type="date" value="${c?c.inicio:""}"></div>
      <div class="field"><label>Fim do período</label><input type="date" value="${c?c.fim:""}"></div>
    </div>
    <div class="field"><label>Descrição</label><textarea placeholder="Recorte operacional do ciclo (ano, semestre, programa, edital…)"></textarea></div>
    <div class="note" style="margin-top:4px"><span>🗓</span><div>O ciclo é o <b>recorte operacional</b> que organiza práticas, atividades, responsáveis, prazos, evidências e indicadores. A geração do planejamento exige um ciclo <b>ativo</b>. Comando <b>ManterCicloPlanejamentoInstitucional</b>.</div></div>`,footer:confirmFooter('Ciclo mantido · evento CicloPlanejamentoInstitucionalMantido')});},
  /* Encerrar ciclo de planejamento institucional (cenário 5) */
  encerrarCiclo(id){const c=DB.ciclos.find(x=>x.id===id);openModal({title:"Encerrar ciclo de planejamento",body:`<p>Encerrar o ciclo <b>${c?c.nome:id}</b>?</p>
    <div class="note" style="margin:12px 0"><span>📦</span><div>O ciclo passa a <b>Encerrado</b> e <b>não recebe novas alterações operacionais</b>, mas os <b>registros vinculados</b> — planejamento, atividades, responsáveis, evidências e indicadores — são <b>preservados como histórico</b> (cenário 5).</div></div>${FORM_NOTE}`,footer:confirmFooter('Ciclo encerrado · evento CicloPlanejamentoInstitucionalEncerrado')});},
  adicionarUsuario(){openModal({title:"Adicionar usuário",body:`
    <div class="form-row">
      <div class="field"><label>Nome</label><input placeholder="Ex.: Pedro Nogueira"></div>
      <div class="field"><label>E-mail</label><input type="email" placeholder="pedro@incubadora.br"></div>
    </div>
    <div class="field"><label>Incubadora</label><select>${DB.incubadoras.map(i=>`<option>${i.nome}</option>`).join("")}</select></div>
    <div class="field"><label>Papel na incubadora</label><select><option>Gestor da Incubadora</option><option>Responsável pelo acompanhamento</option><option>Usuário externo (somente evidências)</option></select></div>
    <div class="note" style="margin-top:4px"><span>👤</span><div>Adicionar <b>identifica o usuário no produto</b> (por e-mail) e o <b>vincula à incubadora</b> com um papel — operação do <b>administrador da plataforma</b>. O vínculo é imediato (evento <b>UsuarioVinculadoIncubadora</b>). O <b>usuário externo</b> (mentor/consultor/avaliador) tem acesso restrito <b>somente à edição de evidências</b>.</div></div>`,footer:confirmFooter('Usuário vinculado · evento UsuarioVinculadoIncubadora')});},
  suspenderUsuario(email){openModal({title:"Suspender acesso",body:`<p>Suspender o acesso de <b>${email}</b>?</p>
    <div class="field"><label>Motivo</label><textarea placeholder="Motivo da suspensão (registrado na auditoria)"></textarea></div>
    <div class="note warn" style="margin-top:8px"><span>⏸</span><div>Operação do <b>administrador da plataforma</b> — comandos <b>SuspenderAcessoUsuario</b> + <b>RegistrarMotivoAlteracaoAcesso</b>. As sessões ativas são encerradas; os registros são preservados.</div></div>`,
    footer:confirmFooter('Acesso suspenso · evento AcessoUsuarioSuspenso')});},
  reativarUsuario(email){openModal({title:"Reativar acesso",body:`<p>Reativar o acesso de <b>${email}</b>?</p>
    <div class="note" style="margin-top:8px"><span>✔</span><div>Operação do <b>administrador da plataforma</b> — comando <b>ReativarAcessoUsuario</b>. O usuário volta a autenticar normalmente.</div></div>`,
    footer:confirmFooter('Acesso reativado · evento AcessoUsuarioReativado')});},

  /* */
  toggleNivel(n){toast(n===1?'O CERNE 1 é o nível base deste mockup':'Nível disponível para adoção futura');},
  novoProcesso(){openModal({title:"Manter processo CERNE",body:`
    <div class="field"><label>Nível CERNE</label><select><option>CERNE 1 – Empreendimento</option></select></div>
    <div class="form-row"><div class="field"><label>Nome do processo</label><input placeholder="Ex.: Pré-incubação"></div>
    <div class="field"><label>Ordem</label><input type="number" value="8"></div></div>
    <div class="field"><label>Descrição</label><textarea></textarea></div>${FORM_NOTE}`,footer:confirmFooter('Processo mantido · evento ProcessoCerneMantido')});},
  novaPratica(pid){const p=NUM(pid);openModal({title:"Manter prática CERNE",body:`
    <div class="field"><label>Processo</label><input value="${p.nome}" disabled></div>
    <div class="field"><label>Nome da prática</label><input placeholder="Ex.: Diagnóstico inicial do empreendimento"></div>
    <div class="field"><label>Descrição</label><textarea></textarea></div>${FORM_NOTE}`,footer:confirmFooter('Prática mantida')});},
  desativarProcesso(id){const p=NUM(id);openModal({title:"Desativar processo CERNE",body:`<p>Desativar o processo <b>${p?p.nome:id}</b>?</p>
    <div class="note" style="margin:12px 0"><span>📦</span><div>O processo deixa de ser usado em <b>novas configurações operacionais</b>, mas os <b>registros históricos</b> já vinculados a ele são <b>preservados</b>. As práticas vinculadas também deixam de ser oferecidas em novos planejamentos.</div></div>${FORM_NOTE}`,footer:confirmFooter('Processo desativado · evento ProcessoCerneDesativado')});},
  desativarPratica(id){const pr=PRAT(id);openModal({title:"Desativar prática CERNE",body:`<p>Desativar a prática <b>${pr?pr.nome:id}</b>?</p>
    <div class="note" style="margin:12px 0"><span>📦</span><div>A prática deixa de ser usada em <b>novas configurações operacionais</b>, preservando os <b>registros históricos</b> já vinculados a ela.</div></div>${FORM_NOTE}`,footer:confirmFooter('Prática desativada · evento PraticaCerneDesativada')});},
  desativarEvidenciaEsperada(id){const e=DB.evidenciasEsperadas.find(x=>x.id===id);openModal({title:"Desativar evidência esperada",body:`<p>Desativar a evidência esperada <b>${e?e.nome:id}</b>?</p>
    <div class="note" style="margin:12px 0"><span>📦</span><div>Deixa de ser exigida em <b>novos planejamentos, acompanhamentos ou registros</b>, preservando os <b>vínculos históricos</b> já existentes.</div></div>${FORM_NOTE}`,footer:confirmFooter('Evidência esperada desativada · evento EvidenciaEsperadaDesativada')});},
  desativarIndicadorMetodologia(id){const i=DB.indicadoresMetodologia.find(x=>x.id===id);openModal({title:"Desativar indicador CERNE",body:`<p>Desativar o indicador <b>${i?i.nome:id}</b>?</p>
    <div class="note" style="margin:12px 0"><span>📦</span><div>Deixa de ser usado em <b>novas metas, planejamentos ou acompanhamentos</b>, preservando os <b>registros históricos</b> já vinculados a ele.</div></div>${FORM_NOTE}`,footer:confirmFooter('Indicador desativado · evento IndicadorCerneDesativado')});},
  novaEvidenciaEsperada(id){const e=id?DB.evidenciasEsperadas.find(x=>x.id===id):null;openModal({title:"Manter evidência esperada",body:`
    <div class="field"><label>Prática CERNE vinculada</label><select>${DB.praticas.map(p=>`<option ${e&&e.pratica===p.id?"selected":""}>${p.nome}</option>`).join("")}</select></div>
    <div class="field"><label>Nome da evidência esperada</label><input value="${e?e.nome:""}" placeholder="Ex.: Ata da reunião de mentoria"></div>
    <div class="field"><label>Descrição</label><textarea>${e?"":""}</textarea></div>
    <div class="form-row">
      <div class="field"><label>Tipo de comprovação</label><select>${["Documento","Arquivo","Planilha","Formulário","Relatório","Imagem","Termo"].map(t=>`<option ${e&&e.tipo===t?"selected":""}>${t}</option>`).join("")}</select></div>
      <div class="field"><label>Obrigatória</label><select><option ${e&&e.obrig?"selected":""}>Sim</option><option ${e&&!e.obrig?"selected":""}>Não</option></select></div>
    </div>
    <div class="field"><label>Situação de uso</label><select><option>Ativa</option><option>Inativa</option></select></div>${FORM_NOTE}`,
    footer:confirmFooter('Evidência esperada mantida · evento EvidenciaEsperadaMantida')});},
  novoIndicadorMetodologia(id){const i=id?DB.indicadoresMetodologia.find(x=>x.id===id):null;openModal({title:"Manter indicador CERNE",wide:true,body:`
    <div class="field"><label>Nome do indicador</label><input value="${i?i.nome:""}" placeholder="Ex.: Nº de empreendimentos prospectados"></div>
    <div class="field"><label>Descrição</label><textarea></textarea></div>
    <div class="field"><label>Vínculo metodológico</label><select>
      <optgroup label="Nível"><option>CERNE 1 – Empreendimento</option></optgroup>
      <optgroup label="Processo">${DB.processos.map(p=>`<option ${i&&i.processo===p.id?"selected":""}>${p.nome}</option>`).join("")}</optgroup>
      <optgroup label="Prática">${DB.praticas.map(p=>`<option>${p.nome}</option>`).join("")}</optgroup>
    </select></div>
    <div class="form-row">
      <div class="field"><label>Unidade de medida</label><input value="${i?i.unidade:""}" placeholder="Ex.: un., %, h, R$"></div>
      <div class="field"><label>Periodicidade de acompanhamento</label><select>${["Mensal","Bimestral","Trimestral","Semestral","Anual","Por ciclo"].map(t=>`<option ${i&&i.periodicidade===t?"selected":""}>${t}</option>`).join("")}</select></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Forma de consolidação</label><select><option>Soma do período</option><option>Média do período</option><option>Acumulado no ciclo</option><option>Último valor apurado</option></select></div>
      <div class="field"><label>Situação de uso</label><select><option>Ativo</option><option>Inativo</option></select></div>
    </div>
    <div class="note" style="margin-top:4px"><span>📐</span><div>Indicador de <b>referência</b>. A definição de <b>metas</b> e o lançamento de <b>resultados</b> ocorrem por ciclo, reutilizando esta referência.</div></div>`,
    footer:confirmFooter('Indicador mantido · evento IndicadorCerneMantido')});},
  publicarMetodologia(){const m=DB.metodologiaPublicada;openModal({title:"Publicar metodologia CERNE",body:`<p>Publicar a metodologia gerando a versão <b>v1.3</b>?</p>
    <div class="field"><label>Publicado por <span class="t-sub">(gestor autenticado — capturado automaticamente,)</span></label><input value="${DB.incubadora.responsavel}" disabled></div>
    <div class="note" style="margin:12px 0"><span>ℹ️</span><div>O autor da publicação <b>não é atribuído à parte</b>: o produto grava <b>quem publicou</b> a versão (o gestor autenticado), como o <i>registradoPor</i> da evidência. É aqui — no ato de publicar — que esse vínculo é registrado.</div></div>
    <div class="note" style="margin:12px 0"><span>🔁</span><div>A v1.3 passa a ser a <b>referência operacional vigente</b>. A versão <b>v${m.versao}</b> deixa de ser vigente, mas é <b>preservada para consulta histórica</b> (cenário 3) — registros já vinculados a ela são mantidos.</div></div>${FORM_NOTE}`,footer:confirmFooter('Metodologia publicada · evento MetodologiaCernePublicada')});},
  verVersaoMetodologia(versao){const v=DB.versoesMetodologia.find((x)=>x.versao===versao);if(!v)return;const vig=v.situacao==="Vigente";openModal({title:`Metodologia CERNE v${v.versao}`,body:`<dl class="kv"><dt>Versão</dt><dd>${vig?badge("Publicado"):'<span class="badge badge-slate">Histórica</span>'} v${v.versao}</dd>
    <dt>Publicada em</dt><dd>${fmtDate(v.publicadaEm)}</dd><dt>Publicada por</dt><dd>${v.por}</dd><dt>Conteúdo</dt><dd>${v.resumo}</dd></dl>
    <div class="note" style="margin-top:12px"><span>${vig?"✅":"📚"}</span><div>${vig?"Versão <b>vigente</b> — referência operacional atual da incubadora.":"Versão <b>histórica</b> — disponível apenas para consulta; não compõe novos planejamentos ou metas."}</div></div>`,footer:`<button class="btn" data-close>Fechar</button><button class="btn btn-primary" onclick="act.visualizarVersaoMetodologia('${v.versao}')">Visualizar na tela</button>`});},
  /* Seleciona a versão de metodologia exibida na tela (vigente ou histórica) */
  visualizarVersaoMetodologia(versao){if(!DB.versoesMetodologia.find((v)=>v.versao===versao))return;metVersao=versao;closeModal();route();},

  /* */
  novoModelo(){openModal({title:"Novo modelo de planejamento",body:`
    <div class="field"><label>Nome do modelo</label><input placeholder="Ex.: Modelo de Aceleração"></div>
    <div class="form-row"><div class="field"><label>Periodicidade</label><select><option>Anual</option><option>Semestral</option><option>Por programa</option></select></div>
    <div class="field"><label>Base metodológica</label><input value="CERNE 1 (v1.2)" disabled></div></div>
    <div class="field"><label>Descrição</label><textarea></textarea></div>${FORM_NOTE}`,footer:confirmFooter('Modelo criado')});},
  verModelo(id){const m=DB.modelos.find(x=>x.id===id);openModal({title:m.nome,wide:true,body:`
    <dl class="kv"><dt>Status</dt><dd>${badge(m.status)} v${m.versao}</dd><dt>Periodicidade</dt><dd>${m.periodicidade}</dd>
    <dt>Metodologia de referência</dt><dd><span class="badge badge-blue">CERNE v${DB.metodologiaPublicada.versao}</span></dd>
    <dt>Estrutura</dt><dd>${m.processos} processos · ${m.atividades} atividades padrão</dd></dl>
    <h4 style="margin:16px 0 8px">Atividades padrão (cada uma ligada a uma prática da metodologia)</h4>
    <table class="tbl"><thead><tr><th>Prática (metodologia)</th><th>Atividade padrão (modelo)</th><th>Marco</th></tr></thead>
    <tbody>${DB.atividadesModelo.filter(a=>a.modelo===id).map(a=>`<tr><td><span class="t-sub">${procNome(a.processo)}</span><br>${pratNome(a.pratica)}</td><td class="t-main">${a.nome}</td><td>${a.marco}</td></tr>`).join("")||'<tr><td colspan="3" class="t-sub">Estrutura em elaboração.</td></tr>'}</tbody></table>`});},
  novaAtividadePadrao(prId){const pr=PRAT(prId);openModal({title:"Manter atividade padrão",body:`
    <div class="field"><label>Processo CERNE</label><input value="${procNome(pr.processo)}" disabled></div>
    <div class="field"><label>Prática CERNE (origem na metodologia)</label><input value="${pr.nome}" disabled></div>
    <div class="field"><label>Atividade padrão</label><input placeholder="Ex.: ${pr.nome.includes('capacita')?'Realizar oficina de modelagem de negócios':'Nova ação prevista'}"></div>
    <div class="form-row"><div class="field"><label>Marco / periodicidade</label><input placeholder="Ex.: 2º trimestre"></div>
    <div class="field"><label>Responsável padrão (pessoa)</label><select>${DB.equipe.map(p=>`<option>${p.nome}</option>`).join("")}</select></div></div>
    <div class="note" style="margin-top:4px"><span>🔗</span><div>A atividade fica vinculada à prática <b>${pr.nome}</b>. O <b>responsável padrão</b> é uma <b>pessoa da equipe</b>, sugerida ao gerar o ciclo — o gestor pode trocá-la por outra pessoa no planejamento.</div></div>`,
    footer:confirmFooter('Atividade padrão mantida · evento AtividadePadraoPlanejamentoMantida')});},
  desativarAtividadePadrao(id){const a=DB.atividadesModelo.find(x=>x.id===id);openModal({title:"Desativar atividade padrão",body:`<p>Desativar a atividade padrão <b>${a?a.nome:id}</b> do modelo?</p>
    <div class="note" style="margin:12px 0"><span>📦</span><div>Deixa de ser usada em <b>novos ciclos gerados a partir do modelo</b>, preservando os <b>registros históricos</b> dos ciclos que já a utilizaram.</div></div>${FORM_NOTE}`,footer:confirmFooter('Atividade padrão desativada · evento AtividadePadraoPlanejamentoDesativada')});},
  publicarModelo(id){openModal({title:"Publicar modelo",body:`<p>Publicar o modelo para que possa gerar planejamentos institucionais?</p>${FORM_NOTE}`,footer:confirmFooter('Modelo publicado')});},

  /* */
  gerarDeModelo(){const ativos=DB.ciclos.filter(c=>c.status==="Ativo");openModal({title:"Gerar planejamento a partir de modelo",body:`
    <div class="field"><label>Modelo publicado</label><select><option>Modelo Anual de Incubação · CERNE 1 (v2.0)</option></select></div>
    <div class="field"><label>Ciclo de destino <span class="t-sub">(somente ciclos ativos)</span></label><select>${ativos.map(c=>`<option>${c.nome}</option>`).join("")}</select></div>
    <div class="note" style="margin-top:4px"><span>⟳</span><div>A geração exige um <b>ciclo ativo</b>: o planejamento nasce <b>vinculado ao ciclo selecionado</b>. Serão criadas <b>9 atividades</b> a partir das <b>atividades padrão</b> do modelo (já ligadas às práticas da metodologia), prontas para ajuste de responsáveis e prazos.</div></div>`,footer:confirmFooter('Planejamento gerado e vinculado ao ciclo · evento PlanejamentoInstitucionalGerado')});},
  consultarPlano(){const p=planoDoCicloFoco();openModal({title:"Planejamento publicado · "+cicloEmFoco().nome,wide:true,body:`
    <dl class="kv"><dt>Ciclo</dt><dd>${cicloEmFoco().nome}</dd><dt>Status</dt><dd>${badge(p.status)}</dd><dt>Período</dt><dd>${fmtDate(p.inicio)} – ${fmtDate(p.fim)}</dd>
    <dt>Responsável</dt><dd>${p.responsavel}</dd><dt>Progresso</dt><dd>${p.progresso}%</dd></dl>
    <p class="t-sub" style="margin-top:12px">Planejamento disponível para acompanhamento operacional.</p>`});},
  ajustarAtividade(id){const a=DB.atividadesPlanejadas.find(x=>x.id===id);openModal({title:"Ajustar atividade planejada",body:`
    <div class="field"><label>Atividade</label><input value="${a.nome}"></div>
    <div class="form-row"><div class="field"><label>Responsável</label><select>
      <optgroup label="Equipe da incubadora">${DB.equipe.map(p=>`<option ${p.nome===a.responsavel?'selected':''}>${p.nome}</option>`).join("")}</optgroup>
      <optgroup label="Usuários das incubadas">${DB.empreendimentos.flatMap(e=>(e.pessoas||[]).filter(pp=>pp.principal).map(pp=>`<option ${pp.nome===a.responsavel?'selected':''}>${pp.nome} — ${e.nome}</option>`)).join("")}</optgroup>
    </select></div>
    <div class="field"><label>Prazo</label><input type="date" value="${a.prazo}"></div></div>
    <div class="form-row">
      <div class="field"><label>Escopo <span class="t-sub">(incubada)</span></label><select>
        <option ${!a.incubadaRef?'selected':''}>Institucional</option>
        ${DB.empreendimentos.map(e=>`<option ${a.incubadaRef===e.id?'selected':''}>${e.nome}</option>`).join("")}
      </select></div>
      <div class="field"><label>Status</label><select>${["Planejada","Em andamento","Concluída","Atrasada"].map(s=>`<option ${s===a.status?'selected':''}>${s}</option>`).join("")}</select></div>
    </div>
    <div class="note" style="margin-top:4px"><span>👤</span><div>Atividades referentes a uma incubada (anexar PDE, comprovar agregação de valor, monitoramento) trazem o <b>nome da incubada</b> em coluna própria; as demais ficam como <b>Institucional</b> (atividade da incubadora como um todo). O responsável pode ser um <b>usuário da incubada</b> — que anexa a evidência pela sua visão — ou o <b>responsável da incubadora</b>, quando a demanda é preenchida em nome da incubada.</div></div>`,footer:confirmFooter('Atividade ajustada · evento AtividadePlanejadaAjustada')});},
  /* Incluir atividade COMPLEMENTAR no ciclo (origem ≠ modelo) */
  incluirAtividadePlanejada(procId){const ciclo=cicloEmFoco();openModal({title:`Incluir atividade complementar <span class="t-sub">· ${ciclo.nome}</span>`,wide:true,body:`
    <div class="note" style="margin-bottom:12px"><span>➕</span><div>Atividade <b>complementar</b> incluída diretamente no ciclo<b>não</b> veio do modelo. Útil para ajustes do ano/semestre, programa, edital, turma ou prioridade institucional. Mantém vínculo a um <b>processo/prática CERNE</b> para rastreabilidade; origem fica marcada como <b>complementar</b>.</div></div>
    <div class="field"><label>Nome da atividade</label><input placeholder="Ex.: Workshop extra de pitch para a turma 2026"></div>
    <div class="field"><label>Descrição</label><textarea placeholder="O que será feito"></textarea></div>
    <div class="form-row">
      <div class="field"><label>Processo CERNE</label><select>${DB.processos.map(p=>`<option ${procId===p.id?"selected":""}>${p.nome}</option>`).join("")}</select></div>
      <div class="field"><label>Prática CERNE</label><select>${DB.praticas.map(p=>`<option>${p.nome}</option>`).join("")}</select></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Responsável <span class="t-sub"></span></label><select>${DB.equipe.map(p=>`<option>${p.nome}</option>`).join("")}</select></div>
      <div class="field"><label>Prazo <span class="t-sub"></span></label><input type="date"></div>
    </div>
    <div class="field"><label>Escopo <span class="t-sub">(incubada)</span></label><select>
      <option selected>Institucional</option>
      ${DB.empreendimentos.map(e=>`<option>${e.nome}</option>`).join("")}
    </select><div class="t-sub" style="margin-top:4px">Deixe em <b>Institucional</b> quando a atividade for da incubadora como um todo (não de um empreendimento específico).</div></div>
    <div class="field"><label>Posição no planejamento <span class="t-sub">(ordem de apresentação)</span></label><input type="number" placeholder="Ex.: 3"></div>${FORM_NOTE}`,
    footer:confirmFooter('Atividade complementar incluída no ciclo · evento AtividadePlanejadaIncluida')});},
  verEvidenciasAtividade(id){const a=DB.atividadesPlanejadas.find(x=>x.id===id);const evs=evidenciasDaAtividade(id);openModal({title:"Evidências da atividade",wide:true,body:`
    <p class="t-sub" style="margin:0 0 4px">${a.nome}</p>
    <div style="display:flex;gap:8px;margin-bottom:14px"><span class="badge badge-blue">${procNome(a.processo)}</span><span class="badge badge-purple">Prática: ${pratNome(a.pratica)}</span></div>
    <div class="note" style="margin-bottom:14px"><span>🔗</span><div>Estas evidências estão <b>vinculadas a esta atividade</b> (campo <code>evidencias.atividade = ${id}</code>,). O contador exibido no planejamento é a <b>contagem real</b> deste vínculo — não um número fixo.</div></div>
    ${evs.length?`<table class="tbl"><thead><tr><th>Evidência</th><th>Arquivo</th><th>Status</th><th></th></tr></thead>
    <tbody>${evs.map(e=>`<tr>
      <td><div class="t-main">${e.titulo}</div><div class="t-sub">${e.registradoPor} · ${fmtDate(e.data)}</div></td>
      <td><span class="badge badge-slate">📄 ${e.arquivo}</span></td><td>${badge(e.status)}</td>
      <td><button class="btn btn-sm" data-close onclick="act.verEvidencia('${e.id}')">Abrir</button></td></tr>`).join("")}</tbody></table>`
:'<p class="t-sub">Nenhuma evidência registrada para esta atividade ainda.</p>'}`});},

  /* */
  registrarExecucao(id){const a=DB.atividadesPlanejadas.find(x=>x.id===id);const evs=evidenciasDaAtividade(id);openModal({title:"Registrar execução de atividade",body:`
    <div class="field"><label>Atividade</label><input value="${a.nome}" disabled></div>
    <div class="field"><label>Situação</label><select>${["Concluída","Em andamento","Atrasada"].map(s=>`<option ${s===a.status?'selected':''}>${s}</option>`).join("")}</select></div>
    <div class="field"><label>Data de execução</label><input type="date"></div>
    ${evs.length?`<div class="field"><label>Evidências já vinculadas</label><div style="display:flex;flex-direction:column;gap:6px">${evs.map(e=>`<div style="display:flex;align-items:center;gap:8px"><span class="badge badge-slate">📄 ${e.arquivo}</span>${badge(e.status)}</div>`).join("")}</div></div>`:""}
    <div class="field"><label>Anexar evidência que comprova a execução (opcional)</label><input type="file"></div>
    <div class="field"><label>Observações</label><textarea></textarea></div>
    <div class="note" style="margin-top:4px"><span>🔗</span><div>A evidência anexada aqui é <b>criada já vinculada a esta atividade</b> (evento <b>EvidenciaRegistrada</b>) e passa a constar em <a href="#/evidencias">Evidências e Documentos</a> com status <b>“Em validação”</b> — é lá que ocorrem a validação, o versionamento e a solicitação de correção. Esta tela apenas <b>captura</b> a prova no momento da execução.</div></div>`,footer:confirmFooter('Execução registrada · evento ExecucaoAtividadeRegistrada')});},
  novaObservacao(){openModal({title:"Registrar observação / encaminhamento",body:`
    <div class="field"><label>Atividade relacionada</label><select>${DB.atividadesPlanejadas.map(a=>`<option>${a.nome}</option>`).join("")}</select></div>
    <div class="field"><label>Tipo</label><select><option>Observação</option><option>Encaminhamento</option></select></div>
    <div class="field"><label>Texto</label><textarea></textarea></div>${FORM_NOTE}`,footer:confirmFooter('Observação registrada')});},

  /* */
  registrarEvidencia(){openModal({title:"Registrar evidência de execução",wide:true,body:`
    <div class="field"><label>Atividade executada</label><select>${DB.atividadesPlanejadas.map(a=>`<option>${a.nome}</option>`).join("")}</select></div>
    <div class="form-row"><div class="field"><label>Processo CERNE</label><select>${DB.processos.map(p=>`<option>${p.nome}</option>`).join("")}</select></div>
    <div class="field"><label>Prática</label><select>${DB.praticas.map(p=>`<option>${p.nome}</option>`).join("")}</select></div></div>
    <div class="field"><label>Título da evidência</label><input placeholder="Ex.: Ata da reunião de mentoria"></div>
    <div class="field"><label>Documento</label><input type="file"></div>${FORM_NOTE}`,footer:confirmFooter('Evidência registrada · evento EvidenciaRegistrada')});},
  verEvidencia(id){const e=DB.evidencias.find(x=>x.id===id);const pr=DB.praticas.find(p=>p.id===e.pratica);openModal({title:e.titulo,body:`
    <dl class="kv"><dt>Status</dt><dd>${badge(e.status)}</dd><dt>Arquivo</dt><dd>📄 ${e.arquivo}</dd>
    <dt>Processo</dt><dd>${procNome(e.processo)}</dd><dt>Prática</dt><dd>${pr?pr.nome:'—'}</dd>
    <dt>Registrado por</dt><dd>${e.registradoPor} · ${fmtDate(e.data)}</dd></dl>
    <h4 style="margin:16px 0 8px">Histórico</h4>
    <div class="timeline"><div class="tl-item green"><div class="tlt">${e.status}</div><div class="tld">${fmtDate(e.data)}</div></div></div>`,
    footer:`<button class="btn" data-close>Fechar</button>${e.status!=="Validada"
      ?`<button class="btn" data-close onclick="toast('Correção solicitada · evento EvidenciaRejeitada')">Rejeitar / solicitar correção</button><button class="btn btn-primary" data-close onclick="toast('Evidência validada · evento EvidenciaValidada')">Validar</button>`
:`<button class="btn" data-close onclick="toast('Validação cancelada · evento ValidacaoEvidenciaCancelada')">Cancelar validação</button>`}`});},
  validarEvidencia(id){const e=DB.evidencias.find(x=>x.id===id);openModal({title:"Validar evidência",body:`<p>Validar a evidência <b>${e.titulo}</b>?</p>${FORM_NOTE}`,footer:confirmFooter('Evidência validada · evento EvidenciaValidada')});},
  rejeitarEvidencia(id){const e=DB.evidencias.find(x=>x.id===id);openModal({title:"Rejeitar / solicitar correção",body:`<p>Rejeitar a evidência <b>${e?e.titulo:id}</b> e solicitar correção?</p>
    <div class="field" style="margin-top:8px"><label>Motivo / o que corrigir</label><textarea placeholder="Ex.: documento ilegível, falta assinatura, prática incorreta"></textarea></div>
    <div class="note" style="margin:12px 0"><span>✎</span><div>A evidência passa a <b>“Correção solicitada”</b> e volta para o responsável ajustar (Cenário 3). Comando <b>RejeitarEvidenciaDocumental</b>.</div></div>${FORM_NOTE}`,footer:confirmFooter('Correção solicitada · evento EvidenciaRejeitada')});},
  cancelarValidacaoEvidencia(id){const e=DB.evidencias.find(x=>x.id===id);openModal({title:"Cancelar validação",body:`<p>Cancelar a validação da evidência <b>${e?e.titulo:id}</b>?</p>
    <div class="note" style="margin:12px 0"><span>↩️</span><div>Reabre uma evidência <b>já validada</b> para nova análise/correção — é o que permite <b>invalidar</b> uma evidência. Sem isso, evidências validadas <b>não podem ser alteradas diretamente</b> (Cenários 8 e 9). Comando <b>CancelarValidacaoEvidenciaDocumental</b>.</div></div>${FORM_NOTE}`,footer:confirmFooter('Validação cancelada · evento ValidacaoEvidenciaCancelada')});},
  removerEvidencia(id){const e=DB.evidencias.find(x=>x.id===id);openModal({title:"Remover evidência",body:`<p>Remover a evidência <b>${e?e.titulo:id}</b>?</p>
    <div class="note" style="margin:12px 0"><span>🗑️</span><div>A remoção só é permitida quando a evidência <b>ainda não possui validação, versão posterior ou consolidação</b> associada. Caso contrário, ela é mantida.</div></div>${FORM_NOTE}`,footer:confirmFooter('Evidência removida · evento EvidenciaExecucaoAtividadeRemovida')});},

  /* Gerar indicadores do ciclo a partir do catálogo da metodologia — análogo ao "Gerar de modelo" */
  gerarIndicadoresDoCiclo(){const cic=cicloEmFoco();
    const noCiclo=indicadoresDoCiclo(cic.id).filter(indDerivado).map(i=>i.nome);
    const pend=DB.indicadoresMetodologia.filter(m=>!noCiclo.includes(m.nome));
    openModal({title:`Gerar indicadores do ciclo com base na metodologia <span class="t-sub">· ${cic.nome}</span>`,wide:true,body:`
    <div class="note" style="margin-bottom:12px"><span>⟳</span><div>Gera os <b>indicadores do ciclo</b> a partir do <b>catálogo da metodologia</b> — como o <i>"Gerar de modelo"</i> do Planejamento cria as atividades. Cada indicador do catálogo ainda ausente em <b>${cic.nome}</b> vira uma <b>instância deste ciclo</b> (com meta e resultados próprios); o catálogo permanece intacto e outros ciclos não são afetados. A <b>meta</b> é definida depois.</div></div>
    ${pend.length?`<div class="t-sub" style="margin-bottom:6px">${pend.length} indicador(es) serão gerados em ${cic.nome}</div>
    <div class="card"><div class="table-wrap"><table class="tbl">
      <thead><tr><th>Indicador</th><th>Vínculo CERNE</th><th>Unidade · periodicidade</th></tr></thead>
      <tbody>${pend.map(m=>`<tr><td class="t-main">${m.nome}</td><td class="t-sub">${procNome(m.processo)}</td><td class="t-sub">${m.unidade} · ${m.periodicidade}</td></tr>`).join("")}</tbody>
    </table></div></div>`
:`<div class="note"><span>✓</span><div>Todos os indicadores do catálogo já estão no ciclo <b>${cic.nome}</b> — nada a gerar.</div></div>`}`,
    footer:pend.length?confirmFooter(`${pend.length} indicador(es) gerados no ciclo a partir da metodologia · evento IndicadorDoCicloDefinido`):""});},
  /* Adotar indicador do catálogo da metodologia (derivado) */
  adotarIndicadorMetodologia(id){const i=id?DB.indicadores.find(x=>x.id===id):null;const cic=DB.ciclos.find(c=>c.id===(i?i.ciclo:cicloFoco))||cicloEmFoco();openModal({title:`${i?"Editar":"Adotar"} indicador da metodologia <span class="t-sub">· ${cic.nome}</span>`,wide:true,body:`
    ${i
      ? `<div class="field"><label>Indicador de referência (metodologia)</label><input value="${i.nome}" disabled></div>
         <div class="form-row">
           <div class="field"><label>Vínculo CERNE</label><input value="${procNome(i.processo)} · ${pratNome(i.pratica)}" disabled></div>
           <div class="field"><label>Unidade · periodicidade</label><input value="${i.unidade} · ${i.periodicidade}" disabled></div>
         </div>`
: `<div class="field"><label>Indicador de referência (catálogo da metodologia)</label><select>${DB.indicadoresMetodologia.map(m=>`<option>${m.nome} — ${procNome(m.processo)} · ${m.unidade} · ${m.periodicidade}</option>`).join("")}</select></div>
         <div class="note" style="margin:8px 0"><span>📐</span><div>Nome, vínculo, unidade e periodicidade são <b>herdados</b> do catálogo — você só define a situação no ciclo. Cria-se uma <b>instância para <i>${cic.nome}</i></b> (com meta e resultados próprios); o indicador <b>continua no catálogo</b> e <b>outros ciclos não são afetados</b> — como "Gerar de modelo" no Planejamento.</div></div>`}
    <div class="field"><label>Situação no ciclo</label><select><option ${i&&i.situacao==="Ativo"?"selected":""}>Ativo</option><option ${i&&i.situacao&&i.situacao!=="Ativo"?"selected":""}>Inativo</option></select></div>
    <div class="note" style="margin-top:4px"><span>🧭</span><div>Adotar <b>traz um indicador da metodologia para o ciclo</b> sem redigitá-lo — o de referência permanece intacto. A meta e os resultados ficam nas outras abas. O <b>responsável não é atribuído aqui</b>: fica gravado quem registrar cada resultado, como nas evidências.</div></div>`,
    footer:confirmFooter('Indicador do ciclo definido · evento IndicadorDoCicloDefinido')});},
  /* Definir indicador COMPLEMENTAR (necessidade gerencial, criado no ciclo) */
  definirIndicadorComplementar(id){const i=id?DB.indicadores.find(x=>x.id===id):null;const cic=DB.ciclos.find(c=>c.id===(i?i.ciclo:cicloFoco))||cicloEmFoco();openModal({title:`${i?"Editar":"Definir"} indicador complementar <span class="t-sub">· ${cic.nome}</span>`,wide:true,body:`
    <div class="note" style="margin-bottom:12px"><span>✨</span><div>Indicador <b>complementar</b>: criado para uma <b>necessidade gerencial</b> da incubadora, fora do catálogo da metodologia. Mantém vínculo a um processo/prática CERNE para rastreabilidade.</div></div>
    <div class="field"><label>Nome do indicador</label><input value="${i?i.nome:""}" placeholder="Ex.: Satisfação dos incubados (NPS)"></div>
    <div class="field"><label>Descrição</label><textarea placeholder="O que o indicador mede e como é apurado"></textarea></div>
    <div class="field"><label>Vínculo metodológico CERNE <span class="t-sub">(obrigatório)</span></label><select>
      <optgroup label="Processo">${DB.processos.map(p=>`<option ${i&&i.processo===p.id?"selected":""}>${p.nome}</option>`).join("")}</optgroup>
    </select></div>
    <div class="field"><label>Prática CERNE</label><select>
      ${DB.praticas.map(p=>`<option ${i&&i.pratica===p.id?"selected":""}>${p.nome}</option>`).join("")}
    </select></div>
    <div class="form-row">
      <div class="field"><label>Unidade de medida</label><input value="${i?i.unidade:""}" placeholder="Ex.: un., %, h, pts"></div>
      <div class="field"><label>Periodicidade de apuração</label><select>${["Mensal","Bimestral","Trimestral","Semestral","Anual","Por ciclo"].map(t=>`<option ${i&&i.periodicidade===t?"selected":""}>${t}</option>`).join("")}</select></div>
    </div>
    <div class="field"><label>Situação no ciclo</label><select><option ${i&&i.situacao==="Ativo"?"selected":""}>Ativo</option><option ${i&&i.situacao&&i.situacao!=="Ativo"?"selected":""}>Inativo</option></select></div>
    <div class="note" style="margin-top:4px"><span>🧭</span><div>O <b>responsável não é atribuído aqui</b>: como nas evidências, fica gravado quem registrar cada resultado na <b>Apuração de Indicadores</b>.</div></div>`,
    footer:confirmFooter('Indicador do ciclo definido · evento IndicadorDoCicloDefinido')});},
  desativarIndicadorCiclo(id){const i=DB.indicadores.find(x=>x.id===id);openModal({title:"Desativar indicador do ciclo",body:`<p>Desativar o indicador <b>${i?i.nome:id}</b> no ciclo?</p>
    <div class="note" style="margin:12px 0"><span>📦</span><div>Deixa de ser acompanhado no ciclo, <b>preservando o histórico</b> de metas e resultados já registrados. Diferente da metodologia, este é um indicador <b>do ciclo</b>.</div></div>${FORM_NOTE}`,footer:confirmFooter('Indicador do ciclo desativado · evento IndicadorDoCicloDesativado')});},
  definirMeta(indId){const i=DB.indicadores.find(x=>x.id===indId);const per=i.tipoMeta==="periodica";openModal({title:(temMeta(i)?"Editar":"Definir")+" meta do indicador",wide:true,body:`
    <div class="field"><label>Indicador</label><input value="${i.nome}" disabled></div>
    <div class="form-row">
      <div class="field"><label>Vínculo metodológico</label><input value="${procNome(i.processo)} · ${pratNome(i.pratica)}" disabled></div>
      <div class="field"><label>Unidade · periodicidade</label><input value="${i.unidade} · ${i.periodicidade}" disabled></div>
    </div>
    <div class="field"><label>Tipo de meta</label><select>
      <option ${i.tipoMeta==="global"?"selected":""}>Global do ciclo (um valor para todo o período)</option>
      <option ${per?"selected":""}>Por período de apuração</option></select></div>
    ${per
      ? `<label class="t-sub" style="display:block;margin-bottom:6px">Meta e <b>janela de apuração</b> por período (${i.periodicidade.toLowerCase()})</label>
         <div class="table-wrap"><table class="tbl">
           <thead><tr><th>Período</th><th>Meta (${i.unidade})</th><th>Apuração — início</th><th>Apuração — fim</th></tr></thead>
           <tbody>${periodosDe(i).map(p=>{const j=janelaDe(i,p);return `<tr>
             <td class="t-main">${p.nome} <span class="t-sub">(${p.id})</span></td>
             <td><input type="number" style="width:84px" value="${i.metas?i.metas[p.id]:""}" placeholder="0"></td>
             <td><input type="date" value="${j.inicio}"></td>
             <td><input type="date" value="${j.fim}"></td>
           </tr>`;}).join("")}</tbody>
         </table></div>
         <div class="t-sub" style="margin-top:6px">A <b>janela de apuração</b> define quando o resultado daquele período pode ser registrado; o <b>fim</b> da janela é o prazo que aciona a pendência. Por padrão é o próprio período, mas pode ser ajustada por período.</div>`
: `<div class="field"><label>Valor esperado (todo o ciclo)</label><input type="number" value="${i.metaGlobal!=null?i.metaGlobal:""}" placeholder="0"></div>`}
    <div class="note" style="margin-top:8px"><span>🎯</span><div>Ao confirmar, a meta e as <b>janelas de apuração</b> ficam vinculadas ao indicador e ao ciclo, preservando o vínculo com processo/prática CERNE (evento <b>MetaIndicadorDoCicloDefinida</b>). Só após a meta definida é possível registrar resultados — o responsável de cada lançamento é quem o registra.</div></div>`,
    footer:confirmFooter('Meta definida · evento MetaIndicadorDoCicloDefinida')});},

  /* Painel do indicador: um único ponto de entrada por indicador,
     listando todos os seus períodos para registrar/editar resultado. */
  registrarResultadosIndicador(indId){
    const i=DB.indicadores.find(x=>x.id===indId);
    const ed=true; // ações sempre disponíveis
    if(!temMeta(i)){if(ed)return act.definirMeta(indId);}
    // Quem registrou o resultado do período (como o registradoPor da evidência,)
    const regCell=(pid)=>{const r=(i.registros||{})[pid];return r?`<div class="t-sub">${r.por}</div><div class="t-sub">${fmtDate(r.data)}</div>`:`<span class="t-sub"></span>`;};
    const linhaPeriodo=(p)=>{
      const jan=janelaDe(i,p);
      const v=(i.resultados||{})[p.id];
      const meta=i.metas?i.metas[p.id]:null;
      let status,btn;
      if(v!=null){status=`<span class="badge badge-green">✓ ${v} ${i.unidade}</span>`;btn=`<button class="btn btn-sm" onclick="act.registrarResultado('${i.id}','${p.id}')">Editar</button>`;}
      else if(periodoFuturo(jan)){status=`<span class="t-sub">apuração não aberta</span>`;btn=`<button class="btn btn-sm" onclick="act.registrarResultado('${i.id}','${p.id}')">Registrar</button>`;}
      else if(periodoEncerrado(jan)){status=`<span class="badge badge-amber">pendente</span>`;btn=`<button class="btn btn-sm btn-warn" onclick="act.registrarResultado('${i.id}','${p.id}')">Registrar</button>`;}
      else{status=`<span class="t-sub">em apuração</span>`;btn=`<button class="btn btn-sm btn-primary" onclick="act.registrarResultado('${i.id}','${p.id}')">Registrar</button>`;}
      if(!ed)btn=`<span class="t-sub">histórico</span>`;
      return `<tr><td class="t-main">${p.nome}</td><td class="t-sub">${fmtDate(jan.inicio)} – ${fmtDate(jan.fim)}</td><td>${meta!=null?meta+" "+i.unidade:"—"}</td><td>${status}</td><td>${regCell(p.id)}</td><td style="text-align:right">${btn}</td></tr>`;
    };
    const corpoGlobal=()=>{const tem=resultadoTotal(i)>0;return `<tr>
      <td class="t-main">Apuração única do ciclo</td><td class="t-sub">${fmtDate(cicloEmFoco().inicio)} – ${fmtDate(cicloEmFoco().fim)}</td><td>${i.metaGlobal} ${i.unidade}</td>
      <td>${tem?`<span class="badge badge-green">✓ ${resultadoTotal(i)} ${i.unidade}</span>`:`<span class="t-sub">a apurar no encerramento</span>`}</td>
      <td>${regCell("Ciclo")}</td>
      <td style="text-align:right">${ed?`<button class="btn btn-sm ${tem?"":"btn-primary"}" onclick="act.registrarResultado('${i.id}','Ciclo')">${tem?"Editar":"Registrar"}</button>`:`<span class="t-sub">histórico</span>`}</td></tr>`;};
    openModal({title:`Resultados — ${i.nome}${ed?"":' <span class="t-sub">· histórico (ciclo encerrado)</span>'}`,wide:true,body:`
      <dl class="kv">
        <dt>Vínculo CERNE</dt><dd>${procNome(i.processo)} · ${pratNome(i.pratica)}</dd>
        <dt>Unidade · periodicidade</dt><dd>${i.unidade} · ${i.periodicidade}</dd>
        <dt>Meta do ciclo</dt><dd>${metaTotal(i)} ${i.unidade} ${i.tipoMeta==="global"?'<span class="t-sub">· global</span>':'<span class="t-sub">· somatório dos períodos</span>'}</dd>
      </dl>
      <h4 style="margin:16px 0 8px">Resultados por período</h4>
      <div class="table-wrap"><table class="tbl">
        <thead><tr><th>Período</th><th>Janela de apuração</th><th>Meta</th><th>Resultado</th><th>Registrado por</th><th></th></tr></thead>
        <tbody>${i.tipoMeta==="global"?corpoGlobal():periodosDe(i).map(linhaPeriodo).join("")}</tbody>
      </table></div>
      <div class="note" style="margin-top:14px"><span>🔗</span><div>Cada lançamento registra o resultado do <b>período</b> e permite vincular evidência/atividade; a <b>validação</b> ocorre na. Evento <b>ResultadoIndicadorRegistrado</b>.</div></div>`,
      footer:`<button class="btn btn-primary" data-close>Concluir</button>`});},
  /* Registrar resultado periódico (grava quem registrou, como na evidência) */
  registrarResultado(indId,periodoId){
    const i=indId?DB.indicadores.find(x=>x.id===indId):null;
    const p=periodoId&&periodoId!=="Ciclo"?findPeriodo(periodoId):null;
    const valAtual=i&&p?(i.resultados||{})[p.id]:(i?resultadoTotal(i):null);
    const editar=valAtual!=null;
    const metaPer=i?(i.tipoMeta==="global"?i.metaGlobal:(i.metas?i.metas[periodoId]:null)):null;
    openModal({title:(editar?"Editar":"Registrar")+" resultado de indicador",body:`
    <div class="field"><label>Indicador</label>${i?`<input value="${i.nome}" disabled>`:`<select>${indicadoresDoCiclo(cicloEmFoco().id).filter(temMeta).map(x=>`<option>${x.nome}</option>`).join("")}</select>`}</div>
    <div class="form-row">
      <div class="field"><label>Período de referência</label>${p?`<input value="${p.nome} (${fmtDate(p.inicio)} – ${fmtDate(p.fim)})" disabled>`:periodoId==="Ciclo"?`<input value="Apuração única do ciclo" disabled>`:`<select>${(i?periodosDe(i):DB.periodosPorTipo.Trimestral).map(x=>`<option>${x.nome}</option>`).join("")}</select>`}</div>
      <div class="field"><label>Meta do período</label><input value="${metaPer!=null?metaPer+" "+(i?i.unidade:""):"—"}" disabled></div>
    </div>
    <div class="form-row">
      <div class="field"><label>Valor realizado</label><input type="number" value="${valAtual!=null?valAtual:""}" placeholder="0"></div>
      <div class="field"><label>Data de apuração</label><input type="date"></div>
    </div>
    <div class="field"><label>Responsável pelo registro <span class="t-sub">(quem está lançando)</span></label><select>${DB.equipe.map(m=>`<option>${m.nome}</option>`).join("")}</select></div>
    <div class="field"><label>Vincular a evidência (opcional)</label><select><option></option>${DB.evidencias.map(e=>`<option>${e.titulo}</option>`).join("")}</select></div>
    <div class="field"><label>Vincular a atividade CERNE (opcional)</label><select><option></option>${DB.atividadesPlanejadas.map(a=>`<option>${a.nome}</option>`).join("")}</select></div>
    <div class="field"><label>Observação justificativa</label><textarea></textarea></div>
    <div class="note" style="margin-top:4px"><span>🔗</span><div>O resultado é vinculado à <b>meta do mesmo período</b>, mantém rastreabilidade com ciclo, processo e prática e <b>grava quem registrou</b> (como na evidência,) — evento <b>ResultadoIndicadorRegistrado</b>. A <b>validação</b> do resultado ocorre em história própria.</div></div>`,
    footer:confirmFooter('Resultado registrado · evento ResultadoIndicadorRegistrado')});},

  /* */
  manterEmpreendimento(id){const e=id?DB.empreendimentos.find(x=>x.id===id):null;openModal({title:(e?"Editar":"Incluir")+" empreendimento apoiado",wide:true,body:`
    <div class="field"><label>Nome do empreendimento</label><input value="${e?e.nome:""}" placeholder="Ex.: XPTO Tecnologia"></div>
    <div class="form-row"><div class="field"><label>Setor</label><input value="${e?e.setor:""}" placeholder="Ex.: Healthtech"></div>
    <div class="field"><label>Modalidade física <span class="t-sub">(residência na incubadora)</span></label><select>${["Residente","Não residente","Virtual"].map(m=>`<option ${e&&e.modalidadeFisica===m?"selected":""}>${m}</option>`).join("")}</select></div></div>
    <div class="form-row"><div class="field"><label>Estágio</label><select>${["Ideação","Validação","Tração","Operação","Graduação"].map(s=>`<option ${e&&e.estagio===s?"selected":""}>${s}</option>`).join("")}</select></div>
    <div class="field"><label>Situação operacional</label><select>${["Em análise","Ativo","Graduado","Suspenso"].map(s=>`<option ${e&&e.situacao===s?"selected":""}>${s}</option>`).join("")}</select></div></div>
    <div class="form-row"><div class="field"><label>Responsável interno <span class="t-sub">(equipe da incubadora · acompanhamento,)</span></label><select>${DB.equipe.map(p=>`<option ${e&&e.responsavel===p.nome?"selected":""}>${p.nome}</option>`).join("")}</select></div>
    <div class="field"><label>Ciclo de apoio</label><select>${DB.ciclos.map(c=>`<option ${(e?e.ciclo===c.id:c.status==="Ativo")?"selected":""}>${c.nome}</option>`).join("")}</select></div></div>
    <div class="note" style="margin-top:4px"><span>👥</span><div>A <b>equipe, sócios e responsáveis do empreendimento</b> (incl. o <b>contato principal</b> perante a incubadora) são mantidos à parte${e?` (${e.pessoas.length} pessoa(s) hoje)`:""}. Aqui ficam apenas os dados básicos e o responsável <b>interno</b>.</div></div>${FORM_NOTE}`,
    footer:confirmFooter(e?'Dados do empreendimento atualizados · evento DadosEmpreendimentoMantidos':'Empreendimento incluído no portfólio')});},
  verEmpreendimento(id,gerir){const e=DB.empreendimentos.find(x=>x.id===id);const principal=(e.pessoas||[]).find(p=>p.principal);const repLegal=(e.pessoas||[]).find(p=>p.papel==="Representante legal");const cic=DB.ciclos.find(c=>c.id===e.ciclo)||cicloAtivo();const ed=true;const canEdit=!!gerir;openModal({title:e.nome,wide:true,body:`
    <div style="display:flex;gap:8px;margin-bottom:14px">${badge(e.situacao)}<span class="badge badge-slate">${e.estagio}</span><span class="badge badge-blue">${e.modalidade}</span><span class="badge badge-purple">${e.modalidadeFisica}</span></div>
    <dl class="kv"><dt>Setor</dt><dd>${e.setor}</dd><dt>Ciclo de apoio</dt><dd>${cic.nome} ${ed?'':'<span class="badge badge-slate">encerrado</span>'}</dd><dt>Entrada</dt><dd>${fmtDate(e.entrada)}</dd></dl>
    <h4 style="margin:16px 0 8px">Monitoramento — eixos CERNE <span class="t-sub"></span></h4>
    ${monitSnapshotEmp(e.id)}
    <p class="t-sub" style="margin:8px 0 0">Situação por eixo e recomendação do <b>último monitoramento</b>. Histórico e radar de evolução em <a href="#/monitoramento">Monitoramento das Incubadas</a>.</p>
    <div class="note" style="margin:14px 0"><span>👤</span><div><b>Três papéis distintos</b> deste empreendimento<br>
      • <b>Responsável interno</b> — pessoa da <b>equipe da incubadora</b> que acompanha o empreendimento. <i>Não</i> é do empreendimento.<br>
      • <b>Contato principal</b> — pessoa <b>do empreendimento</b> que <b>fala com a incubadora</b> no dia a dia (recebe o selo <span class="badge badge-blue" style="margin:0">principal</span>).<br>
      • <b>Representante legal</b> — pessoa <b>do empreendimento</b> que <b>responde juridicamente</b> por ele perante terceiros.</div></div>
    <dl class="kv">
      <dt>Responsável interno <span class="t-sub">(incubadora · acompanhamento)</span></dt><dd>${e.responsavel} <span class="t-sub">— altere em “Editar dados”</span></dd>
      <dt>Contato principal <span class="t-sub">(pessoa do empreendimento · fala com a incubadora)</span></dt><dd>${principal?`${principal.nome} <span class="t-sub">· ${principal.papel}</span>`:'<span class="t-sub">não definido</span>'} ${canEdit?`<button class="btn btn-sm" style="margin-left:6px" onclick="act.definirResponsavelPrincipalEmpreendimento('${e.id}')">${principal?'Alterar':'Definir'} contato</button>`:''}</dd>
      <dt>Representante legal <span class="t-sub">(pessoa do empreendimento · responde juridicamente)</span></dt><dd>${repLegal?`${repLegal.nome}`:'<span class="t-sub">não definido</span>'} ${canEdit?`<button class="btn btn-sm" style="margin-left:6px" onclick="act.definirRepresentanteLegalEmpreendimento('${e.id}')">${repLegal?'Alterar':'Definir'} rep. legal</button>`:''}</dd>
    </dl>
    <div class="toolbar" style="margin:16px 0 8px"><h4 style="margin:0">Equipe, sócios e responsáveis do empreendimento <span class="t-sub"></span></h4>
      <span class="spacer"></span>
      ${canEdit?`<button class="btn btn-sm btn-primary" onclick="act.manterPessoaEmpreendimento('${e.id}')">+ Incluir pessoa</button>`:`<span class="t-sub">somente consulta · use <b>Gerenciar</b> para editar</span>`}</div>
    <div class="card"><div class="table-wrap"><table class="tbl">
      <thead><tr><th>Pessoa</th><th>Papel</th><th>Contato</th><th>Situação</th>${canEdit?"<th></th>":""}</tr></thead>
      <tbody>${(e.pessoas||[]).map((p,idx)=>`<tr>
        <td class="t-main">${p.nome} ${p.principal?'<span class="badge badge-blue" style="margin-left:4px">principal</span>':""}</td>
        <td>${p.papel}</td><td class="t-sub">${p.contato}</td><td>${badge(p.situacao)}</td>
        ${canEdit?`<td style="white-space:nowrap"><button class="btn btn-sm" onclick="act.manterPessoaEmpreendimento('${e.id}',${idx})">Editar</button>
        <button class="btn btn-sm" onclick="act.removerPessoaEmpreendimento('${e.id}',${idx})">Remover</button></td>`:""}</tr>`).join("")}</tbody>
    </table></div></div>`,
    footer:`<button class="btn" data-close>Fechar</button>${canEdit?`<button class="btn" onclick="act.manterEmpreendimento('${e.id}')">Editar dados</button><button class="btn btn-primary" data-close onclick="toast('Situação operacional atualizada · evento SituacaoEmpreendimentoAtualizada')">Atualizar situação</button>`:""}`});},
  /* Manter equipe, sócios e responsáveis do empreendimento */
  PAPEIS_EMPREENDIMENTO:["Sócio(a)-fundador(a)","Sócio(a)","Representante legal","Responsável técnico","Responsável operacional","Contato principal","Membro da equipe"],
  manterPessoaEmpreendimento(eid,idx){const e=DB.empreendimentos.find(x=>x.id===eid);const p=(idx!=null&&e.pessoas)?e.pessoas[idx]:null;openModal({title:(p?"Editar vínculo de pessoa":"Incluir pessoa no empreendimento")+` · ${e.nome}`,wide:true,body:`
    <div class="form-row"><div class="field"><label>Nome</label><input value="${p?p.nome:""}" placeholder="Nome da pessoa"></div>
    <div class="field"><label>Papel no empreendimento</label><select>${act.PAPEIS_EMPREENDIMENTO.map(r=>`<option ${p&&p.papel===r?"selected":""}>${r}</option>`).join("")}</select></div></div>
    <div class="form-row"><div class="field"><label>Forma de contato</label><input value="${p?p.contato:""}" placeholder="e-mail ou telefone"></div>
    <div class="field"><label>Situação</label><select>${["Ativo","Inativo"].map(s=>`<option ${p&&p.situacao===s?"selected":""}>${s}</option>`).join("")}</select></div></div>
    <div class="form-row"><div class="field"><label>Período de vínculo <span class="t-sub">(início)</span></label><input type="date" value="${p&&p.desde?p.desde:""}"></div>
    <div class="field"><label>Responsabilidade no empreendimento</label><input value="${p&&p.responsabilidade?p.responsabilidade:""}" placeholder="Ex.: gestão financeira"></div></div>
    <div class="note" style="margin-top:4px"><span>👥</span><div>São pessoas <b>do empreendimento</b> — sócios, fundadores, representantes, responsáveis técnicos/operacionais<b>não</b> usuários da plataforma. Operar o produto (registrar evidências/resultados) exige uma <b>identidade de usuário da plataforma</b>, provisionada pelo administrador.</div></div>${FORM_NOTE}`,
    footer:voltarFooter(p?'Vínculo de pessoa atualizado · evento VinculoPessoaEmpreendimentoAtualizado':'Pessoa incluída no empreendimento · evento PessoaIncluidaNoEmpreendimento',`act.verEmpreendimento('${eid}',true)`)});},
  removerPessoaEmpreendimento(eid,idx){const e=DB.empreendimentos.find(x=>x.id===eid);const p=e.pessoas[idx];openModal({title:"Remover pessoa do empreendimento",body:`<p>Encerrar o vínculo de <b>${p.nome}</b> (${p.papel}) com <b>${e.nome}</b>?</p>
    <div class="note" style="margin-top:8px"><span>🗂</span><div>O vínculo é <b>encerrado preservando o histórico</b> — a pessoa não é apagada do registro histórico do empreendimento.</div></div>${FORM_NOTE}`,footer:voltarFooter('Vínculo de pessoa encerrado · evento PessoaRemovidaDoEmpreendimento',`act.verEmpreendimento('${eid}',true)`)});},
  definirResponsavelPrincipalEmpreendimento(eid){const e=DB.empreendimentos.find(x=>x.id===eid);const atual=(e.pessoas||[]).find(p=>p.principal);openModal({title:"Definir contato principal · "+e.nome,body:`
    <p class="t-sub" style="margin:0 0 10px">O <b>contato principal</b> é a pessoa do empreendimento que <b>fala com a incubadora</b> no dia a dia. Escolha quem assume esse papel — ela recebe o selo <span class="badge badge-blue" style="margin:0">principal</span>.</p>
    <div class="field"><label>Pessoa do empreendimento</label><select>${(e.pessoas||[]).map(p=>`<option ${p.principal?"selected":""}>${p.nome} — ${p.papel}</option>`).join("")}</select></div>
    ${atual?`<div class="note" style="margin-top:8px"><span>↔</span><div>Contato principal atual<b>${atual.nome}</b>. Confirmar com outra pessoa <b>transfere</b> o contato principal (evento <i>TransferirResponsabilidadeEmpreendimento</i>).</div></div>`:""}${FORM_NOTE}`,
    footer:voltarFooter('Contato principal definido · evento ResponsavelPrincipalEmpreendimentoDefinido',`act.verEmpreendimento('${eid}',true)`)});},
  definirRepresentanteLegalEmpreendimento(eid){const e=DB.empreendimentos.find(x=>x.id===eid);openModal({title:"Definir representante legal · "+e.nome,body:`
    <p class="t-sub" style="margin:0 0 10px">Define o representante <b>legal ou institucional</b> do empreendimento perante terceiros, quando aplicável. Escolha a pessoa que exercerá esse papel.</p>
    <div class="field"><label>Pessoa do empreendimento</label><select>${(e.pessoas||[]).map(p=>`<option ${p.papel==="Representante legal"?"selected":""}>${p.nome} — ${p.papel}</option>`).join("")}</select></div>${FORM_NOTE}`,
    footer:voltarFooter('Representante legal definido · evento RepresentanteLegalEmpreendimentoDefinido',`act.verEmpreendimento('${eid}',true)`)});},

  /* ===================== / Portfólio ===================== */
  consultarPortfolio(){const emps=empreendimentosDoCicloFoco();openModal({title:"Portfólio de empreendimentos apoiados",wide:true,body:`
    <p class="t-sub" style="margin:0 0 10px">Visão operacional e gerencial do portfólio do ciclo <b>${cicloEmFoco().nome}</b> (<i>ConsultarPortfolioEmpreendimentosApoiados</i>). Não altera dados — apenas consulta, filtra e acompanha.</p>
    <div class="table-wrap"><table class="tbl"><thead><tr><th>Empreendimento</th><th>Modalidade física</th><th>Estágio</th><th>Resp. interno</th><th>Situação</th></tr></thead>
      <tbody>${emps.map(e=>`<tr><td class="t-main">${e.nome}</td><td>${e.modalidadeFisica}</td><td>${e.estagio}</td><td>${e.responsavel}</td><td>${badge(e.situacao)}</td></tr>`).join("")}</tbody>
    </table></div>
    <div class="note" style="margin-top:10px"><span>🔎</span><div>Filtros previstos: ciclo, programa, trilha, modalidade física, estágio, setor, situação, responsável e período.</div></div>`});},

  /* ===================== Monitoramento das incubadas ===================== */
  planejarRodada(){const dims=monitDimensoes();openModal({title:"Planejar rodada de monitoramento",wide:true,body:`
    <div class="form-row"><div class="field"><label>Nome da rodada</label><input placeholder="Ex.: Monitoramento semestral 2º/2026"></div>
      <div class="field"><label>Tipo</label><select><option>Periódico</option><option>Diagnóstico inicial</option><option>Sob demanda</option></select></div></div>
    <div class="form-row"><div class="field"><label>Instrumento</label><select>${DB.monitoramento.instrumentos.filter(i=>i.situacao==="Ativo").map(i=>`<option>${i.nome}</option>`).join("")}</select></div>
      <div class="field"><label>Responsável</label><select>${DB.equipe.map(p=>`<option>${p.nome}</option>`).join("")}</select></div></div>
    <div class="form-row"><div class="field"><label>Período</label><input placeholder="Ex.: Dezembro/2026"></div>
      <div class="field"><label>Prazo</label><input type="date"></div></div>
    <label style="display:block;margin:8px 0 6px;font-size:13px;font-weight:600">Dimensões avaliadas (eixos CERNE)</label>
    ${dims.map(d=>`<label class="check"><input type="checkbox" checked><div><div class="ct" style="font-size:13px">${d}</div></div></label>`).join("")}
    <label style="display:block;margin:10px 0 6px;font-size:13px;font-weight:600">Incubadas incluídas</label>
    ${empreendimentosDoCicloFoco().filter(e=>e.situacao==="Ativo").map(e=>`<label class="check"><input type="checkbox" checked><div><div class="ct" style="font-size:13px">${e.nome}</div></div></label>`).join("")}
    <div class="note" style="margin-top:8px"><span>📡</span><div>Comandos <b>PlanejarRodadaMonitoramento</b> + <b>DefinirInstrumentoMonitoramento</b> + <b>VincularIncubadasARodadaMonitoramento</b>.</div></div>${FORM_NOTE}`,
    footer:confirmFooter('Rodada planejada · evento RodadaMonitoramentoPlanejada')});},
  verRodadaMonitoramento(id){const r=DB.monitoramento.rodadas.find(x=>x.id===id);if(!r)return;const avs=avaliacoesDaRodada(id);openModal({title:"Rodada · "+r.nome,wide:true,body:`
    <dl class="kv"><dt>Tipo</dt><dd>${r.tipo}</dd><dt>Instrumento</dt><dd>${(instrumentoMonitById(r.instrumento)||{}).nome||"—"}</dd><dt>Período</dt><dd>${r.periodo}</dd><dt>Responsável</dt><dd>${r.responsavel}</dd><dt>Prazo</dt><dd>${fmtDate(r.prazo)}</dd><dt>Situação</dt><dd>${badge(r.status)}</dd></dl>
    <h4 style="margin:14px 0 6px">Incubadas da rodada</h4>
    <table class="tbl"><tbody>${r.incubadas.map(emp=>{const a=avs.find(x=>x.empreendimento===emp);return `<tr><td class="t-main">${empNome(emp)}</td><td>${a?badge(a.status):'<span class="badge badge-slate">Não iniciada</span>'}</td><td class="t-sub">${a&&a.status==="Concluída"?("média "+mediaAvaliacaoMonit(a).toFixed(1)):"—"}</td><td style="text-align:right">${a?`<button class="btn btn-sm" data-close onclick="act.aplicarInstrumento('${a.id}')">${a.status==="Concluída"?"Revisar":"Aplicar"}</button>`:""}</td></tr>`;}).join("")}</tbody></table>`,
    footer:`<button class="btn" data-close>Fechar</button>`});},
  aplicarInstrumento(id){const a=avaliacaoMonitById(id);if(!a)return;const dims=monitDimensoes();const max=DB.monitoramento.escalaMax;openModal({title:"Aplicar instrumento · "+empNome(a.empreendimento),wide:true,body:`
    <p class="t-sub" style="margin:0 0 10px">Pontue cada dimensão (0–${max}) — eixos CERNE — e registre observação e recomendação.</p>
    <div class="form-row" style="flex-wrap:wrap;gap:10px">${dims.map(d=>`<div class="field" style="flex:1;min-width:110px"><label>${d}</label><input type="number" class="mon-dim" data-dim="${d}" min="0" max="${max}" step="1" value="${a.pontuacoes[d]??""}"></div>`).join("")}</div>
    <div class="field"><label>Observação</label><textarea class="mon-obs" placeholder="Síntese da aplicação">${a.observacao||""}</textarea></div>
    <div class="field"><label>Recomendação</label><select class="mon-rec"><option value="">— selecionar</option>${DB.monitoramento.recomendacoes.map(r=>`<option ${a.recomendacao===r?"selected":""} value="${r}">${r}</option>`).join("")}</select></div>
    <div class="note" style="margin-top:4px"><span>📡</span><div>Comandos <b>RegistrarPontuacaoDimensaoMonitoramento</b> + <b>RegistrarRecomendacaoMonitoramento</b> + <b>ConcluirAplicacaoInstrumentoMonitoramento</b> (11.5).</div></div>`,
    footer:`<button class="btn" data-close>Cancelar</button><button class="btn btn-primary" onclick="act._salvarAplicacao('${a.id}')">Concluir aplicação</button>`});},
  _salvarAplicacao(id){const a=avaliacaoMonitById(id);if(!a)return;const max=DB.monitoramento.escalaMax;const pt={};
    $$(".mon-dim").forEach(inp=>{const v=parseInt(inp.value,10);if(!isNaN(v))pt[inp.dataset.dim]=Math.max(0,Math.min(max,v));});
    if(!Object.keys(pt).length){toast('Pontue ao menos uma dimensão');return;}
    a.pontuacoes=pt;a.observacao=($(".mon-obs").value||"").trim()||null;a.recomendacao=$(".mon-rec").value||null;a.status="Concluída";a.data=a.data||"2026-06-20";
    closeModal();route();toast('Aplicação concluída · evento AplicacaoInstrumentoMonitoramentoConcluida');},

  /* ===================== Usuários e Permissões ===================== */
  /* Gestor altera o PAPEL (e escopo) de um usuário já vinculado — AtribuirPapelAoUsuario */
  alterarPapelUsuario(email){const u=DB.acessos.usuarios.find(x=>x.email===email);if(!u)return;openModal({title:"Alterar papel do usuário",body:`
    <div class="note" style="margin:0 0 12px"><span>👤</span><div><b>${u.nome}</b> · ${u.email}<br>Papel atual<b>${u.papel}</b></div></div>
    <div class="field"><label>Papel</label><select id="upPapel">${DB.acessos.papeis.filter(p=>p.situacao==="Ativo").map(p=>`<option ${u.papel===p.nome?"selected":""}>${p.nome}</option>`).join("")}</select></div>
    <div class="note" style="margin-top:8px"><span>🔐</span><div>Comando <b>AtribuirPapelAoUsuario</b>. As permissões efetivas do usuário passam a derivar do <b>novo papel</b>. Inclusão/suspensão de conta permanecem com o administrador.</div></div>`,
    footer:`<button class="btn" data-close>Cancelar</button><button class="btn btn-primary" onclick="act._salvarPapelUsuario('${email}')">Salvar papel</button>`});},
  _salvarPapelUsuario(email){const u=DB.acessos.usuarios.find(x=>x.email===email);if(!u)return;
    u.papel=$("#upPapel").value;
    closeModal();route();toast('Papel do usuário atualizado · evento PapelAtribuidoAoUsuario');},
  configurarPapel(id){const p=id?DB.acessos.papeis.find(x=>x.id===id):null;openModal({title:(p?"Editar":"Configurar")+" papel de autorização",wide:true,body:`
    <div class="form-row">
      <div class="field"><label>Nome do papel</label><input value="${p?p.nome:""}" placeholder="Ex.: Coordenador de acompanhamento"></div>
      <div class="field"><label>Escopo padrão</label><input value="${p?p.escopo:""}" placeholder="Ex.: Incubadora"></div>
    </div>
    <label>Permissões por recurso</label>
    <div class="table-wrap" style="margin-top:6px"><table class="tbl"><thead><tr><th>Recurso</th><th>Permissão</th></tr></thead>
      <tbody>${DB.acessos.recursos.map(r=>`<tr><td>${r}</td><td><select>${["—","Leitura","Edição","Total"].map(v=>`<option ${p&&p.permissoes[r]===v?"selected":""}>${v}</option>`).join("")}</select></td></tr>`).join("")}</tbody>
    </table></div>
    <div class="note" style="margin-top:8px"><span>🔐</span><div>Comandos <b>ConfigurarPapelAutorizacao</b> + <b>DefinirPermissoesDoPapel</b> + <b>DefinirEscoposPadraoDoPapel</b>.</div></div>`,
    footer:confirmFooter('Papel configurado · evento PapelAutorizacaoConfigurado')});},

  /* ===================== Encerramento do ciclo anual ===================== */
  toggleEncerrPendencias(){encerrVerTodas=!encerrVerTodas;route();},
  encerrarCicloAnual(id){const c=DB.ciclos.find(x=>x.id===id);const p=previaEncerramento(id);openModal({title:"Encerrar ciclo anual · "+c.nome,wide:true,body:`
    <div class="note ${p.pendencias.length?'warn':''}" style="margin:0 0 12px"><span>${p.pendencias.length?'⚠️':'✔'}</span><div>${p.pendencias.length?`O ciclo tem <b>${p.pendencias.length} pendências remanescentes</b>. Ao encerrar, elas são <b>registradas e preservadas</b> no histórico (<i>RegistrarPendenciasRemanescentesCiclo</i>).`:'Sem pendências — encerramento direto.'}</div></div>
    <p class="t-sub">O encerramento consolida os indicadores do ano e bloqueia novas operações. Os registros (planejamento, atividades, evidências, indicadores e monitoramentos) são <b>preservados como histórico</b>.</p>
    <div class="field"><label>Observações de encerramento</label><textarea placeholder="Síntese do ciclo, resultados e pendências"></textarea></div>
    <div class="note" style="margin-top:4px"><span>📦</span><div>Comandos <b>ConsolidarIndicadoresCicloAnual</b> + <b>RegistrarPendenciasRemanescentesCiclo</b> + <b>EncerrarCicloAnualIncubadora</b>.</div></div>`,
    footer:confirmFooter('Ciclo anual encerrado · evento CicloAnualIncubadoraEncerrado')});},
  reabrirCicloAnual(id){const c=DB.ciclos.find(x=>x.id===id);openModal({title:"Reabrir ciclo anual · "+c.nome,body:`
    <p>Reabrir o ciclo <b>${c.nome}</b> para novas operações?</p>
    <div class="field"><label>Justificativa (obrigatória)</label><textarea placeholder="Motivo da reabertura — registrado na auditoria"></textarea></div>
    <div class="note warn" style="margin-top:8px"><span>↩</span><div>Comando <b>ReabrirCicloAnualComJustificativa</b>. A reabertura é rastreável e exige justificativa.</div></div>`,
    footer:confirmFooter('Ciclo reaberto · evento CicloAnualReabertoComJustificativa')});},
  consolidarIndicadoresAnual(id){const c=DB.ciclos.find(x=>x.id===id);const inds=indicadoresDoCiclo(id);openModal({title:"Consolidação dos indicadores · "+c.nome,wide:true,body:`
    <p class="t-sub" style="margin:0 0 10px"><b>Prévia</b> da consolidação anual (meta × realizado × atingimento)<b>somente consulta</b>. A consolidação é <b>efetivada no encerramento</b> do ciclo (<i>ConsolidarIndicadoresCicloAnual</i>).</p>
    <div class="table-wrap"><table class="tbl"><thead><tr><th>Indicador</th><th>Meta</th><th>Realizado</th><th>Atingimento</th></tr></thead>
      <tbody>${inds.map(i=>`<tr><td class="t-main">${i.nome}</td><td>${temMeta(i)?metaTotal(i)+" "+i.unidade:"—"}</td><td>${resultadoTotal(i)} ${i.unidade}</td><td>${temMeta(i)?badge(atingimento(i)>=100?"Atingida":"Abaixo")+" "+atingimento(i)+"%":'<span class="t-sub"></span>'}</td></tr>`).join("")}</tbody>
    </table></div>`});},
};

/* =====================================================================
   ROTEADOR
   ===================================================================== */
function route() {
  let id = location.hash.replace("#/", "") || homeFor(ROLE);
  if (!VIEWS[id]) id = homeFor(ROLE);

  // Se a tela pertence a outro perfil, alterna o perfil automaticamente
  const ownerRole =
    NAV_ADMIN.some((n) => n.id === id) ? "admin":
    NAV_GESTOR.some((n) => n.id === id) ? "gestor": ROLE;
  if (ROLE !== ownerRole) ROLE = ownerRole;
  $$("#roleSwitch.role-opt").forEach((b) => b.classList.toggle("active", b.dataset.role === ROLE));
  renderNav();

  const nav = currentNav().find((n) => n.id === id) || {};
  const ctx = ROLE === "admin" ? "Administrador da plataforma": "Gestor da incubadora";

  $$("#nav a").forEach((a) => a.classList.toggle("active", a.dataset.id === id));
  $("#crumbs").innerHTML = `<span>${ctx}</span><span class="sep">/</span><b>${nav.crumb || "Painel"}</b>`;
  $("#view").innerHTML = VIEWS[id]();
  if (VIEWS[id].after) VIEWS[id].after();
  $("#view").scrollIntoView({ block: "start" });
  $("#sidebar").classList.remove("open");
  window.scrollTo(0, 0);
}

/* ---------- Init ---------- */
renderNav();
window.addEventListener("hashchange", route);
$("#roleSwitch").addEventListener("click", (e) => { const b = e.target.closest(".role-opt"); if (b) setRole(b.dataset.role); });
$("#hamburger").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
$("#modalClose").addEventListener("click", closeModal);
$("#modalOverlay").addEventListener("click", (e) => { if (e.target.id === "modalOverlay" || e.target.closest("[data-close]")) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
route();
