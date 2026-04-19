describe("Personagens - fluxo completo", () => {


  function abrirAbaPersonagens(projectId) {
    cy.visit(`http://localhost:5173/project/${projectId}`)

    cy.contains("Estética", { timeout: 10000 }).should("exist")

    cy.contains("Personagens")
      .should("be.visible")
      .click()

    cy.contains("Criar Personagem", { timeout: 10000 }).should("exist")
  }


  beforeEach(function () {
    cy.request("DELETE", "http://localhost:3000/reset")


    cy.request("POST", "http://localhost:3000/projetos", {
      titulo: "Projeto Teste"
    }).then((res) => {
      expect(res.body.id).to.exist
      cy.wrap(res.body.id).as("projectId")
    })
  })




  it("cria personagem com sucesso", function () {
    abrirAbaPersonagens(this.projectId)


    cy.contains("Criar Personagem").click()


    cy.get('input[placeholder="Nome do personagem"]')
      .should("be.visible")
      .type("Personagem Cypress")


    cy.contains("Salvar").click()


    cy.contains("Personagem Cypress", { timeout: 10000 }).should("exist")
  })


  it("não cria personagem sem nome", function () {
    abrirAbaPersonagens(this.projectId)


    cy.contains("Criar Personagem").click()


    cy.contains("Salvar").click()


    cy.get('input[placeholder="Nome do personagem"]')
      .then($input => {
        expect($input[0].checkValidity()).to.be.false
      })
  })


  it("edita personagem", function () {
    const nome = "Personagem Editar"
    const novoNome = "Personagem Editado"


    abrirAbaPersonagens(this.projectId)

    cy.contains("Criar Personagem").click()
    cy.get('input[placeholder="Nome do personagem"]').type(nome)
    cy.contains("Salvar").click()


    cy.contains(nome).should("exist")

    cy.contains(nome)
      .closest(".character-card")
      .within(() => {
        cy.get('[data-testid="edit-character"]').click({ force: true })
      })

    cy.get('input[placeholder="Nome do personagem"]')
      .clear()
      .type(novoNome)

    cy.contains("Salvar").click()

    cy.contains(novoNome).should("exist")
  })

  it("mantém personagem após reload", function () {
    abrirAbaPersonagens(this.projectId)


    cy.contains("Criar Personagem").click()


    cy.get('input[placeholder="Nome do personagem"]')
      .type("Persistente")


    cy.contains("Salvar").click()


    cy.reload()


    cy.contains("Personagens").click()


    cy.contains("Persistente").should("exist")
  })

  it("deleta personagem com sucesso", function () {
    abrirAbaPersonagens(this.projectId)

    cy.contains("Criar Personagem").click()

    cy.get('input[placeholder="Nome do personagem"]')
      .type("Deletar Teste")

    cy.contains("Salvar").click()

    cy.contains("Deletar Teste").should("exist")

    cy.intercept("DELETE", "**/personagens/*").as("deletePersonagem")

    cy.contains("Deletar Teste")
      .closest(".character-card")
      .within(() => {
        cy.get('[data-testid="delete-character"]').click({ force: true })
      })

    cy.get('[data-testid="confirm-delete"]').click()

    cy.wait("@deletePersonagem")

    cy.contains("Deletar Teste").should("not.exist")
  })


  it("não deleta personagem ao cancelar", function () {
    abrirAbaPersonagens(this.projectId)

    cy.contains("Criar Personagem").click()

    cy.get('input[placeholder="Nome do personagem"]')
      .type("Cancelar Delete")

    cy.contains("Salvar").click()

    cy.contains("Cancelar Delete").should("exist")

    cy.contains("Cancelar Delete")
      .closest(".character-card")
      .within(() => {
        cy.get('[data-testid="delete-character"]').click({ force: true })
      })

    cy.get('[data-testid="cancel-delete"]').click()

    cy.contains("Cancelar Delete").should("exist")
  })


})
