export function salvarRelacoes(projetoId, relacoes, tags) {

  const projetos = JSON.parse(localStorage.getItem("projetos")) || []

  const atualizados = projetos.map(p => {
    if (p.id === projetoId) {
      return {
        ...p,
        relacoes,
        tags, 
        atualizadoEm: new Date().toISOString(),
        ultimaEdicaoPorAba: {
            ...p.ultimaEdicaoPorAba,
            relationships: new Date().toISOString()
        }        
      }
    }
    return p
  })

  localStorage.setItem("projetos", JSON.stringify(atualizados))
}
