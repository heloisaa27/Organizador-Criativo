import { useState, useEffect } from "react"
import { salvarCapitulos } from "../chapters/chaptersStore"
import EmptyState from "../../components/ui/EmptyState"
import SectionStatus from "../../components/ui/SectionStatus"
import TipBox  from "../../components/ui/TipBox"

import { FiClock, FiCalendar } from "react-icons/fi"
import SortableItem from "./components/SortableItem"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"
import { getTip } from "../../utils/tips"


export default function Timeline({ projeto, setProjeto, setTab }) {

  const [capitulos, setCapitulos] = useState(projeto.capitulos || [])
  const tip = getTip("timeline", projeto)

  useEffect(() => {
    setCapitulos(projeto.capitulos || [])
  }, [projeto.capitulos])

  // DRAG

  function handleDragEnd(event) {
    const { active, over } = event

    if (!over || active.id === over.id) return

    const oldIndex = capitulos.findIndex(c => c.id === active.id)
    const newIndex = capitulos.findIndex(c => c.id === over.id)

    const novos = arrayMove(capitulos, oldIndex, newIndex)

    setCapitulos(novos)

    setProjeto({
      ...projeto,
      capitulos: novos
    })

    salvarCapitulos(projeto.id, novos)
  }

  // INPUT (mover manual)

  function moverPara(indexAtual, novoIndex) {
    if (isNaN(novoIndex)) return
    if (novoIndex < 0 || novoIndex >= capitulos.length) return

    const novos = [...capitulos]
    const item = novos.splice(indexAtual, 1)[0]

    novos.splice(novoIndex, 0, item)

    setCapitulos(novos)

    setProjeto({
      ...projeto,
      capitulos: novos
    })

    salvarCapitulos(projeto.id, novos)
  }

  // RENDER

  return (
    <div>

      <h2>Linha do Tempo</h2>

      <TipBox 
        text={tip} 
        color="orange"
      />

      <SectionStatus
        color="orange"
        icon={FiCalendar}
        title={`Sua linha do tempo possui ${capitulos.length} capítulos`}
        subtitle={
          capitulos.length === 0
          ? "Adicione capítulos para estruturar a linha do tempo"
          : capitulos.length < 3
          ? "A sequência da história está começando a se formar"
          : capitulos.length < 6
          ? "Sua linha do tempo já está consistente"
          : "Linha do tempo bem organizada"
        }
      />

      {capitulos.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="Nenhum capítulo na timeline"
          description="Organize seus capítulos na ordem da história"
          hint="A sequência correta melhora o fluxo narrativo"
          actionText="Criar Capítulo"
          onAction={() => setTab("chapters")}
        />
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={capitulos.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="timeline-container">

              {capitulos.map((c, index) => (
                <SortableItem
                  key={c.id}
                  capitulo={c}
                  index={index}
                  total={capitulos.length}
                  onMove={moverPara}
                />
              ))}

            </div>
          </SortableContext>
        </DndContext>
      )}

    </div>
  )
}
