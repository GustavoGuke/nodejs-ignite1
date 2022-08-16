const express = require("express")
const { v4: uuidv4 } = require("uuid")


const app = express()
app.use(express.json())
const customers = []


// middleware
function verifyIfExistsAccountCPF(req, res, next) {
    const { cpf } = req.headers
    const customer = customers.find((customer) => {
        return customer.cpf === cpf
    })

    if (!customer) {
        return res.status(400).json({ error: "Customer not found" })
    }


    req.customer = customer

    return next()
}

// Criação 
app.post("/account", (req, res) => {
    const { cpf, name } = req.body
    
    // validando se cpf ja existe
    const customerAlreadExist = customers.some((customer) => {
        return customer.cpf === cpf
    })
    if (customerAlreadExist) {
        return res.status(400).json({ error: "Customers Already exists!" })
    }

    customers.push({
        cpf: cpf,
        name: name,
        id: uuidv4(),
        statement: []
    })

    console.log(customers)

    return res.status(201).send()
})

function getBalance(statement) {
    const balance = statement.reduce((acc, operation) => {
        if (operation.type === "credit") {
            return acc + operation.amount
        } else {
            return acc - operation.amount
        }
    }, 0)

    return balance
}

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req
    return res.json(customer.statement)
})

// depósito
app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
    const { description, amount } = req.body
    const { customer } = req

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation)

    return res.status(201).send()
})

// saque
app.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
    const { amount } = req.body
    const { customer } = req

    const balance = getBalance(customer.statement)

    if (balance < amount) {
        return res.status(400).json({ error: "Insufficient funds!" })
    }


    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation)

    return res.status(201).send()
})

// buscar por data
app.get("/statement/date", verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req
    const { date } = req.query
    const dateFormat = new Date(date + " 00:00")
    const statement = customer.statement.filter((statement) => {
        return statement.created_at.toDateString() === new Date(dateFormat).toDateString()
    })
    return res.json(statement)
})

// atualizar nome
app.put("/account", verifyIfExistsAccountCPF, (req, res) => {
    const { name } = req.body
    const { customer } = req
    customer.name = name

    return res.status(201).send()
})

// buscar dados 
app.get("/account", verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req
    return res.json(customer)
})


// delete
app.delete("/account", verifyIfExistsAccountCPF, (req, res) => {
    const {customer} = req

    const indexCostumer = customers.findIndex( index => index.cpf === customer.cpf)
    customers.splice(indexCostumer,1)

    return res.status(200).json(customers)
})

app.get("/balance", verifyIfExistsAccountCPF, (req, res) => {
    const {customer} = req
    const balance = getBalance(customer.statement)
    return res.json(balance)
})

app.listen(4000)