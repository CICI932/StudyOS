(function () {
  function render() {
    const state = StudyOS.state;
    StudyOSUI.setContent(`
      ${StudyOSUI.pageHeader("Materias", "Curriculo completo com progressao bloqueada por ordem logica.")}
      <section class="grid two">
        ${state.materias.map(materia => {
          const prog = StudyOSStats.subjectProgress(state, materia.id);
          return `<article class="subject-card">
            <h3><span style="color:${materia.cor}">●</span>${materia.nome}</h3>
            ${StudyOSUI.progress(prog.completed, prog.total)}
            ${materia.categorias.map(cat => `<div class="category">
              <strong>${cat.nome}</strong>
              ${cat.assuntos.map(topic => {
                const st = StudyOSCronograma.statusOf(state, topic.id);
                return `<div class="topic-row"><span>${topic.nome}<br><small>${topic.tempo} min · ${topic.dificuldade}</small></span><span class="status ${st}">${st}</span></div>`;
              }).join("")}
            </div>`).join("")}
          </article>`;
        }).join("")}
      </section>
    `);
  }
  window.StudyOSMaterias = { render };
})();
