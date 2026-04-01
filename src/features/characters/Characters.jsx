import { useState, useEffect } from "react"
import { salvarPersonagens } from "./characterStore"
import { salvarOuEditarPersonagem, deletarPersonagem } from "./characterLogic"
import { getTip } from "../../utils/tips"

import Button from "../../components/ui/Button"
import EmptyState from "../../components/ui/EmptyState"
import SectionStatus from "../../components/ui/SectionStatus"
import ConfirmModal from "../../components/modals/ConfirmModal"
import TipBox from "../../components/ui/TipBox"
import Toast from "../../components/ui/Toast"

import CharacterCard from "./components/CharacterCard"
import CharacterFormModal from "./components/CharacterFormModal"

import { FiUser, FiUsers } from "react-icons/fi"

export default function Characters({ projeto, setProjeto }) {

  const [personagens, setPersonagens] = useState(projeto.personagens || [])

  const [mostrarModal, setMostrarModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [papel, setPapel] = useState("")

  const [cores, setCores] = useState([])
  const [novaCor, setNovaCor] = useState("#000000")

  // sincroniza com projeto
  useEffect(() => {
    setPersonagens(projeto.personagens || [])
  }, [projeto.personagens])

  // TIP
  const tip = getTip("characters", projeto)

  function abrirCriar() {
    setNome("")
    setDescricao("")
    setPapel("")
    setCores([])
    setEditando(null)
    setMostrarModal(true)
  }

  function abrirEditar(p) {
    setNome(p.nome)
    setDescricao(p.descricao || "")
    setPapel(p.papel || "")
    setCores(p.cores || [])
    setEditando(p)
    setMostrarModal(true)
  }

  function salvar() {
    if (!nome.trim()) return

    const atualizados = salvarOuEditarPersonagem({
      personagens,
      editando,
      nome,
      descricao,
      papel,
      cores
    })

    setPersonagens(atualizados)

    setProjeto({
      ...projeto,
      personagens: atualizados
    })

    salvarPersonagens(projeto.id, atualizados)

    const mensagem = editando
      ? "Personagem atualizado com sucesso"
      : "Personagem criado com sucesso"

    setMostrarModal(false)
    setEditando(null)

    showToast(mensagem)


  }

  function deletarConfirmado() {
    const atualizados = deletarPersonagem(personagens, confirmDelete.id)

    setPersonagens(atualizados)

    setProjeto({
      ...projeto,
      personagens: atualizados
    })

    salvarPersonagens(projeto.id, atualizados)

    setConfirmDelete(null)

    showToast("Personagem deletado com sucesso")
  }

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

      <h2>Personagens</h2>

      {/* TIP */}
      <TipBox
        text={tip}
        color="blue"
      />

      <SectionStatus
        color="blue"
        icon={FiUsers}
        title={`${personagens.length} personagens fazem parte da sua história`}
        subtitle={
          personagens.length === 0
            ? "Comece criando seu primeiro personagem"
            : personagens.length < 4
              ? "Seu elenco está começando a ganhar forma"
              : personagens.length < 7
                ? "Seu elenco já está ficando completo"
                : "Você tem um elenco completo!"
        }
        lastEdited={projeto?.ultimaEdicaoPorAba?.characters}
      />

      <Button
        variant="primary"
        className="create-character-btn"
        onClick={abrirCriar}
      >
        + Criar Personagem
      </Button>

      {personagens.length === 0 ? (
        <EmptyState
          icon={FiUser}
          title="Nenhum personagem ainda"
          description="Crie o primeiro personagem da sua história"
          hint="Personagens bem construídos dão vida à narrativa"
          actionText="Criar Personagem"
          onAction={abrirCriar}
        />
      ) : (
        <div className="characters-grid">

          {personagens.map((p) => (
            <CharacterCard
              key={p.id}
              personagem={p}
              onEdit={abrirEditar}
              onDelete={setConfirmDelete}
            />
          ))}

        </div>
      )}

      {/* MODAL CRIAR / EDITAR */}
      {mostrarModal && (
        <CharacterFormModal
          onClose={() => setMostrarModal(false)}
          onSave={salvar}
          editando={editando}
          nome={nome} setNome={setNome}
          descricao={descricao} setDescricao={setDescricao}
          papel={papel} setPapel={setPapel}
          cores={cores} setCores={setCores}
          novaCor={novaCor} setNovaCor={setNovaCor}
        />
      )}

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <ConfirmModal
          title="Deletar personagem?"
          message={`Deseja deletar "${confirmDelete.nome}"?`}
          confirmText="Deletar"
          onConfirm={deletarConfirmado}
          onClose={() => setConfirmDelete(null)}
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
