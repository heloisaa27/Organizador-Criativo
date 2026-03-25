import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import { getProjetos, saveProjetos } from "../services/projetosService"

import ProjectCard from "../components/ui/ProjectCard"
import Button from "../components/ui/Button"
import EmptyState from "../components/ui/EmptyState"

import ProjectModal from "../components/modals/ProjectModal"
import ConfirmModal from "../components/modals/ConfirmModal"

export default function Dashboard() {

  const navigate = useNavigate()
  const location = useLocation()

  const [projetos, setProjetos] = useState([])
  const [mostrarModal, setMostrarModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  // carregar projetos
  useEffect(() => {
    const saved = getProjetos() || []
    setProjetos(saved)
  }, [location])

  // salvar projeto
  function handleSave(projeto) {

    let atualizados

    if (editando) {
      // edição
      atualizados = projetos.map(p =>
        p.id === projeto.id
          ? {
              ...p,
              ...projeto,
              atualizadoEm: new Date().toISOString()
            }
          : p
      )
    } else {
      // criação
      atualizados = [
        ...projetos,
        {
          ...projeto,
          id: Date.now(),

          capitulos: [],
          personagens: [],
          relacoes: [],

          estetica: {
            cores: [],
            imagem: null,
            musica: "",
            humor: "",
            tags: []
          },

          atualizadoEm: new Date().toISOString()
        }
      ]
    }

    setProjetos(atualizados)
    saveProjetos(atualizados)

    setMostrarModal(false)
    setEditando(null)
  }

  // editar
  function editarProjeto(p) {
    setEditando(p)
    setMostrarModal(true)
  }

  // deletar
  function deletarProjeto(id) {
    const atualizados = projetos.filter(p => p.id !== id)

    setProjetos(atualizados)
    saveProjetos(atualizados)

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

      <div className="projects-grid">

        {projetos.length === 0 ? (
          <EmptyState
            title="Nenhum projeto ainda"
            description="Crie sua primeira história"
            actionText="Criar Projeto"
            onAction={() => setMostrarModal(true)}
          />
        ) : (
          projetos.map((p) => (
            <ProjectCard
              key={p.id}
              projeto={p}
              onEdit={editarProjeto}
              onDelete={setConfirmDelete}
            />
          ))
        )}

      </div>

      {/* MODAL CRIAR / EDITAR */}
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

      {/* MODAL DELETE */}
      {confirmDelete && (
        <ConfirmModal
          projeto={confirmDelete}
          onConfirm={() => deletarProjeto(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
        />
      )}

    </div>
  )
}
