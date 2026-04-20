const API_URL = "http://localhost:3000"


// GET
export async function getCapitulos(projetoId) {
  const res = await fetch(`${API_URL}/projetos/${projetoId}/capitulos`)


  if (!res.ok) {
    throw new Error("Erro ao buscar capítulos")
  }


  return res.json()
}


// CREATE
export async function createCapitulo(projetoId, capitulo) {
  const res = await fetch(`${API_URL}/projetos/${projetoId}/capitulos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(capitulo)
  })


  if (!res.ok) {
    throw new Error("Erro ao criar capítulo")
  }


  return res.json()
}


// UPDATE
export async function updateCapitulo(projetoId, capitulo) {
  const res = await fetch(
    `${API_URL}/projetos/${projetoId}/capitulos/${capitulo.id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(capitulo)
    }
  )


  if (!res.ok) {
    throw new Error("Erro ao atualizar capítulo")
  }


  return res.json()
}


// DELETE
export async function deleteCapitulo(projetoId, id) {
  const res = await fetch(
    `${API_URL}/projetos/${projetoId}/capitulos/${id}`,
    {
      method: "DELETE"
    }
  )


  if (!res.ok) {
    throw new Error("Erro ao deletar capítulo")
  }


  return res.json()
}


// REORDER
export async function updateOrdemCapitulos(projetoId, capitulos) {
  const res = await fetch(`${API_URL}/projetos/${projetoId}/capitulos/reordenar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ capitulos })
  })


  if (!res.ok) {
    const error = await res.text()
    console.error("Erro ao reordenar capítulos:", error)
    throw new Error("Erro ao reordenar capítulos")
  }
}

