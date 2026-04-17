import { useEffect, useState, useRef } from "react"

import Input from "../../../components/ui/Input"
import { FiSearch, FiPlay, FiPause } from "react-icons/fi"

import { getTrendingMusicas, searchMusicas } from "../../../services/musicService"

export default function MusicSection({
    musicas,
    onAdd,
    onRemove
}) {
    const [busca, setBusca] = useState("")
    const [resultados, setResultados] = useState([])
    const [carregando, setCarregando] = useState(false)

    const audioRef = useRef(null)
    const [tocandoId, setTocandoId] = useState(null)

    useEffect(() => {
        carregarMusicasIniciais()
    }, [])

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
            }
        }
    }, [])

    async function carregarMusicasIniciais() {
        try {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
                audioRef.current = null
                setTocandoId(null)
            }

            setCarregando(true)
            const data = await getTrendingMusicas()
            setResultados(data)
        } catch (e) {
            console.error(e)
        } finally {
            setCarregando(false)
        }
    }

    async function buscarMusicas(valor) {
        setBusca(valor)

        if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            audioRef.current = null
            setTocandoId(null)
        }

        if (!valor.trim()) {
            carregarMusicasIniciais()
            return
        }

        try {
            setCarregando(true)
            const data = await searchMusicas(valor)
            setResultados(data)
        } catch (e) {
            console.error(e)
        } finally {
            setCarregando(false)
        }
    }

    function handleSelect(musica) {
        const jaExiste = musicas.some((m) => m.id === musica.id)

        if (jaExiste) {
            const index = musicas.findIndex((m) => m.id === musica.id)
            onRemove(index)
        } else {
            onAdd(musica)
        }
    }

    function handlePlay(musica) {
        if (!musica.preview) {
            console.warn("Preview não disponível")
            return
        }

        const audioAtual = audioRef.current

        // mesma música → pausa
        if (tocandoId === musica.id && audioAtual) {
            audioAtual.pause()
            audioAtual.src = ""
            audioRef.current = null
            setTocandoId(null)
            return
        }

        // limpa COMPLETAMENTE o anterior
        if (audioAtual) {
            audioAtual.pause()
            audioAtual.src = ""
            audioRef.current = null
        }

        const novoAudio = new Audio()

        novoAudio.src = musica.preview
        novoAudio.load()

        novoAudio.play()
            .then(() => {
                audioRef.current = novoAudio
                setTocandoId(musica.id)
            })
            .catch(() => {
                console.warn("Erro ao tocar preview")
            })

        novoAudio.onended = () => {
            setTocandoId(null)
            audioRef.current = null
        }

        novoAudio.onerror = () => {
            setTocandoId(null)
            audioRef.current = null
        }
    }

    return (
        <div className="aesthetic-card">
            <h3>Músicas</h3>

            <div className="input-icon">
                <FiSearch className="icon" />

                <Input
                    placeholder="Buscar música ou artista..."
                    value={busca}
                    onChange={(e) => buscarMusicas(e.target.value)}
                />
            </div>

            <div className="music-list">
                {carregando && <p>Carregando...</p>}

                {!carregando &&
                    resultados.slice(0, 5).map((m) => {
                        const selecionada = musicas.some(
                            (mSel) => mSel.id === m.id
                        )

                        return (
                            <div
                                key={m.id}
                                className={`music-item ${selecionada ? "selected" : ""}`}
                                onClick={() => handleSelect(m)}
                            >
                                <div className="music-info">
                                    <span className="music-title">{m.title}</span>
                                    <span className="music-artist">{m.artist?.name || "Desconhecido"}</span>
                                </div>

                                <div
                                    className="music-play"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handlePlay(m)
                                    }}
                                >
                                    {tocandoId === m.id ? <FiPause /> : <FiPlay />}
                                </div>
                            </div>
                        )
                    })}
            </div>

            {musicas.length > 0 && (
                <div className="selected-music-list">
                    <h4>Músicas selecionadas</h4>

                    {musicas.map((m) => (
                        <div
                            key={m.id}
                            className="music-item selected"
                            onClick={() => handleSelect(m)}
                        >
                            <div className="music-info">
                                <span className="music-title">{m.title}</span>
                                <span className="music-artist">{m.artist?.name || "Desconhecido"}</span>
                            </div>

                            <div
                                className="music-play"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handlePlay(m)
                                }}
                            >
                                {tocandoId === m.id ? <FiPause /> : <FiPlay />}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
