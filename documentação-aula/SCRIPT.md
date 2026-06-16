# 🤖 Documentação de Uso de IA (PROMPTS.md)

Este documento registra o uso da Inteligência Artificial (Gemini) como ferramenta de apoio durante o desenvolvimento do Front-end para o Desafio da Copa do Mundo 2026. 

Abaixo estão as interações principais, as sugestões da IA e as decisões tomadas pela equipe.

## 📝 Interação 1: Entendimento do Desafio e Planejamento
- **O que nós perguntamos (Prompt):** Enviamos o texto completo das regras do desafio (objetivo, formato, uso do Insomnia/Postman para pegar o token, endpoints disponíveis e critérios de avaliação).
- **O que a IA sugeriu:** A IA analisou as regras e propôs um "plano de jogo" focado nos critérios de maior peso, sugerindo começar pela definição da interface (ex: lista de jogos ou tabela) e garantindo desde o início a estrutura do `try/catch` para o tratamento de erros (10% da nota).
- **Nossa decisão:** Aceitamos a sugestão de começar pela listagem das seleções e enviar uma amostra real dos dados da API para a IA entender a estrutura antes de gerar o código.

## 📝 Interação 2: Estrutura Base e Tratamento de Erro
- **O que nós perguntamos (Prompt):** *[Enviamos o JSON real que a API retorna no endpoint `GET /get/teams`]* -> `"eu quero ussar essa api { "teams": [ { "_id": "...", "name_en": "Mexico", ... } ] }"`
- **O que a IA sugeriu:** A IA gerou a estrutura inicial dividida em `index.html`, `style.css` (usando CSS Grid para os cards das seleções) e `app.js`. O código JS já veio com o método `fetch` implementado e com o tratamento de erros exigido (tratando status 401 e 429), exibindo a mensagem visualmente no DOM em vez de apenas no console. A IA também sugeriu adicionar filtros na interface.
- **Nossa decisão:** O código base foi aceito porque atendeu perfeitamente à regra de "não travar a tela em caso de erro". Adotamos o uso do CSS Grid pois deixou o layout responsivo e limpo.

## 📝 Interação 3: Implementação de Filtros (Criatividade da Interface)
- **O que nós perguntamos (Prompt):** *"os dois busca para filtrar as seleções por nome, ou criar botões para filtrar as seleções por Grupo (A, B, C...)?"*
- **O que a IA sugeriu:** A IA sugeriu fazer a filtragem no **lado do cliente (front-end)** para otimizar a aplicação e não sobrecarregar a API com múltiplas requisições. Ela propôs:
  1. Salvar os dados da API em uma variável global (`todasAsSelecoes`).
  2. Gerar os botões de grupos dinamicamente usando `Set` (para extrair grupos únicos do JSON).
  3. Criar uma função combinada `.filter()` que verifica tanto o texto digitado quanto o grupo clicado simultaneamente.
- **Nossa decisão:** Aprovamos e aplicamos a lógica. A ideia de filtrar no front-end foi excelente para a performance e evita cair no erro `429 Too Many Requests` da API. A geração dinâmica de botões de grupos também deixou o código mais robusto (não precisamos criar os botões no HTML na mão).

## 📝 Interação 4: Consolidação do Código
- **O que nós perguntamos (Prompt):** *"quero codigo inteiro"*
- **O que a IA sugeriu:** A IA unificou os scripts e estilos em três blocos de código completos e limpos (`index.html`, `style.css` e `app.js`), garantindo que a seção de filtros ficasse oculta (`display: none`) até que os dados da API fossem carregados com sucesso.
- **Nossa decisão:** Utilizamos essa versão consolidada como o núcleo (core) do nosso projeto e base para os próximos commits no GitHub.

## 🎯 Conclusão sobre o uso da IA
A IA foi utilizada como uma assistente de desenvolvimento (Pair Programming). Em vez de pedir para ela "fazer o projeto inteiro de olhos fechados", fomos iterando passo a passo: primeiro a conexão, depois o layout, e por fim as lógicas de filtro. Isso garantiu que o código final fosse compreendido por toda a equipe e respeitasse estritamente a regra de usar **HTML, CSS e JS puros**. A IA ajudou a acelerar o processo, mas as decisões finais e a estruturação do projeto foram feitas por nós, garantindo que o resultado fosse autêntico e alinhado com as regras do desafio.