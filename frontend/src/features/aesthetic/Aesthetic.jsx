import { useState, useEffect } from "react"
import { atualizarEstetica } from "./aestheticStore"
import { adicionarItem, removerItem, toggleItem } from "./aestheticLogic"
import { getTip } from "../../utils/tips"

import { FiFeather } from "react-icons/fi"
import { calcularProgresso } from "../../utils/progresso"

import TipBox from "../../components/ui/TipBox"
import SectionStatus from "../../components/ui/SectionStatus"
import Toast from "../../components/ui/Toast"
import ColorSection from "./components/ColorSection"
import MusicSection from "./components/MusicSection"
import HumorSection from "./components/HumorSection"
import TagSection from "./components/TagSection"
import AestheticSidebar from "./components/AestheticSidebar"

export default function Aesthetic({ projeto, setProjeto }) {

  const [cores, setCores] = useState(projeto.estetica?.cores || [])
  const [novaCor, setNovaCor] = useState("#000000")

  const [musicas, setMusicas] = useState(projeto.estetica?.musicas || [])

  const [humores, setHumores] = useState(projeto.estetica?.humores || [])
  const [novoHumor, setNovoHumor] = useState("")

  const [tags, setTags] = useState(projeto.estetica?.tags || [])
  const [novaTag, setNovaTag] = useState("")

  const opcoesHumor = [
    "Sereno",
    "Melancólico",
    "Acolhedor",
    "Misterioso",
    "Intenso",
    "Alegre",
    "Sombrio",
    "Nostálgico"
  ]

  useEffect(() => {
    const novaEstetica = {
      cores,
      musicas,
      humores,
      tags
    }

    atualizarEstetica(projeto.id, novaEstetica)

    if (setProjeto) {
      setProjeto((prev) => ({
        ...prev,
        estetica: novaEstetica
      }))
    }
  }, [cores, musicas, humores, tags, projeto.id, setProjeto])

  function adicionarCor() {
    const novasCores = adicionarItem(cores, novaCor)
    if (novasCores.length === cores.length) return
    setCores(novasCores)
    showToast("Cor adicionada com sucesso")
  }


  function removerCor(index) {
    setCores(removerItem(cores, index))
    showToast("Cor removida com sucesso")
  }

  // HUMOR

  function toggleHumor(h) {
    setHumores(toggleItem(humores, h))
    showToast("Humor adicionado com sucesso")
  }

  function adicionarHumorCustom() {
    const novosHumores = adicionarItem(humores, novoHumor)
    if (novosHumores.length === humores.length) return
    setHumores(novosHumores)
    setNovoHumor("")
    showToast("Humor adicionado com sucesso")
  }

  function removerHumor(index) {
    setHumores(removerItem(humores, index))
    showToast("Humor removido com sucesso")
  }

  // TAGS

  function adicionarTag() {
    const novasTags = adicionarItem(tags, novaTag)

    if (novasTags.length === tags.length) return

    setTags(novasTags)
    setNovaTag("")
    showToast("Palavra-chave adicionada com sucesso")
  }


  function removerTag(index) {
    setTags(removerItem(tags, index))
  }


  function adicionarMusica(musica) {
    const novasMusicas = adicionarItem(musicas, musica)
    setMusicas(novasMusicas)
    showToast("Música adicionada com sucesso")
  }


  function removerMusica(index) {
    const novasMusicas = removerItem(musicas, index)

    if (novasMusicas.length === musicas.length) return

    setMusicas(novasMusicas)
    showToast("Música removida com sucesso")
  }

  const progresso = calcularProgresso({
  ...projeto,
  estetica: { cores, musicas, humores, tags }
  })

  const [toast, setToast] = useState({
    show: false,
    message: ""
  })

  function showToast(message) {
    setToast({
      show: true,
      message
    })
  }

  // TIP
  const tip = getTip("aesthetic", projeto)

  return (
    <div className="aesthetic-page">

      <div className="aesthetic-header">
        <h2>Estética</h2>

        {/* TIP */}
        <TipBox 
          text={tip} 
          color="green"
        />

        <SectionStatus
          color="green"
          icon={FiFeather}
          title="Progresso da Estética"
          subtitle={
            progresso.estetica === 0
              ? "Comece definindo a estética do seu projeto."
              : progresso.estetica < 40
              ? "Sua estética está começando a tomar forma."
              : progresso.estetica < 80
              ? "Sua estética já está bem desenvolvida."
              : "Estética completa! Ótimo trabalho."
          }
          progress={progresso.estetica || 0}
          showProgress
          lastEdited={projeto?.ultimaEdicaoPorAba?.aesthetic}
        />
      </div>

      <div className="aesthetic-main">

        <div className="aesthetic-content">

          <ColorSection
            cores={cores}
            novaCor={novaCor}
            setNovaCor={setNovaCor}
            onAdd={adicionarCor}
            onRemove={removerCor}
          />

            <MusicSection
              musicas={musicas}
              onAdd={adicionarMusica}
              onRemove={removerMusica}
            />

          <HumorSection
            opcoesHumor={opcoesHumor}
            humores={humores}
            novoHumor={novoHumor}
            setNovoHumor={setNovoHumor}
            onToggle={toggleHumor}
            onAddCustom={adicionarHumorCustom}
            onRemove={removerHumor}
          />
          <TagSection
            tags={tags}
            novaTag={novaTag}
            setNovaTag={setNovaTag}
            onAdd={adicionarTag}
            onRemove={removerTag}
          />
        </div>
        <AestheticSidebar
          cores={cores}
          humores={humores}
          musicas={musicas}
          tags={tags}
        />

          <Toast
            show={toast.show}
            message={toast.message}
            onClose={() =>
              setToast({
                show: false,
                message: ""
              })
            }
          />

      </div>
    </div>
  )
}
