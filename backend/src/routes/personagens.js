import express from "express"


export default function personagensRoutes(db) {
  const router = express.Router()


  // PUT editar personagem
  router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { nome, descricao, papel } = req.body


    if (!nome) {
      return res.status(400).json({ error: "Nome é obrigatório" })
    }


    // pega o projeto antes
    const personagem = await db.get(
      "SELECT projeto_id FROM personagens WHERE id = ?",
      [id]
    )


    if (!personagem) {
      return res.status(404).json({ error: "Personagem não encontrado" })
    }


    await db.run(
      `UPDATE personagens
       SET nome = ?, descricao = ?, papel = ?
       WHERE id = ?`,
      [nome, descricao || "", papel || "", id]
    )


    // atualiza última edição do projeto
    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), personagem.projeto_id]
    )


    res.json({ success: true })
  })


  // DELETE personagem
  router.delete("/:id", async (req, res) => {
    const { id } = req.params


    // pega o projeto antes de deletar
    const personagem = await db.get(
      "SELECT projeto_id FROM personagens WHERE id = ?",
      [id]
    )


    if (!personagem) {
      return res.status(404).json({ error: "Personagem não encontrado" })
    }


    await db.run(
      "DELETE FROM personagens WHERE id = ?",
      [id]
    )


    // atualiza última edição do projeto
    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), personagem.projeto_id]
    )


    res.json({ success: true })
  })


  return router
}
