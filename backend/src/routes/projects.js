import express from "express"
import { atualizarProjeto } from "../utils/projetoUtils.js"


export default function projetosRoutes(db) {
    const router = express.Router()


    async function atualizarProjeto(projetoId) {
        await db.run(
            "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
            [new Date().toISOString(), projetoId]
        )
    }


    function parseEstetica(estetica) {
        return estetica
            ? JSON.parse(estetica)
            : { cores: [], musicas: [], humores: [], tags: [] }
    }

    /**
     * @swagger
     * /projetos:
     *   put:
     *     summary: Atualiza a estética do projeto
     *     tags: [Estética]
     */
    router.put("/:id/estetica", async (req, res) => {
        const { id } = req.params
        const { estetica } = req.body


        if (!estetica) {
            return res.status(400).json({ error: "Estética inválida" })
        }


        await db.run(
            "UPDATE projetos SET estetica = ?, atualizadoEm = ? WHERE id = ?",
            [JSON.stringify(estetica), new Date().toISOString(), id]
        )


        res.json({ success: true })
    })



    /**
     * @swagger
     * /projetos:
     *   get:
     *     summary: Lista todos os projetos
     *     tags: [Projetos]
     */
    router.get("/", async (req, res) => {
        const projetos = await db.all(`
      SELECT p.* FROM projetos p
    `)


        res.json(projetos.map(p => ({
            ...p,
            estetica: parseEstetica(p.estetica)
        })))
    })


    /**
     * @swagger
     * /projetos:
     *   post:
     *     summary: Cria um novo projeto
     *     tags: [Projetos]
     */
    router.post("/", async (req, res) => {
        const { titulo, genero, descricao } = req.body


        const result = await db.run(
            `INSERT INTO projetos (titulo, genero, descricao, atualizadoEm, estetica)
       VALUES (?, ?, ?, ?, ?)`,
            [
                titulo,
                genero || "",
                descricao || "",
                new Date().toISOString(),
                JSON.stringify({ cores: [], musicas: [], humores: [], tags: [] })
            ]
        )


        res.json({ id: result.lastID })
    })


    /**
     * @swagger
     * /projetos/{id}:
     *   get:
     *     summary: Busca projeto por ID
     *     tags: [Projetos]
     */
    router.get("/:id", async (req, res) => {
        const { id } = req.params


        const projeto = await db.get(
            "SELECT * FROM projetos WHERE id = ?",
            [id]
        )


        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado" })
        }


        res.json({
            ...projeto,
            estetica: parseEstetica(projeto.estetica)
        })
    })


    /**
     * @swagger
     * /projetos/{id}:
     *   put:
     *     summary: Atualiza projeto
     *     tags: [Projetos]
     */
    router.put("/:id", async (req, res) => {
        const { id } = req.params
        const { titulo, genero, descricao } = req.body


        await db.run(
            `UPDATE projetos
       SET titulo = COALESCE(?, titulo),
           genero = COALESCE(?, genero),
           descricao = COALESCE(?, descricao),
           atualizadoEm = ?
       WHERE id = ?`,
            [titulo, genero, descricao, new Date().toISOString(), id]
        )


        res.json({ success: true })
    })


    /**
     * @swagger
     * /projetos/{id}:
     *   delete:
     *     summary: Deleta projeto
     *     tags: [Projetos]
     */
    router.delete("/:id", async (req, res) => {
        const { id } = req.params
        await db.run("DELETE FROM projetos WHERE id = ?", [id])
        res.json({ success: true })
    })

    return router
}
