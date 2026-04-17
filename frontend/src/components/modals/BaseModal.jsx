export default function BaseModal({ children, onClose }) {

  return (
    <div className="modal-overlay" onClick={onClose}>

      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>

    </div>
  )
}

