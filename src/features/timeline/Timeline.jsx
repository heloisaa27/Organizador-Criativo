import { useState } from "react"
import { salvarCapitulos } from "../chapters/chaptersStore"

import Button from "../../components/ui/Button"
import EmptyState from "../../components/ui/EmptyState"

import { FiClock, FiArrowUp, FiArrowDown } from "react-icons/fi"

export default function Timeline({ projeto }) {

  const [capitulos, setCapitulos] = useState(projeto.capitulos || [])

  function moverCima(index) {
    if (index === 0) return

    const novos = [...capitulos]
    ;[novos[index], novos[index - 1]] = [novos[index - 1], novos[index]]

    setCapitulos(novos)
    salvarCapitulos(projeto.id, novos)
  }

  function moverBaixo(index) {
    if (index === capitulos.length - 1) return

    const novos = [...capitulos]
    ;[novos[index], novos[index + 1]] = [novos[index + 1], novos[index]]

    setCapitulos(novos)
    salvarCapitulos(projeto.id, novos)
  }

  return (
    <div>

      <h2>Linha do Tempo</h2>

      {capitulos.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="Nenhum capítulo na timeline"
          description="Organize seus capítulos na ordem da história"
          hint="A sequência correta melhora o fluxo narrativo"
          actionText="Criar Capítulo"
          onAction={() => {}}
        />
      ) : (
        <div className="timeline-container">

          {capitulos.map((c, index) => (
            <div key={c.id} className="timeline-item">

              <div className="timeline-marker" />

              <div className="timeline-card">

                <div className="timeline-header">
                  <span className="timeline-index">
                    Capítulo {index + 1}
                  </span>

                  <h3>{c.titulo}</h3>
                </div>

                <div className="timeline-actions">

                  <button
                    onClick={() => moverCima(index)}
                    disabled={index === 0}
                  >
                    <FiArrowUp />
                  </button>

                  <button
                    onClick={() => moverBaixo(index)}
                    disabled={index === capitulos.length - 1}
                  >
                    <FiArrowDown />
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}
