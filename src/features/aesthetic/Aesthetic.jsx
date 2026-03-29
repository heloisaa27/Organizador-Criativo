  import { useState, useEffect } from "react"
  import { atualizarEstetica } from "./aestheticStore"
  import { adicionarItem, removerItem, toggleItem } from "./aestheticLogic"
  import { FiFeather } from "react-icons/fi"
  import { calcularProgresso } from "../../utils/progresso"

  import ColorSection from "./components/ColorSection"
  import MusicSection from "./components/MusicSection"
  import HumorSection from "./components/HumorSection"
  import TagSection from "./components/TagSection"
  import AestheticSidebar from "./components/AestheticSidebar"
  import SectionStatus from "../../components/ui/SectionStatus"

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

    // CORES

    function adicionarCor() {
      setCores(adicionarItem(cores, novaCor))
    }

    function removerCor(index) {
      setCores(removerItem(cores, index))
    }

    // HUMOR

    function toggleHumor(h) {
      setHumores(toggleItem(humores, h))
    }

    function adicionarHumorCustom() {
      setHumores(adicionarItem(humores, novoHumor))
      setNovoHumor("")
    }

    function removerHumor(index) {
      setHumores(removerItem(humores, index))
    }

    // TAGS

    function adicionarTag() {
      setTags(adicionarItem(tags, novaTag))
      setNovaTag("")
    }

    function removerTag(index) {
      setTags(removerItem(tags, index))
    }

    const progresso = calcularProgresso({
    ...projeto,
    estetica: { cores, musicas, humores, tags }
    })

    // RENDER

    return (
      <div className="aesthetic-page">
        <div className="aesthetic-header">
          <h2>Estética</h2>

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
              onAdd={(musica) => setMusicas(adicionarItem(musicas, musica))}
              onRemove={(index) => setMusicas(removerItem(musicas, index))}
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
        </div>
      </div>
    )
  }
