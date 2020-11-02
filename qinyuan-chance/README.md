![logo](/build/logo.png "logo")

<!-- # Vuejs Admin Block -->

**Demo:** <http://vab.cssue.com/>

> -   Username: admin
> -   Password: wasd@007

## 特性

1.  基于 Vue.js 的企业级中后台开源模板
2.  基于 Vue 官方命令行工具 Vue CLI 2 脚手架搭建
3.  使用 Vue 官方核心插件 Vue Router, Vuex
4.  使用 Vue 官方建议的 Axios 插件进行 HTTP 操作
5.  采用时下热门的 UI 组件库 iView
6.  通过 Mock.js 插件拦截 Ajax 请求并生成随机数据

### 技术栈

-   axios @0.18.x
-   iview @3.x
-   mockjs @1.x
-   vue @2.5.x
-   vue-router @3.x
-   vuex @3.x
-   ECMAScript 6
-   cssnext

## 开发构建

### 目录结构

```bash
├── /build/          # 项目构建(webpack)相关配置
├── /config/         # 项目开发环境配置
├── /src/            # 源码目录
│ ├── /assets/       # 组件静态资源(图片)
│ ├── /components/   # 公共组件
│ ├── /config/       # 基础配置
│ ├── /mock/         # 数据模拟
│ ├── /router/       # 路由配置
│ ├── /services/     # 数据接口
│ ├── /store/        # vuex状态管理
│ ├── /utils/        # 工具函数
│ ├── /views/        # 路由组件(页面维度)
│ ├── App.vue        # 组件入口
│ └── main.js        # 程序入口
├── /static/         # 非组件静态资源
├── .babelrc         # ES6语法编译配置
├── .editorconfig    # 定义代码格式
├── .eslintignore    # ES6规范忽略文件
├── .eslintrc.js     # ES6语法规范配置
├── .gitignore       # git忽略文件
├── index.html       # 页面入口
├── package.json     # 项目依赖
└── README.md        # 项目文档
```

开发主流程

1, 进入 router 目录, 打开 routes.js 文件, 添加路由组件, 如 Users

```javascript
{
  path: '/manage/users',
  name: 'Users',
  component: resolve => {
    require(['@/views/manage/Users'], resolve)
  }
}
```

具体阅读 router/routes.js 源码

2, 进入 views 目录, 新建路由组件, 如 Users.vue

```bash
├── /src/
│ ├── /views/
│ │ ├── /manage/
│ │ │ ├── Users.vue
```

具体阅读 views/manage/Users.vue 源码

3, 进入 services 目录, 新建数据接口文件, 如 users.js

```bash
├── /src/
│ ├── /services/
│ │ ├── /manage/
│ │ │ ├── users.js
```

具体阅读 services/manage/users.js 源码

4, 进入 mock 目录, 打开 app.js 文件添加临时菜单, 如 Users

```javascript
{
  name: 'Manage',
  path: '/manage',
  children: [{
    name: 'Users',
    path: '/manage/users'
  }]
}
```

具体阅读 mock/app.js 源码

5, 如需 mock 数据, 进入 mock 目录, 新建数据模拟文件, 如 users.js

```bash
├── /src/
│ ├── /mock/
│ │ ├── users.js
```

具体阅读 mock/users.js 源码

6, 进入 mock 目录, 打开 index.js 文件添加数据模拟文件, 如 users

```javascript
import users from './users'

// 用户管理
users(Mock, qs)
```

具体阅读 mock/index.js 源码

7, 如需使用 vuex 存储状态请阅读 views/common/partials/Sidebar.vue 组件和 store 目录源码

### 快速开始

克隆项目文件:

```bash
git clone git@gitee.com:cssui/vue-admin-block.git
```

进入项目安装依赖:

```bash
# 安装依赖
yarn
# 或
npm install
```

开发：

```bash
# 启用热加载到 localhost:8090
npm start
# 或
npm run dev
```

构建：

```bash
# 构建最小测试
npm run test

# 构建最小预发布
npm run release

# 构建最小生产
npm run build

# 构建最小生产并查看包分析器报告
npm run build --report
```
