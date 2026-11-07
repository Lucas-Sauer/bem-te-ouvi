
// ==========================================
// BEM-TE-OUVI - APLICAÇÃO PRINCIPAL
// ==========================================

// Registros iniciais para quando a API estiver indisponível
const MOCK_INICIAL = [
  {
    id: 1,
    nome: "Bem-te-vi",
    bioma: "Mata Atlântica",
    data: "2026-11-05",
    nota: "Visto no topo da árvore."
  },
  {
    id: 2,
    nome: "Tucano-toco",
    bioma: "Amazônia",
    data: "2026-11-04",
    nota: "Vocalização ao entardecer."
  },
  {
    id: 3,
    nome: "Sabiá-laranja",
    bioma: "Cerrado",
    data: "2026-11-02",
    nota: "Canto territorial perto do lago."
  }
];

let avesDados = [];

// ==========================================
// 1. FUNÇÕES DO LOCALSTORAGE
// ==========================================

// Recupera os registros cadastrados localmente
function getAvesSalvas() {
  try {
    return JSON.parse(
      localStorage.getItem('aves_customizadas') || '[]'
    );
  } catch (error) {
    console.error('Erro ao recuperar registros:', error);
    return [];
  }
}

// Salva uma nova observação
function salvarNovaAveLocal(novaAve) {
  const salvas = getAvesSalvas();

  salvas.unshift(novaAve);

  localStorage.setItem(
    'aves_customizadas',
    JSON.stringify(salvas)
  );
}

// Recupera os IDs das aves excluídas
function getAvesExcluidas() {
  try {
    return JSON.parse(
      localStorage.getItem('aves_excluidas') || '[]'
    );
  } catch (error) {
    console.error('Erro ao recuperar exclusões:', error);
    return [];
  }
}

// Registra uma ave como excluída
function salvarAveExcluida(id) {
  const excluidas = getAvesExcluidas();

  if (!excluidas.some(item => String(item) === String(id))) {
    excluidas.push(id);
  }

  localStorage.setItem(
    'aves_excluidas',
    JSON.stringify(excluidas)
  );
}

// Remove uma ave dos registros personalizados
function removerAveLocal(id) {
  const salvas = getAvesSalvas().filter(
    ave => String(ave.id) !== String(id)
  );

  localStorage.setItem(
    'aves_customizadas',
    JSON.stringify(salvas)
  );
}

// ==========================================
// 2. OPERAÇÃO HTTP GET
// ==========================================

async function carregarAves() {
  let dadosBase = [];

  try {
    const response = await fetch('/api/aves');

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    dadosBase = await response.json();

  } catch (error) {
    console.error('Erro ao consultar API:', error);
    dadosBase = MOCK_INICIAL;
  }

  const salvas = getAvesSalvas();
  const excluidas = getAvesExcluidas();

  // Combina os registros da API com os registros locais
  avesDados = [...salvas, ...dadosBase].filter(ave =>
    !excluidas.some(
      id => String(id) === String(ave.id)
    )
  );

  renderizarCards(avesDados);
}

// ==========================================
// 3. COMPONENTE REUTILIZÁVEL: CARD DE AVE
// ==========================================

function renderizarCards(lista) {
  const container = document.getElementById('cards-container');

  if (!container) return;

  container.replaceChildren();

  if (lista.length === 0) {
    const mensagem = document.createElement('p');

    mensagem.className =
      'col-span-full text-center text-stone-500 py-8';

    mensagem.textContent = 'Nenhum registro encontrado.';

    container.appendChild(mensagem);
    return;
  }

  lista.forEach(ave => {
    const card = document.createElement('article');

    card.className =
      'bg-white rounded-xl shadow-sm border border-stone-200 p-5 hover:shadow-md transition-shadow flex flex-col justify-between';

    const conteudo = document.createElement('div');

    const cabecalho = document.createElement('div');
    cabecalho.className =
      'flex justify-between items-start mb-2';

    const nome = document.createElement('h3');
    nome.className = 'text-lg font-bold text-emerald-900';
    nome.textContent = ave.nome;

    const bioma = document.createElement('span');
    bioma.className =
      'text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full';
    bioma.textContent = ave.bioma;

    cabecalho.append(nome, bioma);

    const nota = document.createElement('p');
    nota.className = 'text-sm text-stone-600 mb-4';
    nota.textContent = ave.nota;

    conteudo.append(cabecalho, nota);

    const rodape = document.createElement('div');
    rodape.className =
      'pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-500';

    const data = document.createElement('span');
    data.textContent = `📅 ${ave.data}`;

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.textContent = 'Apagar';
    botao.className =
      'text-red-600 hover:text-red-800 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1';

    botao.setAttribute(
      'aria-label',
      `Apagar registro de ${ave.nome}`
    );

    botao.addEventListener('click', () => {
      eliminarAve(ave.id);
    });

    rodape.append(data, botao);

    card.append(conteudo, rodape);

    container.appendChild(card);
  });
}

// ==========================================
// 4. OPERAÇÃO HTTP DELETE
// ==========================================

async function eliminarAve(id) {
  if (!confirm('Tem certeza que deseja apagar este registro?')) {
    return;
  }

  try {
    const response = await fetch(
      `/api/aves?id=${encodeURIComponent(id)}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    // Registra a exclusão no navegador
    salvarAveExcluida(id);
    removerAveLocal(id);

    avesDados = avesDados.filter(
      ave => String(ave.id) !== String(id)
    );

    renderizarCards(avesDados);

    alert('Registro excluído com sucesso!');

  } catch (error) {
    console.error('Erro ao excluir:', error);

    alert(
      'Não foi possível excluir o registro. Verifique sua conexão e tente novamente.'
    );
  }
}

// ==========================================
// 5. EVENTOS DA APLICAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  carregarAves();

  // ----------------------------------------
  // INTERAÇÃO 1: PESQUISA EM TEMPO REAL
  // ----------------------------------------

  const campoPesquisa = document.getElementById('search-input');

  campoPesquisa?.addEventListener('input', event => {
    const termo = event.target.value.toLowerCase().trim();

    const filtrados = avesDados.filter(ave =>
      ave.nome.toLowerCase().includes(termo) ||
      ave.bioma.toLowerCase().includes(termo)
    );

    renderizarCards(filtrados);
  });

  // ----------------------------------------
  // INTERAÇÃO 2: CADASTRO E VALIDAÇÃO
  // ----------------------------------------

  const formCadastro = document.getElementById('form-cadastro');

  if (formCadastro) {

    formCadastro.addEventListener('submit', async event => {

      event.preventDefault();

      const campos = [
        'nome',
        'bioma',
        'data',
        'local',
        'nota'
      ];

      let formValido = true;

      // Valida os campos obrigatórios
      campos.forEach(campo => {

        const input = document.getElementById(campo);
        const msgErro = document.getElementById(`erro-${campo}`);

        if (!input || !input.value.trim()) {

          msgErro?.classList.remove('hidden');
          input?.classList.add('border-red-500');

          input?.setAttribute('aria-invalid', 'true');

          formValido = false;

        } else {

          msgErro?.classList.add('hidden');
          input.classList.remove('border-red-500');

          input.setAttribute('aria-invalid', 'false');
        }
      });

      if (!formValido) {
        alert('Preencha todos os campos obrigatórios.');
        return;
      }

      // Cria o objeto da nova observação
      const novoRegisto = {
        id: Date.now(),

        nome: document.getElementById('nome').value.trim(),

        bioma: document.getElementById('bioma').value,

        data: document.getElementById('data').value,

        local: document.getElementById('local').value.trim(),

        nota: document.getElementById('nota').value.trim()
      };

      let apiFuncionou = false;

      // ------------------------------------
      // OPERAÇÃO HTTP POST
      // ------------------------------------

      try {

        const response = await fetch('/api/aves', {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(novoRegisto)
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        apiFuncionou = true;

      } catch (error) {

        console.error('Erro ao cadastrar na API:', error);
      }

      // Salva localmente
      try {

        salvarNovaAveLocal(novoRegisto);

        if (apiFuncionou) {
          alert('Observação cadastrada com sucesso!');
        } else {
          alert(
            'Observação salva no navegador, mas a API não respondeu corretamente.'
          );
        }

        window.location.href = 'index.html';

      } catch (error) {

        console.error('Erro ao salvar localmente:', error);

        alert(
          'Não foi possível salvar a observação no navegador.'
        );
      }

    });
  }

});
