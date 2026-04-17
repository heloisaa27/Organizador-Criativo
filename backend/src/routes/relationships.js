import express from "express"


export default function relacionamentosRoutes(db) {
  const router = express.Router()


  // GET por projeto
  router.get("/projeto/:projetoId", async (req, res) => {
    const { projetoId } = req.params


    const relacoes = await db.all(
      "SELECT * FROM relacoes WHERE projeto_id = ?",
      [projetoId]
    )


    res.json(relacoes)
  })


  // POST criar relação
  router.post("/", async (req, res) => {
    const { projeto_id, personagem1_id, personagem2_id, tipo } = req.body


    if (!projeto_id || !personagem1_id || !personagem2_id || !tipo) {
      return res.status(400).json({ error: "Dados inválidos" })
    }


    if (personagem1_id === personagem2_id) {
      return res.status(400).json({ error: "Relacionamento inválido" })
    }


    const result = await db.run(
      `INSERT INTO relacoes (projeto_id, personagem1_id, personagem2_id, tipo)
       VALUES (?, ?, ?, ?)`,
      [projeto_id, personagem1_id, personagem2_id, tipo]
    )


    // atualiza projeto
    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), projeto_id]
    )


    res.json({ id: result.lastID })
  })


  // DELETE relação
  router.delete("/:id", async (req, res) => {
    const { id } = req.params


    const relacao = await db.get(
      "SELECT projeto_id FROM relacoes WHERE id = ?",
      [id]
    )


    if (!relacao) {
      return res.status(404).json({ error: "Relação não encontrada" })
    }


    await db.run(
      "DELETE FROM relacoes WHERE id = ?",
      [id]
    )


    // atualiza projeto
    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), relacao.projeto_id]
    )


    res.json({ success: true })
  })


  return router
}
