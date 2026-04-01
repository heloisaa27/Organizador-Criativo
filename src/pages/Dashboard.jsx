import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

import { getProjetos, saveProjetos } from "../services/projetosService"

import ProjectCard from "../components/ui/ProjectCard"
import Button from "../components/ui/Button"
import EmptyState from "../components/ui/EmptyState"
import Input from "../components/ui/Input"

import ProjectModal from "../components/modals/ProjectModal"
import ConfirmModal from "../components/modals/ConfirmModal"

import { FiGrid } from "react-icons/fi"

export default function Dashboard() {

  const location = useLocation()

  const [projetos, setProjetos] = useState([])
  const [busca, setBusca] = useState("")
  const [mostrarModal, setMostrarModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  // carregar projetos
  useEffect(() => {
    const saved = getProjetos() || []
    setProjetos(saved)
  }, [location])

  // 🔍 FILTRO
  const projetosFiltrados = projetos.filter(p =>
    p.titulo.toLowerCase().includes(busca.toLowerCase())
  )

  // salvar projeto
  function handleSave(projeto) {

    let atualizados

    if (editando) {
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

  function editarProjeto(p) {
    setEditando(p)
    setMostrarModal(true)
  }

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

      {/* 🔍 BARRA DE BUSCA */}
      {projetos.length > 0 && (
        <Input
          placeholder="Buscar projeto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      )}


      <div className={`projects-grid ${projetos.length === 0 ? "empty" : ""}`}>

        {projetos.length === 0 ? (
          <EmptyState
            icon={FiGrid}
            title="Nenhum projeto encontrado"
            description="Tente outro nome ou crie um novo projeto"
            actionText="Criar Projeto"
            onAction={() => setMostrarModal(true)}
          />
        ) : (
          projetosFiltrados.map((p) => (
            <ProjectCard
              key={p.id}
              projeto={p}
              onEdit={editarProjeto}
              onDelete={setConfirmDelete}
            />
          ))
        )
        }

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
