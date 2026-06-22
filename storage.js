(function () {
  const KEY = "studyos:v1";
  const today = () => new Date().toISOString().slice(0, 10);
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T12:00:00`);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  };

  const seedSubjects = {
    materias: [
      ["IFBA", "IFBA", "#4D8DFF", [
        ["Matematica - Aritmetica", ["Operacoes basicas", "Fracoes", "Numeros decimais", "Potenciacao", "Radiciacao", "MMC", "MDC", "Razao e proporcao", "Regra de tres simples", "Regra de tres composta", "Porcentagem"]],
        ["Matematica - Algebra basica", ["Expressoes algebricas", "Produtos notaveis", "Fatoracao", "Equacoes do 1 grau", "Equacoes do 2 grau", "Inequacoes"]],
        ["Matematica - Funcoes", ["Conceito de funcao", "Funcao afim", "Funcao quadratica", "Funcao exponencial", "Funcao logaritmica", "Graficos de funcoes"]],
        ["Matematica - Geometria plana", ["Angulos", "Triangulos", "Quadrilateros", "Circunferencia", "Poligonos", "Area de figuras planas"]],
        ["Matematica - Geometria espacial", ["Prismas", "Piramides", "Cilindro", "Cone", "Esfera", "Volume e area"]],
        ["Matematica - Estatistica e probabilidade", ["Media, moda e mediana", "Graficos e tabelas", "Probabilidade basica", "Analise de dados"]],
        ["Matematica - Financeira", ["Juros simples", "Juros compostos", "Descontos", "Capital e montante"]],
        ["Portugues - Interpretacao de texto", ["Leitura e compreensao", "Inferencia textual", "Tipos de texto", "Generos textuais"]],
        ["Portugues - Gramatica", ["Ortografia", "Acentuacao", "Pontuacao", "Classes gramaticais", "Sintaxe", "Concordancia verbal", "Concordancia nominal", "Regencia verbal e nominal", "Crase"]],
        ["Portugues - Redacao aplicada", ["Estrutura textual", "Coesao e coerencia", "Conectivos", "Argumentacao"]],
        ["Fisica", ["Cinematica", "Movimento uniforme", "Movimento uniformemente variado", "Leis de Newton", "Trabalho e energia", "Potencia", "Termologia", "Ondulatoria", "Optica", "Eletricidade basica"]],
        ["Quimica", ["Materia e energia", "Atomos e elementos", "Tabela periodica", "Ligacoes quimicas", "Reacoes quimicas", "Funcoes inorganicas", "Estequiometria", "Solucoes", "Quimica organica basica"]],
        ["Biologia - Citologia", ["Membrana plasmatica", "Transporte celular", "Citoplasma", "Organelas celulares", "Nucleo", "Divisao celular"]],
        ["Biologia - Histologia", ["Tecidos epiteliais", "Tecidos conjuntivos", "Tecidos musculares", "Tecido nervoso"]],
        ["Biologia - Fisiologia humana", ["Sistema digestorio", "Sistema respiratorio", "Sistema circulatorio", "Sistema nervoso", "Sistema endocrino", "Sistema excretor", "Sistema reprodutor", "Sistema imunologico"]],
        ["Biologia - Genetica", ["Leis de Mendel", "Genetica molecular", "DNA e RNA", "Mutacao genetica"]],
        ["Biologia - Ecologia", ["Cadeias alimentares", "Ecossistemas", "Relacoes ecologicas", "Ciclos biogeoquimicos"]],
        ["Biologia - Evolucao", ["Teorias evolutivas", "Selecao natural", "Adaptacao"]],
        ["Biologia - Botanica", ["Reino vegetal", "Fisiologia vegetal"]],
        ["Biologia - Zoologia", ["Animais invertebrados", "Animais vertebrados"]],
        ["Historia", ["Historia do Brasil", "Brasil Colonia", "Brasil Imperio", "Republica", "Historia Geral", "Antiguidade", "Idade Media", "Idade Moderna", "Idade Contemporanea", "Guerras Mundiais"]],
        ["Geografia", ["Geografia fisica", "Clima", "Relevo", "Vegetacao", "Hidrografia", "Geografia humana", "Urbanizacao", "Globalizacao", "Geopolitica", "Brasil regional"]]
      ]],
      ["Ingles", "Ingles", "#4CAF50", [["Ingles expandido", ["Verb To Be", "Simple Present", "Present Continuous", "Simple Past", "Past Continuous", "Future will going to", "Present Perfect", "Modal Verbs", "Prepositions", "Phrasal Verbs", "Vocabulary building", "Reading comprehension", "Listening comprehension", "Writing basics"]]]],
      ["Informatica", "Informatica", "#2563EB", [["Fundamentos", ["Hardware", "Software", "Sistemas operacionais", "Redes de computadores", "Banco de dados", "Seguranca da informacao", "Algoritmos", "Logica de programacao", "Inteligencia artificial", "Computacao em nuvem"]]]],
      ["Tecnologia", "Tecnologia e Programacao", "#7C3AED", [
        ["Base", ["Logica de programacao", "Algoritmos"]],
        ["Front-end", ["HTML", "CSS", "JavaScript", "TypeScript", "UX UI"]],
        ["Back-end", ["Node.js", "APIs REST", "Autenticacao", "Banco de dados SQL", "Banco de dados NoSQL"]],
        ["Linguagens", ["Python", "C", "C++", "Java"]],
        ["Estruturas avancadas", ["Estruturas de dados", "Programacao orientada a objetos", "Arquitetura de software"]],
        ["Ferramentas", ["Git", "GitHub", "Docker", "Linux"]],
        ["Conceitos modernos", ["Desenvolvimento web", "Desenvolvimento mobile", "Inteligencia artificial", "Prompt engineering"]]
      ]],
      ["Administracao", "Administracao", "#F59E0B", [["Administracao", ["Administracao geral", "Planejamento estrategico", "Organizacao", "Lideranca", "Gestao de pessoas", "Empreendedorismo", "Marketing", "Marketing digital", "Financas", "Contabilidade basica", "Gestao financeira", "Fluxo de caixa", "Logistica", "Gestao de projetos", "Atendimento ao cliente", "Comunicacao empresarial", "Negociacao", "Etica profissional", "Produtividade", "Gestao do tempo"]]]],
      ["Redacao", "Redacao", "#E74C3C", [["Redacao expandida", ["Estrutura dissertativo-argumentativa", "Introducao", "Desenvolvimento", "Conclusao", "Tese", "Argumentacao", "Repertorio sociocultural", "Coesao textual", "Coerencia textual", "Conectivos", "Competencia 1 norma padrao", "Competencia 2 compreensao do tema", "Competencia 3 argumentacao", "Competencia 4 coesao", "Competencia 5 proposta de intervencao", "Interpretacao de temas", "Producao semanal de redacao", "Correcao e reescrita"]]]]
    ]
  };

  const normalize = () => seedSubjects.materias.map((raw, subjectIndex) => {
    const [id, nome, cor, categorias] = raw;
    let absolute = 0;
    return {
      id, nome, cor, ordem: subjectIndex + 1,
      categorias: categorias.map(([catNome, assuntos]) => ({
        nome: catNome,
        descricao: `Sequencia oficial de ${catNome}.`,
        assuntos: assuntos.map((nomeAssunto, index) => {
          const key = `${id}:${absolute}`;
          const item = {
            id: key,
            nome: nomeAssunto,
            descricao: `Estudar ${nomeAssunto} seguindo a ordem logica do curriculo.`,
            tempo: id === "Redacao" ? 50 : id === "Ingles" ? 30 : id === "Tecnologia" ? 40 : 45,
            dificuldade: index > 8 ? "Alta" : index > 3 ? "Media" : "Baixa",
            status: "Pendente",
            pdf: "",
            prerequisitos: absolute === 0 ? [] : [`${id}:${absolute - 1}`],
            xp: 20,
            ordemGlobal: absolute++
          };
          return item;
        })
      }))
    };
  });

  const achievements = [
    ["primeira_tarefa", "Primeira tarefa", "Concluir a primeira tarefa.", "totalConcluidos", 1],
    ["sete_dias", "7 dias seguidos", "Estudar por 7 dias em sequencia.", "sequencia", 7],
    ["trinta_dias", "30 dias seguidos", "Estudar por 30 dias em sequencia.", "sequencia", 30],
    ["cem_assuntos", "100 assuntos concluidos", "Concluir 100 unidades de estudo.", "totalConcluidos", 100],
    ["mestre_programacao", "Mestre da Programacao", "Concluir Tecnologia e Programacao.", "materia", "Tecnologia"],
    ["mestre_redacao", "Mestre da Redacao", "Concluir Redacao.", "materia", "Redacao"],
    ["mestre_ingles", "Mestre do Ingles", "Concluir Ingles.", "materia", "Ingles"]
  ].map(([id, nome, descricao, tipo, valor]) => ({ id, nome, descricao, tipo, valor }));

  function defaultState() {
    return {
      materias: normalize(),
      frases: [
        "Voce esta mais perto do seu objetivo.",
        "Cada pequeno passo importa.",
        "Disciplina vence motivacao.",
        "As grandes conquistas comecam nas pequenas acoes.",
        "Hoje e um bom dia para continuar."
      ],
      conquistasBase: achievements,
      config: {
        nome: "Cibele",
        diasEstudo: [1, 2, 3, 4, 5, 6],
        tempoDiario: 180,
        maxAssuntos: 4,
        materiasAtivas: ["IFBA", "Informatica", "Tecnologia", "Ingles", "Administracao", "Redacao"],
        primeiroAcesso: !localStorage.getItem(KEY)
      },
      progresso: {
        xp: 0,
        nivel: 1,
        sequenciaDias: 0,
        ultimoDiaConcluido: null,
        assuntos: {},
        revisoes: [],
        historico: {},
        redacoes: [],
        conquistas: []
      }
    };
  }

  function load() {
    const saved = localStorage.getItem(KEY);
    if (!saved) return defaultState();
    const state = defaultState();
    const parsed = JSON.parse(saved);
    return {
      ...state,
      config: { ...state.config, ...parsed.config, primeiroAcesso: false },
      progresso: { ...state.progresso, ...parsed.progresso }
    };
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify({
      config: state.config,
      progresso: state.progresso
    }));
  }

  function reset() {
    localStorage.removeItem(KEY);
    location.reload();
  }

  window.StudyOSStorage = { load, save, reset, today, addDays };
})();
