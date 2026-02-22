# 快速开始指南

## 环境要求

- Node.js >= 18.x
- Yarn >= 4.x (推荐) 或 npm >= 8.x

## 安装步骤

### 1. 克隆项目

```bash
cd /home/node/.openclaw/workspace/programmer/fashion-website
```

### 2. 安装依赖

```bash
# 使用 Yarn (推荐)
yarn install

# 或使用 npm
npm install
```

### 3. 启动开发服务器

```bash
yarn dev
# 或
npm run dev
```

访问 http://localhost:5173 查看网站

### 4. 构建生产版本

```bash
yarn build
# 或
npm run build
```

构建输出在 `dist/` 目录

### 5. 预览生产构建

```bash
yarn preview
# 或
npm run preview
```

## 项目文件说明

### 核心文件

| 文件 | 说明 |
|------|------|
| `src/App.jsx` | 主应用组件，路由配置 |
| `src/main.jsx` | 应用入口 |
| `src/index.css` | 全局样式 |
| `vite.config.js` | Vite 配置 |
| `package.json` | 项目依赖 |

### 组件目录

| 组件 | 说明 |
|------|------|
| `Header.jsx` | 顶部导航栏 |
| `Footer.jsx` | 页脚 |
| `ProductCard.jsx` | 商品卡片 |
| `LinkAlert.jsx` | 外部链接提示 |

### 页面目录

| 页面 | 路由 | 说明 |
|------|------|------|
| `HomePage.jsx` | `/` | 首页 |
| `CategoryPage.jsx` | `/women`, `/shoes`, `/bags` | 分类页 |

### 数据文件

| 文件 | 说明 |
|------|------|
| `src/data/products.js` | 商品数据（18 件示例商品） |

## 添加新商品

编辑 `src/data/products.js`:

```javascript
{
  id: 19,  // 唯一 ID
  name: '商品名称',
  category: 'women',  // women | shoes | bags
  price: 999,  // 价格（元）
  image: 'https://example.com/image.jpg',  // 图片 URL
  link: 'https://affiliate-link.com'  // 联盟链接
}
```

## 自定义样式

### 修改主题色

编辑 `src/index.css`:

```css
:root {
  color: #1a1a1a;  /* 主色调 */
}
```

### 修改字体

在 `src/index.css` 中引入新字体:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont');
```

## 部署

### 快速部署到 Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 或手动部署

1. 运行 `yarn build`
2. 将 `dist/` 目录上传到服务器
3. 或导入到 Vercel/Netlify

详细部署指南见 [docs/deployment.md](docs/deployment.md)

## 常见问题

### 端口被占用

```bash
# 使用其他端口
yarn dev -- --port 3000
```

### 依赖安装失败

```bash
# 清理缓存
rm -rf node_modules yarn.lock
yarn install
```

### 构建失败

```bash
# 检查 Node.js 版本
node -v  # 需要 >= 18

# 清理后重新构建
rm -rf dist
yarn build
```

## 开发技巧

### 组件开发

1. 在 `src/components/` 创建新组件
2. 在页面中导入使用
3. 确保响应式设计

### 添加新页面

1. 在 `src/pages/` 创建页面组件
2. 在 `src/App.jsx` 添加路由
3. 在 `Header.jsx` 添加导航链接

### 调试

- 使用 React DevTools 浏览器扩展
- 查看浏览器控制台
- 使用 `console.log()` 调试

## 下一步

1. ✅ 完成基础功能
2. 🔄 添加更多商品
3. 🔄 优化 SEO
4. 🔄 集成分析工具
5. 🔄 部署上线

## 获取帮助

- 查看 [README.md](README.md) 了解项目详情
- 查看 [docs/specification.md](docs/specification.md) 了解需求
- 查看 [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md) 了解实现细节

---

**祝开发愉快！** 🎉
