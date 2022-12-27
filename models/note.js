const { pass } = require("../pass.js");

const mongoose = require("mongoose");
const url = `mongodb+srv://fullstack:${pass}@cluster0.pf1gfrd.mongodb.net/noteBook?retryWrites=true&w=majority`;
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Note", noteSchema);