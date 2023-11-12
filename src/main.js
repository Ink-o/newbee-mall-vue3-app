import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { ActionBar, ActionBarIcon, ActionBarButton, Divider, Popup, Overlay, Loading, Dialog, ContactCard, Form, AddressEdit, AddressList, Field, CellGroup, Cell, SwipeCell, Icon, Stepper, Card, Checkbox, CheckboxGroup, Button, Swipe, SwipeItem, PullRefresh, List, Tab, Tabs, SubmitBar, Toast, Skeleton } from 'vant'

import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible'

import './assets/main.css'
import './common/style/theme.css'
import 'vant/es/toast/style'
// 创建应用实例，App 作为应用根组件
const app = createApp(App)

// 注册 pinia
app.use(createPinia())
// 注册 路由
app.use(router)
// 全局注册 vant 里的一些组件
app.use(ActionBarButton)
  .use(ActionBarIcon)
  .use(ActionBar)
  .use(Divider)
  .use(Popup)
  .use(Overlay)
  .use(Loading)
  .use(Dialog)
  .use(Toast)
  .use(ContactCard)
  .use(Form)
  .use(AddressEdit)
  .use(AddressList)
  .use(Field)
  .use(CellGroup)
  .use(Cell)
  .use(SwipeCell)
  .use(Icon)
  .use(Stepper)
  .use(Card)
  .use(Button)
  .use(Swipe)
  .use(SwipeItem)
  .use(PullRefresh)
  .use(List)
  .use(Tab)
  .use(Tabs)
  .use(SubmitBar)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Skeleton)

// 全局过滤器
app.config.globalProperties.$filters = {
  prefix(url) {
    // url： test.png
    // http://backend-api-01.newbee.ltdtest.png
    if (url && url.startsWith('http')) {
      return url
    } else {
      url = `http://backend-api-01.newbee.ltd${url}`
      return url
    }
  }
}

// div p a
// div：块元素
// p：段落元素
// a：访问链接

// app 挂载到 #app 这个选择器的 dom 上
app.mount('#app')
