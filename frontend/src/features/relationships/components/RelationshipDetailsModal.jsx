import { useState } from "react"
import BaseModal from "../../../components/modals/BaseModal"
import ConfirmModal from "../../../components/modals/ConfirmModal"
import { FiTrash2 } from "react-icons/fi"


export default function RelationshipDetailsModal({
  personagem,
  personagens,
  relacoes,
  onClose,
  onDeleteRelacao
}) {


  const [relacaoParaDeletar, setRelacaoParaDeletar] = useState(null)


  const relacoesDoPersonagem = relacoes.filter(r =>
    r.p1 === personagem.id || r.p2 === personagem.id
  )


  return (
    <BaseModal onClose={onClose}>


      <h3>{personagem.nome}</h3>


      {relacoesDoPersonagem.length === 0 ? (
        <p>Sem relacionamentos</p>
      ) : (
        relacoesDoPersonagem.map(r => {


          const outroId =
            r.p1 === personagem.id ? r.p2 : r.p1


          const outro = personagens.find(p => p.id === outroId)


          return (
            <div key={r.id} className="relationship-item">


              <strong>{outro?.nome}</strong>
              <p>{r.tipo}</p>


              <div className="color-controls">


                <div
                  className="color-preview-relationship"
                  style={{ background: r.cor || "#cccccc" }}
                />


                <button
                  className="delete"
                  onClick={() => setRelacaoParaDeletar(r.id)}
                >
                  <FiTrash2 className="icon-delete" />
                </button>


              </div>


            </div>
          )
        })
      )}


      {relacaoParaDeletar && (
        <ConfirmModal
          title="Remover relação?"
          message="Essa ação não pode ser desfeita."
          confirmText="Remover"
          onConfirm={() => {
            onDeleteRelacao(relacaoParaDeletar)
            setRelacaoParaDeletar(null)
          }}
          onClose={() => setRelacaoParaDeletar(null)}
        />
      )}


    </BaseModal>
  )
}
