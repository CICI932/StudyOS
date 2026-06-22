(function () {
  function totals(state) {
    const topics = StudyOSCronograma ? StudyOSCronograma.allTopics(state) : [];
    const completed = Object.values(state.progresso.assuntos).filter(item => item.status === "Concluido").length;
    const reviews = state.progresso.revisoes.filter(item => !item.concluida).length;
    const minutes = Object.values(state.progresso.historico)
      .flatMap(day => day.tarefas || [])
      .filter(task => task.concluida)
      .reduce((sum, task) => sum + task.tempo, 0);
    return {
      total: topics.length,
      completed,
      percent: topics.length ? Math.round((completed / topics.length) * 100) : 0,
      reviews,
      minutes,
      hours: Math.round(minutes / 60)
    };
  }

  function subjectProgress(state, materiaId) {
    const materia = state.materias.find(item => item.id === materiaId);
    const topics = materia ? materia.categorias.flatMap(cat => cat.assuntos) : [];
    const completed = topics.filter(topic => state.progresso.assuntos[topic.id]?.status === "Concluido").length;
    return { total: topics.length, completed, percent: topics.length ? Math.round((completed / topics.length) * 100) : 0 };
  }

  function unlockAchievements(state) {
    const stats = totals(state);
    const unlocked = new Set(state.progresso.conquistas);
    state.conquistasBase.forEach(item => {
      if (unlocked.has(item.id)) return;
      if (item.tipo === "totalConcluidos" && stats.completed >= item.valor) unlocked.add(item.id);
      if (item.tipo === "sequencia" && state.progresso.sequenciaDias >= item.valor) unlocked.add(item.id);
      if (item.tipo === "materia" && subjectProgress(state, item.valor).percent === 100) unlocked.add(item.id);
    });
    state.progresso.conquistas = [...unlocked];
  }

  function renderStatsPage() {
    const state = StudyOS.state;
    const stats = totals(state);
    const cards = state.materias.map(materia => {
      const progress = subjectProgress(state, materia.id);
      return `<div class="subject-card">
        <h3><span style="color:${materia.cor}">●</span>${materia.nome}</h3>
        <div class="progress" style="--value:${progress.percent}%"><span></span></div>
        <p>${progress.completed} de ${progress.total} assuntos concluidos</p>
      </div>`;
    }).join("");
    StudyOSUI.setContent(`
      ${StudyOSUI.pageHeader("Estatisticas", "Progresso geral do seu cursinho automatico.")}
      <section class="grid three">
        ${StudyOSUI.metric("XP", state.progresso.xp)}
        ${StudyOSUI.metric("Nivel", state.progresso.nivel)}
        ${StudyOSUI.metric("Horas estudadas", stats.hours)}
      </section>
      <section class="section panel">
        <h2>Progresso geral</h2>
        <p>${stats.completed} de ${stats.total} assuntos concluidos.</p>
        <div class="progress" style="--value:${stats.percent}%"><span></span></div>
      </section>
      <section class="section grid two">${cards}</section>
      <section class="section panel">
        <h2>Conquistas</h2>
        <div class="grid two">${state.conquistasBase.map(item => {
          const ok = state.progresso.conquistas.includes(item.id);
          return `<div class="achievement-card ${ok ? "" : "locked"}"><h3>${ok ? "Desbloqueada" : "Bloqueada"} - ${item.nome}</h3><p>${item.descricao}</p></div>`;
        }).join("")}</div>
      </section>
    `);
  }

  window.StudyOSStats = { totals, subjectProgress, unlockAchievements, renderStatsPage };
})();
