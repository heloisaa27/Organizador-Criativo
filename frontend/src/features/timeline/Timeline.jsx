import { useState, useEffect } from "react"
import { getCapitulos, updateOrdemCapitulos } from "../chapters/chaptersService"


import EmptyState from "../../components/ui/EmptyState"
import SectionStatus from "../../components/ui/SectionStatus"
import TipBox from "../../components/ui/TipBox"


import { FiClock, FiCalendar } from "react-icons/fi"
import SortableItem from "./components/SortableItem"
import { DndContext, closestCenter } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable"


import { getTip } from "../../utils/tips"


export default function Timeline({ projeto, setTab }) {


  const [capitulos, setCapitulos] = useState([])
  const tip = getTip("timeline", projeto)


  // CARREGAR
  useEffect(() => {
    async function carregar() {
      const data = await getCapitulos(projeto.id)
      setCapitulos(data || [])
    }
    carregar()
  }, [projeto.id])


  // DRAG
  async function handleDragEnd(event) {
    const { active, over } = event


    if (!over) return


    const activeId = Number(active.id)
    const overId = Number(over.id)


    if (activeId === overId) return


    const oldIndex = capitulos.findIndex(c => c.id === activeId)
    const newIndex = capitulos.findIndex(c => c.id === overId)


    // 🔥 proteção extra
    if (oldIndex === -1 || newIndex === -1) {
      console.error("Erro ao encontrar índices", { activeId, overId })
      return
    }


    const novos = arrayMove(capitulos, oldIndex, newIndex)


    setCapitulos(novos)


    const comOrdem = novos.map((c, index) => ({
      id: c.id,
      ordem: index
    }))


    await updateOrdemCapitulos(projeto.id, comOrdem)
  }


  // INPUT manual
  async function moverPara(indexAtual, novoIndex) {
    if (isNaN(novoIndex)) return
    if (novoIndex < 0 || novoIndex >= capitulos.length) return


    const novos = [...capitulos]
    const item = novos.splice(indexAtual, 1)[0]
    novos.splice(novoIndex, 0, item)


    setCapitulos(novos)


    const comOrdem = novos.map((c, index) => ({
      id: c.id,
      ordem: index
    }))


    await updateOrdemCapitulos(projeto.id, comOrdem)
  }


  return (
    <div>


      <h2>Linha do Tempo</h2>


      <TipBox text={tip} color="orange" />


      <SectionStatus
        color="orange"
        icon={FiCalendar}
        title={`Sua linha do tempo possui ${capitulos.length} capítulos`}
      />


      {capitulos.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="Nenhum capítulo na timeline"
          description="Crie um capítulo na sua história primeiro"
          hint="Depois volte aqui para os ordenar da forma que quiser"
          actionText="Criar Capítulo"
          onAction={() => setTab("chapters")}
        />
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={capitulos.map(c => String(c.id))} // 🔥 CORREÇÃO
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
