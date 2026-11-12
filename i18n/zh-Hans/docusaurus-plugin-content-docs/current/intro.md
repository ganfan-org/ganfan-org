---
sidebar_position: 1
sidebar_label: 欢迎使用 Docusaurus
---

# 教程简介

让我们在**不到 5 分钟内**了解 **Docusaurus**。

## 开始使用

通过**创建一个新网站**来开始吧。

或者**立即试用 Docusaurus**，访问 **[docusaurus.new](https://docusaurus.new)**。

### 你需要准备什么

- [Node.js](https://nodejs.org/zh-cn/download/) 版本 16.14 或更高：
  - 安装 Node.js 时，建议勾选所有与依赖相关的复选框。

## 生成新网站

使用**经典模板**生成一个新的 Docusaurus 网站。

运行命令后，经典模板会自动添加到你的项目中：

```bash
npm init docusaurus@latest my-website classic
```

你可以在命令提示符、PowerShell、终端或代码编辑器的任何集成终端中输入此命令。

该命令还会安装运行 Docusaurus 所需的所有依赖项。

## 启动你的网站

运行开发服务器：

```bash
cd my-website
npm run start
```

`cd` 命令用于切换工作目录。为了操作新创建的网站，你需要导航到该目录。

`npm run start` 命令会在本地构建你的网站，并通过开发服务器提供服务，你可以在 http://localhost:3000/ 查看。

打开 `docs/intro.md`（即本页面）并编辑一些内容：网站会**自动刷新**并显示你的更改。
