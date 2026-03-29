import { useState } from "react"
import { salvarCapitulos } from "../chapters/chaptersStore"
import EmptyState from "../../components/ui/EmptyState"

import { FiClock } from "react-icons/fi"
import { useEffect } from "react"

import SortableItem from "./components/SortableItem"

import { DndContext, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"


export default function Timeline({ projeto, setProjeto, setTab }) {

  const [capitulos, setCapitulos] = useState(projeto.capitulos || [])

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

  // ITEM ARRASTÁVEL

  function SortableItem({ capitulo, index }) {

    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
    } = useSortable({ id: capitulo.id })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="timeline-item"
      >
        <div className="timeline-marker" />

        <div className="timeline-card">

          {/* HEADER (drag aqui) */}
          <div
            className="timeline-header drag-area"
            {...attributes}
            {...listeners}
          >
            <h3>{capitulo.titulo}</h3>
          </div>

          {/* AÇÕES */}
          <div className="timeline-actions">

            <input
              type="number"
              className="timeline-index-input"
              defaultValue={index + 1}
              min={1}
              max={capitulos.length}
              onBlur={(e) => {
                const novoIndex = Number(e.target.value) - 1
                moverPara(index, novoIndex)
              }}
            />

          </div>

        </div>
      </div>
    )
  }

  // RENDER

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
