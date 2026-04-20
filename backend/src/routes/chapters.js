import express from "express"
import { atualizarProjeto } from "../utils/projetoUtils.js"


export default function capitulosRoutes(db) {
    const router = express.Router()

    /**
     * @swagger
     * /projetos/{id}/capitulos:
     *   get:
     *     summary: Lista capítulos
     *     tags: [Capítulos]
     */
    router.get("/:id/capitulos", async (req, res) => {
        const { id } = req.params


        const capitulos = await db.all(
            "SELECT * FROM capitulos WHERE projeto_id = ? ORDER BY ordem",
            [id]
        )

        res.json(capitulos)
    })


    /**
     * @swagger
     * /projetos/{id}/capitulos:
     *   post:
     *     summary: Cria capítulo
     *     tags: [Capítulos]
     */
    router.post("/:id/capitulos", async (req, res) => {
        const { id } = req.params
        const { titulo } = req.body


        if (!titulo) {
            return res.status(400).json({ error: "Título é obrigatório" })
        }


        const result = await db.run(
            `INSERT INTO capitulos (projeto_id, titulo, conteudo, ordem)
       VALUES (?, ?, ?, ?)`,
            [id, titulo, "", 0]
        )


        await atualizarProjeto(db, id)


        res.json({ id: result.lastID })
    })

    /**
 * @swagger
 * /projetos/{id}/capitulos/{capituloId}:
 *   put:
 *     summary: Atualiza um capítulo
 *     tags: [Capítulos]
 */
    router.put("/:id/capitulos/:capituloId", async (req, res) => {
        const { id, capituloId } = req.params
        const { titulo, conteudo } = req.body


        const capitulo = await db.get(
            "SELECT * FROM capitulos WHERE id = ? AND projeto_id = ?",
            [capituloId, id]
        )


        if (!capitulo) {
            console.log("Capítulo não encontrado:", capituloId)
            return res.status(404).json({ error: "Capítulo não encontrado" })
        }


        await db.run(
            `UPDATE capitulos
        SET titulo = COALESCE(?, titulo),
            conteudo = COALESCE(?, conteudo)
        WHERE id = ? AND projeto_id = ?`,
            [titulo, conteudo, capituloId, id]
        )


        await atualizarProjeto(db, id)


        res.json({ success: true })
    })

    /**
 * @swagger
 * /projetos/{id}/capitulos/{capituloId}:
 *   delete:
 *     summary: Deleta um capítulo
 *     tags: [Capítulos]
 */
    router.delete("/:id/capitulos/:capituloId", async (req, res) => {
        const { id, capituloId } = req.params


        const capitulo = await db.get(
            "SELECT * FROM capitulos WHERE id = ? AND projeto_id = ?",
            [capituloId, id]
        )


        if (!capitulo) {
            return res.status(404).json({ error: "Capítulo não encontrado" })
        }


        await db.run(
            "DELETE FROM capitulos WHERE id = ? AND projeto_id = ?",
            [capituloId, id]
        )


        await atualizarProjeto(db, id)


        res.json({ success: true })
    })
     return router
}