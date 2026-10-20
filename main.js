function getTasks() {
  return JSON.parse(localStorage.getItem('kanbanTasks') || '[]');
}
function saveTasks(tasks) {
  localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
}
function addTask(title) {
  if (!title.trim()) return;
  const tasks = getTasks();
  tasks.push({ id: Date.now(), title: title, status: 'todo' });
  saveTasks(tasks);
  renderTasks();
  document.getElementById('taskInput').value = '';
}
function deleteTask(id) {
  let tasks = getTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
  renderTasks();
}
function renderTasks() {
  const tasks = getTasks();
  document.querySelectorAll('.task-list').forEach(el => el.innerHTML = '');
  tasks.forEach(task => {
    const column = document.querySelector(`[data-status="${task.status}"] .task-list`);
    if (!column) return;
    const card = document.createElement('div');
    card.className = 'task-card';
    card.draggable = true;
    card.dataset.id = task.id;
    card.innerHTML = `<span>${task.title}</span><button class="delete-btn" onclick="deleteTask(${task.id})">×</button>`;
    card.addEventListener('dragstart', dragStart);
    column.appendChild(card);
  });
}
let draggedId = null;
function dragStart(e) {
  draggedId = parseInt(e.target.dataset.id);
  e.dataTransfer.effectAllowed = 'move';
}
document.querySelectorAll('.column').forEach(column => {
  column.addEventListener('dragover', e => e.preventDefault());
  column.addEventListener('drop', e => {
    e.preventDefault();
    const newStatus = column.dataset.status;
    let tasks = getTasks();
    tasks = tasks.map(t => {
      if (t.id === draggedId) t.status = newStatus;
      return t;
    });
    saveTasks(tasks);
    renderTasks();
  });
});
document.getElementById('taskInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask(e.target.value);
});
renderTasks();
