const API_URL = "http://localhost:3000"


// GET
export async function getProjetos() {
  const res = await fetch(`${API_URL}/projetos`)
  return res.json()
}


// POST (criar)
export async function createProjeto(projeto) {
  await fetch(`${API_URL}/projetos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(projeto)
  })
}


// PUT (editar)
export async function updateProjeto(projeto) {
  await fetch(`${API_URL}/projetos/${projeto.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(projeto)
  })
}


// DELETE (deletar)
export async function deleteProjeto(id) {
  await fetch(`${API_URL}/projetos/${id}`, {
    method: "DELETE"
  })
}
