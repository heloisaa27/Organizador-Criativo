export function salvarOuEditarPersonagem({
  personagens,
  editando,
  nome,
  descricao,
  papel,
  cores
}) {
  if (editando) {
    return personagens.map(p =>
      p.id === editando.id
        ? { ...p, nome, descricao, papel, cores }
        : p
    )
  }

  return [
    ...personagens,
    {
      id: Date.now(),
      nome,
      descricao,
      papel,
      cores
    }
  ]
}

export function deletarPersonagem(personagens, id) {
  return personagens.filter(p => p.id !== id)
}
