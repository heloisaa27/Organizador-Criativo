import { useState } from "react"
import { salvarCapitulos } from "./chaptersStore"

import Button from "../../components/ui/Button"
import EmptyState from "../../components/ui/EmptyState"
import BaseModal from "../../components/modals/BaseModal"

import { FiEdit2, FiTrash2, FiBookOpen } from "react-icons/fi"

export default function Chapters({ projeto }) {

  const [capitulos, setCapitulos] = useState(projeto.capitulos || [])
  const [capituloAtivo, setCapituloAtivo] = useState(null)

  const [mostrarModal, setMostrarModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const [titulo, setTitulo] = useState("")

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
    if (!titulo.trim()) return

    let atualizados

    if (editando) {
      atualizados = capitulos.map(c =>
        c.id === editando.id
          ? { ...c, titulo }
          : c
      )
    } else {
      const novo = {
        id: Date.now(),
        titulo,
        texto: ""
      }

      atualizados = [...capitulos, novo]
    }

    setCapitulos(atualizados)
    salvarCapitulos(projeto.id, atualizados)

    setMostrarModal(false)
    setEditando(null)
  }

  function deletarConfirmado() {
    const atualizados = capitulos.filter(c => c.id !== confirmDelete.id)

    setCapitulos(atualizados)
    salvarCapitulos(projeto.id, atualizados)

    setConfirmDelete(null)
  }

  // =========================
  // LISTA
  // =========================

  if (!capituloAtivo) {
    return (
      <div>

        <h2>Capítulos</h2>

        <Button
          variant="primary"
          className="create-chapter-btn"
          onClick={abrirCriar}
        >
          + Criar Capítulo
        </Button>

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

            {capitulos.map((c) => (
              <div
                key={c.id}
                className="chapter-card"
                onClick={() => setCapituloAtivo(c)}
              >

                <h3>{c.titulo}</h3>

                <p className="chapter-preview">
                  {c.texto
                    ? c.texto.slice(0, 80) + "..."
                    : "Sem conteúdo ainda"}
                </p>

                <div className="card-actions">

                  <button
                    className="edit"
                    onClick={(e) => {
                      e.stopPropagation()
                      abrirEditar(c)
                    }}
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    className="delete"
                    onClick={(e) => {
                      e.stopPropagation()
                      setConfirmDelete(c)
                    }}
                  >
                    <FiTrash2 />
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

        {/* MODAL */}
        {mostrarModal && (
          <BaseModal onClose={() => setMostrarModal(false)}>

            <div className="modal-header">
              <h3 className="modal-title">
                {editando ? "Editar Capítulo" : "Novo Capítulo"}
              </h3>
            </div>

            <input
              placeholder="Título do capítulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setMostrarModal(false)}>
                Cancelar
              </Button>

              <Button variant="primary" onClick={salvar}>
                Salvar
              </Button>
            </div>

          </BaseModal>
        )}

        {/* DELETE */}
        {confirmDelete && (
          <BaseModal onClose={() => setConfirmDelete(null)}>

            <p className="modal-text">
              Deseja deletar <strong>{confirmDelete.titulo}</strong>?
            </p>

            <div className="modal-actions">
              <Button variant="danger" onClick={deletarConfirmado}>
                Deletar
              </Button>

              <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </Button>
            </div>

          </BaseModal>
        )}

      </div>
    )
  }

  // EDITOR

  return (
    <div className="chapter-editor">

      <Button
        variant="secondary"
        onClick={() => setCapituloAtivo(null)}
      >
        ← Voltar
      </Button>

      <h2>{capituloAtivo.titulo}</h2>

      <textarea
        className="chapter-textarea"
        value={capituloAtivo.texto || ""}
        onChange={(e) => {

          const novoTexto = e.target.value

          const atualizados = capitulos.map(c =>
            c.id === capituloAtivo.id
              ? { ...c, texto: novoTexto }
              : c
          )

          setCapitulos(atualizados)
          salvarCapitulos(projeto.id, atualizados)

          setCapituloAtivo({
            ...capituloAtivo,
            texto: novoTexto
          })
        }}
        placeholder="Escreva seu capítulo aqui..."
      />

    </div>
  )
}
