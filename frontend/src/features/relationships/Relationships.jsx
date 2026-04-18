import { useState, useEffect } from "react"
import {
  getRelacoes,
  createRelacao,
  deleteRelacao,
  updateCorRelacao
} from "./relationshipsService"


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
import RelationshipTypeModal from "./components/RelationshipTypeModal"


import { FiHeart, FiShare2 } from "react-icons/fi"


export default function Relationships({ projeto, setTab }) {


  const [personagens, setPersonagens] = useState([])
  const [relacoes, setRelacoes] = useState([])


  const [mostrarModal, setMostrarModal] = useState(false)
  const [personagemSelecionado, setPersonagemSelecionado] = useState(null)
  const [tipoSelecionado, setTipoSelecionado] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)


  const [p1, setP1] = useState("")
  const [p2, setP2] = useState("")
  const [tipo, setTipo] = useState("")


  const [toast, setToast] = useState({
    show: false,
    message: ""
  })


  function showToast(message) {
    setToast({ show: true, message })
  }


  useEffect(() => {
    async function carregar() {
      const personagensData = await getPersonagens(projeto.id)
      const relacoesData = await getRelacoes(projeto.id)


      setPersonagens(personagensData || [])
      setRelacoes(relacoesData || [])
    }


    carregar()
  }, [projeto.id])


  const tip = getTip("relationships", projeto)


  const tags = Object.values(
    relacoes.reduce((acc, r) => {
      if (!acc[r.tipo]) {
        acc[r.tipo] = {
          nome: r.tipo,
          cor: r.cor || "#cccccc"
        }
      }
      return acc
    }, {})
  )


  async function adicionarRelacao() {
    if (!p1 || !p2 || !tipo) return


    if (p1 === p2) {
      alert("Um personagem não pode se relacionar com ele mesmo")
      return
    }


    // procura se já existe esse tipo e pega a cor
    const tipoExistente = relacoes.find(r => r.tipo === tipo)


    const cor = tipoExistente?.cor || "#cccccc"


    await createRelacao(projeto.id, {
      p1,
      p2,
      tipo,
      cor // agora envia a cor
    })


    const atualizadas = await getRelacoes(projeto.id)
    setRelacoes(atualizadas)


    setMostrarModal(false)
    setTipo("")
    setP1("")
    setP2("")


    showToast("Relacionamento criado com sucesso")
  }


  async function deletarRelacao(id) {
    await deleteRelacao(id)
    const atualizadas = await getRelacoes(projeto.id)
    setRelacoes(atualizadas)
  }


  async function alterarCorPorTipo(tipo, novaCor) {
    await fetch(`http://localhost:3000/relacoes/tipo/${tipo}/cor`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cor: novaCor })
    })


    const atualizadas = await getRelacoes(projeto.id)
    setRelacoes(atualizadas)
  }


  async function renomearTipo(tipoAntigo, novoTipo) {
    await fetch(`http://localhost:3000/relacoes/tipo/${tipoAntigo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ novoTipo })
    })


    const atualizadas = await getRelacoes(projeto.id)
    setRelacoes(atualizadas)

    setTipoSelecionado(novoTipo)
  }



  async function deletarTipo(tipo) {
    await fetch(`http://localhost:3000/relacoes/tipo/${tipo}`, {
      method: "DELETE"
    })


    const atualizadas = await getRelacoes(projeto.id)
    setRelacoes(atualizadas)
  }


  function resetarRelacoes() {
    setRelacoes([])
    showToast("Relacionamentos resetados (local)")
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
          title="Nenhum personagem criado"
          description="Crie um personagem na sua história primeiro"
          hint="Depois volte aqui para mapear os relacionamenos"
          onAction={() => setTab("characters")}
          actionText="Criar Personagens"
        />
      ) : (
        <div className="relationships-layout">


          <RelationshipLegend
            tags={tags}
            onOpenDetails={setTipoSelecionado}
          />


          <div className="relationships-map">


            <RelationshipGraph
              relacoes={relacoes}
              posicoes={posicoes}
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


        </div>
      )}


      {tipoSelecionado && (
        <RelationshipTypeModal
          tipo={tipoSelecionado}
          relacoes={relacoes}
          personagens={personagens}
          onClose={() => setTipoSelecionado(null)}
          onChangeColor={alterarCorPorTipo}
          onRenameTipo={renomearTipo}
          onDeleteTipo={deletarTipo}
        />
      )}


      {personagemSelecionado && (
        <RelationshipDetailsModal
          personagem={personagemSelecionado}
          personagens={personagens}
          relacoes={relacoes}
          onClose={() => setPersonagemSelecionado(null)}
          onDeleteRelacao={deletarRelacao}
        />
      )}


      {mostrarModal && (
        <RelationshipFormModal
          personagens={personagens}
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
          setToast({ show: false, message: "" })
        }
      />


    </div>
  )
}
