require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require('cors')
const Phonebook = require('./models/phonebook')

app.use(express.json())
app.use(cors())

morgan.token('body', function gePostToken(req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const responseMessage = `Phonebook has info for ${persons.length} people <br /> ${new Date(Date.now())}`
  response.send(responseMessage);
})

app.get('/api/persons', (request, response) => {
  Phonebook.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;

  Phonebook.findById(id)
    .then(person => {
      if (person) {
        return response.json(person).status(200);
      }
      response.status(404).send({ error: "Unknown Id" }).end();
    })
    .catch(err => {
      console.log(err)
      response.status(500).send({ error: "Unknown Id" }).end();
    })
})

app.patch('/api/persons/:id', (request, response) => {

  const id = request.params.id;
  const body = request.body;

  Phonebook.findByIdAndUpdate(id, { ...body }, { new: true })
    .then(result => {
      if (result) {
        return response.json(result).status(200)
      }
      response.status(404).send({ error: "Unknown id" }).end()
    })
    .catch(err => {
      console.log(err)
      response.status(500).send({ error: "Unknown id" }).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  Phonebook.findByIdAndDelete(id)
    .then(result => {
      if (result.length !== 0) {
        return response.json(result).status(200);
      }
      response.status(404).send({ error: "Unknown id" }).end();
    })
    .catch(err => {
      console.log(err)
      response.status(500).send({ error: "Unknown id" }).end();
    })


})

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "missing info"
    })
  }

  Phonebook.find({ name: body.name })
    .then(result => {
      if (result.length !== 0) {
        return response.status(400).json({
          error: "name must be unique"
        }).end()
      }

      const person = new Phonebook({
        name: body.name,
        number: body.number
      })

      person.save().then(savedPerson => {
        response.json(savedPerson).status(201)
      })

    })
    .catch(err => {
      console.log(err)
      response.status(500).end()
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})