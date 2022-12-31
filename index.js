const { response } = require('express')
const express = require('express')
const morgan = require("morgan")
const cors = require('cors')


const app = express()

let phonebook = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.use(express.json())

app.use(cors())

const generateId = () => {
    let id;
    const number = Math.floor(Math.random() * 1000)
    if (phonebook.length > 0 && !(phonebook.map(a => a.id).includes(number))) {
        id = number
    } else {
        generateId()
    }

    return id
}

app.post("/api/phonebook", (req, res) => {
    const body = req.body

    if (phonebook.map(a => a.name).includes(body.name)) {
        return res.status(400).json({
            error: "name must be uniq"
        })
    } else if ((!body.name) || (!body.number)) {
        return res.status(400).json({
            error: "name or number is missing"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    phonebook = phonebook.concat(person)
    res.json(person)
})

app.get("/", (req, res) => {
    res.send("<h1>Hello Guys</h1>")
})

app.get('/api/phonebook', (req, res) => {
    res.json(phonebook)
})

app.get("/api/info", (req, res) => {
    const date = new Date()
    const numberOfPeople = phonebook.length

    res.send(`<p>Phonebook has info for ${numberOfPeople} people <br /> ${date}</p>`)
})

app.get('/api/phonebook/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = phonebook.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete("/api/phonebook/:id", (req, res) => {
    const id = Number(req.params.id)
    phonebook = phonebook.filter(p => p.id !== id)

    res.status(204).end()
})



const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
app.use(morgan("tiny"))