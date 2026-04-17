const API_URL = "http://localhost:3000"


// GET
export async function getCapitulos(projetoId) {
  const res = await fetch(`${API_URL}/projetos/${projetoId}/capitulos`)
  return res.json()
}


// CREATE
export async function createCapitulo(projetoId, capitulo) {
  await fetch(`${API_URL}/projetos/${projetoId}/capitulos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(capitulo)
  })
}


// UPDATE
export async function updateCapitulo(capitulo) {
  await fetch(`${API_URL}/capitulos/${capitulo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(capitulo)
  })
}


// DELETE
export async function deleteCapitulo(id) {
  await fetch(`${API_URL}/capitulos/${id}`, {
    method: "DELETE"
  })
}

export async function updateOrdemCapitulos(capitulos) {
  await fetch(`${API_URL}/capitulos/reordenar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ capitulos })
  })
}
