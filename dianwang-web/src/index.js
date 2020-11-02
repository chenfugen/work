import React from 'react';
import ReactDOM from 'react-dom';
import { Provider }from "react-redux"
import {HashRouter as Router} from 'react-router-dom';
import store from "./redux/store"
import Home from "./containers/home"
import Routers from './router/router';
import Axios from "./axios/index";
import Ax from "./axios/common";
import "./static/css/index.scss"
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';



React.Component.prototype.$Axios = Axios; //带token得请求
React.Component.prototype.$Ax = Ax;    //普通请求

ReactDOM.render((
    <Router>
        <Provider store={store}>
            <ConfigProvider locale={zhCN}>
                <Home>
                    <Routers/>
                </Home>
            </ConfigProvider>
        </Provider>
    </Router>
    ),
    document.getElementById('root'));

