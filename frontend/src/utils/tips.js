export function getTip(aba, projeto, progresso) {

  // ESTÉTICA
  if (aba === "aesthetic") {
    if (!projeto.estetica?.cores?.length) {
      return "Comece definindo uma paleta de cores para sua história."
    }

    if (!projeto.estetica?.musicas?.length) {
      return "Adicionar músicas pode ajudar a definir o clima da narrativa."
    }

    return "Sua estética está bem construída."
  }

  // PERSONAGENS
  if (aba === "characters") {
    if (!projeto.personagens?.length) {
      return "Crie um personagem principal para iniciar sua história."
    }

    if (projeto.personagens.length < 3) {
      return "Adicione mais personagens para enriquecer a narrativa."
    }

    return "Seus personagens já estão bem desenvolvidos."
  }

  // RELAÇÕES
  if (aba === "relationships") {
    if (!projeto.relacoes?.length) {
      return "Crie relações entre personagens para dar profundidade."
    }

    return "Relacionamentos bem definidos fortalecem a história."
  }

  // TIMELINE
  if (aba === "timeline") {
    if (!projeto.capitulos?.length) {
      return "Organize seus capítulos para estruturar a narrativa."
    }

    if (projeto.capitulos.length < 3) {
      return "Sua linha do tempo está começando a tomar forma."
    }

    return "Sua timeline está bem organizada."
  }

  return "Continue desenvolvendo seu projeto."
}
