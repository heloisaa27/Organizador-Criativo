import { FiEdit2, FiTrash2, FiFileText } from "react-icons/fi"


export default function ChapterCard({ capitulo, index, onOpen, onEdit, onDelete }) {


  const conteudo = capitulo.conteudo || ""


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
        {conteudo
          ? conteudo.length > 100
            ? conteudo.slice(0, 100) + "..."
            : conteudo
          : "Sem conteúdo ainda"}
      </p>


      <div className="chapter-footer">
        <span className="chapter-meta">
          <FiFileText className="icon-doc" />
          {conteudo.length} caracteres
        </span>
      </div>


      <div className="card-actions">


        <button
          className="edit"
          data-testid="edit-chapter"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(capitulo)
          }}
        >
          <FiEdit2 className="icon-edit"/>
        </button>


        <button
          className="delete"
          data-testid="delete-chapter"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(capitulo)
          }}
        >
          <FiTrash2 className="icon-delete"/>
        </button>


      </div>


    </div>
  )
}
