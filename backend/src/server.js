import express from "express"
import cors from "cors"
import { initDB } from "./database.js"


import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./swagger.js"


import projetosRoutes from "./routes/projects.js"
import personagensRoutes from "./routes/characters.js"
import capitulosRoutes from "./routes/chapters.js"
import relacionamentosRoutes from "./routes/relationships.js"


const app = express()


app.use(cors())
app.use(express.json())


// ROTA BASE
app.get("/", (req, res) => {
  res.json({
    message: "API Story Builder rodando 🚀",
    docs: "http://localhost:3000/docs"
  })
})


// SWAGGER
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))


initDB()
  .then((db) => {


    app.use("/projetos", projetosRoutes(db))
    app.use("/personagens", personagensRoutes(db))
    app.use("/capitulos", capitulosRoutes(db))
    app.use("/relacoes", relacionamentosRoutes(db))


    // RESET
    if (process.env.NODE_ENV !== "production") {
      app.delete("/reset", async (req, res) => {
        await db.run("DELETE FROM personagens")
        await db.run("DELETE FROM capitulos")
        await db.run("DELETE FROM relacoes")
        await db.run("DELETE FROM projetos")


        res.json({ success: true })
      })
    }


    app.listen(3000, () => {
      console.log("Servidor rodando na porta 3000")
    })


  })
  .catch(err => {
    console.error("Erro ao iniciar DB:", err)
  })
