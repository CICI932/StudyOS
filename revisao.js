(function () {
  function render() {
    const due = StudyOSCronograma.pendingReviews(StudyOS.state, StudyOSStorage.today());
    const all = StudyOS.state.progresso.revisoes.filter(item => !item.concluida);
    StudyOSUI.setContent(`
      ${StudyOSUI.pageHeader("Revisoes", "Conteudos que voltam automaticamente no momento certo.")}
      <section class="grid two">
        ${StudyOSUI.metric("Pendentes hoje", due.length)}
        ${StudyOSUI.metric("Agendadas", all.length)}
      </section>
      <section class="section grid">
        ${due.length ? due.map(topic => `<article class="task-card"><div class="task-head"><div class="task-title"><span class="pill">${topic.materia.nome}</span><strong>${topic.nome}</strong><span class="muted">Revisao de ${topic.tempo} min</span></div><span class="status Revisao">Revisao</span></div></article>`).join("") : `<div class="empty">Nenhuma revisao pendente hoje.</div>`}
      </section>
    `);
  }
  window.StudyOSRevisao = { render };
})();
