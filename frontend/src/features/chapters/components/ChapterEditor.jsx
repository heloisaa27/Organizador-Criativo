import Button from "../../../components/ui/Button"
import { FiArrowLeft } from "react-icons/fi"

export default function ChapterEditor({
  capitulo,
  onBack,
  onChange
}) {

  return (
    <div className="chapter-editor-page">

      {/* HEADER */}
      <div className="editor-header">

        <Button variant="secondary" onClick={onBack} className="editor-back-btn">
          <FiArrowLeft />
          Voltar
        </Button>

        <h2 className="editor-title">
          {capitulo.titulo}
        </h2>

      </div>

      {/* ÁREA DE ESCRITA */}
      <div className="editor-container">

        <textarea
          className="chapter-editor-textarea"
          value={capitulo.texto || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Comece a escrever seu capítulo..."
        />

      </div>

    </div>
  )
}
