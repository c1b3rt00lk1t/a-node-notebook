require("dotenv").config();
const express = require("express");
const app = express();
const Note = require("./models/note");
console.log(Note)

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
  Note.findById(request.params.id).then((note) => {
    if(note){
      response.json(note);
    } else {
      response.status(404).end();
    }

  })
  .catch(error => {
    console.log(error)
    response.status(400).send({error: 'malformatted id'})
  })
});

app.delete("/api/notes/:id", (request, response) => {
  Note.deleteOne({ _id: request.params.id })
    .then((res) => response.json(request.params.id));
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
    date: new Date(),
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.put("/api/notes/:id", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  Note.updateOne(
    { _id: body.id },
    { $set: { important: body.important } }
  ).then((res) => response.json(body));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
