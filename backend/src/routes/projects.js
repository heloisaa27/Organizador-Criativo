import express from "express"


export default function projetosRoutes(db) {
  const router = express.Router()


  // GET TODOS PROJETOS
  router.get("/", async (req, res) => {
    const projetos = await db.all(`
      SELECT
        p.*,
        COUNT(DISTINCT c.id) as total_personagens,
        COUNT(DISTINCT cap.id) as total_capitulos,
        COUNT(DISTINCT r.id) as total_relacoes
      FROM projetos p
      LEFT JOIN personagens c ON c.projeto_id = p.id
      LEFT JOIN capitulos cap ON cap.projeto_id = p.id
      LEFT JOIN relacoes r ON r.projeto_id = p.id
      GROUP BY p.id
    `)


    const formatados = projetos.map(p => ({
      ...p,
      estetica: p.estetica
        ? JSON.parse(p.estetica)
        : {
            cores: [],
            musicas: [],
            humores: [],
            tags: []
          }
    }))


    res.json(formatados)
  })


  // POST criar projeto
  router.post("/", async (req, res) => {
    const { titulo, genero, descricao } = req.body


    const result = await db.run(
      "INSERT INTO projetos (titulo, genero, descricao, atualizadoEm, estetica) VALUES (?, ?, ?, ?, ?)",
      [
        titulo,
        genero || "",
        descricao || "",
        new Date().toISOString(),
        JSON.stringify({
          cores: [],
          musicas: [],
          humores: [],
          tags: []
        })
      ]
    )


    res.json({ id: result.lastID })
  })


  // PUT editar projeto
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


  // PUT ESTÉTICA
  router.put("/:id/estetica", async (req, res) => {
    const { id } = req.params
    const { estetica } = req.body


    await db.run(
      "UPDATE projetos SET estetica = ?, atualizadoEm = ? WHERE id = ?",
      [JSON.stringify(estetica), new Date().toISOString(), id]
    )


    res.json({ success: true })
  })


  // DELETE projeto
  router.delete("/:id", async (req, res) => {
    const { id } = req.params


    await db.run("DELETE FROM projetos WHERE id = ?", [id])


    res.json({ success: true })
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


    res.json({
      ...projeto,
      estetica: projeto.estetica
        ? JSON.parse(projeto.estetica)
        : {
            cores: [],
            musicas: [],
            humores: [],
            tags: []
          }
    })
  })


  // PERSONAGENS
  router.get("/:id/personagens", async (req, res) => {
    const { id } = req.params


    const personagens = await db.all(
      "SELECT * FROM personagens WHERE projeto_id = ?",
      [id]
    )


    res.json(personagens)
  })


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


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), id]
    )


    res.json({ id: result.lastID })
  })


  // CAPÍTULOS
  router.get("/:id/capitulos", async (req, res) => {
    const { id } = req.params


    const capitulos = await db.all(
      "SELECT * FROM capitulos WHERE projeto_id = ? ORDER BY ordem",
      [id]
    )


    res.json(capitulos)
  })


  router.post("/:id/capitulos", async (req, res) => {
    const { id } = req.params
    const { titulo } = req.body


    if (!titulo) {
      return res.status(400).json({ error: "Título é obrigatório" })
    }


    const ultimo = await db.get(
      "SELECT MAX(ordem) as maxOrdem FROM capitulos WHERE projeto_id = ?",
      [id]
    )


    const novaOrdem = (ultimo?.maxOrdem ?? -1) + 1


    const result = await db.run(
      `INSERT INTO capitulos (projeto_id, titulo, conteudo, ordem)
       VALUES (?, ?, ?, ?)`,
      [id, titulo, "", novaOrdem]
    )


    await db.run(
      "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
      [new Date().toISOString(), id]
    )


    res.json({ id: result.lastID })
  })


  // COMPLETO
  router.get("/:id/completo", async (req, res) => {
    const { id } = req.params


    const projeto = await db.get(
      "SELECT * FROM projetos WHERE id = ?",
      [id]
    )


    if (!projeto) {
      return res.status(404).json({ error: "Projeto não encontrado" })
    }


    const personagens = await db.all(
      "SELECT * FROM personagens WHERE projeto_id = ?",
      [id]
    )


    const capitulos = await db.all(
      "SELECT * FROM capitulos WHERE projeto_id = ? ORDER BY ordem",
      [id]
    )


    const relacoes = await db.all(
      "SELECT * FROM relacoes WHERE projeto_id = ?",
      [id]
    )


    res.json({
      ...projeto,
      estetica: projeto.estetica
        ? JSON.parse(projeto.estetica)
        : {
            cores: [],
            musicas: [],
            humores: [],
            tags: []
          },
      personagens,
      capitulos,
      relacoes
    })
  })


  return router
}
