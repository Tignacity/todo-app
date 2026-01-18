 document.addEventListener('DOMContentLoaded', () => {
 

  const input = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const list = document.getElementById('task-list');

// API base URL (change to production URL later)
const API_BASE = 'http://localhost:5000/task';

// Load tasks from backend when page loads
async function loadTasks() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to load tasks');
    const tasks = await res.json();
    list.innerHTML = ''; // Clear current list
    tasks.forEach(task => createTaskElement(task.text, task.done, task._id));
  } catch (err) {
    console.error('Error loading tasks:', err);
    alert('Could not load tasks from server');
  }
}

// Save a new task to backend
async function saveTask(text) {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error('Failed to save task');
    const newTask = await res.json();
    createTaskElement(newTask.text, newTask.done); // Add to DOM
  } catch (err) {
    console.error('Error saving task:', err);
    alert('Could not save task - server issue');
  }
}

// Update task done status
async function updateTask(id, done) {
  try {
    await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done })
    });
  } catch (err) {
    console.error('Error updating task:', err);
  }
}

// Delete task from backend
async function deleteTask(id) {
  try {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Error deleting task:', err);
  }
}

  // Create a task element and add it to the list
  function createTaskElement(text, done = false) {
  const li = document.createElement('li');

  li.innerHTML = `
    <label>
      <input type="checkbox" ${done ? 'checked' : ''} />
      <span class="task-text ${done ? 'done' : ''}">${text}</span>
    </label>
    <button>Delete</button>
  `;

  // Checkbox: toggle done state
  const checkbox = li.querySelector('input[type="checkbox"]');
  checkbox.addEventListener('change', () => {
    li.querySelector('.task-text').classList.toggle('done');
    saveTasks();
  });

  // Restore "done" status
  if (done) {
    li.querySelector('.task-text').classList.add('done');
  }

  // Toggle done by clicking the text
  li.querySelector('.task-text').addEventListener('click', () => {
    li.querySelector('.task-text').classList.toggle('done');
    saveTasks();
  });

  // Delete button
  li.querySelector('button').addEventListener('click', () => {
    li.remove();
    saveTasks();
  });

  // Add the new list item to the DOM
  list.appendChild(li);

  return li;
}
  // Add new task
  function addTask() {
    const text = input.value.trim();
    if (!text) return;

    createTaskElement(text);
    input.value = '';
    saveTasks(); // Save after adding
  }

  // Event listeners
  addBtn.addEventListener('click', addTask);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

const clearBtn = document.getElementById('clear-btn');

clearBtn.addEventListener('click', async () => {
  if (confirm('Are you sure you want to delete all tasks? This cannot be undone.')) {
    try {
      const res = await fetch(API_BASE, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete all tasks');
      list.innerHTML = ''; // Clear the visible list
    } catch (err) {
      console.error('Error clearing tasks:', err);
      alert('Could not clear tasks from server');
    }
  }
});


  // Load any saved tasks when page starts
  loadTasks();


});