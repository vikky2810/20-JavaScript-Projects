const STORAGE_KEY = 'todo-list-items';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const clearCompletedButton = document.getElementById('clear-completed');
const itemsLeft = document.getElementById('items-left');

let todos = loadTodos();

renderTodos();

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) return;

  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  todoInput.value = '';
  saveAndRender();
});

clearCompletedButton.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  saveAndRender();
});

todoList.addEventListener('click', (event) => {
  const target = event.target;
  const item = target.closest('[data-id]');
  if (!item) return;

  const { id } = item.dataset;

  if (target.matches('input[type="checkbox"]')) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: target.checked } : todo
    );
    saveAndRender();
  }

  if (target.classList.contains('delete-btn')) {
    todos = todos.filter((todo) => todo.id !== id);
    saveAndRender();
  }
});

function renderTodos() {
  todoList.innerHTML = '';

  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <div class="todo-content">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} aria-label="Mark task complete" />
        <span class="label"></span>
      </div>
      <button class="delete-btn" type="button" aria-label="Delete task">Delete</button>
    `;

    li.querySelector('.label').textContent = todo.text;
    todoList.appendChild(li);
  });

  const remaining = todos.filter((todo) => !todo.completed).length;
  itemsLeft.textContent = `${remaining} item${remaining === 1 ? '' : 's'} left`;
}

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  renderTodos();
}
