import BaseModal from "./BaseModal"
import Button from "../ui/Button"
import { FiAlertTriangle } from "react-icons/fi"


export default function ConfirmModal({
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  onConfirm,
  onClose
}) {


  return (
    <BaseModal onClose={onClose}>


      {/* TÍTULO */}
      <div className="modal-header">
        <h3 className="modal-title">{title}</h3>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>


      {/* TEXTO */}
      <p className="modal-text">
        {message}
      </p>


      {/* ALERTA */}
      <div className="modal-warning">
        <FiAlertTriangle className="warning-icon" />
        <span>Esta ação não pode ser desfeita.</span>
      </div>


      {/* BOTÕES */}
      <div className="modal-actions">
        <Button variant="secondary" data-testid="cancel-delete" onClick={onClose}>
          Cancelar
        </Button>


        <Button variant="danger" data-testid="confirm-delete" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>


    </BaseModal>
  )
}
