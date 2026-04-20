import express from "express"
import { atualizarProjeto } from "../utils/projetoUtils.js"


export default function linhaDoTempoRoutes(db) {
  const router = express.Router()


  router.put("/:id/capitulos/reordenar", async (req, res) => {
    const { id } = req.params
    const { capitulos } = req.body


    if (!Array.isArray(capitulos)) {
      return res.status(400).json({ error: "Formato inválido" })
    }


    try {
      for (const c of capitulos) {
        await db.run(
          "UPDATE capitulos SET ordem = ? WHERE id = ? AND projeto_id = ?",
          [Number(c.ordem), Number(c.id), Number(id)]
        )
      }

      await atualizarProjeto(db, id)


      res.json({ success: true })
    } catch (err) {
      console.error("Erro real:", err)
      res.status(500).json({ error: "Erro ao reordenar capítulos" })
    }
  })


  return router
}
