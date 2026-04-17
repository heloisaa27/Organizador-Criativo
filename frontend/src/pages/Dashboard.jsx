import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"


import {
  getProjetos,
  createProjeto,
  updateProjeto,
  deleteProjeto
} from "../services/projetosService"


import ProjectCard from "../components/ui/ProjectCard"
import Button from "../components/ui/Button"
import EmptyState from "../components/ui/EmptyState"
import Input from "../components/ui/Input"


import ProjectModal from "../components/modals/ProjectModal"
import ConfirmModal from "../components/modals/ConfirmModal"


import { FiGrid, FiSearch } from "react-icons/fi"


export default function Dashboard() {


  const location = useLocation()


  const [projetos, setProjetos] = useState([])
  const [busca, setBusca] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)


  // carregar projetos
  useEffect(() => {
    async function carregar() {
      const saved = await getProjetos()
      setProjetos(saved || [])
    }


    carregar()
  }, [location])


  // ordenação
  const projetosOrdenados = [...projetos].sort((a, b) => {
    const aMatch = a.titulo.toLowerCase().includes(busca.toLowerCase())
    const bMatch = b.titulo.toLowerCase().includes(busca.toLowerCase())


    if (aMatch !== bMatch) {
      return aMatch ? -1 : 1
    }


    return new Date(b.atualizadoEm) - new Date(a.atualizadoEm)
  })


  // salvar projeto (AJUSTADO)
  async function handleSave(projeto) {


    if (editando) {
      const atualizado = {
        ...editando,
        ...projeto,
        atualizadoEm: new Date().toISOString()
      }


      await updateProjeto(atualizado)


    } else {
      // 🔥 REMOVIDO: personagens, capítulos, etc
      const novoProjeto = {
        ...projeto,
        atualizadoEm: new Date().toISOString()
      }


      await createProjeto(novoProjeto)
    }


    // recarrega
    const atualizados = await getProjetos()
    setProjetos(atualizados)


    setMostrarModal(false)
    setEditando(null)
  }


  function editarProjeto(p) {
    setEditando(p)
    setMostrarModal(true)
  }


  // DELETE
  async function deletarProjeto(id) {
    await deleteProjeto(id)


    const atualizados = await getProjetos()
    setProjetos(atualizados)


    setConfirmDelete(null)
  }


  return (
    <div className="dashboard">


      <h1>Organizador Criativo</h1>


      <Button
        variant="primary"
        className="create-project-btn"
        onClick={() => {
          setEditando(null)
          setMostrarModal(true)
        }}
      >
        + Criar Projeto
      </Button>


      <h2>Minhas Histórias</h2>


      {/* BARRA DE BUSCA */}
      {projetos.length > 0 && (
        <div className="input-icon">
          <FiSearch className="icon" />
          <Input
            placeholder="Buscar projeto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      )}


      <div className={`projects-grid ${projetos.length === 0 ? "empty" : ""}`}>


        {projetos.length === 0 ? (
          <EmptyState
            icon={FiGrid}
            title="Nenhum projeto ainda"
            description="Crie sua primeira história"
            actionText="Criar Projeto"
            onAction={() => setMostrarModal(true)}
          />
        ) : (
          projetosOrdenados.map((p) => (
            <ProjectCard
              key={p.id}
              projeto={p}
              onEdit={editarProjeto}
              onDelete={setConfirmDelete}
            />
          ))
        )}


      </div>


      {mostrarModal && (
        <ProjectModal
          projeto={editando}
          onClose={() => {
            setMostrarModal(false)
            setEditando(null)
          }}
          onSave={handleSave}
        />
      )}


      {confirmDelete && (
        <ConfirmModal
          title="Deletar projeto?"
          message={`Deseja deletar "${confirmDelete.titulo}"?`}
          projeto={confirmDelete}
          onConfirm={() => deletarProjeto(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
        />
      )}


    </div>
  )
}
