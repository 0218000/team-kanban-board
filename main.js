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
}

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