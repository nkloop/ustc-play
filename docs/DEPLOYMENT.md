# USTC Play GitHub Pages 部署任务

## 前置条件

1. `nkloop/ustc-play` 仓库已创建为公开仓库。
2. `/workspace/sites/ustc-play` 的现有 `main` 分支已推送到该仓库。
3. 待仓库所有者在仓库 Settings → Pages 中选择 **GitHub Actions** 作为发布源。

## Vite base 要求

GitHub Pages 项目站点的访问路径为 `/ustc-play/`，因此生产构建需要：

```ts
base: '/ustc-play/'
```

若未来绑定自定义域名或发布到根域名，需相应改为 `/`。开发环境可保持 `/`，或只在生产构建设置该值。

## Actions 任务

工作流应在推送 `main` 和手动触发时执行：

1. checkout；
2. 配置 Node 22；
3. `npm ci`；
4. `npm run check`；
5. `npm run build -- --mode github-pages`；
6. 上传 `dist/`；
7. 使用 GitHub Pages 部署动作发布。

工作流需要 `pages: write` 与 `id-token: write` 权限。发布链接将是 `https://nkloop.github.io/ustc-play/`，但只有在 GitHub Pages workflow 成功后才能称为实际可访问。

## 当前限制

截至 2026-10-13，仓库和项目已上传。GitHub Actions 的 `npm ci`、`npm run check` 与构建均通过，但 `actions/configure-pages` 因仓库尚未启用 Pages 而失败；自动启用请求被 GitHub 拒绝（`Resource not accessible by integration`）。站点仍未部署，因此预期 Pages 地址不能称为实际可访问。此前 `chatgpt.site` 地址受到 Cloudflare 网络拦截，不能以构建环境 HTTP 200 代替用户网络可访问性验证。
