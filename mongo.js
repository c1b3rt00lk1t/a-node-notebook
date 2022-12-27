const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
if (process.argv.length < 4) {
  console.log('Please provide the text for the new note to be included')
  process.exit(1)
}

const password = process.argv[2]
const newNote = process.argv[3]


// important: the name of the database has to be included BEFORE the question mark ?retryWrites...
const url = `mongodb+srv://fullstack:${password}@cluster0.pf1gfrd.mongodb.net/noteBook?retryWrites=true&w=majority`



const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    const note = new Note({
      content: newNote,
      date: new Date(),
      important: true,
    })

    return note.save()
  })
  .then(() => {
    console.log(newNote,'note saved!')
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))