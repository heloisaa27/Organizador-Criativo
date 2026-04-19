import swaggerJSDoc from "swagger-jsdoc"


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Story Builder API",
      version: "1.0.0",
      description: "API para gerenciamento de projetos, personagens e capítulos"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ]
  },
  apis: ["./src/routes/*.js"]
}


export const swaggerSpec = swaggerJSDoc(options)
