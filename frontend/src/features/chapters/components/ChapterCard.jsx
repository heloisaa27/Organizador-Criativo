import { FiEdit2, FiTrash2 } from "react-icons/fi"

export default function ChapterCard({
  capitulo,
  index,
  onOpen,
  onEdit,
  onDelete
}) {

  return (
    <div
      className="chapter-card card"
      onClick={() => onOpen(capitulo)}
    >

      <div className="chapter-header">
        <span className="chapter-index">
          Capítulo {index + 1}
        </span>

        <h3>{capitulo.titulo || "Sem título"}</h3>
      </div>

      <p className="chapter-preview">
        {capitulo.texto
          ? capitulo.texto.length > 100
            ? capitulo.texto.slice(0, 100) + "..."
            : capitulo.texto
          : "Sem conteúdo ainda"}
      </p>

      <div className="chapter-footer">
        <span>
          📄 {capitulo.texto?.length || 0} caracteres
        </span>
      </div>

      <div className="card-actions">

        <button
          className="edit"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(capitulo)
          }}
        >
          <FiEdit2 className="icon-edit" />
        </button>

        <button
          className="delete"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(capitulo)
          }}
        >
          <FiTrash2 className="icon-delete" />
        </button>

      </div>

    </div>
  )
}
