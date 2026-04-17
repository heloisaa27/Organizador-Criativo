import { useState } from "react"
import { salvarRelacoes } from "./relationshipsStore"
import { criarRelacao, removerRelacao } from "./relationshipsLogic"
import { getTip } from "../../utils/tips"

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

  const personagens = projeto.personagens || []
  const [relacoes, setRelacoes] = useState(projeto.relacoes || [])
  const tags = projeto.tags || []

  const [mostrarModal, setMostrarModal] = useState(false)
  const [personagemSelecionado, setPersonagemSelecionado] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const [p1, setP1] = useState("")
  const [p2, setP2] = useState("")
  const [tipo, setTipo] = useState("")

  // TIP
  const tip = getTip("relationships", projeto)

  // CRIAR RELAÇÃO
  function adicionarRelacao() {
    if (!p1 || !p2 || !tipo) return

    if (p1 === p2) {
      alert("Um personagem não pode se relacionar com ele mesmo")
      return
    }

    const resultado = criarRelacao({
      p1,
      p2,
      tipo,
      relacoes,
      tags
    })

    setRelacoes(resultado.relacoes)

    setProjeto({
      ...projeto,
      relacoes: resultado.relacoes,
      tags: resultado.tags
    })

    salvarRelacoes(projeto.id, resultado.relacoes, resultado.tags)

    setMostrarModal(false)
    setTipo("")
    setP1("")
    setP2("")

    showToast("Relacionamento criado com sucesso")
  }

  function removerTipo(tipoNome) {
    const relacoesAtualizadas = relacoes.filter(
      r => r.tipo !== tipoNome
    )

    const tagsAtualizadas = tags.filter(
      t => t.nome !== tipoNome
    )

    setRelacoes(relacoesAtualizadas)

    setProjeto({
      ...projeto,
      relacoes: relacoesAtualizadas,
      tags: tagsAtualizadas
    })

    salvarRelacoes(projeto.id, relacoesAtualizadas, tagsAtualizadas)

    showToast("Relacionamento deletado com sucesso")
  }

  function resetarRelacoes() {
    setRelacoes([])

    setProjeto({
      ...projeto,
      relacoes: [],
      tags: []
    })

    salvarRelacoes(projeto.id, [], [])

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

  const relacoesDoPersonagem = relacoes.filter(r =>
    r.p1 === personagemSelecionado?.id ||
    r.p2 === personagemSelecionado?.id
  )


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

      {/* TIP */}
      <TipBox 
        text={tip} 
        color="pink"
      />

      <SectionStatus
        color="pink"
        icon={FiShare2}
        title={`${relacoes.length} relacionamentos conectam seus personagens`}
        subtitle={
          relacoes.length === 0
            ? "Conecte personagens para dar profundidade à narrativa"
            : relacoes.length < 4
            ? "As relações estão começando a se formar"
            : relacoes.length < 7
            ? "As conexões já estão bem definidas"
            : "Rede de relacionamentos bem desenvolvida"
        }
        lastEdited={projeto?.ultimaEdicaoPorAba?.relationships}
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
          description="Crie personagens primeiro"
          actionText={"Crie um Personagem"}
          onAction={() => setTab("characters")}
        />
      ) : (

        <div className="relationships-map">

          <RelationshipLegend
            tags={tags}
            onRemoveTipo={removerTipo}
          />

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
              relacoes: atualizados,
              tags
            })

            salvarRelacoes(projeto.id, atualizados, tags)
          }}

          onChangeColor={(tipo, novaCor) => {

            const novasTags = tags.map(t =>
              t.nome === tipo
                ? { ...t, cor: novaCor }
                : t
            )

            setProjeto({
              ...projeto,
              tags: novasTags
            })

            salvarRelacoes(projeto.id, relacoes, novasTags)
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
          message="Isso vai apagar todas as relações e tipos criados."
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
