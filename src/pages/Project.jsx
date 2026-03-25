import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

import MainLayout from "../components/layout/MainLayout"
import Header from "../components/layout/Header"
import Tabs from "../components/layout/Tabs"

import Aesthetic from "../features/aesthetic/Aesthetic"
import Characters from "../features/characters/Characters"
import Chapters from "../features/chapters/Chapters"
import Timeline from "../features/timeline/Timeline"
import Relationships from "../features/relationships/Relationships"

export default function Project() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [projeto, setProjeto] = useState(null)
  const [tab, setTab] = useState("aesthetic")

  // carregar projeto com segurança
  useEffect(() => {
    try {
      const projetos = JSON.parse(localStorage.getItem("projetos")) || []
      const encontrado = projetos.find(p => p.id === Number(id))
      setProjeto(encontrado)
    } catch {
      setProjeto(null)
    }
  }, [id])

  const tabs = [
    { id: "aesthetic", label: "Estética" },
    { id: "characters", label: "Personagens" },
    { id: "chapters", label: "Capítulos" },
    { id: "timeline", label: "Linha do Tempo" },
    { id: "relationships", label: "Relacionamentos" }
  ]

  function renderTab() {
    switch (tab) {
      case "aesthetic":
        return <Aesthetic projeto={projeto} />

      case "characters":
        return <Characters projeto={projeto} />

      case "chapters":
        return <Chapters projeto={projeto} />

      case "timeline":
        return <Timeline projeto={projeto} />

      case "relationships":
        return <Relationships projeto={projeto} />

      default:
        return null
    }
  }

  // carregando
  if (projeto === null) {
    return <p style={{ padding: "20px" }}>Carregando...</p>
  }

  // projeto não encontrado
  if (!projeto) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Projeto não encontrado</h2>
        <button onClick={() => navigate("/")}>
          Voltar
        </button>
      </div>
    )
  }

  return (
    <MainLayout>

      <Header
        titulo={projeto.titulo}
        subtitulo="Gerencie sua história"
        onBack={() => navigate("/")}
      />

      <Tabs
        tabs={tabs}
        active={tab}
        onChange={setTab}
      />

      {renderTab()}

    </MainLayout>
  )
}
