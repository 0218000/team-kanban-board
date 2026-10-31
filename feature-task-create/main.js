/* =====================================================
   团队任务看板 · PR#4：新建任务（弹窗表单 + 看板动态渲染）
   ===================================================== */

// ---------- 数据（内存中，暂不持久化） ----------
let tasks = [];
let taskId = 0;

const COLUMNS = [
  { key: 'todo',  name: '📋 待办事项' },
  { key: 'doing', name: '🚧 进行中' },
  { key: 'done',  name: '✅ 已完成' }
];

// ---------- 看板动态渲染 ----------
function render() {
  const board = document.getElementById('board');
  board.innerHTML = '';

  COLUMNS.forEach(col => {
    const list = tasks.filter(t => t.status === col.key);

    const section = document.createElement('section');
    section.className = 'column';
    section.dataset.status = col.key;

    const h2 = document.createElement('h2');
    h2.innerHTML = col.name + ' <span class="count">' + list.length + '</span>';

    section.appendChild(h2);

    if (list.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = '暂无任务';
      section.appendChild(empty);
    }

    list.forEach(task => section.appendChild(renderCard(task)));
    board.appendChild(section);
  });
}

function renderCard(task) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = task.id;

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = task.title;

  card.appendChild(title);

  if (task.desc) {
    const desc = document.createElement('div');
    desc.className = 'card-desc';
    desc.textContent = task.desc;
    card.appendChild(desc);
  }

  const meta = document.createElement('div');
  meta.className = 'card-meta';

  const pri = document.createElement('span');
  pri.className = 'priority priority-' + task.priority;
  pri.textContent = task.priority;

  const owner = document.createElement('span');
  owner.textContent = task.owner || '未指定';

  meta.appendChild(pri);
  meta.appendChild(owner);
  card.appendChild(meta);
  return card;
}

// ---------- 新建任务弹窗 ----------
const modalMask = document.getElementById('modal-mask');

document.getElementById('new-task-btn').addEventListener('click', () => {
  modalMask.hidden = false;
  document.getElementById('f-title').focus();
});

document.getElementById('f-cancel').addEventListener('click', closeModal);
modalMask.addEventListener('click', e => {
  if (e.target === modalMask) closeModal();
});

function closeModal() {
  modalMask.hidden = true;
  document.getElementById('f-title').value = '';
  document.getElementById('f-desc').value = '';
  document.getElementById('f-owner').value = '';
  document.getElementById('f-priority').value = '中';
}

document.getElementById('f-save').addEventListener('click', () => {
  const title = document.getElementById('f-title').value.trim();
  if (!title) {
    alert('请输入任务标题！');
    return;
  }
  tasks.push({
    id: ++taskId,
    title: title,
    desc: document.getElementById('f-desc').value.trim(),
    priority: document.getElementById('f-priority').value,
    owner: document.getElementById('f-owner').value.trim(),
    status: 'todo'
  });
  closeModal();
  render();
});

// ---------- 初始渲染 ----------
render();
