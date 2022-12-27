require('dotenv').config();
const express = require("express");
const app = express();
const Note = require('./models/note')

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use(requestLogger);

app.use(express.static("build"));



app.get("/", (request, response) => {
  response.send("<h1>Hello World!<h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  note ? response.json(note) : response.status(404).end("404 not found");
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});


app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  // Use of the class Note and removal of the id to let the db generate it
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  });


  note.save().then(savedNote => {
    response.json(savedNote)
  })
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
