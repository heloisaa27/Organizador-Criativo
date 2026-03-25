import { useState } from "react"
import { salvarRelacoes } from "./relationshipsStore"

import Button from "../../components/ui/Button"
import EmptyState from "../../components/ui/EmptyState"
import BaseModal from "../../components/modals/BaseModal"

import { FiTrash2, FiHeart } from "react-icons/fi"

export default function Relationships({ projeto }) {

  const personagens = projeto.personagens || []
  const [relacoes, setRelacoes] = useState(projeto.relacoes || [])

  const [p1, setP1] = useState("")
  const [p2, setP2] = useState("")
  const [tipo, setTipo] = useState("")

  const [mostrarModal, setMostrarModal] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  // =========================
  // CRIAR
  // =========================

  function abrirModal() {
    setP1("")
    setP2("")
    setTipo("")
    setMostrarModal(true)
  }

  function adicionarRelacao() {
    if (!p1 || !p2) return

    const nova = {
      id: Date.now(),
      p1,
      p2,
      tipo
    }

    const atualizados = [...relacoes, nova]

    setRelacoes(atualizados)
    salvarRelacoes(projeto.id, atualizados)

    setMostrarModal(false)
  }

  // =========================
  // DELETE
  // =========================

  function deletarConfirmado() {
    const atualizados = relacoes.filter(r => r.id !== confirmDelete.id)

    setRelacoes(atualizados)
    salvarRelacoes(projeto.id, atualizados)

    setConfirmDelete(null)
  }

  return (
    <div>

      <h2>Relacionamentos</h2>

      <Button
        variant="primary"
        className="create-relationship-btn"
        onClick={abrirModal}
      >
        + Criar Relacionamento
      </Button>

      {/* EMPTY */}
      {relacoes.length === 0 ? (
        <EmptyState
          icon={FiHeart}
          title="Nenhum relacionamento mapeado"
          description="Conecte personagens para criar uma rede de relações"
          hint="Relacionamentos bem definidos dão profundidade à história"
          actionText="Criar Relacionamento"
          onAction={abrirModal}
        />
      ) : (
        <div className="relationships-grid">

          {relacoes.map((r) => (
            <div key={r.id} className="relationship-card">

              <div className="relationship-content">

                <h3>
                  {r.p1} <span className="link">↔</span> {r.p2}
                </h3>

                <p className="relationship-type">
                  {r.tipo || "Sem tipo definido"}
                </p>

              </div>

              <div className="card-actions">
                <button
                  className="delete"
                  onClick={() => setConfirmDelete(r)}
                >
                  <FiTrash2 />
                </button>
              </div>

            </div>
          ))}

        </div>
      )}

      {/* MODAL CRIAR */}
      {mostrarModal && (
        <BaseModal onClose={() => setMostrarModal(false)}>

          <div className="modal-header">
            <h3 className="modal-title">Novo Relacionamento</h3>
          </div>

          <select value={p1} onChange={(e) => setP1(e.target.value)}>
            <option value="">Personagem 1</option>
            {personagens.map(p => (
              <option key={p.id} value={p.nome}>
                {p.nome}
              </option>
            ))}
          </select>

          <select value={p2} onChange={(e) => setP2(e.target.value)}>
            <option value="">Personagem 2</option>
            {personagens.map(p => (
              <option key={p.id} value={p.nome}>
                {p.nome}
              </option>
            ))}
          </select>

          <input
            placeholder="Tipo (ex: amizade, rivalidade)"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          />

          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setMostrarModal(false)}>
              Cancelar
            </Button>

            <Button variant="primary" onClick={adicionarRelacao}>
              Criar
            </Button>
          </div>

        </BaseModal>
      )}

      {/* DELETE */}
      {confirmDelete && (
        <BaseModal onClose={() => setConfirmDelete(null)}>

          <p className="modal-text">
            Deletar relação entre{" "}
            <strong>{confirmDelete.p1}</strong> e{" "}
            <strong>{confirmDelete.p2}</strong>?
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
