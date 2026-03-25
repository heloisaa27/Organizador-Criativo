import { useState } from "react"
import { salvarPersonagens } from "./characterStore"

import Button from "../../components/ui/Button"
import EmptyState from "../../components/ui/EmptyState"
import BaseModal from "../../components/modals/BaseModal"

import { FiEdit2, FiTrash2, FiUser } from "react-icons/fi"

export default function Characters({ projeto }) {

  const [personagens, setPersonagens] = useState(projeto.personagens || [])

  const [mostrarModal, setMostrarModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [papel, setPapel] = useState("")

  const [cores, setCores] = useState([])
  const [novaCor, setNovaCor] = useState("#000000")

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

  function adicionarCor() {
    if (!novaCor) return
    if (cores.includes(novaCor)) return
    setCores([...cores, novaCor])
  }

  function removerCor(index) {
    setCores(cores.filter((_, i) => i !== index))
  }

  function salvar() {
    if (!nome.trim()) return

    let atualizados

    if (editando) {
      atualizados = personagens.map(p =>
        p.id === editando.id
          ? { ...p, nome, descricao, papel, cores }
          : p
      )
    } else {
      const novo = {
        id: Date.now(),
        nome,
        descricao,
        papel,
        cores
      }

      atualizados = [...personagens, novo]
    }

    setPersonagens(atualizados)
    salvarPersonagens(projeto.id, atualizados)

    setMostrarModal(false)
    setEditando(null)
  }

  function deletarConfirmado() {
    const atualizados = personagens.filter(p => p.id !== confirmDelete.id)
    setPersonagens(atualizados)
    salvarPersonagens(projeto.id, atualizados)
    setConfirmDelete(null)
  }

  return (
    <div>

      <h2>Personagens</h2>

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
            <div key={p.id} className="character-card">

              <div className="character-content">

                <div className="character-header">
                  <div className="avatar" />

                  <div>
                    <h4>{p.nome || "Sem nome"}</h4>
                    <span className="tag">
                      {p.papel || "Sem papel"}
                    </span>
                  </div>
                </div>

                <p className="character-desc">
                  {p.descricao || "Sem descrição"}
                </p>

                <div className="character-bars">
                  {(p.cores || []).slice(0, 3).map((cor, i) => (
                    <div key={i} style={{ background: cor }} />
                  ))}
                </div>

              </div>

              <div className="card-actions">

                <button
                  className="edit"
                  onClick={(e) => {
                    e.stopPropagation()
                    abrirEditar(p)
                  }}
                >
                  <FiEdit2 className="icon-edit" />
                </button>

                <button
                  className="delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    setConfirmDelete(p)
                  }}
                >
                  <FiTrash2 className="icon-delete" />
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* MODAL CRIAR / EDITAR */}
      {mostrarModal && (
        <BaseModal onClose={() => setMostrarModal(false)}>

          <div className="modal-header">
            <h3 className="modal-title">
              {editando ? "Editar Personagem" : "Novo Personagem"}
            </h3>

            <button
              className="modal-close"
              onClick={() => setMostrarModal(false)}
            >
              ✕
            </button>
          </div>

          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <input
            placeholder="Papel"
            value={papel}
            onChange={(e) => setPapel(e.target.value)}
          />

          <h4>Paleta de cores</h4>

          <div className="color-controls">

            <label className="color-add">
              +
              <input
                type="color"
                value={novaCor}
                onChange={(e) => setNovaCor(e.target.value)}
              />
            </label>

            <div
              className="color-preview"
              style={{ background: novaCor }}
            />

            <Button variant="secondary" onClick={adicionarCor}>
              Adicionar
            </Button>

          </div>

          <div className="color-palette">
            {cores.map((cor, i) => (
              <div className="tag-item" key={i}>
                <div
                  className="color-box"
                  style={{ background: cor }}
                />
                <button
                  className="remove-btn"
                  onClick={() => removerCor(i)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

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

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <BaseModal onClose={() => setConfirmDelete(null)}>

          <div className="modal-header">
            <h3 className="modal-title">Deletar personagem</h3>
          </div>

          <p className="modal-text">
            Deseja deletar <strong>{confirmDelete.nome}</strong>?
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
