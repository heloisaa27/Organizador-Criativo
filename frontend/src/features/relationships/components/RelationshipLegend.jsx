export default function RelationshipLegend({ tags, onRemoveTipo }) {

    return (
        <div className="relationships-legend">

            <div className="relationships-legend-title">
                Legenda
            </div>

            {tags.map(tag => (
                <div key={tag.nome} className="relationships-legend-item">

                    <div
                        className="relationships-legend-color"
                        style={{ background: tag.cor }}
                    />

                    <span className="relationships-legend-text">
                        {tag.nome}
                    </span>

                    <button
                        className="remove-btn"
                        onClick={() => onRemoveTipo(tag.nome)}
                    >
                        ✕
                    </button>

                </div>
            ))}
        </div>
    )
}
