# Vercel 部署说明

## 1. 本地运行

安装依赖：

```bash
npm install
```

启动本地开发服务：

```bash
npm run dev
```

默认情况下，Vite 会在终端输出本地访问地址，例如：

```text
http://localhost:5173
```

## 2. 本地构建

执行生产构建：

```bash
npm run build
```

构建产物会输出到：

```text
dist
```

## 3. 部署到 Vercel

推荐方式：

1. 将项目代码推送到 GitHub、GitLab 或 Bitbucket。
2. 在 Vercel 中导入该项目仓库。
3. 选择项目根目录作为 Root Directory。
4. 使用下方推荐配置完成部署。

如果手动上传静态构建产物，请先执行：

```bash
npm run build
```

然后上传 `dist` 目录。

## 4. Vercel 推荐配置

Framework Preset:

```text
Vite
```

Install Command:

```text
npm install
```

Build Command:

```text
npm run build
```

Output Directory:

```text
dist
```

Root Directory:

```text
项目根目录
```

## React Router 刷新 404

项目根目录已添加 `vercel.json`，将所有路径重写到 `index.html`，用于解决 React Router 页面刷新后出现 404 的问题。
