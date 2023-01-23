require("dotenv").config()
const { response } = require("express")
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")
const mongoose = require("mongoose")



const app = express()

// BEFORE MONGO
// let phonebook = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

app.use(express.json())

app.use(cors())

app.use(express.static("build"))

// BEFORE MONGO
// const generateId = () => {
//     let id;
//     const number = Math.floor(Math.random() * 1000)
//     if (phonebook.length > 0 && !(phonebook.map(a => a.id).includes(number))) {
//         id = number
//     } else {
//         generateId()
//     }

//     return id
// }

// let addedList = []
// let x = Person.find({})
//     .then(result => {
//         result.forEach(p => {
//             addedList.push(p.name)
//             console.log(returnedList)
//         })
//     })

app.post("/api/phonebook", (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    // BEFORE MONGO
    // if (phonebook.map(a => a.name).includes(body.name)) {
    //     return res.status(400).json({
    //         error: "name must be uniq"
    //     })
    // } else if ((!body.name) || (!body.number)) {
    //     return res.status(400).json({
    //         error: "name or number is missing"
    //     })
    // }

    if (body.name === undefined) {
        return res.status(400).json({ error: "name missing" })
    }



    Person.create(person)
        .then(data => {
            console.log(`Added ${data.name} phone ${data.number} to phonebook`,)
        })

        

    // BEFORE MONGO
    // phonebook = phonebook.concat(person)
    // person.save().then(savedPerson => {
    //     res.json(savedPerson)
    // })
})

app.put("/api/phonebook/:id", (req, res, next) => {
    const {name, number} = req.body
    Person.findById(
        req.params.id,
        {name, number},
        {new: true, runValidators: true, context: "query"}
    )
        .then(person => {
            if (name === person.name && number !== person.number) {
                console.log("number changed")
                person.number = number
            } else if (name !== person.name && number === person.number) {
                console.log("name changed")
                person.name = name
            }
            person.save().then(savedPerson => res.json(savedPerson))
            
        }).catch(err => next(err))
})

app.get("/api/phonebook", (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get("/", (req, res) => {
    res.send("<h1>Hello Guys</h1>")
})

// BEFORE MONGO
// app.get('/api/phonebook', (req, res) => {
//     res.json(phonebook)
// })


// app.get("/api/info", (req, res) => {
//     const date = new Date()
//     const numberOfPeople = phonebook.length

//     res.send(`<p>Phonebook has info for ${numberOfPeople} people <br /> ${date}</p>`)
// })

app.get("/api/phonebook/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            console.log(person)
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete("/api/phonebook/:id", (req, res) => {
    Person.findById(req.params.id)
        .then(person => {
            person.delete()
        })

    res.status(204).end()
})

const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if(error.name === "CastError") {
        return res.status(400).send({error: "malformed id"})
    } else if(error.name === "ValidationError") {
        return res.status(400).json({error: error.message})
    }

    next(error)
}



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
app.use(morgan("tiny")) 