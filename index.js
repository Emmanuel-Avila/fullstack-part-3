const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token('body', function gePostToken(req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const responseMessage = `Phonebook has info for ${persons.length} people <br /> ${new Date(Date.now())}`
  response.send(responseMessage);
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);

  const person = persons.find(p => p.id === id);

  if (person) {
    response.json(person).status(200);
  } else {
    response.status(404).send({ error: "Unknown Id" }).end();
  }

})

app.patch('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;
  const person = persons.find(p => p.id === id);
  const updatedPhonePerson = { ...person, ...body };
  if (person) {
    persons = persons.map(p => p.id === id ? updatedPhonePerson : p)
    response.json(updatedPhonePerson).status(200)
  } else {
    response.status(404).send({ error: "Unknown id" }).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id);
  if (person) {
    persons = persons.filter(p => p.id !== id);
    response.json(person).status(200);
  } else {
    response.status(404).send({ error: "Unknown id" }).end();
  }

})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "missing info"
    })
  }

  const duplicateName = persons.find(p => p.name === body.name);

  if (duplicateName) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person);
  response.json(person).status(200)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})