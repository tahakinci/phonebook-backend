const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("Please provide the password as an argument: node mongo.js <password>")
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://phonebook:${password}@phonebook.bpzfary.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model("Person", personSchema)

mongoose
    .connect(url)
    .then((result) => {
        Person.create({ name: name, number: number })
            .then((data) => {
                console.log(`Added ${data.name} phone ${data.number} to phonebook`)
            }).catch((err) => console.log(err));

    })

    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })





