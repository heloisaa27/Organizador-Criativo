import BaseModal from "./BaseModal"
import Button from "../ui/Button"

export default function ConfirmModal({ onConfirm, onClose, projeto }) {

  return (
    <BaseModal onClose={onClose}>

      {/* TÍTULO */}
      <div className="modal-header">
        <h3 className="modal-title">Excluir Projeto</h3>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>

      {/* TEXTO */}
      <p className="modal-text">
        Você tem certeza de que deseja excluir o projeto{" "}
        <strong>"{projeto?.titulo}"</strong>?
      </p>

      {/* O ALERTA :o*/}
      <div className="modal-warning">
        ⚠️ Esta ação não pode ser desfeita. Todos os dados do projeto serão permanentemente removidos.
      </div>

      {/* BOTÕES */}
      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>

        <Button variant="danger" onClick={onConfirm}>
          Excluir Projeto
        </Button>
      </div>

    </BaseModal>
  )
}
