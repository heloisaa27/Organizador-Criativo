import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export default function SortableItem({
  capitulo,
  index,
  total,
  onMove
}) {
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
            max={total}
            onBlur={(e) => {
              const novoIndex = Number(e.target.value) - 1
              onMove(index, novoIndex)
            }}
          />

        </div>

      </div>
    </div>
  )
}
