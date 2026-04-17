import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { ptBR } from "date-fns/locale"

export function tempoRelativo(data) {
    return formatDistanceToNow(new Date(data), {
      addSuffix: true,
      locale: ptBR
    })
  }
