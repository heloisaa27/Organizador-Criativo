export default function Chapters() {

  const capitulos = [
    { id: 1, titulo: "O Despertar" },
    { id: 2, titulo: "Primeiro Contato" }
  ]

  return (
    <div>

      <h2>Capítulos</h2>

      {capitulos.map((capitulo, index) => (

        <div key={capitulo.id} className="chapter-card">

          <h3>
            Capítulo {index + 1}: {capitulo.titulo}
          </h3>

        </div>

      ))}

    </div>
  )
}