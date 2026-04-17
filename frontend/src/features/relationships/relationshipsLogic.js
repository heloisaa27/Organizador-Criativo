export function gerarCor() {
  const cores = [
    "#fca5a5",
    "#93c5fd",
    "#86efac",
    "#fde68a",
    "#c4b5fd"
  ]
  return cores[Math.floor(Math.random() * cores.length)]
}


export function criarRelacao({ p1, p2, tipo, relacoes }) {
  const tipoFormatado = tipo.toLowerCase().trim()


  const nova = {
    id: Date.now(),
    p1: Number(p1),
    p2: Number(p2),
    tipo: tipoFormatado,
    cor: "#cccccc"
  }

  return [...relacoes, nova]
}


export function removerRelacao(relacoes, id) {
  return relacoes.filter(r => r.id !== id)
}
