# node 版本
18+
# 打包工具
Vite
# 包管理工具
pnpm
# 项目启动
```shell
pnpm i # 安装依赖
npm run dev # 启动本地环境
```
# Chrome 插件
Vue devtools
# 项目目录
```text
├─.gitignore git 忽略上传文件
├─.nvmrc  nvm 控制文件，主要用来设置 nvm 默认给定的 node 版本
├─LICENSE 软件许可证
├─index.html 项目入口 html
├─newbee-v3-server.js  打包后的项目启动（本地开发不用管）
├─package.json  项目依赖，项目启动脚本命令在里面
├─postcss.config.cjs postcss 工具配置文件 https://postcss.org/
├─vite.config.js  Vite 打包工具配置文件 https://cn.vitejs.dev/guide/
├─src
|  ├─App.vue 项目根组件
|  ├─main.js 项目主入口（页面一进来就是执行的这个入口）
|  ├─views
|  |   ├─About.vue 关于我们
|  |   ├─Address.vue 地址管理
|  |   ├─AddressEdit.vue 新增地址
|  |   ├─Cart.vue 购物车
|  |   ├─Category.vue 分类
|  |   ├─CreateOrder.vue 创建订单
|  |   ├─Home.vue 首页
|  |   ├─Login.vue 登录组件
|  |   ├─Order.vue 我的订单
|  |   ├─OrderDetail.vue 订单详情
|  |   ├─ProductDetail.vue 商品详情
|  |   ├─ProductList.vue 商品搜索
|  |   ├─Setting.vue 账号管理
|  |   └User.vue 个人信息组件
|  ├─utils 工具类文件夹
|  |   └axios.js 异步请求工具类
|  ├─stores Pinia 全局状态管理
|  |   └cart.js 购物车全局状态管理
|  ├─service 接口请求
|  |    ├─address.js
|  |    ├─cart.js
|  |    ├─good.js
|  |    ├─home.js
|  |    ├─order.js
|  |    └user.js
|  ├─router
|  |   └index.js 前端路由配置
|  ├─components 全局组件
|  |     ├─ListScroll.vue 滚动组件
|  |     ├─NavBar.vue 底部导航组件
|  |     ├─SimpleHeader.vue 顶部组件，例如：我的界面的上的底部
|  |     ├─Swiper.vue 轮播图组件
|  |     └VueImageVerify.vue 验证码组件
|  ├─common 公共资源
|  |   ├─style 样式资源
|  |   |   ├─base.less
|  |   |   ├─mixin.less
|  |   |   └theme.css
|  |   ├─js 工具方法
|  |   | └utils.js
|  ├─assets 全局样式资源
|  |   ├─base.css
|  |   ├─logo.svg
|  |   └main.css
├─public
|   └favicon.ico 网站 icon
```