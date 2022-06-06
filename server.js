const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(morgan('tiny'))

morgan.token('object', (req, res) => {
  return `${JSON.stringify(req.body)}`
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

const PORT = 3001

let persons = [
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

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(entry => entry.id))
    : 0
  return maxId + 1
}

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
  const currentDate = new Date()
  res.send(`<h2>Phonebook has info for ${persons.length} people </h2> 
            <h2>${currentDate} </h2>`)

})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const entry = persons.find(entry => entry.id === id)

  if(entry){
    res.json(entry)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id' , (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(entry => entry.id != id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name){
    //custom error message
    return res.status(400).json({ error: 'name is missing' })
  }

  if(!body.number){
    //custom error message
    return res.status(400).json({ error: 'number is missing' })
  }

  if(persons.some(entry => entry.name === body.name)){
    //return error
    return res.status(409).json({ error: 'name must be unique' })
  }

  let entry = {
    id: generateId(),
    name: body.name,
    number: body.number 
  }

  persons.push(entry)
  res.json(persons)
})

app.listen(PORT, () => {
  console.log(`Server active on ${PORT}`)
})