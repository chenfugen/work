import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { ConfigProvider, Modal } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import * as serviceWorker from './serviceWorker'
import { createBrowserHistory } from 'history'
import 'moment/locale/zh-cn'
import moment from 'moment'
import store from './store'
import { Provider } from 'react-redux'
moment.locale('en')
const history = createBrowserHistory()
history.listen(() => {
  Modal.destroyAll()
})

// if (process.env.NODE_ENV === 'development') {
//   require('./mock')
// }

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
