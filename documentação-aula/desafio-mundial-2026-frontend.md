# 🏆 Desafio Copa do Mundo 2026 — Front-end com IA

## Objetivo

Construir uma interface web (HTML + CSS + JavaScript puro) que exiba dados reais da Copa do Mundo 2026 — que está acontecendo agora — consumindo uma API. O ponto central do desafio é usar IA como ferramenta de apoio durante todo o desenvolvimento e **documentar como vocês a usaram**.

## Formato

- Mesmos grupos do projeto que vocês já estão desenvolvendo.
- Front-end em HTML + CSS + JavaScript puro (sem frameworks/bibliotecas — é o que estudamos no curso).
- Entrega: **repositório no GitHub**. Não precisa de deploy, pode rodar local.

## A API

### worldcup2026

- Repositório: https://github.com/rezarahiminia/worldcup2026
- URL base (produção): `https://worldcup26.ir`
- Documentação interativa (Swagger): https://worldcup26.ir/api-docs/

⚠️ **Atenção:** apesar do projeto se anunciar como "sem chave de API", isso vale só pro health check. Pra tudo mais, é preciso cadastro e login (JWT).

**Pra essa parte (cadastro e login), usem um cliente REST — Insomnia ou Postman.** Não dá pra mandar um POST com corpo JSON direto pela barra de endereço do navegador, por isso a ferramenta é obrigatória aqui (mesmo escrevendo o resto da aplicação em HTML/CSS/JS puro).

**1. Cadastro (uma vez só, por grupo) — feito no Insomnia/Postman:**

- Método: `POST`
- URL: `https://worldcup26.ir/auth/register`
- Body → tipo `JSON`:

```json
{
  "name": "Grupo 1",
  "email": "grupo1.turmaA@desafiocopa2026.test",
  "password": "uma_senha_qualquer"
}
```

- Cliquem em **Send**.

✅ **Testado e confirmado funcionando** — não precisa de e-mail real, nem de confirmação por inbox. Cada grupo usa um endereço único seguindo o padrão `grupoN.turmaX@desafiocopa2026.test` (troquem N pelo número do grupo e X pela turma).

> Detalhe: a API normaliza o e-mail pra minúsculas na resposta (`grupo1.turmaA@...` volta como `grupo1.turmaa@...`). Não é erro — usem minúsculas desde o cadastro pra não se confundirem no login depois.

Resposta esperada (200 OK):

```json
{
  "user": {
    "name": "Grupo 1",
    "email": "grupo1.turmaa@desafiocopa2026.test",
    "_id": "6a3131a15a9b344d2b95a68c",
    "createdAt": "2026-06-16T11:21:05.841Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Copiem o valor de `token`** — é ele que vai ser usado em toda chamada daqui pra frente.

![Insomnia](insomnia.png)

**2. Login (só precisam disso se perderem o token ou quiserem gerar de novo):**

- Método: `POST`
- URL: `https://worldcup26.ir/auth/authenticate`
- Body → `JSON`:

```json
{
  "email": "grupo1.turmaa@desafiocopa2026.test",
  "password": "uma_senha_qualquer"
}
```

O token dura 84 dias — pra esse projeto, na prática, fazem esse passo uma vez só.

**3. Consumindo dados no código** — toda requisição GET precisa do header `Authorization: Bearer SEU_TOKEN`:

```javascript
fetch("https://worldcup26.ir/get/teams", {
  headers: { Authorization: "Bearer SEU_TOKEN" },
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

**Endpoints disponíveis:**

| Endpoint                  | O que retorna                    |
| ------------------------- | -------------------------------- |
| `GET /get/teams`          | As 48 seleções                   |
| `GET /get/team/:id`       | Uma seleção específica           |
| `GET /get/teams/?group=A` | Seleções de um grupo             |
| `GET /get/groups`         | Os 12 grupos com classificação   |
| `GET /get/group/:id`      | Um grupo específico              |
| `GET /get/games`          | As 104 partidas                  |
| `GET /get/game/:id`       | Uma partida específica           |
| `GET /get/stadiums`       | Os 16 estádios                   |
| `GET /health`             | Status da API (sem autenticação) |

> 💡 Como é uma API gratuita mantida por um único desenvolvedor (não é oficial da FIFA), usem sempre o padrão de e-mail fictício acima — nunca e-mail ou senha reais reaproveitados de outras contas.

## Regras técnicas

- Proibido mockar dados — tudo precisa vir da API.
- Tratamento de erro é obrigatório, não opcional: se a chamada à API falhar (rede, 401, 429, 500, timeout), o código precisa identificar isso e mostrar uma mensagem clara pro usuário, sem travar a tela.
- Podem (e devem) usar IA o tempo todo — é o ponto central do desafio.

## Entregáveis (no repositório GitHub)

1. Código-fonte completo (HTML, CSS, JS).
2. `README.md` explicando o que a aplicação faz e como abrir/rodar localmente.
3. `PROMPTS.md` — o coração da avaliação do uso de IA. Documentem: quais prompts usaram, o que a IA sugeriu, o que vocês mudaram ou rejeitaram e por quê.

## Critérios de avaliação

| Critério                                                                                      | Peso |
| --------------------------------------------------------------------------------------------- | ---- |
| Funcionalidade / consumo correto da API                                                       | 30%  |
| Qualidade do código (organização dos arquivos, estrutura do repositório, clareza dos commits) | 25%  |
| Criatividade da interface                                                                     | 20%  |
| Documentação do uso de IA (`PROMPTS.md`)                                                      | 15%  |
| Tratamento de erros                                                                           | 10%  |

## Ideias de interface

A liberdade visual é total. Algumas ideias pra quem quiser referência (não são obrigatórias — combinar duas ou mais costuma dar um resultado mais interessante):

- Lista de jogos com filtro por grupo, data ou seleção.
- Tabela de classificação por grupo (pontos, saldo de gols, V/E/D).
- Cards de estádios com cidade, país e capacidade.
- Contagem regressiva pro próximo jogo de uma seleção escolhida.
- Comparador simples entre duas seleções (gols marcados, jogos disputados, etc.).
- "Modo acompanhamento": busca os dados de novo a cada X segundos enquanto a aba estiver aberta.
- Estado visual de carregamento e de erro (algo melhor que a tela travada ou em branco se a API demorar ou falhar).

### Exemplo mínimo pra começar

Isso aqui é só o esqueleto — mostra o padrão de buscar dados e tratar erro. A organização, o estilo e o que exibir são escolha de cada grupo.

```html
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <title>Copa 2026</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Seleções da Copa 2026</h1>
    <div id="status"></div>
    <ul id="lista-times"></ul>

    <script src="app.js"></script>
  </body>
</html>
```

```javascript
// app.js
const TOKEN = "SEU_TOKEN_AQUI"; // gerado no login da API

async function carregarTimes() {
  const status = document.getElementById("status");

  try {
    const resposta = await fetch("https://worldcup26.ir/get/teams", {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    if (!resposta.ok) throw new Error("API indisponível");

    const times = await resposta.json();
    status.textContent = "";
    renderizarTimes(times);
  } catch (erro) {
    status.textContent =
      "Não foi possível carregar os dados agora. Tente novamente em alguns instantes.";
  }
}

function renderizarTimes(times) {
  const lista = document.getElementById("lista-times");
  lista.innerHTML = "";
  times.forEach((time) => {
    const item = document.createElement("li");
    item.textContent = `${time.name_en} (Grupo ${time.groups})`;
    lista.appendChild(item);
  });
}

carregarTimes();
```

## Passo a passo sugerido

1. Testem `GET /health` da API pra confirmar que está no ar.
2. No Insomnia ou Postman, façam o cadastro (`POST /auth/register`) e guardem o token da resposta.
3. Façam uma chamada simples (`/get/teams`) e confirmem que os dados chegam.
4. Implementem o tratamento de erro desde o início — se a chamada falhar, a tela precisa avisar o usuário, não travar.
5. Construam a interface com a liberdade que quiserem: lista de jogos, tabela de grupos, bandeiras, estádios — é com vocês.
6. Documentem os prompts à medida que forem trabalhando, não deixem pro final.
7. Subam tudo pro GitHub.

---

Se a API ficar instável durante a semana do desafio (é mantida por uma pessoa só, em domínio pessoal), avisem o professor.
