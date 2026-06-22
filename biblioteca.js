(function () {
  function render() {
    const topics = StudyOSCronograma.allTopics(StudyOS.state);
    StudyOSUI.setContent(`
      ${StudyOSUI.pageHeader("Biblioteca", "PDFs organizados por materia e assunto.")}
      <section class="grid three">
        ${topics.map(topic => `<article class="library-card">
          <span class="pill">${topic.materia.nome}</span>
          <h3>${topic.nome}</h3>
          <p>${topic.categoria.nome}</p>
          ${topic.pdf ? `<button data-pdf="${topic.pdf}">Abrir PDF</button>` : `<span class="muted">Material nao disponivel</span>`}
        </article>`).join("")}
      </section>
    `);
    document.querySelectorAll("[data-pdf]").forEach(button => {
      button.addEventListener("click", () => window.open(button.dataset.pdf, "_blank"));
    });
  }
  window.StudyOSBiblioteca = { render };
})();
