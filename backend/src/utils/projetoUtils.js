export async function atualizarProjeto(db, projetoId) {
  await db.run(
    "UPDATE projetos SET atualizadoEm = ? WHERE id = ?",
    [new Date().toISOString(), projetoId]
  )
}
