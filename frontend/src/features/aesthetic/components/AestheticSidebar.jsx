export default function AestheticSidebar({
    cores,
    humores,
    musicas,
    tags
}) {
    return (
        <div className="aesthetic-sidebar">

            <h3>Visão Geral</h3>

            <div className="preview-section">
                <p>Paleta de Cores</p>
                <div className="preview-colors">
                    {cores.map((c, i) => (
                        <div key={i} style={{ background: c }} />
                    ))}
                </div>
            </div>

            <div className="preview-section">
                <p>Humor</p>
                <div className="tags">
                    {humores.map((h, i) => (
                        <span key={i}>{h}</span>
                    ))}
                </div>
            </div>

            <div className="preview-section">
                <p>Músicas</p>
                <div className="tags">
                    {musicas.map((m) => (
                        <span key={m.id}>
                            {m.title} - {m.artist?.name || "Desconhecido"}
                        </span>
                    ))}

                </div>
            </div>

            <div className="preview-section">
                <p>Palavras-chave</p>
                <div className="tags">
                    {tags.map((t, i) => (
                        <span key={i}>{t}</span>
                    ))}
                </div>
            </div>

        </div>
    )
}
