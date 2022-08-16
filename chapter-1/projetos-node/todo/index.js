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
    const { user } = req.headers
    const userExist = users.find(username => username.username === user)
    if (!userExist) {
        return res.status(400).json({ error: "User not exists" })
    }
    req.user = userExist
    return next()
}
// checar se usuário e pró, deixar ter 10 todos para usuario free
function checksCreateTodoUserAvailability(req, res, next) {
    const { user } = req

    if (!user.pro && user.todo.length >= 10) {
        return res.status(404).json({ error: "free version limit of 10 all reached" })
    }
    return next()

}

function checksTodoExists(req, res, next) {
    const { username } = req.headers
    const id = req.params.id

    const userExist = users.find(user => user.username === username)
    if (!userExist) {
        return res.status(404).json({ error: "User not found" })
    }

    const userIdTodo = userExist.todo.find(userId => userId.id === id)
    if (!userIdTodo) {
        return res.status(404).json({ error: "Id Not found" })
    }

    req.todo = userIdTodo
    return next()
}

//checar se nome existe
function findUserByid(req, res, next) {
    const id = req.params.id

    const checkIdUser = users.find(user => user.id === id)
    if (!checkIdUser) {
        return res.status(404).json({ error: "ID Not Found" })
    }

    req.user = checkIdUser
    return next()
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
        pro: false,
        todo: []
    }

    users.push(newuser)
    return res.status(201).json(newuser)
})

// buscar todos usuários
app.get("/users/show", (req, res) => {
    return res.json(users)
})


// buscar um usuário
app.get("/users/:id", findUserByid, (req, res) => {
    const { user } = req
    return res.json(user)
})

// fazer update do nome e username
app.put("/users/login", checksExistsUsername, (req, res) => {
    const { user } = req
    const { name, username } = req.body

    user.name = name
    user.username = username

    return res.status(200).json(user)

})

app.delete("/users/:id", findUserByid, (req, res) => {
    const { user } = req
    const userIndex = users.indexOf(user)

    if (userIndex === -1) {
        return res.status(404).json({ error: "User id not found " })
    }

    users.splice(userIndex, 1)

    return res.status(204).send()
})

// mudar conta para pro
app.patch("/users/:id/pro", findUserByid, (req, res) => {
    const { user } = req

    if (user.pro) {
        return res.status(404).json({ error: "Pro plan is already active" })
    }
    user.pro = true
    return res.json(user)
})

//A rota deve receber, pelo header da requisição, uma propriedade username contendo o username do usuário e retornar uma lista com todas as tarefas desse usuário.
app.get("/todos", checksExistsUsername, (req, res) => {
    const { user } = req
    return res.send(user.todo)
})

//A rota deve receber title e deadline dentro do corpo da requisição e, uma propriedade username contendo o username do usuário dentro do header da requisição. Ao criar um novo todo, ele deve ser armazenada dentro da lista todos do usuário que está criando essa tarefa
app.post("/todos", checksExistsUsername, checksCreateTodoUserAvailability, (req, res) => {
    const { title, deadline } = req.body
    const { user } = req

    const newTodo = {
        id: uuidv4(),
        title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()
    }
    user.todo.push(newTodo)
    return res.status(201).json(newTodo)
})



//A rota deve receber, pelo header da requisição, uma propriedade username contendo o username do usuário e receber as propriedades title e deadline dentro do corpo. É preciso alterar apenas o title e o deadline da tarefa que possua o id igual ao id presente nos parâmetros da rota
app.put("/todos/:id", checksTodoExists, (req, res) => {
    const { title, deadline } = req.body
    const { todo } = req
    // const id = req.params.id
    // console.log(id)
    // let update = user.todo.find(user => user.id === id)
    // if (!update) {
    //     return res.status(404).json({ error: "ID not Found" })
    // }
    //console.log(update)
    todo.title = title
    todo.deadline = new Date(deadline)

    return res.status(201).json(todo)
})

// A rota deve receber, pelo header da requisição, uma propriedade username contendo o username do usuário e alterar a propriedade done para true no todo que possuir um id igual ao id presente nos parâmetros da rota.
app.patch("/todos/:id/done", checksTodoExists, (req, res) => {
    const { todo } = req

    todo.done = true
    return res.status(200).json(todo)
})

//A rota deve receber, pelo header da requisição, uma propriedade username contendo o username do usuário e alterar a propriedade done para true no todo que possuir um id igual ao id presente nos parâmetros da rota.
app.delete("/todo/:id", checksExistsUsername, checksTodoExists, (req, res) => {
    const { user, todo } = req
    const todoIndex = user.todo.indexOf(todo)

    if (todoIndex === -1) {
        return res.status(404).json({ error: "Todo Not found" })
    }

    user.todo.splice(todoIndex, 1)
    return res.status(204).json(user.todo)


    // const id = req.params.id

    // let updateDonecheck = user.todo.some(user => user.id === id)
    // if (!updateDonecheck) {
    //     return res.status(404).json({ error: "ID not Found" })
    // }
    // let updateDone = user.todo.filter(user => user.id !== id)
    // user.todo = updateDone
    // return res.status(204).json()
})

app.listen(3333)
