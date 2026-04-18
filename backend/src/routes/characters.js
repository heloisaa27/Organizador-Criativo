import express from "express"


export default function personagensRoutes(db) {
  const router = express.Router()


  // GET personagens por projeto
  router.get("/:projetoId", async (req, res) => {
    const { projetoId } = req.params


    const personagens = await db.all(
      "SELECT * FROM personagens WHERE projeto_id = ?",
      [projetoId]
    )


    const formatados = personagens.map(p => ({
      ...p,
      cores: p.cores ? JSON.parse(p.cores) : []
    }))


    res.json(formatados)
  })


  // POST criar personagem
  router.post("/", async (req, res) => {
    const { projeto_id, nome, descricao, papel, cores } = req.body


    if (!nome) {
      return res.status(400).json({ error: "Nome é obrigatório" })
    }


    const result = await db.run(
      `INSERT INTO personagens (projeto_id, nome, descricao, papel, cores)
       VALUES (?, ?, ?, ?, ?)`,
      [
        projeto_id,
        nome,
        descricao || "",
        papel || "",
        JSON.stringify(cores || [])
      ]
    )


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), projeto_id]
    )


    res.json({ id: result.lastID })
  })


  // PUT editar personagem (AGORA COM CORES)
  router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { nome, descricao, papel, cores } = req.body


    if (!nome) {
      return res.status(400).json({ error: "Nome é obrigatório" })
    }


    const personagem = await db.get(
      "SELECT projeto_id FROM personagens WHERE id = ?",
      [id]
    )


    if (!personagem) {
      return res.status(404).json({ error: "Personagem não encontrado" })
    }


    await db.run(
      `UPDATE personagens
       SET nome = ?, descricao = ?, papel = ?, cores = ?
       WHERE id = ?`,
      [
        nome,
        descricao || "",
        papel || "",
        JSON.stringify(cores || []),
        id
      ]
    )


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), personagem.projeto_id]
    )


    res.json({ success: true })
  })


  // DELETE personagem
  router.delete("/:id", async (req, res) => {
    const { id } = req.params


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


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), personagem.projeto_id]
    )


    res.json({ success: true })
  })


  return router
}
