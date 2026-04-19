describe("Capítulos", () => {


  beforeEach(function () {
    cy.request("DELETE", "http://localhost:3000/reset")


    cy.request("POST", "http://localhost:3000/projetos", {
      titulo: "Projeto Teste"
    }).then((res) => {
      expect(res.body.id).to.exist
      cy.wrap(res.body.id).as("projectId")
    })
  })




  function abrirAbaCapitulos(projectId) {
    cy.visit(`http://localhost:5173/project/${projectId}`)


    cy.contains("Estética", { timeout: 10000 }).should("exist")


    cy.contains("Capítulos")
      .should("be.visible")
      .click()

    cy.contains("Criar Capítulo", { timeout: 10000 }).should("exist")
  }




  it("cria capítulo", function () {
    const titulo = "Capítulo " + Date.now()


    abrirAbaCapitulos(this.projectId)


    cy.contains("Criar Capítulo").click()


    cy.get('input[placeholder="Título do capítulo"]')
      .should("be.visible")
      .type(titulo)


    cy.contains("Salvar").click()


    cy.contains(titulo, { timeout: 10000 }).should("exist")
  })




  it("não cria capítulo sem título", function () {
    abrirAbaCapitulos(this.projectId)


    cy.contains("Criar Capítulo").click()


    cy.contains("Salvar").click()


    cy.get('input[placeholder="Título do capítulo"]')
      .then($input => {
        expect($input[0].checkValidity()).to.be.false
      })
  })




  it("edita capítulo", function () {
    const titulo = "Capítulo Editar " + Date.now()
    const novoTitulo = titulo + " atualizado"


    abrirAbaCapitulos(this.projectId)

    cy.contains("Criar Capítulo").click()
    cy.get('input[placeholder="Título do capítulo"]').type(titulo)
    cy.contains("Salvar").click()


    cy.contains(titulo).should("exist")

    cy.contains(titulo)
      .closest(".chapter-card")
      .trigger("mouseover")
      .within(() => {
        cy.get('[data-testid="edit-chapter"]').click({ force: true })
      })


    cy.get('input[placeholder="Título do capítulo"]')
      .should("be.visible")
      .clear()
      .type(novoTitulo)


    cy.contains("Salvar").click()


    cy.contains(novoTitulo, { timeout: 10000 }).should("exist")
  })




  it("mantém capítulo após reload", function () {
    const titulo = "Capítulo Persistente"


    abrirAbaCapitulos(this.projectId)


    cy.contains("Criar Capítulo").click()
    cy.get('input[placeholder="Título do capítulo"]').type(titulo)
    cy.contains("Salvar").click()


    cy.reload()


    cy.contains("Capítulos").click()


    cy.contains(titulo).should("exist")
  })




  it("deleta capítulo", function () {
    const titulo = "Capítulo Delete " + Date.now()


    abrirAbaCapitulos(this.projectId)


    cy.contains("Criar Capítulo").click()
    cy.get('input[placeholder="Título do capítulo"]').type(titulo)
    cy.contains("Salvar").click()


    cy.contains(titulo).should("exist")


    cy.intercept("DELETE", "**/capitulos/*").as("deleteCapitulo")


    cy.contains(titulo)
      .closest(".chapter-card")
      .trigger("mouseover")
      .within(() => {
        cy.get('[data-testid="delete-chapter"]').click({ force: true })
      })


    cy.get('[data-testid="confirm-delete"]').click()


    cy.wait("@deleteCapitulo")


    cy.contains(titulo).should("not.exist")
  })




  it("não deleta capítulo ao cancelar", function () {
    const titulo = "Capítulo Cancelar"


    abrirAbaCapitulos(this.projectId)


    cy.contains("Criar Capítulo").click()
    cy.get('input[placeholder="Título do capítulo"]').type(titulo)
    cy.contains("Salvar").click()


    cy.contains(titulo).should("exist")


    cy.contains(titulo)
      .closest(".chapter-card")
      .trigger("mouseover")
      .within(() => {
        cy.get('[data-testid="delete-chapter"]').click({ force: true })
      })


    cy.get('[data-testid="cancel-delete"]').click()


    cy.contains(titulo).should("exist")
  })


})
