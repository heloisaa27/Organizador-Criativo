describe("Projetos - fluxo completo", () => {


  beforeEach(() => {
    cy.request("DELETE", "http://localhost:3000/reset")


    cy.visit("http://localhost:5173")

    cy.contains("Criar Projeto", { timeout: 10000 }).should("exist")
  })




  it("cria projeto com nome (mínimo)", () => {
    const nome = "Projeto " + Date.now()


    cy.contains("Criar Projeto").click()


    cy.get('[data-testid="input-nome"]')
      .should("be.visible")
      .type(nome)


    cy.contains("Salvar").click()


    cy.contains(nome, { timeout: 10000 }).should("exist")
  })




  it("não cria projeto sem nome", () => {
    cy.contains("Criar Projeto").click()


    cy.contains("Salvar").click()


    cy.get('[data-testid="input-nome"]')
      .then($input => {
        expect($input[0].checkValidity()).to.be.false
      })
  })




  it("cria projeto completo", () => {
    const nome = "Projeto Completo " + Date.now()


    cy.contains("Criar Projeto").click()


    cy.get('[data-testid="input-nome"]').type(nome)
    cy.get('[data-testid="input-descricao"]').type("Uma história épica")
    cy.get('[data-testid="input-genero"]').type("Fantasia")


    cy.contains("Salvar").click()


    cy.contains(nome, { timeout: 10000 }).should("exist")
  })




  it("edita projeto", () => {
    const nome = "Projeto Editar " + Date.now()
    const novoNome = nome + " atualizado"


    cy.contains("Criar Projeto").click()
    cy.get('[data-testid="input-nome"]').type(nome)
    cy.contains("Salvar").click()


    cy.contains(nome).should("exist")

    cy.contains(nome)
      .closest(".story-card")
      .within(() => {
        cy.get('[data-testid="edit-project"]').click({ force: true })
      })


    cy.get('[data-testid="input-nome"]')
      .clear()
      .type(novoNome)


    cy.contains("Salvar").click()


    cy.contains(novoNome, { timeout: 10000 }).should("exist")
  })


  it("deleta projeto", () => {
    const nome = "Projeto Deletar " + Date.now()

    cy.contains("Criar Projeto").click()
    cy.get('[data-testid="input-nome"]').type(nome)
    cy.contains("Salvar").click()


    cy.contains(nome).should("exist")


    cy.intercept("DELETE", "**/projetos/*").as("deleteProjeto")


    cy.contains(nome)
      .closest(".story-card")
      .within(() => {
        cy.get('[data-testid="delete-project"]').click({ force: true })
      })


    cy.get('[data-testid="confirm-delete"]').click()


    cy.wait("@deleteProjeto")


    cy.contains(nome).should("not.exist")
  })


})
