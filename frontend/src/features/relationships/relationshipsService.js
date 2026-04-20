const API_URL = "http://localhost:3000"


// GET
export async function getRelacoes(projetoId) {
  const res = await fetch(`${API_URL}/projetos/${projetoId}/relacoes`)
  return res.json()
}


// CREATE
export async function createRelacao(projetoId, data) {
  const res = await fetch(`${API_URL}/projetos/${projetoId}/relacoes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })


  if (!res.ok) {
    throw new Error("Erro ao criar relação")
  }


  return res.json()
}


// DELETE RELAÇÃO (individual)
export async function deleteRelacao(projetoId, id) {
  await fetch(`${API_URL}/projetos/${projetoId}/relacoes/${id}`, {
    method: "DELETE"
  })
}


// UPDATE COR POR TIPO
export async function updateCorTipoRelacao(projetoId, tipo, cor) {
  await fetch(`${API_URL}/projetos/${projetoId}/relacoes/tipo/${tipo}/cor`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ cor })
  })
}


// RENOMEAR TIPO
export async function renameTipoRelacao(projetoId, tipoAntigo, novoTipo) {
  await fetch(`${API_URL}/projetos/${projetoId}/relacoes/tipo/${tipoAntigo}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ novoTipo })
  })
}


// DELETE TIPO
export async function deleteTipoRelacao(projetoId, tipo) {
  await fetch(`${API_URL}/projetos/${projetoId}/relacoes/tipo/${tipo}`, {
    method: "DELETE"
  })
}


// RESET (NOVO)
export async function resetRelacoes(projetoId) {
  await fetch(`${API_URL}/projetos/${projetoId}/relacoes/reset`, {
    method: "DELETE"
  })
}
