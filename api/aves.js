export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Retorna a lista de aves mockadas
  if (req.method === 'GET') {
    return res.status(200).json([
      { id: 1, nome: "Bem-te-vi", bioma: "Mata Atlântica", data: "2026-11-05", nota: "Visto no topo da árvore." },
      { id: 2, nome: "Tucano-toco", bioma: "Amazônia", data: "2026-11-04", nota: "Vocalização ao entardecer." },
      { id: 3, nome: "Sabiá-laranja", bioma: "Cerrado", data: "2026-11-02", nota: "Canto territorial perto do lago." }
    ]);
  }

  // POST: Simula a criação de uma nova observação
  if (req.method === 'POST') {
    return res.status(201).json({ message: "Observação registada com sucesso!" });
  }

  // DELETE: Simula a remoção de um registro
  if (req.method === 'DELETE') {
    return res.status(200).json({ message: "Registo removido com sucesso!" });
  }

  return res.status(405).json({ message: "Método não permitido" });
}