export function atualizarEstetica(projetoId, novaEstetica) {
  const projetos = JSON.parse(localStorage.getItem("projetos")) || []

  const atualizados = projetos.map(p => {
    if (p.id !== projetoId) return p

    return {
      ...p,
      estetica: {
        ...p.estetica,
        ...novaEstetica
      },
      atualizadoEm: new Date().toISOString(),
      ultimaEdicaoPorAba: {
          ...p.ultimaEdicaoPorAba,
          aesthetic: new Date().toISOString()
      }
    }
  })

  localStorage.setItem("projetos", JSON.stringify(atualizados))
}
