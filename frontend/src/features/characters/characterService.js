const API_URL = "http://localhost:3000"


// GET
export async function getPersonagens(projetoId) {
  const res = await fetch(`${API_URL}/projetos/${projetoId}/personagens`)
  return res.json()
}


// CREATE
export async function createPersonagem(projetoId, personagem) {
  const res = await fetch(`${API_URL}/projetos/${projetoId}/personagens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(personagem)
  })


  if (!res.ok) throw new Error("Erro ao criar personagem")
  return res.json()
}


// UPDATE
export async function updatePersonagem(projetoId, personagem) {
  await fetch(
    `${API_URL}/projetos/${projetoId}/personagens/${personagem.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(personagem)
    }
  )
}


// DELETE
export async function deletePersonagem(projetoId, id) {
  await fetch(
    `${API_URL}/projetos/${projetoId}/personagens/${id}`,
    {
      method: "DELETE"
    }
  )
}
