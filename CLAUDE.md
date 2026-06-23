# 非遗·寻迹 — 非物质文化遗产数字展示平台

## 项目概述
- 名称：非遗·寻迹
- 类型：Vue 3 + Vite 纯前端 SPA，集成 AI 对话
- 目标：大三练手项目 → 简历作品 → 可能发展为毕设
- 创建时间：2026年6月

## 技术栈
- Vue 3 (Composition API + `<script setup>`)
- Vite 构建
- Vue Router 4（路由）
- 纯 CSS 变量（未引入组件库）
- DeepSeek API（AI 对话，待配置 Key）

## 项目结构
```
feiyi-trace/
├── index.html
├── src/
│   ├── main.js              # 应用入口
│   ├── App.vue              # 根组件：导航+内容+AI面板
│   ├── style.css            # 全局样式变量
│   ├── router/index.js      # 路由：/ 和 /detail/:id
│   ├── data/heritage.js     # 6个非遗项目数据
│   ├── views/
│   │   ├── HomePage.vue     # 首页：横幅+筛选+卡片列表
│   │   └── DetailPage.vue   # 详情页
│   └── components/
│       ├── NavBar.vue       # 顶部导航
│       ├── HeritageCard.vue # 非遗卡片
│       └── AiChatPanel.vue  # AI问答面板
```

## 运行命令
```bash
cd D:\学习\小项目\feiyi-trace
npm install       # 装依赖
npm run dev       # 开发服务器 → http://localhost:5173
npm run build     # 生产构建
```

## AI 对话配置
- 使用 DeepSeek API（deepseek-chat 模型）
- 需在 `src/components/AiChatPanel.vue` 中替换 `API_KEY`
- 注册地址：https://platform.deepseek.com

## 开发历史
- 2026-06-10：项目初始化，完成首页、详情页、AI面板、路由、响应式布局
