import express from "express"
import cors from "cors"
import { initDB } from "./database.js"


import projetosRoutes from "./routes/projects.js"
import personagensRoutes from "./routes/characters.js"
import capitulosRoutes from "./routes/chapters.js"
import relacionamentosRoutes from "./routes/relationships.js"


const app = express()


app.use(cors())
app.use(express.json())


let db


initDB().then(database => {
    db = database


    app.use("/projetos", projetosRoutes(db))
    app.use("/personagens", personagensRoutes(db))
    app.use("/capitulos", capitulosRoutes(db))
    app.use("/relacoes", relacionamentosRoutes(db))

})


app.listen(3000, () => {
    console.log("Servidor rodando")
})
