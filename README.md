# U-Play · 球场相见

独立制作的校园运动社交 Web App 高保真交互原型，非学校官方服务。界面采用中文，优先适配 iPhone 等手机浏览器。

## 本地运行

需要 Node.js 20.19+ 或 22.12+。

```bash
npm install
npm run dev
```

打开终端显示的地址（通常是 `http://localhost:5173`）。同一局域网中的手机可以打开电脑的局域网 IP 与端口预览；电脑和手机需要在同一网络下。

其他命令：

```bash
npm run check    # TypeScript 类型检查
npm run build    # 类型检查并构建 dist/
npm run preview  # 本地预览构建产物
```

## 主要交互

- **首页**：切换篮球与足球、查看收藏球场及模拟热度、进入球场详情、收藏或取消收藏。
- **发现**：浏览全部模拟球场。
- **球场详情**：查看球场信息，选择五级热度并可补充现场情况，然后发布上报。
- **我的状态**：选择六种运动状态、运动类型、球场及有效期，更新本机状态。
- **好友**：按昵称或 ID 搜索，切换列表，关注或取消关注模拟好友，查看其演示状态。
- **我的**：编辑昵称、查看收藏球场、设置是否展示运动状态。

## 数据边界

**这是单设备原型，没有服务器、数据库、账号或真实用户同步。** 球场热度初始值、运动人数、好友资料与好友状态都是内置模拟数据。收藏、关注、个人状态、昵称、隐私设置和上报记录仅保存在当前浏览器的 `localStorage`（键名 `ustc-play-v1`）。其他设备或浏览器不会看到这些更改；清除站点数据会重置原型。状态有效期只影响本机展示。

球场画面为项目内 SVG 插画，并非校园场地实拍。应用不需要 API 密钥或付费云资源。

## 技术栈与结构

React 19、TypeScript、Vite 6、Tailwind CSS 4、Lucide 图标。

```text
src/
  App.tsx     页面、组件与交互状态
  data.ts     模拟球场、好友和选项
  style.css   Tailwind 入口与移动端视觉样式
  main.tsx    React 入口
```

本项目可直接提交到 GitHub。`node_modules/` 与 `dist/` 已加入 `.gitignore`。

## GitHub Pages

仓库 `nkloop/ustc-play` 的 `main` 分支推送后，GitHub Actions 会执行类型检查、以 `/ustc-play/` 为静态资源基础路径构建，并发布到 GitHub Pages。仓库设置中的 **Pages → Build and deployment → Source** 需选择 **GitHub Actions**。预期网址为 `https://nkloop.github.io/ustc-play/`；只有 Actions 部署成功且实际浏览器可访问后，才能视为上线。

## 微信小程序体验版

`miniprogram/` 是单独的微信小程序项目，导入和预览方法见 [miniprogram/README.md](miniprogram/README.md)。当前只展示球场查询与本机收藏；数据仍为模拟数据，未提交微信审核。
