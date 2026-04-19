import { useEffect } from "react"
import { FiCheck } from "react-icons/fi"

export default function Toast({ show, message, onClose }) {

  const testId = message
    ?.toLowerCase()
    .replace(/\s+/g, "-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")


  useEffect(() => {
    if (!show) return


    const timer = setTimeout(() => {
      onClose()
    }, 2500)


    return () => clearTimeout(timer)
  }, [show, onClose])


  if (!show) return null


  return (
    <div className="toast" data-testid={`toast-${testId}`}>
      <div className="toast__icon">
        <FiCheck />
      </div>
      <span className="toast__message">
        {message}
      </span>
    </div>
  )
}
