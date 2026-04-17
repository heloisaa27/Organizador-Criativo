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


  // POST criar (COM COR AUTOMÁTICA)
  router.post("/", async (req, res) => {
    const { projeto_id, p1, p2, tipo, cor } = req.body


    if (!projeto_id || !p1 || !p2 || !tipo) {
      return res.status(400).json({ error: "Dados inválidos" })
    }


    if (p1 === p2) {
      return res.status(400).json({ error: "Relacionamento inválido" })
    }


    const tipoFormatado = tipo.toLowerCase().trim()


    const existente = await db.get(
      `SELECT cor FROM relacoes
       WHERE projeto_id = ? AND tipo = ?
       LIMIT 1`,
      [projeto_id, tipoFormatado]
    )


    const corFinal = cor || existente?.cor || "#cccccc"


    const result = await db.run(
      `INSERT INTO relacoes (projeto_id, p1, p2, tipo, cor)
       VALUES (?, ?, ?, ?, ?)`,
      [
        projeto_id,
        Number(p1),
        Number(p2),
        tipoFormatado,
        corFinal
      ]
    )


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), projeto_id]
    )


    res.json({ id: result.lastID })
  })


  // DELETE relação única
  router.delete("/:id", async (req, res) => {
    const { id } = req.params


    const relacao = await db.get(
      "SELECT projeto_id FROM relacoes WHERE id = ?",
      [id]
    )


    if (!relacao) {
      return res.status(404).json({ error: "Relação não encontrada" })
    }


    await db.run("DELETE FROM relacoes WHERE id = ?", [id])


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), relacao.projeto_id]
    )


    res.json({ success: true })
  })


  // UPDATE COR (UMA RELAÇÃO)
  router.put("/:id/cor", async (req, res) => {
    const { id } = req.params
    const { cor } = req.body


    if (!cor || !/^#[0-9A-Fa-f]{6}$/.test(cor)) {
      return res.status(400).json({ error: "Cor inválida" })
    }


    const relacao = await db.get(
      "SELECT projeto_id FROM relacoes WHERE id = ?",
      [id]
    )


    await db.run(
      "UPDATE relacoes SET cor = ? WHERE id = ?",
      [cor, id]
    )


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), relacao.projeto_id]
    )


    res.json({ success: true })
  })


  // UPDATE COR POR TIPO
  router.put("/tipo/:tipo/cor", async (req, res) => {
    const { tipo } = req.params
    const { cor } = req.body


    if (!cor || !/^#[0-9A-Fa-f]{6}$/.test(cor)) {
      return res.status(400).json({ error: "Cor inválida" })
    }


    const relacao = await db.get(
      "SELECT projeto_id FROM relacoes WHERE tipo = ? LIMIT 1",
      [tipo]
    )


    if (!relacao) return res.json({ success: true })


    await db.run(
      "UPDATE relacoes SET cor = ? WHERE tipo = ?",
      [cor, tipo]
    )


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), relacao.projeto_id]
    )


    res.json({ success: true })
  })


  // RENOMEAR TIPO
  router.put("/tipo/:tipo", async (req, res) => {
    const { tipo } = req.params
    const { novoTipo } = req.body


    if (!novoTipo) {
      return res.status(400).json({ error: "Novo tipo inválido" })
    }


    const relacao = await db.get(
      "SELECT projeto_id FROM relacoes WHERE tipo = ? LIMIT 1",
      [tipo]
    )


    if (!relacao) return res.json({ success: true })


    await db.run(
      "UPDATE relacoes SET tipo = ? WHERE tipo = ?",
      [novoTipo.toLowerCase().trim(), tipo]
    )


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), relacao.projeto_id]
    )


    res.json({ success: true })
  })


  // DELETE TIPO
  router.delete("/tipo/:tipo", async (req, res) => {
    const { tipo } = req.params


    const relacao = await db.get(
      "SELECT projeto_id FROM relacoes WHERE tipo = ? LIMIT 1",
      [tipo]
    )


    if (!relacao) return res.json({ success: true })


    await db.run(
      "DELETE FROM relacoes WHERE tipo = ?",
      [tipo]
    )


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), relacao.projeto_id]
    )


    res.json({ success: true })
  })


  return router
}
