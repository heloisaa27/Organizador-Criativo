describe("Fluxo completo do usuário", () => {


  beforeEach(() => {
    cy.request("DELETE", "http://localhost:3000/reset")
  })


  it("usuário cria projeto, define estética, personagem e capítulo", () => {
    const nomeProjeto = "Projeto " + Date.now()
    const personagem = "Herói"
    const capitulo = "Capítulo 1"


    cy.visit("http://localhost:5173")


    // cria projeto
    cy.contains("Criar Projeto").click()
    cy.get('[data-testid="input-nome"]').type(nomeProjeto)
    cy.contains("Salvar").click()


    cy.contains(nomeProjeto).click()

    // ESTÉTICA
    cy.contains("Estética", { timeout: 10000 }).should("exist")


    // HUMOR
    cy.contains("Humor")
      .parent()
      .within(() => {


        cy.get('input[placeholder="Adicionar humor personalizado"]')
          .should("be.visible")
          .type("Sombrio")


        cy.contains("Adicionar").click()


        cy.contains("Sombrio").should("exist")
      })




    // PALAVRAS-CHAVE
    cy.contains("Palavras-chave")
      .parent()
      .within(() => {


        cy.get('input[placeholder="Adicionar palavra"]')
          .should("be.visible")
          .type("Fantasia")


        cy.contains("Adicionar").click()


        cy.contains("Fantasia").should("exist")
      })



    // COR
    cy.get('input[type="color"]')
      .first()
      .trigger("change")


    cy.contains("Adicionar").first().click() 

    cy.get(".color-preview, .tag, .chip, .color-item")
      .should("exist")


    // PERSONAGENS
    cy.contains("Personagens").click()


    cy.contains("Criar Personagem").click()
    cy.get('input[placeholder="Nome do personagem"]').type(personagem)
    cy.contains("Salvar").click()


    cy.contains(personagem).should("exist")


    // CAPÍTULOS
    cy.contains("Capítulos").click()


    cy.contains("Criar Capítulo").click()
    cy.get('input[placeholder="Título do capítulo"]').type(capitulo)
    cy.contains("Salvar").click()


    cy.contains(capitulo).should("exist")
  })


})
