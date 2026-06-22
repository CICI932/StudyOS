(function () {
  function render() {
    const state = StudyOS.state;
    const subjects = state.materias.map(m => `<label class="check"><input type="checkbox" name="materias" value="${m.id}" ${state.config.materiasAtivas.includes(m.id) ? "checked" : ""}>${m.nome}</label>`).join("");
    const dayOptions = [["1", "Seg"], ["2", "Ter"], ["3", "Qua"], ["4", "Qui"], ["5", "Sex"], ["6", "Sab"], ["0", "Dom"]]
      .map(([value, label]) => `<label class="check"><input type="checkbox" name="dias" value="${value}" ${state.config.diasEstudo.includes(Number(value)) ? "checked" : ""}>${label}</label>`).join("");
    StudyOSUI.setContent(`
      ${StudyOSUI.pageHeader("Configuracoes", "Preferencias usadas pelo motor automatico.")}
      <section class="panel">
        <form id="configForm" class="form-grid">
          <div class="field"><label>Nome</label><input name="nome" value="${state.config.nome}" required></div>
          <div class="field"><label>Dias disponiveis</label><div class="checks">${dayOptions}</div></div>
          <div class="grid two">
            <div class="field"><label>Tempo diario</label><input type="number" name="tempo" min="30" step="15" value="${state.config.tempoDiario}"></div>
            <div class="field"><label>Maximo de assuntos</label><input type="number" name="max" min="1" max="6" value="${state.config.maxAssuntos}"></div>
          </div>
          <div class="field"><label>Materias ativas</label><div class="checks">${subjects}</div></div>
          <div class="page-actions"><button>Salvar</button><button type="button" class="ghost" id="resetBtn">Reiniciar progresso</button></div>
        </form>
      </section>
    `);
    document.getElementById("configForm").addEventListener("submit", event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      state.config.nome = form.get("nome");
      state.config.tempoDiario = Number(form.get("tempo"));
      state.config.maxAssuntos = Number(form.get("max"));
      state.config.diasEstudo = form.getAll("dias").map(Number);
      state.config.materiasAtivas = form.getAll("materias");
      StudyOSStorage.save(state);
      StudyOSUI.toast("Configuracoes salvas.");
    });
    document.getElementById("resetBtn").addEventListener("click", () => {
      if (confirm("Reiniciar todo o progresso salvo neste navegador?")) StudyOSStorage.reset();
    });
  }
  window.StudyOSConfig = { render };
})();
