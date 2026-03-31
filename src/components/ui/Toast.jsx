import { useEffect } from "react"
import { FiCheck } from "react-icons/fi"


export default function Toast({ show, message, onClose }) {
  useEffect(() => {
    if (!show) return


    const timer = setTimeout(() => {
      onClose()
    }, 2500)


    return () => clearTimeout(timer)
  }, [show, onClose])


  if (!show) return null


  return (
    <div className="toast">
      <div className="toast__icon">
        <FiCheck />
      </div>


      <span className="toast__message">
        {message}
      </span>
    </div>
  )
}
