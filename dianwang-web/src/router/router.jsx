import React,{ Component } from "react"
import {Route,Redirect,Switch} from 'react-router-dom';
//数据统计
import statistics from "../containers/statistics"
//不动产
import realEstateManage from "../containers/realBstateManage"
//不动产详情
import realBstateDetail from "../containers/realBstateDetail"
//空间管理
import spaceManage from "../containers/spaceManage"
//空间详情
import spaceDetail from "../containers/spaceDetail"
//仓库管理
import storeManage from "../containers/storeManage"

//资产管理
import assetManage from "../containers/assetManage"
//资产详情
import assetDetail from  "../containers/assetDetail"
//品类管理
import sortManage from "../containers/sortManage"
//分类管理
import classifyManage from "../containers/classifyManage"
//名录管理
import directoryManage from "../containers/directoryManage"

//申领管理
import applyManage from "../containers/apply"
//申领详情
import applyDetail from "../containers/applyDetail"
//报表统计
import parentColumn from "../containers/parentColumn"
import categoryColumn from "../containers/categoryColumn"
import directoryColumn from "../containers/directoryColumn"

//组织管理
import organization from "../containers/organization"
import department from "../containers/department"
//权限管理
import authority from "../containers/authority"
//账户管理
import account from "../containers/account"
//日志管理
import log from "../containers/log"
//二维码
import qrcode from "../containers/qrcode"
//账户详情
import accountDetail from  "../containers/accountDetail"
//角色详情
import roleDetail from  "../containers/roleDetail"
//个人中心
import userInfo from "../containers/userInfo"
import changePassword from "../containers/changePassword"

//状态页
import login from "../containers/login"
import error403 from "../views/exception/403"
import error404 from "../views/exception/404"
import error500 from "../views/exception/500"
export default class router extends  Component{
      render() {
        return(
        <div>
            <Switch>
                <Route path="/statistics" component={statistics}></Route>
                <Route path="/realEstateManage" component={realEstateManage}></Route>
                <Route path="/assetManage" component={assetManage}></Route>
                <Route path="/applyManage" component={applyManage}></Route>
                <Route path="/applyDetail/:id" component={applyDetail}></Route>
                <Route path="/spaceManage" component={spaceManage}></Route>
                <Route path="/spaceDetail/:id" component={spaceDetail}></Route>
                <Route path="/realBstateDetail/:id" component={realBstateDetail}></Route>
                <Route path="/assetDetail/:id" component={assetDetail}></Route>
                <Route path="/sortManage" component={sortManage}></Route>
                <Route path="/storeManage" component={storeManage}></Route>
                <Route path="/classifyManage" component={classifyManage}></Route>
                <Route path="/directoryManage" component={directoryManage}></Route>
                <Route path="/parentColumn" component={parentColumn}></Route>
                <Route path="/categoryColumn/:id" component={categoryColumn}></Route>
                <Route path="/directoryColumn/:id" component={directoryColumn}></Route>
                <Route path="/organization" component={organization}></Route>
                <Route path="/department" component={department}></Route>
                <Route path="/authority" component={authority}></Route>
                <Route path="/account" component={account}></Route>
                <Route path="/accountDetail/:id" component={accountDetail}></Route>
                <Route path="/roleDetail/:id" component={roleDetail}></Route>
                <Route path="/userInfo" component={userInfo}></Route>
                <Route path="/changePassword" component={changePassword}></Route>
                <Route path="/log" component={log}></Route>
                <Route path="/qrcode" component={qrcode}></Route>
                <Route path="/login" component={login}></Route>
                <Route path="/403" component={error403}></Route>
                <Route path="/404" component={error404}></Route>
                <Route path="/500" component={error500}></Route>
                <Redirect from="/" to="/login"/>
            </Switch>
        </div>
        )
    }
}