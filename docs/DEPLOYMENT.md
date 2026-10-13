# USTC Play GitHub Pages 部署任务

## 前置条件

1. 在 GitHub 创建或授权可写的 `nkloop/ustc-play` 仓库。
2. 将 `/workspace/sites/ustc-play` 的现有 `main` 分支推送到该仓库。
3. 在仓库 Settings → Pages 中选择 **GitHub Actions** 作为发布源。

## Vite base 要求

GitHub Pages 项目站点的访问路径为 `/ustc-play/`，因此生产构建需要：

```ts
base: '/ustc-play/'
```

若未来绑定自定义域名或发布到根域名，需相应改为 `/`。开发环境可保持 `/`，或只在生产构建设置该值。

## Actions 任务

工作流应在推送 `main` 和手动触发时执行：

1. checkout；
2. 配置 Node 20；
3. `npm ci`；
4. `npm run check`；
5. `npm run build`；
6. 上传 `dist/`；
7. 使用 GitHub Pages 部署动作发布。

工作流需要 `pages: write` 与 `id-token: write` 权限。发布链接将是 `https://nkloop.github.io/ustc-play/`，但只有在 GitHub Pages workflow 成功后才能称为实际可访问。

## 当前限制

截至 2026-10-13，GitHub 账号已连接但没有发现 `ustc-play` 仓库；项目远程仍是内部 Git 服务。尚未创建仓库、推送或部署，因此不存在可验证的 GitHub Pages 链接。此前 `chatgpt.site` 地址受到 Cloudflare 网络拦截，不能以构建环境 HTTP 200 代替用户网络可访问性验证。
