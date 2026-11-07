
export default function handler(req, res) {

  // Configurações de comunicação
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, DELETE, OPTIONS'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  // Trata requisições de preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ======================================
  // GET - CONSULTAR REGISTROS
  // ======================================

  if (req.method === 'GET') {

    const aves = [
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

    return res.status(200).json(aves);
  }

  // ======================================
  // POST - CADASTRAR OBSERVAÇÃO
  // ======================================

  if (req.method === 'POST') {

    const { id, nome, bioma, data, local, nota } = req.body || {};

    // Validação dos campos obrigatórios
    if (!id || !nome || !bioma || !data || !local || !nota) {

      return res.status(400).json({
        sucesso: false,
        message: "Todos os campos são obrigatórios."
      });
    }

    // Simulação de cadastro
    return res.status(201).json({
      sucesso: true,
      message: "Observação cadastrada com sucesso!",
      registro: {
        id,
        nome,
        bioma,
        data,
        local,
        nota
      }
    });
  }

  // ======================================
  // DELETE - EXCLUIR REGISTRO
  // ======================================

  if (req.method === 'DELETE') {

    const id = req.query?.id;

    if (!id) {
      return res.status(400).json({
        sucesso: false,
        message: "ID do registro não informado."
      });
    }

    // Simulação de exclusão
    return res.status(200).json({
      sucesso: true,
      message: "Solicitação de exclusão recebida.",
      id: id
    });
  }

  // ======================================
  // MÉTODO NÃO PERMITIDO
  // ======================================

  return res.status(405).json({
    sucesso: false,
    message: "Método HTTP não permitido."
  });
}
