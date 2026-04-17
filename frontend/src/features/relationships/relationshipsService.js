const BASE = "http://localhost:3000/relacoes"


export async function getRelacoes(projetoId) {
  const res = await fetch(`${BASE}/projeto/${projetoId}`)
  return res.json()
}


export async function createRelacao(projetoId, data) {
  await fetch(`${BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      projeto_id: projetoId,
      ...data
    })
  })
}


export async function deleteRelacao(id) {
  await fetch(`${BASE}/${id}`, {
    method: "DELETE"
  })
}


export async function updateCorRelacao(id, cor) {
  await fetch(`${BASE}/${id}/cor`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cor })
  })
}
