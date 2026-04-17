import BaseModal from "../../../components/modals/BaseModal"
import Button from "../../../components/ui/Button"
import Select from "../../../components/ui/Select"
import Input from "../../../components/ui/Input"


export default function RelationshipFormModal({
  personagens,
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
        onChange={(e) => {
          const value = e.target.value
          setP1(value ? Number(value) : "")
        }}
      >
        <option value="">Selecione</option>


        {personagens.map(p => (
          <option
            key={p.id}
            value={p.id}
            disabled={p2 === p.id}
          >
            {p.nome}
          </option>
        ))}
      </Select>


      <Select
        label="Personagem 2"
        value={p2}
        onChange={(e) => {
          const value = e.target.value
          setP2(value ? Number(value) : "")
        }}
      >
        <option value="">Selecione</option>


        {personagens.map(p => (
          <option
            key={p.id}
            value={p.id}
            disabled={p1 === p.id}
          >
            {p.nome}
          </option>
        ))}
      </Select>


      <Input
        label="Tipo de relacionamento"
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
