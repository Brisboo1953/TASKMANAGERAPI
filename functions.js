const API_URL = "http://localhost:3000/tasks";

document.addEventListener("DOMContentLoaded", loadTasks);

async function loadTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  const list = document.getElementById("taskList");
  const emptyMessage = document.getElementById("emptyMessage");

  list.innerHTML = "";

  if (tasks.length === 0) {
    emptyMessage.textContent = "No hay tareas disponibles.";
    return;
  }

  emptyMessage.textContent = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = task.title;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Eliminar";
    deleteBtn.onclick = () => deleteTask(task.id);

    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const title = input.value.trim();

  if (!title) return;

  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      completed: false
    })
  });

  input.value = "";
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  loadTasks();
}
