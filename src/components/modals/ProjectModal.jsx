import { useState, useEffect } from "react"
import BaseModal from "./BaseModal"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Textarea from "../ui/Textarea"

export default function ProjectModal({ projeto, onClose, onSave }) {

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    genero: ""
  })

  // Preenche ao editar
  useEffect(() => {
    if (projeto) {
      setForm({
        titulo: projeto.titulo || "",
        descricao: projeto.descricao || "",
        genero: projeto.genero || ""
      })
    }
  }, [projeto])

  function handleChange(campo, valor) {
    setForm(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  function handleSubmit() {
    if (!form.titulo.trim()) return // é pra evita vazio

    onSave({
      ...projeto,
      ...form
    })
  }

  return (
    <BaseModal onClose={onClose}>

      <h3>{projeto ? "Editar Projeto" : "Novo Projeto"}</h3>

      <Input
        label="Nome do projeto"
        value={form.titulo}
        onChange={(e) => handleChange("titulo", e.target.value)}
        placeholder="Ex: Minha história"
      />

      <Textarea
        label="Descrição"
        value={form.descricao}
        onChange={(e) => handleChange("descricao", e.target.value)}
        placeholder="Sobre o que é sua história?"
      />

      <Input
        label="Gênero"
        value={form.genero}
        onChange={(e) => handleChange("genero", e.target.value)}
        placeholder="Fantasia, romance..."
      />

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>

        <Button variant="primary" onClick={handleSubmit}>
          Salvar
        </Button>
      </div>

    </BaseModal>
  )
}
