import sqlite3 from "sqlite3"
import { open } from "sqlite"


export async function initDB() {
    const db = await open({
        filename: "./database.db",
        driver: sqlite3.Database
    })


    await db.exec(`
    CREATE TABLE IF NOT EXISTS projetos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT,
      genero TEXT,
      descricao TEXT,
      atualizadoEm TEXT
    )
  `)

    await db.exec(`
  CREATE TABLE IF NOT EXISTS personagens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projeto_id INTEGER,
    nome TEXT,
    descricao TEXT,
    papel TEXT
  )
`)



    return db
}
