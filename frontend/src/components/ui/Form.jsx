export default function Form({ onSubmit, children }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(e)
      }}
      className="form"
    >
      {children}
    </form>
  )
}
