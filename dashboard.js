(function () {
  function greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }

  function dateLabel() {
    return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date());
  }

  function currentPlan() {
    return StudyOSCronograma.buildDailyPlan(StudyOS.state);
  }

  function bindTaskActions(renderAgain) {
    document.querySelectorAll("[data-action]").forEach(button => {
      button.addEventListener("click", () => {
        const action = button.dataset.action;
        if (action === "complete") {
          StudyOSCronograma.completeTask(StudyOS.state, button.dataset.id);
          StudyOSUI.toast("Tarefa concluida. Progresso salvo.");
          renderAgain();
        }
        if (action === "postpone") {
          StudyOSCronograma.postponeTask(StudyOS.state, button.dataset.id);
          StudyOSUI.toast("Tarefa remarcada automaticamente.");
          renderAgain();
        }
        if (action === "pdf") {
          if (!button.dataset.pdf) return StudyOSUI.toast("Material ainda nao cadastrado.");
          window.open(button.dataset.pdf, "_blank");
        }
      });
    });
  }

  function planSummary(plan) {
    const done = plan.filter(item => item.concluida).length;
    const totalTime = plan.reduce((sum, task) => sum + task.tempo, 0);
    return { done, total: plan.length, totalTime, percent: plan.length ? Math.round((done / plan.length) * 100) : 0 };
  }

  function renderDashboard() {
    const plan = currentPlan();
    const summary = planSummary(plan);
    const phrase = StudyOS.state.frases[Math.floor(Math.random() * StudyOS.state.frases.length)];
    const finished = plan.length && summary.done === summary.total;
    StudyOSUI.setContent(`
      <section class="hero">
        <div class="panel hero-card">
          <div>
            <div class="eyebrow">${dateLabel()}</div>
            <h1>${greeting()}, ${StudyOS.state.config.nome}.</h1>
            <p class="date">${finished ? "Voce concluiu todas as tarefas de hoje." : `Hoje voce possui ${plan.length} tarefas.`}</p>
          </div>
          <div>
            <div class="progress" style="--value:${summary.percent}%"><span></span></div>
            <p class="quote">${phrase}</p>
          </div>
        </div>
        <div class="stats-stack">
          ${StudyOSUI.metric("Tempo estimado", `${Math.floor(summary.totalTime / 60)}h ${summary.totalTime % 60}min`)}
          ${StudyOSUI.metric("Progresso do dia", `${summary.percent}%`)}
          ${StudyOSUI.metric("XP", StudyOS.state.progresso.xp)}
        </div>
      </section>
      <section class="section panel">
        <div class="topbar"><div><h2>Hoje voce estudara</h2><p>O plano foi montado automaticamente.</p></div><a class="pill" href="hoje.html">Abrir plano</a></div>
        <div class="today-list">${plan.length ? plan.slice(0, 4).map(StudyOSUI.taskCard).join("") : `<div class="empty">Hoje nao ha tarefas pendentes. Aproveite para descansar.</div>`}</div>
      </section>
    `);
    bindTaskActions(renderDashboard);
  }

  function renderTodayPage() {
    const plan = currentPlan();
    const summary = planSummary(plan);
    StudyOSUI.setContent(`
      ${StudyOSUI.pageHeader("Plano de Hoje", "Lista real do que estudar agora.")}
      <section class="panel">
        <h2>Resumo diario</h2>
        <p>${summary.done} de ${summary.total} tarefas concluidas · ${summary.totalTime} minutos estimados</p>
        <div class="progress" style="--value:${summary.percent}%"><span></span></div>
      </section>
      <section class="section grid">${plan.length ? plan.map(StudyOSUI.taskCard).join("") : `<div class="empty">O sistema marcou hoje como descanso ou nao encontrou tarefas liberadas.</div>`}</section>
    `);
    bindTaskActions(renderTodayPage);
  }

  window.StudyOSDashboard = { renderDashboard, renderTodayPage };
})();
