const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Estudiar Web APIs",
    completed: false
  }
];

let nextId = 2;

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title, completed } = req.body;

  if (!title) {
    return res.status(400).json({ message: "El título es obligatorio" });
  }

  const newTask = {
    id: nextId++,
    title,
    completed: completed || false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});


app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(task => task.id !== id);
  res.json({ message: "Tarea eliminada" });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
