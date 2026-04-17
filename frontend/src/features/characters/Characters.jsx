import { useState, useEffect } from "react"
import {
  getPersonagens,
  createPersonagem,
  updatePersonagem,
  deletePersonagem
} from "./characterService"


import { getTip } from "../../utils/tips"


import Button from "../../components/ui/Button"
import EmptyState from "../../components/ui/EmptyState"
import SectionStatus from "../../components/ui/SectionStatus"
import ConfirmModal from "../../components/modals/ConfirmModal"
import TipBox from "../../components/ui/TipBox"
import Toast from "../../components/ui/Toast"
import Input from "../../components/ui/Input"


import CharacterCard from "./components/CharacterCard"
import CharacterFormModal from "./components/CharacterFormModal"


import { FiUser, FiUsers, FiSearch } from "react-icons/fi"


export default function Characters({ projeto }) {


  const [personagens, setPersonagens] = useState([])
  const [busca, setBusca] = useState("")


  const [mostrarModal, setMostrarModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)


  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [papel, setPapel] = useState("")


  const [cores, setCores] = useState([])
  const [novaCor, setNovaCor] = useState("#000000")


  // CARREGAR DO BACKEND
  useEffect(() => {
    async function carregar() {
      const data = await getPersonagens(projeto.id)
      setPersonagens(data || [])
    }


    carregar()
  }, [projeto.id])


  // ordenação
  const personagensOrdenados = busca
    ? [...personagens].sort((a, b) => {
      const aMatch = a.nome.toLowerCase().includes(busca.toLowerCase())
      const bMatch = b.nome.toLowerCase().includes(busca.toLowerCase())


      if (aMatch === bMatch) return 0
      return aMatch ? -1 : 1
    })
    : personagens


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


  // SALVAR
  async function salvar() {
    if (!nome.trim()) return


    if (editando) {
      await updatePersonagem({
        ...editando,
        nome,
        descricao,
        papel,
        cores
      })
    } else {
      await createPersonagem(projeto.id, {
        nome,
        descricao,
        papel,
        cores
      })
    }


    const atualizados = await getPersonagens(projeto.id)
    setPersonagens(atualizados)


    setMostrarModal(false)
    setEditando(null)


    showToast(
      editando
        ? "Personagem atualizado com sucesso"
        : "Personagem criado com sucesso"
    )
  }

  // DELETE 
  async function deletarConfirmado() {
    await deletePersonagem(confirmDelete.id)


    const atualizados = await getPersonagens(projeto.id)
    setPersonagens(atualizados)


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


      <TipBox text={tip} color="blue" />


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
      />


      <Button
        variant="primary"
        className="create-character-btn"
        onClick={abrirCriar}
      >
        + Criar Personagem
      </Button>


      {personagens.length > 0 && (
        <div className="input-icon">
          <FiSearch className="icon" />
          <Input
            placeholder="Buscar personagem..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      )}


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
          {personagensOrdenados.map((p) => (
            <CharacterCard
              key={p.id}
              personagem={p}
              onEdit={abrirEditar}
              onDelete={setConfirmDelete}
            />
          ))}
        </div>
      )}


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
