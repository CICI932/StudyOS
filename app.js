(function () {
  const state = StudyOSStorage.load();
  window.StudyOS = { state };

  function route() {
    StudyOSUI.initShell();
    if (state.config.primeiroAcesso) setTimeout(StudyOSUI.showSetup, 100);
    const page = document.body.dataset.page;
    if (page === "redacoes") renderRedacoes();
    if (page === "dashboard" && window.StudyOSDashboard) StudyOSDashboard.renderDashboard();
    if (page === "hoje" && window.StudyOSDashboard) StudyOSDashboard.renderTodayPage();
    if (page === "materias" && window.StudyOSMaterias) StudyOSMaterias.render();
    if (page === "biblioteca" && window.StudyOSBiblioteca) StudyOSBiblioteca.render();
    if (page === "revisoes" && window.StudyOSRevisao) StudyOSRevisao.render();
    if (page === "estatisticas" && window.StudyOSStats) StudyOSStats.renderStatsPage();
    if (page === "configuracoes" && window.StudyOSConfig) StudyOSConfig.render();
  }

  function renderRedacoes() {
    const items = state.progresso.redacoes;
    StudyOSUI.setContent(`
      ${StudyOSUI.pageHeader("Redacoes", "Controle simples de producao textual e reescrita.")}
      <section class="panel">
        <form id="redacaoForm" class="form-grid">
          <div class="grid two">
            <div class="field"><label>Tema</label><input name="tema" placeholder="Tema da redacao" required></div>
            <div class="field"><label>Status</label><select name="status"><option>Planejada</option><option>Escrita</option><option>Corrigida</option><option>Reescrita</option></select></div>
          </div>
          <button>Registrar redacao</button>
        </form>
      </section>
      <section class="section grid">${items.length ? items.map(item => `<div class="redacao-item"><div><strong>${item.tema}</strong><p>${item.data}</p></div><span class="pill">${item.status}</span></div>`).join("") : `<div class="empty">Nenhuma redacao registrada ainda.</div>`}</section>
    `);
    document.getElementById("redacaoForm").addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      state.progresso.redacoes.unshift({ tema: form.get("tema"), status: form.get("status"), data: StudyOSStorage.today() });
      StudyOSStorage.save(state);
      StudyOSUI.toast("Redacao registrada.");
      renderRedacoes();
    });
  }

  document.addEventListener("DOMContentLoaded", route);
})();
