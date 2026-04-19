import { useState, useEffect } from "react"


import {
  getCapitulos,
  createCapitulo,
  updateCapitulo,
  deleteCapitulo
} from "./chaptersService"


import { getTip } from "../../utils/tips"


import Button from "../../components/ui/Button"
import EmptyState from "../../components/ui/EmptyState"
import SectionStatus from "../../components/ui/SectionStatus"
import ConfirmModal from "../../components/modals/ConfirmModal"
import TipBox from "../../components/ui/TipBox"
import Toast from "../../components/ui/Toast"
import Input from "../../components/ui/Input"


import ChapterCard from "./components/ChapterCard"
import ChapterEditor from "./components/ChapterEditor"
import ChapterFormModal from "./components/ChapterFormModal"


import { FiBookOpen, FiFileText, FiSearch } from "react-icons/fi"


export default function Chapters({ projeto }) {


  const [capitulos, setCapitulos] = useState([])
  const [capituloAtivo, setCapituloAtivo] = useState(null)


  const [busca, setBusca] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)


  const [titulo, setTitulo] = useState("")


  const [toast, setToast] = useState({
    show: false,
    message: ""
  })


  useEffect(() => {
    async function carregar() {
      const data = await getCapitulos(projeto.id)
      setCapitulos(data || [])
    }
    carregar()
  }, [projeto.id])


  const tip = getTip("chapters", projeto)


  const capitulosOrdenados = busca
    ? [...capitulos].sort((a, b) => {
      const aMatch = a.titulo.toLowerCase().includes(busca.toLowerCase())
      const bMatch = b.titulo.toLowerCase().includes(busca.toLowerCase())
      if (aMatch === bMatch) return 0
      return aMatch ? -1 : 1
    })
    : capitulos


  function showToast(message) {
    setToast({ show: true, message })
  }


  function abrirCriar() {
    setTitulo("")
    setEditando(null)
    setMostrarModal(true)
  }


  function abrirEditar(c) {
    setTitulo(c.titulo)
    setEditando(c)
    setMostrarModal(true)
  }


  async function salvar() {
    if (!titulo.trim()) return


    if (editando) {
      await updateCapitulo({
        ...editando,
        titulo
      })
    } else {
      await createCapitulo(projeto.id, { titulo })
    }


    const atualizados = await getCapitulos(projeto.id)
    setCapitulos(atualizados)


    setMostrarModal(false)
    setEditando(null)


    showToast(
      editando
        ? "Capítulo atualizado com sucesso"
        : "Capítulo criado com sucesso"
    )
  }


  async function deletarConfirmado() {
    await deleteCapitulo(confirmDelete.id)


    const atualizados = await getCapitulos(projeto.id)
    setCapitulos(atualizados)


    setConfirmDelete(null)


    showToast("Capítulo deletado com sucesso")
  }


  // LISTA
  if (!capituloAtivo) {
    return (
      <div>


        <h2>Capítulos</h2>


        <TipBox text={tip} color="yellow" />


        <SectionStatus
          color="yellow"
          icon={FiFileText}
          title={`Você já deu vida a ${capitulos.length} capítulos da sua história`}
        />


        <Button
          variant="primary"
          className="create-chapter-btn"
          onClick={abrirCriar}
        >
          + Criar Capítulo
        </Button>


        {capitulos.length > 0 && (
          <div className="input-icon">
            <FiSearch className="icon" />
            <Input
              placeholder="Buscar capítulo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        )}


        {capitulos.length === 0 ? (
          <EmptyState
            icon={FiBookOpen}
            title="Nenhum capítulo criado ainda"
            description="Crie o primeiro capítulo da sua história"
            hint="Alguma coisa sobre capitulos vou botar aqui depois"
            actionText="Criar Capítulo"
            onAction={abrirCriar}
          />
        ) : (
          <div className="chapters-grid">


            {capitulosOrdenados.map((c) => {
              const indexReal = capitulos.findIndex(cap => cap.id === c.id)


              return (
                <ChapterCard
                  key={c.id}
                  capitulo={c}
                  index={indexReal}
                  onOpen={setCapituloAtivo}
                  onEdit={abrirEditar}
                  onDelete={setConfirmDelete}
                />
              )
            })}


          </div>
        )}


        {mostrarModal && (
          <ChapterFormModal
            onClose={() => setMostrarModal(false)}
            onSave={salvar}
            editando={editando}
            titulo={titulo}
            setTitulo={setTitulo}
          />
        )}


        {confirmDelete && (
          <ConfirmModal
            title="Deletar capítulo?"
            message={`Deseja deletar "${confirmDelete.titulo}"?`}
            onConfirm={deletarConfirmado}
            onClose={() => setConfirmDelete(null)}
          />
        )}


        <Toast
          show={toast.show}
          message={toast.message}
          onClose={() => setToast({ show: false, message: "" })}
        />


      </div>
    )
  }


  // EDITOR
  return (
    <ChapterEditor
      capitulo={capituloAtivo}
      onBack={() => setCapituloAtivo(null)}
      onChange={async (novoTexto) => {


        await updateCapitulo({
          ...capituloAtivo,
          conteudo: novoTexto
        })


        const atualizado = {
          ...capituloAtivo,
          conteudo: novoTexto
        }


        setCapituloAtivo(atualizado)


        setCapitulos(prev =>
          prev.map(c =>
            c.id === atualizado.id ? atualizado : c
          )
        )
      }}
    />
  )
}
