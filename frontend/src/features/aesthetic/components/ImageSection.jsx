import { useState } from "react"
import Button from "../../../components/ui/Button"
import { FiUpload } from "react-icons/fi"


export default function ImageSection({ onPaletteExtracted }) {
    const [preview, setPreview] = useState(null)
    const [coresExtraidas, setCoresExtraidas] = useState([])


    async function handleUpload(file) {
        if (!file) return


        const url = URL.createObjectURL(file)
        setPreview(url)


        const img = new Image()
        img.src = url


        try {
            // garante que a imagem carregou
            await img.decode()


            if (!window.ColorThief) {
                console.error("ColorThief não carregado")
                return
            }


            const colorThief = new window.ColorThief()


            const palette = colorThief.getPalette(img, 5)


            const hexColors = palette.map(([r, g, b]) =>
                "#" +
                [r, g, b]
                    .map(x => x.toString(16).padStart(2, "0"))
                    .join("")
            )


            setCoresExtraidas(hexColors)


        } catch (err) {
            console.error("Erro ao extrair cores:", err)
        }


        // limpa memória
        URL.revokeObjectURL(url)
    }


    function handleInput(e) {
        handleUpload(e.target.files[0])
    }


    function aplicarPaleta() {
        if (!coresExtraidas.length) return
        onPaletteExtracted(coresExtraidas.slice(0, 5))
    }


    return (
        <div className="aesthetic-card">


            <div className="section-header">
                <h3>Paleta de Cores e Referência</h3>
                <span className="optional">opcional</span>
            </div>


            <p className="section-subtitle">Imagem de Referência</p>


            <label className="image-dropzone">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleInput}
                    hidden
                />


                {!preview ? (
                    <div className="dropzone-content">
                        <div className="upload-icon">
                            <FiUpload />
                        </div>
                        <p><strong>Clique para fazer upload</strong></p>
                        <span>A paleta será extraída automaticamente</span>
                    </div>
                ) : (
                    <img src={preview} className="image-preview" />
                )}
            </label>


            {coresExtraidas.length > 0 && (
                <>
                    <div className="color-palette auto">
                        {coresExtraidas.map((cor, i) => (
                            <div
                                key={i}
                                className="color-box"
                                style={{ background: cor }}
                            />
                        ))}
                    </div>


                    <Button
                        variant="secondary"
                        disabled={!coresExtraidas.length}
                        onClick={aplicarPaleta}
                    >
                        Aplicar paleta
                    </Button>

                </>
            )}


        </div>
    )
}


