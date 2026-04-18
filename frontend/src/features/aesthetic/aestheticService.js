const BASE = "http://localhost:3000/projetos"


export async function updateEstetica(projetoId, estetica) {
  await fetch(`${BASE}/${projetoId}/estetica`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ estetica })
  })
}
