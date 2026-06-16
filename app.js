const TOKEN = "SEU_TOKEN_AQUI";
const URL_TEAMS = "https://worldcup26.ir/get/teams";
const URL_STADIUMS = "https://worldcup26.ir/get/stadiums";

// Elementos do DOM
const mainContainer = document.getElementById("main-container");
const feedbackMessage = document.getElementById("feedback-message");
const filtersSection = document.getElementById("filters-section");
const searchInput = document.getElementById("search-input");
const groupButtonsContainer = document.getElementById("group-buttons-container");

const tabTeams = document.getElementById("tab-teams");
const tabStadiums = document.getElementById("tab-stadiums");

// Controle de Estado da Aplicação
let todasAsSelecoes = [];
let todosOsEstadios = [];
let abaAtual = "teams"; // Pode ser "teams" ou "stadiums"
let grupoSelecionado = "Todos";
let termoDeBusca = "";

// 1. Carrega todos os dados necessários da Copa
async function carregarDadosDaCopa() {
  try {
    // Faz o fetch das duas APIs ao mesmo tempo economizando tempo
    const [resTeams, resStadiums] = await Promise.all([
      fetch(URL_TEAMS, { headers: { "Authorization": `Bearer ${TOKEN}` } }),
      fetch(URL_STADIUMS, { headers: { "Authorization": `Bearer ${TOKEN}` } })
    ]);

    if (!resTeams.ok || !resStadiums.ok) {
      throw new Error("Erro ao obter os dados da API. Verifique o Token ou o servidor.");
    }

    const dataTeams = await resTeams.json();
    const dataStadiums = await resStadiums.json();

    todasAsSelecoes = dataTeams.teams;
    // Aceita se vier encapsulado ou direto em formato de Array
    todosOsEstadios = dataStadiums.stadiums || dataStadiums;

    // Remove tela de loading e libera interface
    feedbackMessage.style.display = "none";
    filtersSection.style.display = "flex";

    gerarBotoesDeGrupo(todasAsSelecoes);
    renderizarTela();

  } catch (error) {
    console.error(error);
    feedbackMessage.textContent = error.message || "Falha ao conectar com o serviço.";
    feedbackMessage.classList.add("error");
  }
}

// 2. Decide o que filtrar e renderizar dependendo da aba ativa
function renderizarTela() {
  mainContainer.innerHTML = "";

  if (abaAtual === "teams") {
    // Mostra os botões de grupos
    groupButtonsContainer.style.display = "flex";
    searchInput.placeholder = "Buscar seleção por nome (ex: Brazil)...";

    // Filtra e desenha as seleções
    const filtradas = todasAsSelecoes.filter(team => {
      const matchGrupo = grupoSelecionado === "Todos" || team.groups === grupoSelecionado;
      const matchBusca = team.name_en.toLowerCase().includes(termoDeBusca.toLowerCase());
      return matchGrupo && matchBusca;
    });
    desenharSelecoes(filtradas);

  } else if (abaAtual === "stadiums") {
    // Esconde os botões de grupos (estádios não têm grupos A, B, C...)
    groupButtonsContainer.style.display = "none";
    searchInput.placeholder = "Buscar estádio por nome ou cidade...";

    // Filtra e desenha os estádios
    const filtrados = todosOsEstadios.filter(stadium => {
      const termo = termoDeBusca.toLowerCase();
      return stadium.name_en.toLowerCase().includes(termo) ||
        stadium.city_en.toLowerCase().includes(termo) ||
        stadium.country_en.toLowerCase().includes(termo);
    });
    desenharEstadios(filtrados);
  }
}

// 3. Renderizadores específicos para cada tipo de Card
function desenharSelecoes(lista) {
  if (lista.length === 0) {
    mainContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#666;">Nenhuma seleção encontrada.</p>`;
    return;
  }
  lista.forEach(team => {
    const card = document.createElement("div");
    card.classList.add("team-card");
    card.innerHTML = `
      <img src="${team.flag}" alt="Bandeira ${team.name_en}">
      <h3>${team.name_en}</h3>
      <span class="group-badge">Grupo ${team.groups}</span>
    `;
    mainContainer.appendChild(card);
  });
}

function desenharEstadios(lista) {
  if (lista.length === 0) {
    mainContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#666;">Nenhum estádio encontrado.</p>`;
    return;
  }
  lista.forEach(stadium => {
    const card = document.createElement("div");
    card.classList.add("stadium-card");
    card.innerHTML = `
      <h3>🏟️ ${stadium.name_en}</h3>
      <p><strong>Nome FIFA:</strong> ${stadium.fifa_name || 'N/A'}</p>
      <p><strong>Cidade:</strong> ${stadium.city_en}</p>
      <p class="capacity">👥 ${Number(stadium.capacity).toLocaleString()} lugares</p>
      <span class="stadium-badge">${stadium.country_en}</span>
    `;
    mainContainer.appendChild(card);
  });
}

// 4. Criação dinâmica do carrossel de botões de grupos
function gerarBotoesDeGrupo(teamsArray) {
  const grupos = [...new Set(teamsArray.map(t => t.groups))].sort();
  groupButtonsContainer.innerHTML = `<button class="filter-btn active" data-group="Todos">Todos</button>`;

  grupos.forEach(grupo => {
    groupButtonsContainer.innerHTML += `<button class="filter-btn" data-group="${grupo}">Grupo ${grupo}</button>`;
  });

  const botoes = groupButtonsContainer.querySelectorAll(".filter-btn");
  botoes.forEach(botao => {
    botao.addEventListener("click", (e) => {
      botoes.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      grupoSelecionado = e.target.getAttribute("data-group");
      renderizarTela();
    });
  });
}

// 5. Escutadores de Eventos (Barra de busca e Abas)
searchInput.addEventListener("input", (e) => {
  termoDeBusca = e.target.value;
  renderizarTela();
});

tabTeams.addEventListener("click", () => {
  tabTeams.classList.add("active");
  tabStadiums.classList.remove("active");
  abaAtual = "teams";
  renderizarTela();
});

tabStadiums.addEventListener("click", () => {
  tabStadiums.classList.add("active");
  tabTeams.classList.remove("active");
  abaAtual = "stadiums";
  renderizarTela();
});

// Inicialização
carregarDadosDaCopa();