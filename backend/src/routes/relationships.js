import express from "express"
import { atualizarProjeto } from "../utils/projetoUtils.js"


export default function relacoesRoutes(db) {
    const router = express.Router()

    /**
       * @swagger
       * /projetos/{id}/relacoes:
       *   get:
       *     summary: Lista relações
       *     tags: [Relações]
       */
    router.get("/:id/relacoes", async (req, res) => {
        const { id } = req.params


        const relacoes = await db.all(
            "SELECT * FROM relacoes WHERE projeto_id = ?",
            [id]
        )


        res.json(relacoes)
    })


    /**
     * @swagger
     * /projetos/{id}/relacoes:
     *   post:
     *     summary: Cria relações
     *     tags: [Relações]
     */
    router.post("/:id/relacoes", async (req, res) => {
        const { id } = req.params
        const { p1, p2, tipo, cor } = req.body


        if (!p1 || !p2 || !tipo) {
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
            [id, tipoFormatado]
        )


        const corFinal = cor || existente?.cor || "#cccccc"


        const result = await db.run(
            `INSERT INTO relacoes (projeto_id, p1, p2, tipo, cor)
     VALUES (?, ?, ?, ?, ?)`,
            [id, p1, p2, tipoFormatado, corFinal]
        )


        await db.run(
            "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
            [new Date().toISOString(), id]
        )


        res.json({ id: result.lastID })
    })


    /**
     * @swagger
     * /projetos/{id}/relacoes/tipo/{tipo}/cor:
     *   put:
     *     summary: Atualiza cor de todas relações de um tipo
     *     tags: [Relações]
     */
    router.put("/:id/relacoes/tipo/:tipo/cor", async (req, res) => {
        const { id, tipo } = req.params
        const { cor } = req.body


        if (!cor || !/^#[0-9A-Fa-f]{6}$/.test(cor)) {
            return res.status(400).json({ error: "Cor inválida" })
        }


        await db.run(
            "UPDATE relacoes SET cor = ? WHERE tipo = ? AND projeto_id = ?",
            [cor, tipo, id]
        )


        await atualizarProjeto(db, id)


        res.json({ success: true })
    })


    /**
    * @swagger
    * /projetos/{id}/relacoes/tipo/{tipo}:
    *   put:
    *     summary: Renomeia um tipo de relação
    *     tags: [Relações]
    */
    router.put("/:id/relacoes/tipo/:tipo", async (req, res) => {
        const { id, tipo } = req.params
        const { novoTipo } = req.body


        if (!novoTipo) {
            return res.status(400).json({ error: "Novo tipo inválido" })
        }


        await db.run(
            "UPDATE relacoes SET tipo = ? WHERE tipo = ? AND projeto_id = ?",
            [novoTipo.toLowerCase().trim(), tipo, id]
        )


        await atualizarProjeto(db, id)


        res.json({ success: true })
    })


    /**
    * @swagger
    * /projetos/{id}/relacoes/reset:
    *   delete:
    *     summary: Reseta todas relações
    *     tags: [Relações]
    */
    router.delete("/:id/relacoes/reset", async (req, res) => {
        const { id } = req.params


        await db.run(
            "DELETE FROM relacoes WHERE projeto_id = ?",
            [id]
        )


        await atualizarProjeto(db, id)


        res.json({ success: true })
    })




    /**
 * @swagger
 * /projetos/{id}/relacoes/{relacaoId}:
 *   delete:
 *     summary: Remove uma relação específica
 *     tags: [Relações]
 */
    router.delete("/:id/relacoes/:relacaoId", async (req, res) => {
        const { id, relacaoId } = req.params


        const relacao = await db.get(
            "SELECT * FROM relacoes WHERE id = ? AND projeto_id = ?",
            [relacaoId, id]
        )


        if (!relacao) {
            return res.status(404).json({ error: "Relação não encontrada" })
        }


        await db.run(
            "DELETE FROM relacoes WHERE id = ? AND projeto_id = ?",
            [relacaoId, id]
        )


        await atualizarProjeto(db, id)


        res.json({ success: true })
    })


    /**
    * @swagger
    * /projetos/{id}/relacoes/tipo/{tipo}:
    *   delete:
    *     summary: Remove todas relações de um tipo
    *     tags: [Relações]
    */
    router.delete("/:id/relacoes/tipo/:tipo", async (req, res) => {
        const { id, tipo } = req.params


        await db.run(
            "DELETE FROM relacoes WHERE tipo = ? AND projeto_id = ?",
            [tipo, id]
        )


        await atualizarProjeto(db, id)


        res.json({ success: true })
    })

     return router
}