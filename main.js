// 看板任务数据
let taskList = {
  todo: [],
  doing: [],
  done: []
};
// 打开新增任务弹窗
function openAddModal() {
  document.getElementById('modal').style.display = 'block';
}
// 关闭弹窗
function closeModal() {
  document.getElementById('modal').style.display = 'none';
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
    alert("任务标题不能为空！");
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
  const todoWrap = document.querySelector('.column[data-status="todo"] .task-list');
  const doingWrap = document.querySelector('.column[data-status="doing"] .task-list');
  const doneWrap = document.querySelector('.column[data-status="done"] .task-list');
  todoWrap.innerHTML = '';
  doingWrap.innerHTML = '';
  doneWrap.innerHTML = '';
  function createCard(task) {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.draggable = true;
    div.dataset.taskId = task.id;
    div.innerHTML = `
      <h4>${task.title}</h4>
      <p>${task.desc || '无描述'}</p>
      <p>优先级：${task.priority}</p>
      <p>负责人：${task.owner || '未分配'}</p>
    `;
    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('taskId', task.id);
    });
    return div;
  }
  taskList.todo.forEach(t => todoWrap.appendChild(createCard(t)));
  taskList.doing.forEach(t => doingWrap.appendChild(createCard(t)));
  taskList.done.forEach(t => doneWrap.appendChild(createCard(t)));
}

// 初始化拖拽监听
function initDrop() {
  const columns = document.querySelectorAll('.column');
  columns.forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
    })
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      const taskId = Number(e.dataTransfer.getData('taskId'));
      const targetColumn = col.dataset.status;
      let targetTask = null;
      for (const key of ['todo','doing','done']) {
        const idx = taskList[key].findIndex(item => item.id === taskId);
        if (idx !== -1) {
          targetTask = taskList[key].splice(idx,1)[0];
          break;
        }
      }
      if(targetTask){
        taskList[targetColumn].push(targetTask);
        renderBoard();
      }
    })
  })
}

// ✅ 重点：等页面全部DOM加载完毕，再绑定按钮！
document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('addTaskBtn').onclick = openAddModal;
  document.getElementById('saveTaskBtn').onclick = saveTask;
  document.querySelector('.close').onclick = closeModal;

  renderBoard();
  initDrop();
})
