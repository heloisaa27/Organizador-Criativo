import express from "express"


export default function personagensRoutes(db) {
  const router = express.Router()


  // PUT editar personagem
  router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { nome, descricao, papel, musica } = req.body


    await db.run(
      `UPDATE personagens
       SET nome = ?, descricao = ?, papel = ?, musica = ?
       WHERE id = ?`,
      [nome, descricao || "", papel || "", musica || "", id]
    )


    res.json({ success: true })
  })


  // DELETE personagem
  router.delete("/:id", async (req, res) => {
    const { id } = req.params


    await db.run(
      "DELETE FROM personagens WHERE id = ?",
      [id]
    )


    res.json({ success: true })
  })


  return router
}
