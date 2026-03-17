import { useState } from "react"

export default function ChapterEditor() {

  const [tab, setTab] = useState("writing")

  return (

    <div>

      <h2>Capítulo</h2>

      <div className="tabs">

        <button onClick={() => setTab("writing")}>
          Escrita
        </button>

        <button onClick={() => setTab("scenes")}>
          Cenas
        </button>

        <button onClick={() => setTab("characters")}>
          Personagens no Capítulo
        </button>

      </div>

      {tab === "writing" && (
        <textarea
          placeholder="Escreva o capítulo..."
          style={{width:"100%", height:"300px"}}
        />
      )}

    </div>

  )
}