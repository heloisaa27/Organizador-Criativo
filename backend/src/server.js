import express from "express"
import cors from "cors"
import { initDB } from "./database.js"


import projetosRoutes from "./routes/projetos.js"
import personagensRoutes from "./routes/personagens.js"


const app = express()


app.use(cors())
app.use(express.json())


let db


initDB().then(database => {
  db = database


  app.use("/projetos", projetosRoutes(db))
  app.use("/personagens", personagensRoutes(db))
})


app.listen(3000, () => {
  console.log("Servidor rodando")
})
