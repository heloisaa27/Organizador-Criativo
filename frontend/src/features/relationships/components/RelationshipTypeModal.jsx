import { useState } from "react"
import BaseModal from "../../../components/modals/BaseModal"
import ConfirmModal from "../../../components/modals/ConfirmModal"
import { FiEdit2, FiTrash2 } from "react-icons/fi"


export default function RelationshipTypeModal({
  tipo,
  relacoes,
  personagens,
  onClose,
  onChangeColor,
  onRenameTipo,
  onDeleteTipo
}) {


  const [editando, setEditando] = useState(false)
  const [novoNome, setNovoNome] = useState(tipo)


  const [confirmDelete, setConfirmDelete] = useState(false)


  const filtradas = relacoes.filter(r => r.tipo === tipo)


  function salvarEdicao() {
    if (novoNome.trim() && novoNome !== tipo) {
      onRenameTipo(tipo, novoNome.trim())
    }
    setEditando(false)
  }


  return (
    <BaseModal onClose={onClose}>


      {/* HEADER */}
      <div className="type-modal-header">


        {/* NOME */}
        {editando ? (
          <input
            className="type-input"
            value={novoNome}
            autoFocus
            onChange={(e) => setNovoNome(e.target.value)}
            onBlur={salvarEdicao}
            onKeyDown={(e) => {
              if (e.key === "Enter") salvarEdicao()
            }}
          />
        ) : (
          <h3>{tipo}</h3>
        )}


        {/* AÇÕES */}
        <div className="type-actions">


          {/* COR */}
          <div className="type-color-picker">
            <input
              type="color"
              value={filtradas[0]?.cor || "#cccccc"}
              onChange={(e) => onChangeColor(tipo, e.target.value)}
            />
            <div
              className="type-color-preview"
              style={{ background: filtradas[0]?.cor || "#ccc" }}
            />
          </div>


          {/* EDIT */}
          <button
            className="edit"
            onClick={() => setEditando(true)}
          >
            <FiEdit2 />
          </button>


          {/* DELETE */}
          <button
            className="delete"
            onClick={() => setConfirmDelete(true)}
          >
            <FiTrash2 />
          </button>


        </div>
      </div>


      {/* LISTA */}
      <div style={{ marginTop: "15px" }}>
        {filtradas.map(r => {


          const p1 = personagens.find(p => p.id === r.p1)
          const p2 = personagens.find(p => p.id === r.p2)


          return (
            <div key={r.id} className="relationship-item">
              <strong>{p1?.nome} ↔ {p2?.nome}</strong>
            </div>
          )
        })}
      </div>


      {/* CONFIRMAÇÃO DE DELETE */}
      {confirmDelete && (
        <ConfirmModal
          title="Excluir tipo de relacionamento?"
          message="Todas as relações desse tipo serão removidas. Essa ação não pode ser desfeita."
          confirmText="Excluir"
          onConfirm={() => {
            onDeleteTipo(tipo)
            setConfirmDelete(false)
            onClose()
          }}
          onClose={() => setConfirmDelete(false)}
        />
      )}


    </BaseModal>
  )
}
