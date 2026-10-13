# USTC Play 工程交接

## 当前代码位置

- Git 工作树：`/workspace/sites/ustc-play`
- 分支：`main`
- 最近提交：`42bc8d2 Initial USTC Play prototype`
- 前端：React 19、TypeScript、Vite 6、Tailwind CSS 4、Lucide React。

`/workspace` 下还有一份同名源文件副本，但它不是 Git 仓库。后续 GitHub 提交、CI 与 Pages 配置都应以 `/workspace/sites/ustc-play` 为准，避免误传重复文件。

## 数据与边界

这是无后端的单设备原型。模拟数据在 `src/data.ts`，页面和本地交互在 `src/App.tsx`，浏览器状态存于 `localStorage`。没有 API 密钥、服务端数据库或真实用户同步。

## 忽略规则

项目 `.gitignore` 已忽略依赖、构建结果、环境文件、常见证书/私钥文件和本地部署压缩包：`node_modules/`、`dist/`、`.env*`（保留 `.env.example`）、`*.pem`、`*.key`、`*.p12`、`*.pfx`、`deploy.tar.gz`。

## 验证命令

在项目根目录执行：

```bash
npm ci
npm run check
npm run build
```

构建产物位于 `dist/`。本地预览使用 `npm run preview`。

## GitHub 状态（2026-10-13）

已连接 GitHub 用户 `nkloop`，该账户的 GitHub App 安装对所有仓库可用，并确认已有仓库具备推送权限。项目当前尚未关联 GitHub：远程 `origin` 为内部 Git 服务，未发现名为 `ustc-play` 的可访问 GitHub 仓库。创建 `nkloop/ustc-play` 或取得现有仓库写权限后，才可安全推送。
