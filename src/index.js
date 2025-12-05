import express from "express"
import cors from "cors"
import mysql from "mysql2"

const { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } = process.env

const app = express()
const port = 3333

app.use(cors())
app.use(express.json())

app.get("/", (request, response) => {
  const selectCommand = "SELECT name, email FROM usuario"
  database.query(selectCommand, (error, users) => {
    if (error) {
      console.log(error)
      return
    }
    response.json(users)
  })
})

app.post("/cadastrar", (request, response) => {
  const { name, email, password } = request.body.user

  const insertCommand = "INSERT INTO usuario(name, email, password) VALUES(?, ?, ?)"

  database.query(insertCommand, [name, email, password], (error) => {
    if (error) {
      console.log(error)
      return
    }
    response.status(201).json({ message: "Usuário cadastrado com sucesso!" })
  })
})

app.post("/login", (request, response) => {
  const { email, password } = request.body.user

  const selectCommand = "SELECT * FROM usuario WHERE email = ?"

  database.query(selectCommand, [email], (error, user) => {
    if (error) {
      console.log(error)
      return
    }

    if (user.length === 0 || password !== user[0].password) {
      response.json({ message: "Email ou senha incorreto!" })
      return
    }

    response.json({ id: user[0].id, name: user[0].name })
  })
})

app.post("/score", (request, response) => {
  const { id, score } = request.body.userScore
  response.json({ message: "Rota de score recebida" })
})

app.listen(port, () => {
  console.log("Servidor rodando na porta:", port)
})

const database = mysql.createPool({
  host: DATABASE_HOST,
  database: DATABASE_NAME,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  connectionLimit: 10
})