const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

const { loginValidation, login, authenticateToken } = require('./auth');

app.use(cors());
app.use(express.json());

function getUsers() {
  const data = fs.readFileSync('usuarios.json');
  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync('usuarios.json', JSON.stringify(users, null, 2));
}

app.post('/login', loginValidation, login);

app.get('/tasks', authenticateToken, (req, res) => {

  const users = getUsers();

  const user = users.find(u => u.username === req.user.username);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  if (!user.tasks) {
    user.tasks = [];
  }

  res.json(user.tasks);

});

app.post('/tasks', authenticateToken, (req, res) => {

  const { title } = req.body;

  const users = getUsers();

  const user = users.find(u => u.username === req.user.username);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  if (!user.tasks) {
    user.tasks = [];
  }

  const newTask = {
    id: Date.now(),
    title: title,
    completed: false
  };

  user.tasks.push(newTask);

  saveUsers(users);

  res.status(201).json(newTask);

});

app.delete('/tasks/:id', authenticateToken, (req, res) => {

  const id = parseInt(req.params.id);

  const users = getUsers();

  const user = users.find(u => u.username === req.user.username);

  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  user.tasks = user.tasks.filter(task => task.id !== id);

  saveUsers(users);

  res.sendStatus(204);

});

app.listen(3000, () => {
  console.log('Servidor iniciado en http://localhost:3000');
});
