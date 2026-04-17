

import express from "express"


export default function capitulosRoutes(db) {
  const router = express.Router()


  // PUT reordenar capítulos
  router.put("/reordenar", async (req, res) => {
    const { capitulos } = req.body


    if (!Array.isArray(capitulos)) {
      return res.status(400).json({ error: "Formato inválido" })
    }


    try {
      for (const c of capitulos) {
        await db.run(
          "UPDATE capitulos SET ordem = ? WHERE id = ?",
          [c.ordem, c.id]
        )
      }


      // atualizar projeto
      const primeiro = capitulos[0]


      if (primeiro) {
        const cap = await db.get(
          "SELECT projeto_id FROM capitulos WHERE id = ?",
          [primeiro.id]
        )


        if (cap) {
          await db.run(
            "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
            [new Date().toISOString(), cap.projeto_id]
          )
        }
      }


      res.json({ success: true })


    } catch (error) {
      console.error("Erro ao reordenar:", error)
      res.status(500).json({ error: "Erro ao reordenar capítulos" })
    }
  })


  // PUT editar capítulo
  router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { titulo, conteudo } = req.body


    const capitulo = await db.get(
      "SELECT projeto_id FROM capitulos WHERE id = ?",
      [id]
    )


    if (!capitulo) {
      return res.status(404).json({ error: "Capítulo não encontrado" })
    }


    await db.run(
      `UPDATE capitulos
       SET titulo = COALESCE(?, titulo),
           conteudo = COALESCE(?, conteudo)
       WHERE id = ?`,
      [titulo, conteudo, id]
    )


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), capitulo.projeto_id]
    )


    res.json({ success: true })
  })


  // DELETE capítulo
  router.delete("/:id", async (req, res) => {
    const { id } = req.params


    const capitulo = await db.get(
      "SELECT projeto_id FROM capitulos WHERE id = ?",
      [id]
    )


    if (!capitulo) {
      return res.status(404).json({ error: "Capítulo não encontrado" })
    }


    await db.run(
      "DELETE FROM capitulos WHERE id = ?",
      [id]
    )


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), capitulo.projeto_id]
    )


    res.json({ success: true })
  })


  return router
}
