import express from "express"
import { atualizarProjeto } from "../utils/projetoUtils.js"


export default function personagensRoutes(db) {
  const router = express.Router()


  /**
     * @swagger
     * /projetos/{id}/personagens:
     *   get:
     *     summary: Lista personagens do projeto
     *     tags: [Personagens]
     */
    router.get("/:id/personagens", async (req, res) => {
        const { id } = req.params


        const personagens = await db.all(
            "SELECT * FROM personagens WHERE projeto_id = ?",
            [id]
        )


        res.json(personagens.map(p => ({
            ...p,
            cores: p.cores ? JSON.parse(p.cores) : []
        })))
    })


    /**
     * @swagger
     * /projetos/{id}/personagens:
     *   post:
     *     summary: Cria personagem
     *     tags: [Personagens]
     */
    router.post("/:id/personagens", async (req, res) => {
        const { id } = req.params
        const { nome, descricao, papel, cores } = req.body


        if (!nome) {
            return res.status(400).json({ error: "Nome é obrigatório" })
        }


        const result = await db.run(
            `INSERT INTO personagens (projeto_id, nome, descricao, papel, cores)
       VALUES (?, ?, ?, ?, ?)`,
            [id, nome, descricao || "", papel || "", JSON.stringify(cores || [])]
        )


        await atualizarProjeto(db, id)


        res.json({ id: result.lastID })
    })


    /**
     * @swagger
     * /projetos/{id}/personagens/{personagemId}:
     *   put:
     *     summary: Atualiza personagem
     *     tags: [Personagens]
     */
    router.put("/:id/personagens/:personagemId", async (req, res) => {
        const { id, personagemId } = req.params
        const { nome, descricao, papel, cores } = req.body


        await db.run(
            `UPDATE personagens
       SET nome = ?, descricao = ?, papel = ?, cores = ?
       WHERE id = ? AND projeto_id = ?`,
            [nome, descricao, papel, JSON.stringify(cores || []), personagemId, id]
        )


        await atualizarProjeto(db, id)


        res.json({ success: true })
    })


    /**
     * @swagger
     * /projetos/{id}/personagens/{personagemId}:
     *   delete:
     *     summary: Deleta personagem
     *     tags: [Personagens]
     */
    router.delete("/:id/personagens/:personagemId", async (req, res) => {
        const { id, personagemId } = req.params


        await db.run(
            "DELETE FROM personagens WHERE id = ? AND projeto_id = ?",
            [personagemId, id]
        )


        await atualizarProjeto(db, id)


        res.json({ success: true })
    })

     return router

}
