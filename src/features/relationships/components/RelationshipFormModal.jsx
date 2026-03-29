import BaseModal from "../../../components/modals/BaseModal"
import Button from "../../../components/ui/Button"
import Select from "../../../components/ui/Select"
import Input from "../../../components/ui/Input"



export default function RelationshipFormModal({
  personagens,
  tags,
  p1,
  p2,
  tipo,
  setP1,
  setP2,
  setTipo,
  onClose,
  onCreate
}) {

  return (
    <BaseModal onClose={onClose}>

      <div className="modal-header">
        <h3>Novo Relacionamento</h3>

        <Button variant="ghost" onClick={onClose}>
          ✕
        </Button>
      </div>

      <Select
        label="Personagem 1"
        value={p1}
        onChange={(e) => setP1(e.target.value)}
      >
        <option value="">Selecione</option>

        {personagens.map(p => (
          <option
            key={p.id}
            value={p.id}
            disabled={Number(p2) === p.id}
          >
            {p.nome}
          </option>
        ))}
      </Select>



      <Select
        label="Personagem 2"
        value={p2}
        onChange={(e) => setP2(e.target.value)}
      >
        <option value="">Selecione</option>

        {personagens.map(p => (
          <option
            key={p.id}
            value={p.id}
            disabled={Number(p1) === p.id}
          >
            {p.nome}
          </option>
        ))}
      </Select>

      <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
        Selecione um tipo existente:
      </p>

      <div className="tags-container">
        {tags.length === 0 ? (
          <p className="tags-empty">
            Nenhum tipo existente ainda.
          </p>
        ) : (
          tags.map(tag => (
            <div
              key={tag.nome}
              className={`tag ${tipo === tag.nome ? "active" : ""}`}
              style={{ background: tag.cor }}
              onClick={() => setTipo(tag.nome)}
            >
              {tag.nome}
            </div>
          ))
        )}
      </div>

      <Input
        label="Ou crie um novo tipo:"
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        placeholder="Ex: amizade, rivalidade..."
      />

      <Button onClick={onCreate}>
        Criar
      </Button>

    </BaseModal>
  )
}
