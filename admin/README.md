# Mou Control Room

这是给 `jiajia2222.github.io` 配套的独立内容管理后台。原 Hexo 站点仍然由根目录的 GitHub Pages workflow 构建，`admin/` 是可以部署到 Node.js 平台的全栈应用。

## 本地启动

```bash
cd admin
copy .env.example .env
npm install
npm run db:push
npm run db:seed
npm run dev
```

打开 <http://localhost:3000>，演示账号：

- 邮箱：`admin@nadev.xyz`
- 密码：`ChangeMe123!`

部署前请修改 seed 中的初始密码逻辑，并重新创建管理员账号。

## 已包含功能

- HttpOnly Cookie 会话登录、bcrypt 密码哈希、管理员角色基础
- 仪表盘：文章、阅读、评论、发布状态、操作动态
- 文章 CRUD：草稿 / 已发布 / 定时发布、分类、标签、精选、摘要、Markdown 编辑与预览
- GitHub 发布：配置 Token 后把文章写入 `source/_posts/*.md`，触发当前 Pages workflow
- 评论审核：待审核、通过、垃圾评论、回收站
- 媒体库：本地上传、10MB 限制、复制资源链接
- 访问分析与热门文章、站点设置、审计日志
- `/api/health` 健康检查

## GitHub 发布配置

在部署后台时设置：

```env
GITHUB_TOKEN=你的细粒度访问令牌
GITHUB_OWNER=jiajia2222
GITHUB_REPO=jiajia2222.github.io
GITHUB_BRANCH=main
```

Token 只在服务端读取，不会下发到浏览器。令牌至少需要目标仓库 `Contents: Read and write` 权限。

## 生产建议

SQLite 适合单实例和低流量后台；部署到多实例平台时把 `DATABASE_URL` 换成 PostgreSQL，把媒体存储换成 S3 / R2 / OSS，并将登录限流迁移到 Redis。GitHub Pages 仍负责公开站点，后台可以部署到 Render、Railway、Fly.io 或自有 VPS。
