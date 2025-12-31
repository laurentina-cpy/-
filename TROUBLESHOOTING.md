# 城小二管理系统 - 问题排查指南

## 页面空白无法显示？

### 1. 检查依赖是否安装完整

```bash
cd chengxiaoer-admin
npm install
```

### 2. 清除缓存重新启动

```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install

# 启动开发服务器
npm run dev
```

### 3. 检查浏览器控制台

按 F12 打开浏览器开发者工具，查看 Console 标签页是否有错误信息：

常见错误：
- **404 错误**: 检查文件路径是否正确
- **Import 错误**: 检查 import 路径是否正确
- **Runtime 错误**: 查看具体错误信息

### 4. 检查开发服务器端口

默认端口是 3001，访问：
```
http://localhost:3001
```

如果端口被占用，Vite 会自动使用其他端口，查看终端输出的实际地址。

### 5. 尝试无痕模式

使用浏览器的无痕/隐私模式访问，排除浏览器缓存问题。

### 6. 检查路由守卫

如果没有 Token，会被重定向到登录页。先访问登录页：
```
http://localhost:3001/login
```

登录信息（模拟数据）：
- 用户名: `admin`
- 密码: 任意（如 `123456`）

### 7. 确认 Element Plus 已正确安装

检查 package.json 中是否包含：
```json
"dependencies": {
  "element-plus": "^2.3.9"
}
```

如果没有，运行：
```bash
npm install element-plus
```

### 8. 检查 Vite 配置

确保 vite.config.js 配置正确：
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3001
  }
})
```

## 登录后白屏？

### 检查 Token 存储
登录成功后，检查 localStorage 是否存储了 adminToken：

```javascript
// 在浏览器控制台执行
localStorage.getItem('adminToken')
```

### 检查 Dashboard 组件
查看 Dashboard.vue 是否正确导出。

### 检查图表库
ECharts 图表可能导致问题，可以临时注释掉图表相关代码测试。

## 样式错乱？

### 检查 Element Plus CSS

确保 main.js 中导入了样式：
```javascript
import 'element-plus/dist/index.css'
```

### 检查全局样式

确保 main.css 文件存在且内容正确。

## API 请求失败？

### 确认模拟数据已启用

检查 `src/utils/request.js` 中：
```javascript
const ENABLE_MOCK = true
```

### 检查响应拦截器

查看浏览器 Network 标签页，确认请求是否成功。

## 图标不显示？

### 检查图标导入

确保正确导入图标组件：
```javascript
import { House, Goods, User } from '@element-plus/icons-vue'
```

### 确认 Element Plus 图标库已安装

```bash
npm install @element-plus/icons-vue
```

## 常用调试命令

### 查看项目结构
```bash
tree -L 3 src/
```

### 检查文件是否存在
```bash
ls -la src/views/
```

### 查看 package.json
```bash
cat package.json
```

## 完全重置项目

如果以上方法都无法解决，尝试完全重置：

```bash
# 1. 备份配置文件
cp package.json package.json.backup
cp vite.config.js vite.config.js.backup

# 2. 删除所有依赖和缓存
rm -rf node_modules package-lock.json .vite dist

# 3. 重新安装依赖
npm install

# 4. 启动项目
npm run dev
```

## 获取帮助

如果问题依然存在，请提供以下信息：

1. 浏览器控制台的完整错误信息
2. 终端的启动日志
3. 使用的浏览器版本
4. Node.js 版本 (`node -v`)
5. npm 版本 (`npm -v`)

## 快速测试命令

启动后，按顺序测试：

```bash
# 1. 启动服务
npm run dev

# 2. 访问登录页
# http://localhost:3001/login

# 3. 使用测试账号登录
# 用户名: admin
# 密码: 123456

# 4. 登录后应跳转到仪表板
# http://localhost:3001/

# 5. 测试各个菜单导航
```

## 文件检查清单

确保以下文件都存在：

```
chengxiaoer-admin/
├── src/
│   ├── main.js                    ✅
│   ├── App.vue                    ✅
│   ├── router/index.js             ✅
│   ├── store/index.js              ✅
│   ├── utils/request.js            ✅
│   ├── utils/mock.js              ✅
│   ├── api/index.js               ✅
│   ├── components/Layout.vue       ✅
│   ├── views/
│   │   ├── Dashboard.vue           ✅
│   │   ├── Login.vue              ✅
│   │   ├── Goods/Goods.vue        ✅
│   │   ├── Users/Users.vue        ✅
│   │   ├── Categories.vue         ✅
│   │   ├── Suppliers.vue          ✅
│   │   ├── Delivery.vue           ✅
│   │   └── Orders.vue            ✅
│   └── assets/
│       └── main.css               ✅
├── index.html                    ✅
├── vite.config.js                ✅
└── package.json                 ✅
```
