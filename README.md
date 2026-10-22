# 团队任务看板 · Team Kanban Board

一个用于团队协作管理项目进度的简易看板应用，支持创建、删除和在列间移动任务卡片。

## 功能

- 三列看板：待办 / 进行中 / 已完成
- 创建任务卡片（标题、描述、优先级、负责人）
- 拖拽卡片在列之间移动，实时更新状态与计数
- 删除任务卡片
- 数据保存在浏览器 localStorage，刷新不丢失
- 按关键字搜索任务

## 技术栈

- HTML5 + CSS3 + 原生 JavaScript（不使用任何框架，降低复杂度）
- 数据持久化：浏览器 localStorage，无需后端
- 版本控制：Git（GitHub）

## 本地运行

直接双击 `index.html` 在浏览器中打开即可，无需安装任何依赖。

## 团队与分工

| 成员 | 角色 | 负责内容 |
| --- | --- | --- |
| 成员 1 | 项目负责人（兼前端 A） | 初始化仓库、看板 UI 布局与任务卡片展示、审阅并合并所有 PR |
| 成员 2 | 前端 B | 创建任务、删除任务 |
| 成员 3 | 前端 C | 拖拽更新任务状态、localStorage 持久化 |

## 协作规范

本项目采用 Fork + Pull Request 工作流：

1. 从中央仓库拉取最新代码，创建规范命名的功能分支（如 `feature/ui-layout`）
2. 在功能分支上开发，提交信息清晰（如 `feat: add kanban board columns and header`）
3. 向中央仓库 `main` 发起 Pull Request，并请其他成员 Code Review
4. 由项目负责人使用 Squash and merge 合并，并删除已合并的功能分支