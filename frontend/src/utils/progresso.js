export function calcularProgresso(projeto) {


  let estetica = 0


  if (projeto.estetica?.cores?.length) estetica += 30
  if (projeto.estetica?.humores?.length) estetica += 30
  if (projeto.estetica?.tags?.length) estetica += 30
  if (projeto.estetica?.musicas?.length) estetica += 10


  const personagens = projeto.total_personagens || 0
  const capitulos = projeto.total_capitulos || 0
  const relacoes = projeto.total_relacoes || 0


  return {
    estetica,
    personagens,
    capitulos,
    relacoes
  }
}
