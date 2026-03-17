import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Chapters from "./Chapters"
import Characters from "./Characters"
import Aesthetic from "./Aesthetic"
import Timeline from "./Timeline"
import Relationships from "./Relationships"

export default function Story() {

  const [tab, setTab] = useState("chapters")
  const navigate = useNavigate()

  return (
    <div>
      <div className="header">

        <button onClick={() => navigate("/")}>
          ← Voltar
        </button>
      </div>

      <h1>Projeto</h1>

      <div className="tabs">

        <button onClick={() => setTab("aesthetic")}>
          Estética
        </button>

        <button onClick={() => setTab("characters")}>
          Personagens
        </button>

        <button onClick={() => setTab("chapters")}>
          Capítulos
        </button>

        <button onClick={() => setTab("timeline")}>
          Linha do Tempo
        </button>

        <button onClick={() => setTab("relationships")}>
          Diagrama
        </button>

      </div>

      {tab === "aesthetic" && <Aesthetic />}
      {tab === "characters" && <Characters />}
      {tab === "chapters" && <Chapters />}
      {tab === "timeline" && <Timeline />}
      {tab === "relationships" && <Relationships />}

    </div>
  )
}