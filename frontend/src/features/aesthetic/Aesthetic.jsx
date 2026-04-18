import { useState, useEffect, useRef } from "react"
import { updateEstetica } from "./aestheticService"
import { adicionarItem, removerItem, toggleItem } from "./aestheticLogic"
import { getTip } from "../../utils/tips"


import { FiFeather } from "react-icons/fi"
import { calcularProgresso } from "../../utils/progresso"


import TipBox from "../../components/ui/TipBox"
import SectionStatus from "../../components/ui/SectionStatus"
import Toast from "../../components/ui/Toast"


import ImageSection from "./components/ImageSection"
import ColorSection from "./components/ColorSection"
import MusicSection from "./components/MusicSection"
import HumorSection from "./components/HumorSection"
import TagSection from "./components/TagSection"
import AestheticSidebar from "./components/AestheticSidebar"


export default function Aesthetic({ projeto, setProjeto }) {


  const carregadoRef = useRef(false)


  const [cores, setCores] = useState([])
  const [novaCor, setNovaCor] = useState("#000000")


  const [musicas, setMusicas] = useState([])


  const [humores, setHumores] = useState([])
  const [novoHumor, setNovoHumor] = useState("")


  const [tags, setTags] = useState([])
  const [novaTag, setNovaTag] = useState("")


  const [toast, setToast] = useState({
    show: false,
    message: ""
  })


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


  // ✅ CARREGAR APENAS UMA VEZ
  useEffect(() => {
    if (!projeto?.estetica || carregadoRef.current) return


    setCores(projeto.estetica.cores || [])
    setMusicas(projeto.estetica.musicas || [])
    setHumores(projeto.estetica.humores || [])
    setTags(projeto.estetica.tags || [])


    carregadoRef.current = true
  }, [projeto])


  // ✅ SALVAR SEM LOOP
  useEffect(() => {
    if (!projeto?.id) return


    const novaEstetica = {
      cores,
      musicas,
      humores,
      tags
    }


    const atual = projeto.estetica || {}


    const igual =
      JSON.stringify(atual) === JSON.stringify(novaEstetica)


    if (igual) return


    updateEstetica(projeto.id, novaEstetica)


    // ⚠️ mantém, mas agora não causa loop
    if (setProjeto) {
      setProjeto(prev => ({
        ...prev,
        estetica: novaEstetica
      }))
    }


  }, [cores, musicas, humores, tags])


  function showToast(message) {
    setToast({
      show: true,
      message
    })
  }


  // CORES
  function adicionarCor() {
    if (cores.length >= 5) {
      showToast("Máximo de 5 cores atingido")
      return
    }


    const novasCores = adicionarItem(cores, novaCor)
    if (novasCores.length === cores.length) return


    setCores(novasCores)
    showToast("Cor adicionada com sucesso")
  }


  function removerCor(index) {
    setCores(removerItem(cores, index))
    showToast("Cor removida com sucesso")
  }


  // PALETA DA IMAGEM
  function aplicarPaletaImagem(coresExtraidas) {
    setCores(prev => {
      const novas = [...prev]


      coresExtraidas.forEach(cor => {
        if (!novas.includes(cor) && novas.length < 5) {
          novas.push(cor)
        }
      })


      return novas
    })


    showToast("Paleta gerada a partir da imagem")
  }


  // HUMOR
  function toggleHumor(h) {
    setHumores(toggleItem(humores, h))
    showToast("Humor atualizado")
  }


  function adicionarHumorCustom() {
    const novosHumores = adicionarItem(humores, novoHumor)
    if (novosHumores.length === humores.length) return


    setHumores(novosHumores)
    setNovoHumor("")
    showToast("Humor adicionado")
  }


  function removerHumor(index) {
    setHumores(removerItem(humores, index))
    showToast("Humor removido")
  }


  // TAGS
  function adicionarTag() {
    const novasTags = adicionarItem(tags, novaTag)
    if (novasTags.length === tags.length) return


    setTags(novasTags)
    setNovaTag("")
    showToast("Tag adicionada")
  }


  function removerTag(index) {
    setTags(removerItem(tags, index))
  }


  // MÚSICAS
  function adicionarMusica(musica) {
    const novasMusicas = adicionarItem(musicas, musica)
    setMusicas(novasMusicas)
    showToast("Música adicionada")
  }


  function removerMusica(index) {
    const novasMusicas = removerItem(musicas, index)
    if (novasMusicas.length === musicas.length) return


    setMusicas(novasMusicas)
    showToast("Música removida")
  }


  const progresso = calcularProgresso({
    ...projeto,
    estetica: { cores, musicas, humores, tags }
  })


  const tip = getTip("aesthetic", projeto)


  return (
    <div className="aesthetic-page">


      <div className="aesthetic-header">
        <h2>Estética</h2>


        <TipBox text={tip} color="green" />


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


          <ImageSection onPaletteExtracted={aplicarPaletaImagem} />


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
            setToast({ show: false, message: "" })
          }
        />


      </div>
    </div>
  )
}
