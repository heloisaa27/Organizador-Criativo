export default function ColorSection({
    cores,
    novaCor,
    setNovaCor,
    onAdd,
    onRemove
}) {
    return (
        <div className="aesthetic-card">
            <h3>Paleta de Cores</h3>

            <div className="color-palette">
                {cores.map((cor, i) => (
                    <div 
                        className="tag-item" 
                        key={i}>
                        <div className="color-box" style={{ background: cor }} />
                        <button className="remove-btn" onClick={() => onRemove(i)}>
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            <div className="color-controls">

                <label className="color-add">
                    +
                    <input
                        type="color"
                        value={novaCor}
                        onChange={(e) => setNovaCor(e.target.value)}
                    />
                </label>

                <div
                    className="color-preview"
                    style={{ background: novaCor }}
                />
                
                <button onClick={onAdd}>Adicionar</button>

            </div>
        </div>
    )
}
