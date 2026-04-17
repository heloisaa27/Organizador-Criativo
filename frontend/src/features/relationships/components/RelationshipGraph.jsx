export default function RelationshipGraph({ relacoes, posicoes }) {


  return (
    <svg className="relationships-svg" width="100%" height="100%">
      {relacoes.map(r => {


        const a = posicoes.find(p => p.id === r.p1)
        const b = posicoes.find(p => p.id === r.p2)


        if (!a || !b) return null


        return (
          <line
            key={r.id}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={r.cor || "#cccccc"}
            strokeWidth={3}
            strokeLinecap="round"
            strokeOpacity={0.8}
          />
        )
      })}
    </svg>
  )
}
