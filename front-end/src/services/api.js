const API_URL = "http://localhost:4000";

export async function fetchLojas() {
  const res = await fetch(`${API_URL}/lojas`);
  if (!res.ok) throw new Error("Erro ao buscar lojas");
  return res.json();
}

export async function fetchCaixasByLoja(lojaId, data) {
  const res = await fetch(`${API_URL}/lojas/${lojaId}/caixas?data=${data}`);
  if (!res.ok) throw new Error("Erro ao buscar caixas da loja");
  return res.json();
}

export async function fetchCaixa(caixaId) {
  const res = await fetch(`${API_URL}/caixas/${caixaId}`);
  if (!res.ok) throw new Error("Erro ao buscar caixa");
  return res.json();
}

export async function finalizarCaixa(caixaId) {
  const res = await fetch(`${API_URL}/caixas/${caixaId}/finalizar`, {
    method: "PATCH",
  });

  if (!res.ok) throw new Error("Erro ao finalizar caixa");
  return res.json();
}

export async function fetchTransacoes(caixaId) {
  const res = await fetch(`${API_URL}/caixas/${caixaId}/transacoes`);
  if (!res.ok) {
    throw new Error("Erro ao buscar transações do caixa.");
  }
  return res.json();
}
