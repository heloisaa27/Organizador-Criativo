import { useState, useEffect } from "react"
import { salvarRelacoes } from "./relationshipsService"
import { criarRelacao, removerRelacao } from "./relationshipsLogic"
import { getTip } from "../../utils/tips"

import { getPersonagens } from "../characters/characterService"

import Button from "../../components/ui/Button"
import EmptyState from "../../components/ui/EmptyState"
import SectionStatus from "../../components/ui/SectionStatus"
import ConfirmModal from "../../components/modals/ConfirmModal"
import TipBox from "../../components/ui/TipBox"
import Toast from "../../components/ui/Toast"


import RelationshipFormModal from "./components/RelationshipFormModal"
import RelationshipLegend from "./components/RelationshipLegend"
import RelationshipDetailsModal from "./components/RelationshipDetailsModal"
import RelationshipGraph from "./components/RelationshipGraph"


import { FiHeart, FiShare2 } from "react-icons/fi"


export default function Relationships({ projeto, setProjeto, setTab }) {

  const [personagens, setPersonagens] = useState([])

  const [relacoes, setRelacoes] = useState(projeto.relacoes || [])

  const [mostrarModal, setMostrarModal] = useState(false)
  const [personagemSelecionado, setPersonagemSelecionado] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const [p1, setP1] = useState("")
  const [p2, setP2] = useState("")
  const [tipo, setTipo] = useState("")

  // CARREGAR PERSONAGENS
  useEffect(() => {
    async function carregar() {
      const data = await getPersonagens(projeto.id)
      setPersonagens(data || [])
    }

    carregar()
  }, [projeto.id])

  // TAGS DERIVADAS
  const tags = [...new Set(relacoes.map(r => r.tipo))].map(nome => ({
    nome,
    cor: "#ccc"
  }))

  const tip = getTip("relationships", projeto)

  function adicionarRelacao() {
    if (!p1 || !p2 || !tipo) return

    if (p1 === p2) {
      alert("Um personagem não pode se relacionar com ele mesmo")
      return
    }

    const tipoNormalizado = tipo.trim().toLowerCase()

    const resultado = criarRelacao({
      p1,
      p2,
      tipo: tipoNormalizado,
      relacoes
    })

    setRelacoes(resultado)


    setProjeto({
      ...projeto,
      relacoes: resultado
    })

    salvarRelacoes(projeto.id, resultado)

    setMostrarModal(false)
    setTipo("")
    setP1("")
    setP2("")

    showToast("Relacionamento criado com sucesso")
  }

  function resetarRelacoes() {
    setRelacoes([])

    setProjeto({
      ...projeto,
      relacoes: []
    })

    salvarRelacoes(projeto.id, [])

    showToast("Relacionamentos resetados com sucesso")
  }

  const tamanho = 450
  const centro = tamanho / 2
  const raio = 170

  const posicoes = personagens.map((p, index) => {
    const angulo = (index / personagens.length) * 2 * Math.PI

    return {
      ...p,
      x: centro + Math.cos(angulo) * raio,
      y: centro + Math.sin(angulo) * raio
    }
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

  return (
    <div>


      <h2>Relacionamentos</h2>


      <TipBox text={tip} color="pink" />


      <SectionStatus
        color="pink"
        icon={FiShare2}
        title={`${relacoes.length} relacionamentos conectam seus personagens`}
      />


      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <Button onClick={() => setMostrarModal(true)}>
          + Criar Relacionamento
        </Button>


        <Button variant="danger" onClick={() => setConfirmReset(true)}>
          Resetar Relações
        </Button>
      </div>


      {personagens.length === 0 ? (
        <EmptyState
          icon={FiHeart}
          title="Nenhum personagem"
          onAction={() => setTab("characters")}
          actionText="Criar Personagens"
        />
      ) : (
        <div className="relationships-map">


          <RelationshipLegend tags={tags} />


          <RelationshipGraph
            relacoes={relacoes}
            posicoes={posicoes}
            tags={tags}
          />


          {posicoes.map(p => (
            <div
              key={p.id}
              className="relationship-node"
              style={{ left: p.x, top: p.y }}
              onClick={() => setPersonagemSelecionado(p)}
            >
              {p.nome}
            </div>
          ))}


        </div>
      )}


      {personagemSelecionado && (
        <RelationshipDetailsModal
          personagem={personagemSelecionado}
          personagens={personagens}
          relacoes={relacoes}
          tags={tags}
          onClose={() => setPersonagemSelecionado(null)}


          onDeleteRelacao={(id) => {
            const atualizados = removerRelacao(relacoes, id)


            setRelacoes(atualizados)


            setProjeto({
              ...projeto,
              relacoes: atualizados
            })


            salvarRelacoes(projeto.id, atualizados)
          }}
        />
      )}


      {mostrarModal && (
        <RelationshipFormModal
          personagens={personagens}
          tags={tags}
          p1={p1}
          p2={p2}
          tipo={tipo}
          setP1={setP1}
          setP2={setP2}
          setTipo={setTipo}
          onClose={() => setMostrarModal(false)}
          onCreate={adicionarRelacao}
        />
      )}


      {confirmReset && (
        <ConfirmModal
          title="Resetar relações?"
          confirmText="Resetar"
          onConfirm={() => {
            resetarRelacoes()
            setConfirmReset(false)
          }}
          onClose={() => setConfirmReset(false)}
        />
      )}


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
  )
}
