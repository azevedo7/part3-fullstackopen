const express = require('express')
const app = express()
const morgan = require('morgan')
morgan.token('body', function(req, res) { return JSON.stringify(req.body) })

app.use(express.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//3.2
app.get('/info', (req,res) => {
    const numberPeople = persons.length
    const date = Date()
    res.send(`<p>Phonebook has info for ${numberPeople} people</p>
        <p>${date.toString()}</p>`)
})


//3.3
app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id = id)
    
    if(person){
        res.json(person)
    } else{
        res.status(404).end()
    }
})

//3.4
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)
    
    res.status(204).end()
})

//3.5
const generateId = () => {
    return String(Math.floor(Math.random() * 10000))
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    // name is missing
    if(!body.name){
        return res.status(400).json({
            error: 'name missing'
        })
    }

    // phone is missing
    if(!body.number){
        return res.status(400).json({
            error: 'phone missing'
        })
    }

    // name exists
    if(persons.find(p => p.name === body.name))
    {
        return res.status(404).json({
            error: 'name exists'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: Number(body.number)
    } 
    persons = persons.concat(person)

    console.log(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})