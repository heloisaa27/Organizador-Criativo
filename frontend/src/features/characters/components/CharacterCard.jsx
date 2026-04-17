import { FiEdit2, FiTrash2 } from "react-icons/fi"

export default function CharacterCard({ personagem, onEdit, onDelete }) {

  return (
    <div className="character-card">

      <div className="character-content">

        <div className="character-header">
          <div className="avatar" />

          <div>
            <h4>{personagem.nome || "Sem nome"}</h4>
            <span className="tag">
              {personagem.papel || "Sem papel"}
            </span>
          </div>
        </div>

        <p className="character-desc">
          {personagem.descricao || "Sem descrição"}
        </p>

        <div className="character-bars">
          {(personagem.cores || []).slice(0, 3).map((cor, i) => (
            <div key={cor + i} style={{ background: cor }} />
          ))}
        </div>

      </div>

      <div className="card-actions">

        <button
          className="edit"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(personagem)
          }}
        >
          <FiEdit2 className="icon-edit"/>
        </button>

        <button
          className="delete"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(personagem)
          }}
        >
          <FiTrash2 className="icon-delete" />
        </button>

      </div>

    </div>
  )
}
