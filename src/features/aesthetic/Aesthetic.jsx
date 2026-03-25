import { useState, useEffect } from "react"
import { atualizarEstetica } from "./aestheticStore"

import Input from "../../components/ui/Input"

export default function Aesthetic({ projeto }) {

  const [cores, setCores] = useState(projeto.estetica?.cores || [])
  const [novaCor, setNovaCor] = useState("#000000")

  const [musicas, setMusicas] = useState(projeto.estetica?.musicas || [])
  const [novaMusica, setNovaMusica] = useState("")

  const [humores, setHumores] = useState(projeto.estetica?.humores || [])
  const [novoHumor, setNovoHumor] = useState("")

  const [tags, setTags] = useState(projeto.estetica?.tags || [])
  const [novaTag, setNovaTag] = useState("")

  const opcoesHumor = [
    "Sereno",
    "Melancólico",
    "Acolhedor",
    "Misterioso",
    "Intenso",
    "Alegre",
    "Sombrio",
    "Nostálgico"
  ]

  useEffect(() => {
    atualizarEstetica(projeto.id, {
      cores,
      musicas,
      humores,
      tags
    })
  }, [cores, musicas, humores, tags])

  // CORES

  function adicionarCor() {
    if (!novaCor) return
    if (cores.includes(novaCor)) return
    setCores([...cores, novaCor])
  }

  function removerCor(index) {
    setCores(cores.filter((_, i) => i !== index))
  }

  // MÚSICAS

  function adicionarMusica() {
    if (!novaMusica) return
    setMusicas([...musicas, novaMusica])
    setNovaMusica("")
  }

  function removerMusica(index) {
    setMusicas(musicas.filter((_, i) => i !== index))
  }

  // HUMOR

  function toggleHumor(h) {
    if (humores.includes(h)) {
      setHumores(humores.filter(x => x !== h))
    } else {
      setHumores([...humores, h])
    }
  }

  function adicionarHumorCustom() {
    if (!novoHumor) return
    if (humores.includes(novoHumor)) return
    setHumores([...humores, novoHumor])
    setNovoHumor("")
  }

  function removerHumor(index) {
    setHumores(humores.filter((_, i) => i !== index))
  }

  // TAGS

  function adicionarTag() {
    if (!novaTag) return
    setTags([...tags, novaTag])
    setNovaTag("")
  }

  function removerTag(index) {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (
    <div className="aesthetic-page">

      <div className="aesthetic-content">

        <h2>Estética</h2>

        {/* CORES */}
        <div>
          <h3>Paleta de cores</h3>

          {/* lista */}
          <div className="color-palette">
            {cores.map((cor, i) => (
              <div className="tag-item" key={i}>
                <div className="color-box" style={{ background: cor }} />
                <button className="remove-btn" onClick={() => removerCor(i)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* controles */}
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

            <button onClick={adicionarCor}>Adicionar</button>

          </div>
        </div>

        {/* MÚSICAS */}

        <div>
          <h3>Músicas</h3>

          <Input
            placeholder="Adicionar música"
            value={novaMusica}
            onChange={(e) => setNovaMusica(e.target.value)}
          />

          <button onClick={adicionarMusica}>Adicionar</button>

          <div className="tags">
            {musicas.map((m, i) => (
              <div className="tag-item" key={i}>
                <span>{m}</span>
                <button className="remove-btn" onClick={() => removerMusica(i)}>✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* HUMOR */}

        <div>
          <h3>Humor</h3>

          <div className="tags">
            {opcoesHumor.map((h, i) => (
              <span
                key={i}
                onClick={() => toggleHumor(h)}
                className={humores.includes(h) ? "active" : ""}
              >
                {h}
              </span>
            ))}
          </div>

          <Input
            placeholder="Adicionar humor personalizado"
            value={novoHumor}
            onChange={(e) => setNovoHumor(e.target.value)}
          />

          <button onClick={adicionarHumorCustom}>Adicionar</button>

          <div className="tags">
            {humores.map((h, i) => (
              <div className="tag-item" key={i}>
                <span>{h}</span>
                <button className="remove-btn" onClick={() => removerHumor(i)}>✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* TAGS */}

        <div>
          <h3>Palavras-chave</h3>

          <Input
            placeholder="Adicionar palavra"
            value={novaTag}
            onChange={(e) => setNovaTag(e.target.value)}
          />

          <button onClick={adicionarTag}>Adicionar</button>

          <div className="tags">
            {tags.map((tag, i) => (
              <div className="tag-item" key={i}>
                <span>{tag}</span>
                <button className="remove-btn" onClick={() => removerTag(i)}>✕</button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* SIDEBAR */}

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
            {musicas.map((m, i) => (
              <span key={i}>{m}</span>
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

    </div>
  )
}
