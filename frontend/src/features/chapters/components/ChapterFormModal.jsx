import BaseModal from "../../../components/modals/BaseModal"
import Button from "../../../components/ui/Button"
import Form from "../../../components/ui/Form"
import Input from "../../../components/ui/Input"

export default function ChapterFormModal({
  onClose,
  onSave,
  editando,
  titulo,
  setTitulo
}) {

  function handleSubmit() {
    onSave()
  }

  return (
    <BaseModal onClose={onClose}>

      <div className="modal-header">
        <h3 className="modal-title">
          {editando ? "Editar Capítulo" : "Novo Capítulo"}
        </h3>

        <Button variant="ghost" onClick={onClose}>
          ✕
        </Button>
      </div>

      <Form onSubmit={handleSubmit}>

        <Input
          label="Título do capítulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título do capítulo"
          required
        />

        <div className="modal-actions">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>

          <Button variant="primary" type="submit">
            Salvar
          </Button>
        </div>

      </Form>

    </BaseModal>
  )
}
