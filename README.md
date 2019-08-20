 #基于webpack构建的 Koa2 RESTful API 服务器脚手架
 这是一个基于 Koa2 的轻量级 RESTful API Server 脚手架，支持 ES6, 支持使用TypeScript编写。

此脚手架只安装了一些配合koa2使用的必要插件，不仅提供RESTful API实现，同时也集成了对静态资源的处理，支持跨越，代理转发请求等基础功能。基本上您仅需要关注您的业务开发即可。

脚手架可以根据不同的环境配置不同的信息运行价值，支持开发，测试，生产环境的不同参数配置。

 #数据库选型MySQL
当然你也可以根据需要配置其他的关系型数据库，可扩展 sequelize.js 作为 PostgreSQL, MySQL, MariaDB, SQLite, MSSQL 关系型数据库的 ORM，本框架使用MVC分成模式实现，事例上通过SQL去实现对数据库的增、删、查、改操作。

 ## 目录结构说明

```bash
.
├── README.md
├── .babelrc                    # Babel 配置文件
├── .gitignore                  # Git 忽略文件列表
├── package.json                # 描述文件
├── process.config.js           # pm2 部署示例文件
├── bin                         # bin入口目录
│   └── www                     # 启动文件入口
├── .vscode                     # VS CODE 调式目录
│   └── launch.json             # 调试配置
├── config                      # 配置文件
│   ├── db.config.js            # 数据库配置文件
│   ├── logger.config.js        # 日志配置文件
│   ├── proxy.config.js         # 代理配置文件
│   └── session.config.js       # session配置文件
├── src                         # 源代码目录，编译后目标源代码位于 dist 目录
│   ├── app.js                  # 入口文件
│   ├── files                   # 存放文件目录
│   ├── middleware              # 中间件目录
│       └── errorRouteCatch.js  # 示例插件 -  router异常处理
│   ├── utils                   # 工具类目录
│   ├── controllers             # 控制器
│       └── usersController.js  # 示例users控制器
│   ├── models                  # 模型层
│   ├── routes                  # 路由层
│         └── users.js          # 示例users路由
│   └── services                # 服务层
│         └── usersService.js   # 示例users服务层
├── public                      # 静态资源目录
└── logs                        # 日志目录
```

## 开发使用说明

```bash
git clone https://github.com/Allenzihan/koa2-mysql-framework.git

cd mv koa2-mysql-framework
npm install
npm run dev

访问： http://127.0.0.1:3000/home
```
## 开发调试说明

支持VSCODE调试 Node.js功能，已经配置好, 启动VSCODE IDE 上的Debug按钮即可调试


## 开发环境
 
npm run dev

## PM2 部署说明
提供了 PM2 部署 RESTful API Server 的示例配置，位于“process.config.js”文件中。

process.config.js 文件提供了两套环境的配置，分别是测试环境和生产环境的配置

启动测试环境：
npm run uat

如何启动失败，使用pm2 直接启动
pm2 start process.config.js --only uat

启动生产环境：
npm run prod

如何启动失败，使用pm2 直接启动
pm2 start process.config.js --only prod

以上使用pm2启动，需提前安装好pm2模块
PM2 配合 Docker 部署说明： http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/

### 关于 Token 使用的特别说明（JWT 身份认证）

app.use(jwt({ 
  secret: publicKey.toString()
}).unless({
  path: [
    /^\/users\/login/,
    /^\/home/,
    /^\/assets/
  ] 
}))

在 path 里面的开头路径则不进行身份认证，否则都将进行  鉴权。

前端处理方案：

```javascript
import axios from 'axios'
import { getToken } from './tool'

const DevBaseUrl = 'http://127.0.0.1:8080'
const ProdBashUrl = 'https://xxx.xxx'

let config = {
  baseURL: process.env.NODE_ENV !== 'production' ? DevBaseUrl : ProdBashUrl // 配置API接口地址
}

let token = getToken()
if (token) {
  config.headers = { Authorization: 'Bearer ' + token }
}

let request = axios.create(config)

// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (window) {
      let token = getToken()
      if (token) {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    // if (config.method === 'get') {
    //   config.url = config.url + 'timestamp=' + Date.now().toString()
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

export default request
```

`tool.js`文件

```javascript
// 写 cookies
export let setCookie = function setCookie(name, value, time) {
  if (time) {
    let strsec = getsec(time)
    let exp = new Date()
    exp.setTime(exp.getTime() + parseInt(strsec))
    document.cookie =
      name + '=' + escape(value) + ';expires=' + exp.toGMTString()
  } else {
    document.cookie = name + '=' + escape(value)
  }
}

// 读 cookies
export let getCookie = function(name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  return arr ? unescape(arr[2]) : null
}

// 删 cookies
export let delCookie = function(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

// 获取Token
export let getToken = function() {
  if (window.sessionStorage && window.sessionStorage.Bearer) {
    return window.sessionStorage.Bearer
  } else if (window.localStorage && window.localStorage.Bearer) {
    return window.localStorage.Bearer
  } else if (window.document.cookie) {
    return getCookie('Bearer')
  }
}

// 设置Token
export let setToken = function(token, rememberTime) {
  if (window.sessionStorage) {
    window.sessionStorage.Bearer = token
  }

  if ((rememberTime && window.localStorage) || !window.sessionStorage) {
    window.localStorage.Bearer = token
  }

  if (
    window.document.cookie &&
    !window.sessionStorage &&
    !window.localStorage
  ) {
    if (rememberTime) {
      setCookie('Bearer', token, rememberTime)
    } else {
      setCookie('Bearer', token)
    }
  }
}

// 删除Token
export let delToken = function() {
  if (window.sessionStorage && window.sessionStorage.Bearer) {
    window.sessionStorage.removeItem('Bearer')
  }

  if (window.localStorage && window.localStorage.Bearer) {
    window.localStorage.removeItem('Bearer')
  }

  if (window.document.cookie) {
    delCookie('Bearer')
  }
}
```

大概原理：
通过某个 API（通常是登录 API）获取成功后的 Token，存于本地，然后每次请求的时候在 Header 带上`Authorization: "Bearer " + token`，通常情况下无需担心本地 Token 被破解。