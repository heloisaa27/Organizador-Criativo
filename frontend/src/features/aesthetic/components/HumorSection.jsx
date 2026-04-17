import Input from "../../../components/ui/Input"
import Tag from "../../../components/ui/Tag"


export default function HumorSection({
    opcoesHumor,
    humores,
    novoHumor,
    setNovoHumor,
    onToggle,
    onAddCustom,
    onRemove
}) {
    return (
        <div className="aesthetic-card">
            <h3>Humor</h3>

            {/* opções fixas */}
            <div className="tags">
                {opcoesHumor.map((h, i) => (
                    <Tag
                        key={h}
                        active={humores.includes(h)}
                        onClick={() => onToggle(h)}
                    >
                        {h}
                    </Tag>

                ))}
            </div>

            {/* input */}
            <Input
                placeholder="Adicionar humor personalizado"
                value={novoHumor}
                onChange={(e) => setNovoHumor(e.target.value)}
            />

            <button onClick={onAddCustom}>Adicionar</button>

            {/* lista */}
            <div className="tags">
                {humores.map((h, i) => (
                    <Tag 
                        key={h + i}
                        onRemove={() => onRemove(i)}>
                        {h}
                    </Tag>
                ))}
            </div>
        </div>
    )
}
