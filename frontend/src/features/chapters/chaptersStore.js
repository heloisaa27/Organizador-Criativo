export function salvarCapitulos(projetoId, capitulos) {

  const projetos = JSON.parse(localStorage.getItem("projetos")) || []

  const atualizados = projetos.map(p => {
    if (p.id === projetoId) {
      return {
        ...p,
        capitulos,
        atualizadoEm: new Date().toISOString(),
        ultimaEdicaoPorAba: {
            ...p.ultimaEdicaoPorAba,
            chapters: new Date().toISOString()
        }
      }
    }
    return p
  })

  localStorage.setItem("projetos", JSON.stringify(atualizados))
}
