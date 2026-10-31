# 团队任务看板 · Team Kanban Board

一个用于团队协作管理项目进度的简易看板应用，支持创建、删除和在列间移动任务卡片。

## 功能

- 三列看板：待办 / 进行中 / 已完成
- 创建任务卡片（标题、描述、优先级、负责人）
- 拖拽卡片在列之间移动，实时更新状态与计数
- 删除任务卡片
- 数据保存在浏览器 localStorage，刷新不丢失
- 关键字搜索任务

## 技术栈
- HTML5 + CSS3 + 原生 JavaScript（不使用任何框架，降低复杂度）
- 数据持久化：浏览器 localStorage，无需后端
- 版本控制：Git（GitHub）

## 本地运行

直接双击 `index.html` 在浏览器中打开即可，无需安装任何依赖。

## 团队与分工

| 成员 | 角色 | 负责内容 |
| --- | --- | --- |
| 成员1（0218000） | 项目负责人 | 初始化仓库、分支保护、审查并合并所有 PR、协调进度 |
| 成员2 | 前端 A | PR#4 新建任务：弹窗表单（标题/描述/优先级/负责人）+ 看板动态渲染（feature/task-create） |
| 成员3 | 前端 B | PR#5 删除任务：卡片悬停删除按钮 + 二次确认（feature/task-delete） |
| 成员4 | 前端 C | PR#6 拖拽移动任务状态（feature/drag-move）；PR#7 localStorage 持久化与关键字搜索（feature/localstorage） |

## 协作规范

本项目采用 Fork + Pull Request 工作流：

1. 从中央仓库拉取最新代码，创建规范命名的功能分支（如 `feature/ui-layout`）
2. 在功能分支上开发，提交信息清晰（如 `feat: add kanban board columns and header`）
3. 向中央仓库 `main` 发起 Pull Request，并请其他成员 Code Review
4. 由项目负责人使用 Squash and merge 合并，并删除已合并的功能分支
