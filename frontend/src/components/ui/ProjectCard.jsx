import Card from "./Card"
import { useNavigate } from "react-router-dom"
import { calcularProgresso } from "../../utils/progresso"
import { tempoRelativo } from "../../utils/tempo"
import { FiEdit2, FiTrash2 } from "react-icons/fi"

export default function ProjectCard({ projeto, onEdit, onDelete }) {

  const navigate = useNavigate()
  const progresso = calcularProgresso(projeto)

  return (
    <Card
      className="story-card"
      onClick={() => projeto?.id && navigate(`/project/${projeto.id}`)}
    >

      {/* TÍTULO */}
      <h3>{projeto?.titulo || "Novo Projeto"}</h3>

      {/* DESCRIÇÃO */}
      <p className="descricao">
        <strong>Descrição:</strong>{" "}
        {projeto?.descricao || "Sem descrição"}
      </p>

      {/* GÊNERO */}
      <p className="genero">
        Gênero: {projeto?.genero || "não definido"}
      </p>

      {/* CORES */}
      <div className="color-palette">
        {(projeto.estetica?.cores || []).map((cor, i) => (
          <div
            key={i}
            className="color-box"
            style={{ backgroundColor: cor }}
          />
        ))}
      </div>

      {/* HUMOR */}
      <p className="humor">
        {(projeto.estetica?.humores || []).join(", ")}
      </p>

      {/* TAGS */}
      <div className="tags">
        {(projeto.estetica?.tags || []).map((tag, i) => (
          <span key={i}>{tag}</span>
        ))}
      </div>

      <div className="card-spacer" />

      {/* PARTE FIXA */}
      <div className="card-progress">

        <p className="progress-label">Processo por Abas:</p>

        <div className="progresso">
          <div>
            <strong>{progresso.estetica || 0}%</strong>
            <span>Estética</span>
          </div>

          <div>
            <strong>{progresso.personagens || 0}</strong>
            <span>Personagens</span>
          </div>

          <div>
            <strong>{progresso.capitulos || 0}</strong>
            <span>Capítulos</span>
          </div>

          <div>
            <strong>{progresso.relacoes || 0}</strong>
            <span>Relações</span>
          </div>
        </div>

        <p className="last-edit">
          Última edição:{" "}
          {projeto?.atualizadoEm
            ? tempoRelativo(projeto.atualizadoEm)
            : "Sem edição"}
        </p>

      </div>

      {/* AÇÕES */}
      <div className="card-actions">

        <button
          className="edit"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(projeto)
          }}
        >
          <FiEdit2 className="icon-edit" />
        </button>

        <button
          className="delete"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(projeto)
          }}
        >
          <FiTrash2 className="icon-delete" />
        </button>

      </div>

    </Card>
  )
}
