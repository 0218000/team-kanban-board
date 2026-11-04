// 从本地存储读取数据，没有就初始化
let taskList = JSON.parse(localStorage.getItem("kanbanData")) || {
  todo: [],
  doing: [],
  done: []
};

// 保存数据到 localStorage
function saveToStorage() {
  localStorage.setItem("kanbanData", JSON.stringify(taskList));
}

// 渲染看板 + 搜索过滤
function renderBoard(filterText = "") {
  const columns = ["todo", "doing", "done"];
  columns.forEach(colKey => {
    const listDom = document.querySelector(`#${colKey} .task-list`);
    listDom.innerHTML = "";
    taskList[colKey].forEach((task, idx) => {
      // 搜索匹配
      const text = filterText.toLowerCase();
      const match = task.title.toLowerCase().includes(text)
        || task.desc.toLowerCase().includes(text)
        || task.owner.toLowerCase().includes(text);
      if(filterText && !match) return;

      const card = document.createElement("div");
      card.className = `task-card ${task.priority}`;
      card.draggable = true;
      card.dataset.col = colKey;
      card.dataset.index = idx;
      card.innerHTML = `
        <h4>${task.title}</h4>
        <p>${task.desc || "无描述"}</p>
        <p>负责人：${task.owner || "未分配"}</p>
      `;
      // 拖拽开始
      card.addEventListener("dragstart", e=>{
        e.dataTransfer.setData("fromCol", colKey);
        e.dataTransfer.setData("fromIdx", idx);
      })
      listDom.appendChild(card);
    })
  })
}

// 打开新增弹窗
function openAddModal() {
  document.getElementById('modal').style.display = 'block';
}
// 关闭弹窗
function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskOwner').value = '';
}
// 保存新增任务
function saveTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const desc = document.getElementById('taskDesc').value.trim();
  const priority = document.getElementById('taskPriority').value;
  const owner = document.getElementById('taskOwner').value.trim();
  if (!title) {
    alert("标题不能为空！");
    return;
  }
  taskList.todo.push({title,desc,priority,owner});
  saveToStorage();
  renderBoard();
  closeModal();
  feature/task-delete
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
      <button type="button" class="delete-btn" draggable="false" title="删除任务">🗑</button>
    `;
    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('taskId', task.id);
    });
    // 删除按钮：阻止冒泡，避免点到按钮时触发卡片拖拽
    const delBtn = div.querySelector('.delete-btn');
    delBtn.addEventListener('mousedown', (e) => e.stopPropagation());
    delBtn.addEventListener('dragstart', (e) => e.preventDefault());
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });
    return div;
  }
  taskList.todo.forEach(t => todoWrap.appendChild(createCard(t)));
  taskList.doing.forEach(t => doingWrap.appendChild(createCard(t)));
  taskList.done.forEach(t => doneWrap.appendChild(createCard(t)));

  // 刷新每列的任务数量
  document.querySelectorAll('.column').forEach(col => {
    const count = taskList[col.dataset.status].length;
    let badge = col.querySelector('.task-count');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'task-count';
      col.querySelector('h3').appendChild(badge);
    }
    badge.textContent = count;
  });
}

// 删除任务：先弹确认框，确认后从所在列移除并重新渲染
function deleteTask(taskId) {
  for (const key of ['todo', 'doing', 'done']) {
    const idx = taskList[key].findIndex(item => item.id === taskId);
    if (idx === -1) continue;

    const task = taskList[key][idx];
    if (!window.confirm('确定删除任务「' + task.title + '」吗？')) return;

    taskList[key].splice(idx, 1);
    renderBoard();
    return;
  }
}
main

// 拖拽放置：给每一列绑定drop
function bindDropEvent() {
  document.querySelectorAll(".column").forEach(col => {
    col.addEventListener("dragover", e=> e.preventDefault())
    col.addEventListener("drop", e=>{
      e.preventDefault();
      const fromCol = e.dataTransfer.getData("fromCol");
      const fromIdx = Number(e.dataTransfer.getData("fromIdx"));
      const toCol = col.id;
      if(fromCol === toCol) return;
      // 取出任务
      const task = taskList[fromCol].splice(fromIdx,1)[0];
      taskList[toCol].push(task);
      saveToStorage();
      renderBoard(document.getElementById("searchInput").value.trim());
    })
  })
}

// 搜索框监听
function bindSearch() {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", ()=>{
    renderBoard(searchInput.value.trim());
  })
}

// 页面加载完初始化
window.onload = function(){
  renderBoard();
  bindDropEvent();
  bindSearch();
}