# 🐦 Bem-Te-Ouvi — Plataforma de Observação de Aves

O **Bem-Te-Ouvi** é uma aplicação web responsiva voltada para entusiastas da ornitologia e observadores de aves. A aplicação permite catalogar, pesquisar, visualizar detalhes e registrar novos avistamentos de aves de forma simples, acessível e intuitiva.

🔗 **Link da Aplicação em Produção:** [bem-te-ouvi-steel.vercel.app](https://bem-te-ouvi-steel.vercel.app)

---

## 🎯 Objetivo do Projeto

Desenvolver uma aplicação Web funcional e acessível aplicando os conceitos da Unidade 2 (Desenvolvimento Web), integrando interface do usuário com consumo de API REST, validação avançada de formulários e práticas de acessibilidade (WCAG AA).

---

## 🚀 Funcionalidades e Requisitos Atendidos

### 📱 1. Telas Responsivas (Desktop e Mobile)
- **Home (`index.html`)**: Vitrine/catalogo de aves com busca e filtros rápidos.
- **Detalhes (`detalhes.html`)**: Exibição completa das informações, habitat e registros de uma ave selecionada.
- **Cadastro (`cadastro.html`)**: Formulário para inserção de novos avistamentos ou espécies.

### 🧩 2. Componentes Reutilizáveis
- **Navegação Global & Header/Footer**: Estrutura de menu responsivo utilizada de forma consistente em todas as páginas.
- **Cards de Exibição de Aves**: Componentes visuais padronizados para listagem de dados obtidos via API.

### 🕹️ 3. Interações do Usuário
- **Busca e Filtro em Tempo Real**: Pesquisa dinâmica pelo nome ou espécie da ave.
- **Modal / Exibição de Detalhes**: Visualização dinâmica e detalhada do avistamento.
- **Manipulação de Dados**: Ações diretas de cadastro, filtragem e remoção de registros.

### 📝 4. Formulário e Validações (`cadastro.html`)
Formulário composto por mais de 5 campos (Ex.: Nome da Ave, Nome Científico, Local do Avistamento, Data, Descrição/Observações), contando com:
- Validação de campos obrigatórios (*required*).
- Feedback visual instantâneo e tratamento de mensagens de erro ao usuário.

### 🌐 5. Consumo de API REST (`/api/aves.js`)
Implementação de requisições assíncronas utilizando a API Fetch, cobrindo as operações HTTP:
- **`GET`**: Busca e listagem dos dados das aves.
- **`POST`**: Envio de novos dados de avistamento cadastrados no formulário.
- **`DELETE`** / **`PUT`**: Remoção/atualização de registros.
- Tratamento adequado de respostas (`200 OK`, `201 Created`) e manipulação de falhas (`try/catch` com alerta ao usuário).

### ♿ 6. Acessibilidade e Performance
- Estruturação semântica do HTML (tags `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- Contraste adequado e navegação acessível via teclado em conformidade com as diretrizes **WCAG AA**.
- Pontuação focada em atingir **>90** nos testes de Acessibilidade do Google Lighthouse.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** (Estrutura semântica)
- **CSS3** (Estilização responsiva e layouts Flexbox/Grid)
- **JavaScript (ES6+)** (Consumo de API, manipulação do DOM e validações)
- **Serverless Functions / API Mock** (`/api/aves.js`)
- **Vercel** (Hospedagem e deploy contínuo em produção)
- **Git & GitHub** (Versionamento e controle de código)

---

## 👥 Integrantes do Grupo

- **Lucas Sauer**
- **Mateus**
- **joao schraiber**

---

## 📂 Estrutura do Repositório

```text
bem-te-ouvi/
├── api/
│   └── aves.js          # Endpoint/Handler da API REST (Mock/Serverless)
├── index.html           # Tela principal / Listagem de aves
├── detalhes.html        # Tela de detalhes da ave
├── cadastro.html        # Tela do formulário de cadastro
├── app.js               # Lógica de integração, manipulação do DOM e Fetch API
├── style.css            # Estilização global da aplicação
└── README.md            # Documentação do projeto
