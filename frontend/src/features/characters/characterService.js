const API_URL = "http://localhost:3000"


// GET personagens do projeto
export async function getPersonagens(projetoId) {
  const res = await fetch(`${API_URL}/projetos/${projetoId}/personagens`)
  return res.json()
}


// POST criar personagem dentro do projeto
export async function createPersonagem(projetoId, personagem) {
  await fetch(`${API_URL}/projetos/${projetoId}/personagens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(personagem)
  })
}


// PUT editar personagem
export async function updatePersonagem(personagem) {
  await fetch(`${API_URL}/personagens/${personagem.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(personagem)
  })
}


// DELETE personagem
export async function deletePersonagem(id) {
  await fetch(`${API_URL}/personagens/${id}`, {
    method: "DELETE"
  })
}
