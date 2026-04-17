import express from "express"


export default function projetosRoutes(db) {
    const router = express.Router()


    // GET todos projetos
    router.get("/", async (req, res) => {
        const projetos = await db.all(`
    SELECT 
      p.*,
      COUNT(c.id) as total_personagens
    FROM projetos p
    LEFT JOIN personagens c ON c.projeto_id = p.id
    GROUP BY p.id
  `)


        res.json(projetos)
    })


    // POST criar projeto
    router.post("/", async (req, res) => {
        const { titulo, genero, descricao } = req.body


        const result = await db.run(
            "INSERT INTO projetos (titulo, genero, descricao, atualizadoEm) VALUES (?, ?, ?, ?)",
            [titulo, genero || "", descricao || "", new Date().toISOString()]
        )


        res.json({ id: result.lastID })
    })


    // PUT editar projeto
    router.put("/:id", async (req, res) => {
        const { id } = req.params
        const { titulo, genero, descricao } = req.body


        await db.run(
            "UPDATE projetos SET titulo = ?, genero = ?, descricao = ?, atualizadoEm = ? WHERE id = ?",
            [titulo, genero || "", descricao || "", new Date().toISOString(), id]
        )


        res.json({ success: true })
    })


    // DELETE projeto
    router.delete("/:id", async (req, res) => {
        const { id } = req.params


        await db.run(
            "DELETE FROM projetos WHERE id = ?",
            [id]
        )


        res.json({ success: true })
    })


    // GET personagens do projeto
    router.get("/:id/personagens", async (req, res) => {
        const { id } = req.params


        const personagens = await db.all(
            "SELECT * FROM personagens WHERE projeto_id = ?",
            [id]
        )


        res.json(personagens)
    })


    // POST criar personagem no projeto
    router.post("/:id/personagens", async (req, res) => {
        const { id } = req.params
        const { nome, descricao, papel } = req.body


        if (!nome) {
            return res.status(400).json({ error: "Nome é obrigatório" })
        }


        const result = await db.run(
            `INSERT INTO personagens (projeto_id, nome, descricao, papel)
     VALUES (?, ?, ?, ?)`,
            [id, nome, descricao || "", papel || ""]
        )


        // atualiza última edição
        await db.run(
            "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
            [new Date().toISOString(), id]
        )


        res.json({ id: result.lastID })
    })


    // GET projeto por id
    router.get("/:id", async (req, res) => {
        const { id } = req.params


        const projeto = await db.get(
            "SELECT * FROM projetos WHERE id = ?",
            [id]
        )


        if (!projeto) {
            return res.status(404).json({ error: "Projeto não encontrado" })
        }


        res.json(projeto)
    })



    return router
}
