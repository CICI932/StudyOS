(function () {
  const nav = [
    ["dashboard.html", "Dashboard", "⌂", "dashboard"],
    ["hoje.html", "Plano de Hoje", "✓", "hoje"],
    ["biblioteca.html", "Biblioteca", "▣", "biblioteca"],
    ["materias.html", "Materias", "☰", "materias"],
    ["redacoes.html", "Redacoes", "✎", "redacoes"],
    ["estatisticas.html", "Estatisticas", "◷", "estatisticas"],
    ["revisoes.html", "Revisoes", "↻", "revisoes"],
    ["configuracoes.html", "Configuracoes", "⚙", "configuracoes"]
  ];

  function initShell() {
    const page = document.body.dataset.page;
    document.getElementById("app").innerHTML = `
      <div class="shell">
        <aside class="sidebar">
          <a class="brand" href="dashboard.html"><span class="logo">S</span><span>StudyOS</span></a>
          <nav class="nav">${nav.map(([href, label, icon, id]) =>
            `<a class="${page === id ? "active" : ""}" href="${href}"><span>${icon}</span>${label}</a>`
          ).join("")}</nav>
        </aside>
        <main class="main" id="content"></main>
      </div>`;
  }

  function setContent(html) {
    document.getElementById("content").innerHTML = html;
  }

  function pageHeader(title, subtitle) {
    return `<div class="topbar"><div><div class="eyebrow">StudyOS</div><h1>${title}</h1><p>${subtitle}</p></div><div class="pill">Nivel ${StudyOS.state.progresso.nivel} · ${StudyOS.state.progresso.xp} XP</div></div>`;
  }

  function metric(label, value) {
    return `<div class="metric"><span class="muted">${label}</span><strong>${value}</strong></div>`;
  }

  function progress(done, total) {
    const percent = total ? Math.round((done / total) * 100) : 0;
    return `<div class="progress" style="--value:${percent}%"><span></span></div><p>${percent}% concluido</p>`;
  }

  function toast(message) {
    const node = document.createElement("div");
    node.className = "toast";
    node.textContent = message;
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 2600);
  }

  function taskCard(task) {
    const status = task.concluida ? "Concluido" : task.tipo === "revisao" ? "Revisao" : task.prioridade === "Atrasado" ? "Atrasado" : "Pendente";
    return `<article class="task-card" data-task="${task.id}">
      <div class="task-head">
        <div class="task-title">
          <span class="pill">${task.materia} · ${task.categoria}</span>
          <strong>${task.assunto}</strong>
          <span class="muted">${task.tempo} min · ${task.prioridade}</span>
        </div>
        <span class="status ${status}">${status}</span>
      </div>
      <div class="task-actions">
        <button class="success" data-action="complete" data-id="${task.id}" ${task.concluida ? "disabled" : ""}>Concluir</button>
        <button class="ghost" data-action="postpone" data-id="${task.id}" ${task.concluida ? "disabled" : ""}>Adiar</button>
        <button class="secondary" data-action="pdf" data-pdf="${task.pdf || ""}">Abrir PDF</button>
      </div>
    </article>`;
  }

  function showSetup() {
    const subjects = StudyOS.state.materias.map(m => `<label class="check"><input type="checkbox" name="materias" value="${m.id}" checked>${m.nome}</label>`).join("");
    const days = [["1", "Seg"], ["2", "Ter"], ["3", "Qua"], ["4", "Qui"], ["5", "Sex"], ["6", "Sab"], ["0", "Dom"]]
      .map(([value, label]) => `<label class="check"><input type="checkbox" name="dias" value="${value}" ${value !== "0" ? "checked" : ""}>${label}</label>`).join("");
    document.body.insertAdjacentHTML("beforeend", `<div class="modal-backdrop">
      <form class="modal" id="setupForm">
        <div class="eyebrow">Primeiro acesso</div>
        <h2>Vamos preparar seu StudyOS</h2>
        <p>Depois disso, o sistema decide seu estudo diario automaticamente.</p>
        <div class="form-grid">
          <div class="field"><label>Seu nome</label><input name="nome" value="${StudyOS.state.config.nome}" required></div>
          <div class="field"><label>Dias de estudo</label><div class="checks">${days}</div></div>
          <div class="grid two">
            <div class="field"><label>Tempo por dia</label><select name="tempo"><option value="30">30 min</option><option value="60">1 hora</option><option value="120">2 horas</option><option value="180" selected>3 horas</option><option value="240">4 horas</option><option value="300">5 horas</option></select></div>
            <div class="field"><label>Assuntos por dia</label><select name="max"><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option></select></div>
          </div>
          <div class="field"><label>Materias ativas</label><div class="checks">${subjects}</div></div>
          <button>Comecar</button>
        </div>
      </form>
    </div>`);
    document.getElementById("setupForm").addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      StudyOS.state.config.nome = form.get("nome");
      StudyOS.state.config.tempoDiario = Number(form.get("tempo"));
      StudyOS.state.config.maxAssuntos = Number(form.get("max"));
      StudyOS.state.config.diasEstudo = form.getAll("dias").map(Number);
      StudyOS.state.config.materiasAtivas = form.getAll("materias");
      StudyOS.state.config.primeiroAcesso = false;
      StudyOSStorage.save(StudyOS.state);
      document.querySelector(".modal-backdrop").remove();
      location.reload();
    });
  }

  window.StudyOSUI = { initShell, setContent, pageHeader, metric, progress, toast, taskCard, showSetup };
})();
