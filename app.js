// Substitua o valor abaixo pelo Token JWT gerado no Insomnia/Postman
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMzE1MGU3NWE5YjM0NGQyYmFiMjJlMiIsImlhdCI6MTc4MTYxNjg3OCwiZXhwIjoxNzg4ODc0NDc4fQ._dutQR7uQAUtIop1lIRiEvtd_5LHnKgz2EGV1jcr5JcI"; 
const API_URL = "https://worldcup26.ir/get/teams";

// Mapeamento dos elementos do DOM
const teamsContainer = document.getElementById("teams-container");
const feedbackMessage = document.getElementById("feedback-message");
const filtersSection = document.getElementById("filters-section");
const searchInput = document.getElementById("search-input");
const groupButtonsContainer = document.getElementById("group-buttons");

// Variáveis de estado global
let todasAsSelecoes = [];
let grupoSelecionado = "Todos";
let termoDeBusca = "";

// 1. Busca os dados na API
async function fetchTeams() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { "Authorization": `Bearer ${TOKEN}` }
    });

    // Tratamento de Erros obrigatório do desafio
    if (!response.ok) {
      if (response.status === 401) throw new Error("Não autorizado. Verifique seu Token JWT no código.");
      if (response.status === 429) throw new Error("Muitas requisições. A API atingiu o limite, tente novamente mais tarde.");
      throw new Error(`Erro na comunicação com a API (Status: ${response.status}).`);
    }

    const data = await response.json();
    todasAsSelecoes = data.teams; 
    
    // Sucesso: Esconde a mensagem de carregamento e mostra a interface
    feedbackMessage.style.display = "none";
    filtersSection.style.display = "flex";
    
    gerarBotoesDeGrupo(todasAsSelecoes);
    aplicarFiltros(); 

  } catch (error) {
    // Exibe o erro visualmente para o usuário
    console.error("Erro capturado:", error);
    feedbackMessage.textContent = error.message || "Não foi possível carregar as seleções no momento. Tente novamente mais tarde.";
    feedbackMessage.classList.add("error");
  }
}

// 2. Lógica combinada: Filtra por nome e por grupo
function aplicarFiltros() {
  const selecoesFiltradas = todasAsSelecoes.filter(team => {
    const matchGrupo = grupoSelecionado === "Todos" || team.groups === grupoSelecionado;
    const matchBusca = team.name_en.toLowerCase().includes(termoDeBusca.toLowerCase());
    return matchGrupo && matchBusca;
  });

  renderTeams(selecoesFiltradas);
}

// 3. Gera os botões de Grupo dinamicamente
function gerarBotoesDeGrupo(teamsArray) {
  const grupos = [...new Set(teamsArray.map(t => t.groups))].sort();
  
  groupButtonsContainer.innerHTML = `<button class="filter-btn active" data-group="Todos">Todos</button>`;
  
  grupos.forEach(grupo => {
    groupButtonsContainer.innerHTML += `<button class="filter-btn" data-group="${grupo}">Grupo ${grupo}</button>`;
  });

  // Escuta os cliques nos botões de grupo
  const botoes = groupButtonsContainer.querySelectorAll(".filter-btn");
  botoes.forEach(botao => {
    botao.addEventListener("click", (e) => {
      botoes.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      
      grupoSelecionado = e.target.getAttribute("data-group");
      aplicarFiltros();
    });
  });
}

// 4. Escuta a barra de busca
searchInput.addEventListener("input", (e) => {
  termoDeBusca = e.target.value;
  aplicarFiltros();
});

// 5. Renderiza os Cards na tela
function renderTeams(teamsArray) {
  teamsContainer.innerHTML = ""; 

  // Feedback se a busca não encontrar nada
  if (teamsArray.length === 0) {
    teamsContainer.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #666;">Nenhuma seleção encontrada.</p>`;
    return;
  }

  teamsArray.forEach(team => {
    const card = document.createElement("div");
    card.classList.add("team-card");
    card.innerHTML = `
      <img src="${team.flag}" alt="Bandeira ${team.name_en}">
      <h3>${team.name_en}</h3>
      <span class="group-badge">Grupo ${team.groups}</span>
    `;
    teamsContainer.appendChild(card);
  });
}

// Inicia a aplicação
fetchTeams();