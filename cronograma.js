(function () {
  const revisionOffsets = [2, 7, 15, 30];

  function allTopics(state) {
    return state.materias.flatMap(materia =>
      materia.categorias.flatMap(categoria =>
        categoria.assuntos.map(assunto => ({ ...assunto, materia, categoria }))
      )
    );
  }

  function isCompleted(state, topicId) {
    return state.progresso.assuntos[topicId]?.status === "Concluido";
  }

  function statusOf(state, topicId) {
    return state.progresso.assuntos[topicId]?.status || "Pendente";
  }

  function nextUnlockedBySubject(state, subjectId) {
    const materia = state.materias.find(item => item.id === subjectId);
    if (!materia) return null;
    const topics = materia.categorias.flatMap(categoria =>
      categoria.assuntos.map(assunto => ({ ...assunto, materia, categoria }))
    );
    return topics.find(topic =>
      statusOf(state, topic.id) !== "Concluido" &&
      topic.prerequisitos.every(req => isCompleted(state, req))
    ) || null;
  }

  function subjectStudyCount(state, subjectId) {
    return Object.values(state.progresso.assuntos)
      .filter(item => item.materiaId === subjectId && item.status === "Concluido").length;
  }

  function pendingReviews(state, date) {
    return state.progresso.revisoes
      .filter(review => !review.concluida && review.data <= date)
      .map(review => {
        const topic = allTopics(state).find(item => item.id === review.assuntoId);
        return topic ? { ...topic, revisaoId: review.id, tipo: "revisao", prioridade: "Revisao pendente", tempo: Math.min(25, topic.tempo) } : null;
      })
      .filter(Boolean);
  }

  function overdueTasks(state, date) {
    return Object.entries(state.progresso.historico)
      .filter(([day]) => day < date)
      .flatMap(([, record]) => record.tarefas || [])
      .filter(task => !task.concluida && task.tipo !== "revisao")
      .map(task => {
        const topic = allTopics(state).find(item => item.id === task.assuntoId);
        return topic ? { ...topic, tipo: "atrasado", prioridade: "Atrasado" } : null;
      })
      .filter(Boolean);
  }

  function normalCandidates(state, chosen) {
    const active = state.config.materiasAtivas;
    return active
      .map(subjectId => nextUnlockedBySubject(state, subjectId))
      .filter(Boolean)
      .filter(topic => !chosen.some(item => item.id === topic.id))
      .sort((a, b) => subjectStudyCount(state, a.materia.id) - subjectStudyCount(state, b.materia.id));
  }

  function canAdd(plan, topic, used, state) {
    const last = plan.at(-1);
    if (last && last.materia.id === topic.materia.id && plan.length > 1) return false;
    if (used + topic.tempo > state.config.tempoDiario) return false;
    if (plan.length >= state.config.maxAssuntos) return false;
    return true;
  }

  function buildDailyPlan(state, date = StudyOSStorage.today()) {
    const existing = state.progresso.historico[date];
    if (existing?.tarefas?.length) return existing.tarefas;
    const day = new Date(`${date}T12:00:00`).getDay();
    if (!state.config.diasEstudo.includes(day)) {
      state.progresso.historico[date] = { tarefas: [], descanso: true };
      StudyOSStorage.save(state);
      return [];
    }

    const plan = [];
    let used = 0;
    const pools = [overdueTasks(state, date), pendingReviews(state, date), normalCandidates(state, plan)];
    for (const pool of pools) {
      for (const topic of pool) {
        if (canAdd(plan, topic, used, state) && !plan.some(item => item.id === topic.id || item.revisaoId === topic.revisaoId)) {
          plan.push(topic);
          used += topic.tempo;
        }
      }
    }
    while (plan.length < state.config.maxAssuntos && used < state.config.tempoDiario) {
      const pool = normalCandidates(state, plan);
      const next = pool.find(topic => canAdd(plan, topic, used, state));
      if (!next) break;
      plan.push({ ...next, tipo: "estudo", prioridade: "Sequencia logica" });
      used += next.tempo;
    }
    const tarefas = plan.map(topic => ({
      id: `${date}:${topic.revisaoId || topic.id}`,
      assuntoId: topic.id,
      revisaoId: topic.revisaoId || null,
      materiaId: topic.materia.id,
      materia: topic.materia.nome,
      categoria: topic.categoria.nome,
      assunto: topic.nome,
      tempo: topic.tempo,
      tipo: topic.tipo || "estudo",
      prioridade: topic.prioridade || "Sequencia logica",
      pdf: topic.pdf,
      concluida: false
    }));
    state.progresso.historico[date] = { tarefas, descanso: false };
    StudyOSStorage.save(state);
    return tarefas;
  }

  function completeTask(state, taskId, date = StudyOSStorage.today()) {
    const record = state.progresso.historico[date] || { tarefas: [] };
    const task = record.tarefas.find(item => item.id === taskId);
    if (!task || task.concluida) return;
    task.concluida = true;
    task.concluidaEm = new Date().toISOString();
    if (task.revisaoId) {
      const review = state.progresso.revisoes.find(item => item.id === task.revisaoId);
      if (review) review.concluida = true;
      state.progresso.xp += 15;
    } else {
      state.progresso.assuntos[task.assuntoId] = {
        status: "Concluido",
        materiaId: task.materiaId,
        concluidoEm: new Date().toISOString()
      };
      revisionOffsets.forEach(offset => {
        state.progresso.revisoes.push({
          id: `${task.assuntoId}:${offset}:${Date.now()}`,
          assuntoId: task.assuntoId,
          materiaId: task.materiaId,
          data: StudyOSStorage.addDays(date, offset),
          etapa: offset,
          concluida: false
        });
      });
      state.progresso.xp += 20;
    }
    if (record.tarefas.length && record.tarefas.every(item => item.concluida)) {
      state.progresso.xp += 50;
      updateStreak(state, date);
    }
    state.progresso.nivel = Math.floor(state.progresso.xp / 100) + 1;
    StudyOSStats.unlockAchievements(state);
    StudyOSStorage.save(state);
  }

  function postponeTask(state, taskId, date = StudyOSStorage.today()) {
    const record = state.progresso.historico[date];
    const task = record?.tarefas.find(item => item.id === taskId);
    if (!task || task.concluida) return;
    const tomorrow = StudyOSStorage.addDays(date, 1);
    state.progresso.historico[tomorrow] ||= { tarefas: [], descanso: false };
    state.progresso.historico[tomorrow].tarefas.unshift({ ...task, id: `${tomorrow}:${task.assuntoId}:adiado`, prioridade: "Atrasado" });
    record.tarefas = record.tarefas.filter(item => item.id !== taskId);
    StudyOSStorage.save(state);
  }

  function updateStreak(state, date) {
    const last = state.progresso.ultimoDiaConcluido;
    const yesterday = StudyOSStorage.addDays(date, -1);
    state.progresso.sequenciaDias = last === yesterday ? state.progresso.sequenciaDias + 1 : 1;
    state.progresso.ultimoDiaConcluido = date;
  }

  window.StudyOSCronograma = { allTopics, buildDailyPlan, completeTask, postponeTask, pendingReviews, statusOf };
})();
