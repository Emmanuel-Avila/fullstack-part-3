const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => { console.log('error connecting to MongoDB: ', err.message) })



const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /([0-9]{2,3}-[0-9]{3,})/.test(v)
      },
      message: props => `${props.value} no es un numero valido!`
    },
    required: true
  },
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    return returnedObject
  }
})
module.exports = mongoose.model('Phonebook', phonebookSchema)