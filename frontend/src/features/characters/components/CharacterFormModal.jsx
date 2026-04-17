import BaseModal from "../../../components/modals/BaseModal"
import Button from "../../../components/ui/Button"
import Input from "../../../components/ui/Input"
import Textarea from "../../../components/ui/Textarea"
import Form from "../../../components/ui/Form"

export default function CharacterFormModal({
  onClose,
  onSave,
  editando,
  nome, setNome,
  descricao, setDescricao,
  papel, setPapel,
  cores, setCores,
  novaCor, setNovaCor
}) {

  function adicionarCor() {
    if (!novaCor) return
    if (cores.includes(novaCor)) return
    setCores([...cores, novaCor])
  }

  function removerCor(index) {
    setCores(cores.filter((_, i) => i !== index))
  }

  function handleSubmit() {
    onSave()
  }

  return (
    <BaseModal onClose={onClose}>

      <div className="modal-header">
        <h3 className="modal-title">
          {editando ? "Editar Personagem" : "Novo Personagem"}
        </h3>

        <Button variant="ghost" onClick={onClose}>
          ✕
        </Button>
      </div>

      <Form onSubmit={handleSubmit}>

        <Input
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome do personagem"
          required
        />

        <Textarea
          label="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição do personagem"
        />

        <Input
          label="Papel"
          value={papel}
          onChange={(e) => setPapel(e.target.value)}
          placeholder="Ex: protagonista, antagonista..."
        />

        {/* CORES */}

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

          <Button type="button" variant="secondary" onClick={adicionarCor}>
            Adicionar
          </Button>

        </div>

        <div className="color-palette">
          {cores.map((cor, i) => (
            <div key={cor + i} className="tag-item">

              <div
                className="color-box"
                style={{ background: cor }}
              />

              <button
                type="button"
                className="remove-btn"
                onClick={() => removerCor(i)}
              >
                ✕
              </button>

            </div>
          ))}
        </div>

        {/* AÇÕES */}

        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
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
