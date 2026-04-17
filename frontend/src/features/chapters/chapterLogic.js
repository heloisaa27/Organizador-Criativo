export function salvarOuEditarCapitulo({ capitulos, editando, titulo }) {
  if (editando) {
    return capitulos.map(c =>
      c.id === editando.id
        ? { ...c, titulo }
        : c
    )
  }

  return [
    ...capitulos,
    {
      id: Date.now(),
      titulo,
      texto: ""
    }
  ]
}

export function deletarCapitulo(capitulos, id) {
  return capitulos.filter(c => c.id !== id)
}

export function atualizarTexto(capitulos, id, novoTexto) {
  return capitulos.map(c =>
    c.id === id
      ? { ...c, texto: novoTexto }
      : c
  )
}
