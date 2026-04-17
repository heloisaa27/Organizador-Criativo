import { useState, useEffect } from "react"
import { salvarCapitulos } from "./chaptersStore"
import { salvarOuEditarCapitulo, deletarCapitulo, atualizarTexto } from "./chapterLogic"
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


export default function Chapters({ projeto, setProjeto }) {


  const [capitulos, setCapitulos] = useState(projeto.capitulos || [])
  const [capituloAtivo, setCapituloAtivo] = useState(null)


  const [busca, setBusca] = useState("") // ADICIONADO


  const [mostrarModal, setMostrarModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)


  const [titulo, setTitulo] = useState("")


  useEffect(() => {
    setCapitulos(projeto.capitulos || [])
  }, [projeto.capitulos])


  // TIP
  const tip = getTip("chapters", projeto)


  // PRIORIZAÇÃO
  const capitulosOrdenados = busca
    ? [...capitulos].sort((a, b) => {
      const aMatch = a.titulo.toLowerCase().includes(busca.toLowerCase())
      const bMatch = b.titulo.toLowerCase().includes(busca.toLowerCase())


      if (aMatch === bMatch) return 0
      return aMatch ? -1 : 1
    })
    : capitulos


  // CRIAR / EDITAR


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


  function salvar() {
    const atualizados = salvarOuEditarCapitulo({
      capitulos,
      editando,
      titulo
    })


    setCapitulos(atualizados)


    setProjeto({
      ...projeto,
      capitulos: atualizados
    })


    salvarCapitulos(projeto.id, atualizados)


    setMostrarModal(false)
    setEditando(null)


    const mensagem = editando
      ? "Capítulo atualizado com sucesso"
      : "Capítulo criado com sucesso"


    showToast(mensagem)
  }


  function deletarConfirmado() {
    const atualizados = deletarCapitulo(capitulos, confirmDelete.id)


    setCapitulos(atualizados)


    setProjeto({
      ...projeto,
      capitulos: atualizados
    })


    salvarCapitulos(projeto.id, atualizados)


    setConfirmDelete(null)


    showToast("Capítulo deletado com sucesso")
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


  // LISTA


  if (!capituloAtivo) {
    return (
      <div>


        <h2>Capítulos</h2>


        <TipBox
          text={tip}
          color="yellow"
        />


        <SectionStatus
          color="yellow"
          icon={FiFileText}
          title={`Você já deu vida a ${capitulos.length} capítulos da sua história`}
          subtitle={
            capitulos.length === 0
              ? "Comece criando seu primeiro capítulo"
              : capitulos.length < 5
                ? "Sua estrutura narrativa está começando"
                : capitulos.length < 10
                  ? "Sua história já está bem estruturada"
                  : "Estrutura narrativa bem desenvolvida"
          }
          lastEdited={projeto?.ultimaEdicaoPorAba?.chapters}
        />


        <Button
          variant="primary"
          className="create-chapter-btn"
          onClick={abrirCriar}
        >
          + Criar Capítulo
        </Button>


        {/* BUSCA */}
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
            description="Comece criando seu primeiro capítulo"
            hint="Organize sua história em capítulos para facilitar a escrita"
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


  // EDITOR


  return (
    <ChapterEditor
      capitulo={capituloAtivo}
      onBack={() => setCapituloAtivo(null)}
      onChange={(novoTexto) => {


        const atualizados = atualizarTexto(
          capitulos,
          capituloAtivo.id,
          novoTexto
        )


        setCapitulos(atualizados)
        salvarCapitulos(projeto.id, atualizados)


        setCapituloAtivo({
          ...capituloAtivo,
          texto: novoTexto
        })
      }}
    />
  )
}
