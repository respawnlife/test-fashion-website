# 部署指南

## Vercel 部署

### 前置准备

1. 注册 [Vercel](https://vercel.com) 账号
2. 安装 Vercel CLI（可选）: `npm i -g vercel`

### 方式一：通过 GitHub 自动部署（推荐）

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 https://vercel.com/new
   - 点击 "Import Git Repository"
   - 选择你的项目仓库
   - 点击 "Import"

3. **配置构建设置**
   - Framework Preset: `Vite`
   - Build Command: `yarn build`
   - Output Directory: `dist`
   - Install Command: `yarn install`

4. **点击 Deploy**
   - Vercel 会自动构建并部署
   - 获得一个免费的 `.vercel.app` 域名

### 方式二：使用 Vercel CLI

```bash
# 登录 Vercel
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

### 方式三：手动上传

```bash
# 1. 构建项目
yarn build

# 2. 创建 vercel.json（已包含在项目中）
# 3. 在 Vercel Dashboard 创建项目
# 4. 使用 CLI 或 Dashboard 上传 dist 目录
```

## 自定义域名

1. 在 Vercel Dashboard 进入项目
2. 点击 "Domains"
3. 添加你的域名
4. 按照提示配置 DNS:
   - Type: `A` 或 `CNAME`
   - Value: `cname.vercel-dns.com`

## 环境变量

如果需要使用环境变量（如 API 密钥）：

1. 在 Vercel Dashboard 进入项目
2. 点击 "Settings" → "Environment Variables"
3. 添加变量：
   - `VITE_API_URL`: API 地址
   - `VITE_ANALYTICS_ID`: 分析工具 ID

在代码中使用：
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 性能优化建议

### 1. 图片优化
- 使用 WebP 格式
- 压缩图片（推荐 TinyPNG）
- 使用懒加载

### 2. 代码分割
Vite 自动进行代码分割，确保：
```javascript
// 动态导入大型组件
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 3. CDN 加速
Vercel 自动使用全球 CDN，无需额外配置

### 4. 缓存策略
已在 `vercel.json` 中配置静态资源缓存

## 监控和分析

### Vercel Analytics
```bash
yarn add @vercel/analytics
```

在 `main.jsx` 中添加:
```javascript
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### Google Analytics
在 `index.html` 中添加 GA 代码

## 故障排查

### 构建失败
```bash
# 本地测试构建
yarn build

# 查看详细错误
yarn build --debug
```

### 路由问题
确保 `vercel.json` 包含重写规则:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 图片不显示
- 检查图片 URL 是否可访问
- 确保使用 HTTPS
- 检查 CORS 设置

## 持续集成

### GitHub Actions 示例

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: yarn install
      - run: yarn build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## 回滚

在 Vercel Dashboard:
1. 进入项目 → "Deployments"
2. 找到之前的版本
3. 点击 "Promote to Production"

## 支持

- [Vercel 文档](https://vercel.com/docs)
- [Vite 文档](https://vitejs.dev)
- [React 文档](https://react.dev)

---

最后更新：2026-02-22
