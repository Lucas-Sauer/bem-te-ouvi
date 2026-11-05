// Lista inicial padrão (caso a API ou o navegador estejam limpos)
const MOCK_INICIAL = [
  { id: 1, nome: "Bem-te-vi", bioma: "Mata Atlântica", data: "2026-11-05", nota: "Visto no topo da árvore." },
  { id: 2, nome: "Tucano-toco", bioma: "Amazônia", data: "2026-11-04", nota: "Vocalização ao entardecer." },
  { id: 3, nome: "Sabiá-laranja", bioma: "Cerrado", data: "2026-11-02", nota: "Canto territorial perto do lago." }
];

let avesDados = [];

// Funções para manipular o LocalStorage
function getAvesSalvas() {
  return JSON.parse(localStorage.getItem('aves_customizadas') || '[]');
}

function salvarNovaAveLocal(novaAve) {
  const salvas = getAvesSalvas();
  salvas.unshift(novaAve); // Adiciona a nova no início da lista
  localStorage.setItem('aves_customizadas', JSON.stringify(salvas));
}

function removerAveLocal(id) {
  const salvas = getAvesSalvas().filter(ave => ave.id !== id);
  localStorage.setItem('aves_customizadas', JSON.stringify(salvas));
}

// Operação HTTP GET + Leitura do LocalStorage
async function carregarAves() {
  let dadosBase = [];
  try {
    const response = await fetch('/api/aves');
    if (!response.ok) throw new Error('Falha na resposta da API');
    dadosBase = await response.json();
  } catch (error) {
    dadosBase = MOCK_INICIAL;
  }

  // Combina os registos salvos no navegador com os registos da API
  const salvas = getAvesSalvas();
  avesDados = [...salvas, ...dadosBase];
  renderizarCards(avesDados);
}

// Componente Reutilizável: Card de Ave
function renderizarCards(lista) {
  const container = document.getElementById('cards-container');
  if (!container) return;

  if (lista.length === 0) {
    container.innerHTML = `<p class="col-span-full text-center text-stone-500 py-8">Nenhum registo encontrado.</p>`;
    return;
  }

  container.innerHTML = lista.map(ave => `
    <article class="bg-white rounded-xl shadow-sm border border-stone-200 p-5 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-bold text-emerald-900">${ave.nome}</h3>
          <span class="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">${ave.bioma}</span>
        </div>
        <p class="text-sm text-stone-600 mb-4">${ave.nota}</p>
      </div>
      <div class="pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-500">
        <span>📅 ${ave.data}</span>
        <button onclick="eliminarAve(${ave.id})" class="text-red-600 hover:text-red-800 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1">
          Apagar
        </button>
      </div>
    </article>
  `).join('');
}

// Operação HTTP DELETE
async function eliminarAve(id) {
  if (confirm("Tem a certeza que deseja apagar este registo?")) {
    try {
      await fetch('/api/aves', { method: 'DELETE' });
    } catch (e) {
      console.log('Modo local');
    }
    
    // Remove do localStorage e da lista em memória
    removerAveLocal(id);
    avesDados = avesDados.filter(ave => ave.id !== id);
    renderizarCards(avesDados);
  }
}

// Eventos da página
document.addEventListener('DOMContentLoaded', () => {
  carregarAves();

  // Interação 1: Filtro de Pesquisa em Tempo Real
  document.getElementById('search-input')?.addEventListener('input', (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = avesDados.filter(ave => 
      ave.nome.toLowerCase().includes(termo) || 
      ave.bioma.toLowerCase().includes(termo)
    );
    renderizarCards(filtrados);
  });

  // Interação 2: Validação de Formulário e POST
  const formCadastro = document.getElementById('form-cadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
      e.preventDefault();

      const campos = ['nome', 'bioma', 'data', 'local', 'nota'];
      let formValido = true;

      campos.forEach(campo => {
        const input = document.getElementById(campo);
        const msgErro = document.getElementById(`erro-${campo}`);
        
        if (!input || !input.value.trim()) {
          msgErro?.classList.remove('hidden');
          input?.classList.add('border-red-500');
          formValido = false;
        } else {
          msgErro?.classList.add('hidden');
          input?.classList.remove('border-red-500');
        }
      });

      if (!formValido) return;

      const novoRegisto = {
        id: Date.now(), // Gera um ID único baseado no timestamp
        nome: document.getElementById('nome').value,
        bioma: document.getElementById('bioma').value,
        data: document.getElementById('data').value,
        local: document.getElementById('local').value,
        nota: document.getElementById('nota').value
      };

      // Tenta o POST na API Vercel e salva no localStorage
      try {
        await fetch('/api/aves', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoRegisto)
        });
      } catch (error) {
        console.log("Salvo apenas localmente");
      }

      // Salva no navegador e redireciona
      salvarNovaAveLocal(novoRegisto);
      alert("Observação registada com sucesso!");
      window.location.href = "index.html";
    });
  }
});