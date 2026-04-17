import Input from "../../../components/ui/Input"
import Tag from "../../../components/ui/Tag"

export default function TagSection({
    tags,
    novaTag,
    setNovaTag,
    onAdd,
    onRemove
}) {
    return (
        <div className="aesthetic-card">
            <h3>Palavras-chave</h3>

            <Input
                placeholder="Adicionar palavra"
                value={novaTag}
                onChange={(e) => setNovaTag(e.target.value)}
            />

            <button onClick={onAdd}>Adicionar</button>

            <div className="tags">
                {tags.map((tag, i) => (
                    <Tag 
                        key={tag + i}
                        onRemove={() => onRemove(i)}>
                        {tag}
                    </Tag>
                ))}
            </div>
        </div>
    )
}
