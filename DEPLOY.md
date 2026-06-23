# 🚀 部署指南 — 非遗·寻迹

## 快速部署（GitHub Pages + 自动构建）

### 第 1 步：创建 GitHub 仓库

在 GitHub 上新建一个仓库，名字叫 `feiyi-trace`：
- 勾选 Public（公开仓库免费使用 GitHub Pages）
- **不要**勾选 "Add a README file"

### 第 2 步：初始化本地 Git 并推送

打开终端，进入项目目录：

```bash
cd D:\学习\小项目\feiyi-trace

# 初始化 Git
git init
git add .
git commit -m "初始化非遗·寻迹项目"

# 关联远程仓库（替换 YOUR_NAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_NAME/feiyi-trace.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 第 3 步：配置 GitHub Secrets（保护 API Key）

进入仓库 → Settings → Secrets and variables → Actions → New repository secret：

| Secret 名称 | 值 |
|-------------|-----|
| `VITE_API_KEY` | `ark-caca7202-49d1-43f2-a4b6-031cf25d28bc-c8fb0` (你的豆包 Key) |
| `VITE_API_URL` | `https://ark.cn-beijing.volces.com/api/v3/chat/completions` |

> ⚠️ 这个 Key 不会出现在 GitHub 源码里，但部署后在前端 JS 中仍可见。
> 正式项目记得用后端代理调用 AI API。

### 第 4 步：启用 GitHub Pages

进入仓库 → Settings → Pages：
- Source: **GitHub Actions**
- 推送一次代码后，自动部署就会运行

### 第 5 步：访问你的网站

部署完成后（约 1 分钟），访问：
```
https://YOUR_NAME.github.io/feiyi-trace/
```

---

## 手动部署（不用 Actions，直接推 dist 文件夹）

如果不想用 Actions，也可以手动部署：

```bash
# ① 构建
npm run build

# ② 把 dist 推送到 gh-pages 分支
npx gh-pages -d dist

# 然后在 GitHub 仓库 Settings → Pages 中选择 gh-pages 分支作为来源
```

---

## 本地预览生产版本

部署前可以先在本地看看构建后的效果：

```bash
npm run build
npm run preview   # 在 http://localhost:4173 预览
```

---

## 常见问题

### Q: 刷新子页面（如 /detail/1）出现 404？
A: 已经通过 `404.html` + `sessionStorage` 机制处理了。如果仍有问题，检查 `vite.config.js` 的 `base` 是否与仓库名一致。

### Q: 换了仓库名怎么办？
A: 同步修改三个地方：
1. `vite.config.js` → `base: '/新仓库名/'`
2. `src/router/index.js` → `createWebHistory('/新仓库名/')`
3. `public/404.html` → `location.replace` 中的路径
4. `index.html` → 恢复脚本中的 `base` 变量

### Q: 想用自定义域名？
A: 把上面三个地方的 `/feiyi-trace/` 全部改成 `/`，然后在 GitHub Pages 设置中绑定域名。

### Q: 为什么我代码更新了网站没变？
A: Actions 自动部署需要 1-2 分钟。在仓库 Actions 页面可以查看进度。

---

## 关于 API Key 安全性的补充说明

```
┌──────────────────────────────────────────────────────┐
│  .env 文件 → 不提交到 Git → 源码仓库看不到 Key        │
│           ↓                                          │
│  npm run build → Key 被打包进 JS 文件                 │
│           ↓                                          │
│  部署到 GitHub Pages → 浏览器 F12 能看到 Key           │
└──────────────────────────────────────────────────────┘
```

**练手项目**：Key 泄露没啥大损失，大不了重新生成一个。

**正式项目**：需要加一层后端代理——
```
浏览器 → 你的后端 API → DeepSeek/豆包 API
        （Key 在后端，前端看不到）
```
