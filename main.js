// 看板任务数据
let taskList = {
  todo: [],
  doing: [],
  done: []
};

// 打开新增任务弹窗
function openAddModal() {
  document.getElementById('taskModal').style.display = 'block';
}

// 关闭弹窗
function closeModal() {
  document.getElementById('taskModal').style.display = 'none';
  // 清空表单
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskOwner').value = '';
}

// 保存任务
function saveTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const desc = document.getElementById('taskDesc').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const owner = document.getElementById('taskOwner').value.trim();

  if (!title) {
    alert('任务标题不能为空！');
    return;
  }

  const task = {
    id: Date.now(),
    title,
    desc,
    priority,
    owner
  };
  // 默认放到待办
  taskList.todo.push(task);
  renderBoard();
  closeModal();
}

// 渲染看板
function renderBoard() {
  const todoWrap = document.getElementById('todo-list');
  const doingWrap = document.getElementById('doing-list');
  const doneWrap = document.getElementById('done-list');
  todoWrap.innerHTML = '';
  doingWrap.innerHTML = '';
  doneWrap.innerHTML = '';

  function createCard(task) {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.desc || '无描述'}</p>
      <p>优先级：${task.priority}</p>
      <p>负责人：${task.owner || '未分配'}</p>
    `;
    return div;
  }

  taskList.todo.forEach(t => todoWrap.appendChild(createCard(t)));
  taskList.doing.forEach(t => doingWrap.appendChild(createCard(t)));
  taskList.done.forEach(t => doneWrap.appendChild(createCard(t)));
}

// 绑定按钮事件
document.getElementById('addTaskBtn').onclick = openAddModal;
document.getElementById('saveTaskBtn').onclick = saveTask;
document.getElementById('closeModalBtn').onclick = closeModal;

// 初始化渲染
renderBoard();