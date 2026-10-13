# USTC Play 工程交接

## 当前代码位置

- Git 工作树：`/workspace/sites/ustc-play`
- 分支：`main`
- GitHub 远程：`https://github.com/nkloop/ustc-play.git`（`origin`）
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

`nkloop/ustc-play` 已创建为公开仓库，现有 `main` 分支及完整项目已推送；原 Sites 内部 Git 远程保留为 `sites`。仓库所有者已在 Settings → Pages 选择 **GitHub Actions** 作为 Source。Actions 的依赖安装、类型检查、构建和发布均已成功。GitHub API 与工作流令牌此前未获准自动启用 Pages，因此首次设置需要仓库所有者完成。
