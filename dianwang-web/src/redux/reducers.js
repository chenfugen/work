import {combineReducers} from "redux"
import {
    get_account,
    get_user,
    save_user,
    get_display,
    change_display,
    get_company,
    get_department,
    get_role,
    get_asset,
    get_build,
    get_room,
    get_category,
    get_parent,
    get_address,
    get_store,
    get_applyRecord,
    get_directory,
    get_log,
    get_assetCount,
    get_companyList,
    get_departmentList,
    get_applyDetail,
    get_roomAsset,
    get_useCount,
    get_applyCount,
    get_AllParent,
      get_chartData
} from "./action-type";

const displays = (state = "none", action) => {
    switch (action.type) {
        case change_display:
            return state = action.data;
        case get_display:
            return state = action.data;
        default:
            return state;
    }
};

//用户
const userInfo = (state = {}, action) => {
    switch (action.type) {
        case get_user:
            return state = action.data;
        case save_user:
            return state = action.data;
        default:
            return state;
    }
};
//账户
const account = (state ={}, action) => {
    switch (action.type) {
        case get_account:
            return state = action.data;
        default:
            return state;
    }
};
//公司
const companyList = (state = [], action) => {
    switch (action.type) {
        case get_company:
            return state = action.data;
        default:
            return state;
    }
};
//单位部门
const department = (state = [], action) => {
    switch (action.type) {
        case get_department:
            return state = action.data;
        default:
            return state;
    }
};
//角色
const role = (state = {}, action) => {
    switch (action.type) {
        case get_role:
            return state = action.data;
        default:
            return state;
    }
};
//资产大类
const asset = (state = {}, action) => {
    switch (action.type) {
        case get_asset:
            return state = action.data;
        default:
            return state;
    }
};

//不动产
const build = (state = {}, action) => {
    switch (action.type) {
        case get_build:
            return state = action.data;
        default:
            return state;
    }
};
//空间
const room = (state = {}, action) => {
    switch (action.type) {
        case get_room:
            return state = action.data;
        default:
            return state;
    }
};

//地址
const addressList = (state = {}, action) => {
    switch (action.type) {
        case get_address:
            return state = action.data;
        default:
            return state;
    }
};

//资产大类
const parent = (state = {}, action) => {
    switch (action.type) {
        case get_parent:
            return state = action.data;
        default:
            return state;
    }
};
//不受权限的资产大类
const allParent = (state = [], action) => {
    switch (action.type) {
        case get_AllParent:
            return state = action.data;
        default:
            return state;
    }
};
//资产分类
const category = (state = {}, action) => {
    switch (action.type) {
        case get_category:
            return state = action.data;
        default:
            return state;
    }
};
//资产名录
const directory= (state = {}, action) => {
    switch (action.type) {
        case get_directory:
            return state = action.data;
        default:
            return state;
    }
};

//日志
const logList= (state = {}, action) => {
    switch (action.type) {
        case get_log:
            return state = action.data;
        default:
            return state;
    }
};
//申请
const applyRecord= (state = {}, action) => {
    switch (action.type) {
        case get_applyRecord:
            return state = action.data;
        default:
            return state;
    }
};

const applyDetail= (state = {}, action) => {
    switch (action.type) {
        case get_applyDetail:
            return state = action.data;
        default:
            return state;
    }
};
//仓库数据
const stores = (state = {}, action) => {
    switch (action.type) {
        case get_store:
            return state = action.data;
        default:
            return state;
    }
};
//资产数据
const organization= (state ={}, action) => {
    switch (action.type) {
        case get_companyList:
            return state = action.data;
        default:
            return state;
    }
};

//资产数据
const assetCount= (state =[], action) => {
    switch (action.type) {
        case get_assetCount:
            return state = action.data;
        default:
            return state;
    }
};

//部门列表
const departmentList = (state ={}, action) => {
    switch (action.type) {
        case get_departmentList:
            return state = action.data;
        default:
            return state;
    }
};

//空间资产
const roomAsset = (state =[], action) => {
    switch (action.type) {
        case get_roomAsset:
            return state = action.data;
        default:
            return state;
    }
};
//当日申请数量
const applyCount = (state =0, action) => {
    switch (action.type) {
        case get_applyCount:
            return state = action.data;
        default:
            return state;
    }
};
//当日申领数量
const useCount = (state =0, action) => {
    switch (action.type) {
        case get_useCount:
            return state = action.data;
        default:
            return state;
    }
};

//获取资产图表数据
const chartData = (state ={}, action) => {
    switch (action.type) {
        case get_chartData:
            return state = action.data;
        default:
            return state;
    }
};

export default combineReducers({
    addressList,
    organization,
    departmentList,
    parent,
    allParent,
    category,
    build,
    room,
    asset,
    role,
    department,
    companyList,
    account,
    displays,
    userInfo,
    stores,
    applyRecord,
    applyDetail,
    logList,
    directory,
    assetCount,
    roomAsset,
    applyCount,
    useCount,
    chartData
})
