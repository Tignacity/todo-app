document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const list = document.getElementById('task-list');
  const clearBtn = document.getElementById('clear-btn');

  const API_BASE = 'http://localhost:5000/api/tasks';

  async function loadTasks() {
    try {
      const res = await fetch(API_BASE);
      const tasks = await res.json();
      list.innerHTML = '';
      tasks.forEach(task => {
        createTaskElement(task.text, task.done, task._id);
      });
    } catch (err) {
      console.error('Load failed', err);
    }
  }

  async function saveTask(text) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const task = await res.json();
    createTaskElement(task.text, task.done, task._id);
  }

  async function updateTask(id, done) {
    await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done })
    });
  }

  async function deleteTask(id) {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  }

  function createTaskElement(text, done, id) {
    const li = document.createElement('li');
    li.dataset.id = id;

    li.innerHTML = `
      <label>
        <input type="checkbox" ${done ? 'checked' : ''} />
        <span class="task-text ${done ? 'done' : ''}">${text}</span>
      </label>
      <button>Delete</button>
    `;

    const checkbox = li.querySelector('input');
    checkbox.addEventListener('change', () => {
      updateTask(id, checkbox.checked);
      li.querySelector('.task-text').classList.toggle('done');
    });

    li.querySelector('button').addEventListener('click', () => {
      deleteTask(id);
      li.remove();
    });

    list.appendChild(li);
  }

  function addTask() {
    const text = input.value.trim();
    if (!text) return;
    saveTask(text);
    input.value = '';
  }

  addBtn.addEventListener('click', addTask);
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
  });

  clearBtn.addEventListener('click', async () => {
    if (!confirm('Delete all tasks?')) return;
    await fetch(API_BASE, { method: 'DELETE' });
    list.innerHTML = '';
  });

  loadTasks();
});
