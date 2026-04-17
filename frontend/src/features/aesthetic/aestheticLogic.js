export function adicionarItem(lista, item) {
  if (!item) return lista
  if (lista.includes(item)) return lista
  return [...lista, item]
}

export function removerItem(lista, index) {
  return lista.filter((_, i) => i !== index)
}

export function toggleItem(lista, item) {
  if (lista.includes(item)) {
    return lista.filter(x => x !== item)
  }
  return [...lista, item]
}
