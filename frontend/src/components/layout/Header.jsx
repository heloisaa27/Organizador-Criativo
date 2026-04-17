import { FiArrowLeft } from "react-icons/fi"

export default function Header({ titulo, subtitulo, onBack }) {
  return (
    <div className="header">

      <button className="back-btn" onClick={onBack}>
        <FiArrowLeft />
      </button>

      <div className="header-text">
        <h1>{titulo || "Novo Projeto"}</h1>
        <p>{subtitulo}</p>
      </div>

    </div>
  )
}
