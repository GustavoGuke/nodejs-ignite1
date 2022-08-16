const express = require("express")
const { v4: uuidv4 } = require("uuid")
const cors = require("cors")
const app = express()


app.use(express.json())
app.use(cors())

const users = []

// middleware
//checar se username ja existe
function checksExistsUsername(req, res, next) {
    const { username } = req.headers
    const user = users.find(user => user.username === username)
    if (!user) {
        return res.status(400).json({ error: "Username not exists" })
    }
    req.username = user
    next()
}


// Criar usuário passando name e username pelo body, criar objeto com id,name,username,todo
app.post("/users", (req, res) => {
    const { name, username } = req.body

    let checkUserName = users.some(user => user.username === username)

    if (checkUserName) {
        return res.status(400).json({ error: "Username  exists" })
    }

    const newuser = {
        id: uuidv4(),
        name,
        username,
        todo: []
    }

    users.push(newuser)
    return res.status(201).send(newuser)
})

//A rota deve receber, pelo header da requisição, uma propriedade username contendo o username do usuário e retornar uma lista com todas as tarefas desse usuário.
app.get("/todos", checksExistsUsername, (req, res) => {
    const { username } = req
    return res.send(username.todo)
})

//A rota deve receber title e deadline dentro do corpo da requisição e, uma propriedade username contendo o username do usuário dentro do header da requisição. Ao criar um novo todo, ele deve ser armazenada dentro da lista todos do usuário que está criando essa tarefa

app.post("/todos", checksExistsUsername, (req, res) => {
    const { username } = req
    const { title, deadline } = req.body

    const newTodo = {
        id: uuidv4(),
        title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()
    }
    username.todo.push(newTodo)
    return res.status(201).json(newTodo)
})

app.listen(4000)
