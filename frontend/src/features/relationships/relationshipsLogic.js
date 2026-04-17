export function criarRelacao({ p1, p2, tipo, relacoes }) {


  const nova = {
    id: Date.now(),
    p1: Number(p1),
    p2: Number(p2),
    tipo: tipo.toLowerCase().trim()
  }


  return [...relacoes, nova]
}


export function removerRelacao(relacoes, id) {
  return relacoes.filter(r => r.id !== id)
}
