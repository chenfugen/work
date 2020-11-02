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
    get_address,
    get_category,
    get_parent,
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
import Axios from "../axios/index";
import Ax from "../axios/common";
import exportFrom from "../axios/export";
import {message, notification} from 'antd';
import defaultState from "./state"



//显示菜单栏和头部
export const changeHome = () => ({
    type:change_display, data:defaultState.display
})

export const getHome = () => ({
    type:get_display, data:"block"
})

//获取用户信息和保存
export const getUserInfo = (userInfo) => ({
    type:get_user, data:userInfo
})

export const saveUserInfo = (userInfo) => ({
    type:save_user, data:userInfo
})
export const getUser = () => {
    return dispatch => {
        Axios.get("/manage/account/detail").then((res) => {
            if (res.success) {
                const userInfo = res.data;
                dispatch(getUserInfo(userInfo))
            }
        })
    }
}

//后勤资产统计
export const getUseCount = (count) => ({
    type:get_useCount, data:count
})
export const getApplyCount = (count) => ({
    type:get_applyCount, data:count
})
export const getChart= (count) => ({
    type:get_chartData, data:count
})
export const getApplyNum = () => {
    return dispatch => {
        Axios.get("/manage/chart/apply/count").then((res) => {
            if (res.success) {
                dispatch(getApplyCount( res.data))
            }
        })
    }
}
export const getUseNum = () => {
    return dispatch => {
        Axios.get("/manage/chart/use/count").then((res) => {
            if (res.success) {
                dispatch(getUseCount( res.data))
            }
        })
    }
}

export const getChartData = () => {
    return dispatch => {
        Axios.get("/manage/chart/data").then((res) => {
            if (res.success) {
                dispatch(getChart( res.data))
            }
        })
    }
}


//获取账户信息
export const getAccountList = (account) => ({
    type:get_account, data:account
})

export const getAccount = (pageNum, pageSize,searchList) => {
    let page={
        pageNum:pageNum,
        pageSize:pageSize
    }
    return dispatch => {
        Axios.get("/manage/admin/list", {
            params:{
               ...page,...searchList
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    if (res.data.data.length > 0) {
                        res.data.data.forEach((item, index) => {
                            item["key"] = (pageNum - 1) * pageSize + index + 1;
                        })
                    }
                    const account = res.data;
                    dispatch(getAccountList(account));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}

export const createAccount = (account) => {
    return dispatch => {
        Axios.post("/manage/admin/create", account).then((res) => {
            if (res.success) {
                message.success("新增成功");
                dispatch(getAccount(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const delAccount = (id) => {
    return dispatch => {
        Axios.post("/manage/admin/delete", {
            id:id
        }).then((res) => {
            if (res.success) {
                message.success("删除成功");
                dispatch(getAccount(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}

export const editAccount = (account) => {
    return dispatch => {
        Axios.post("/manage/admin/update", account).then((res) => {
            if (res.success) {
                message.success("修改成功");
                dispatch(getAccount(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const getAccountDetail = (id) => {
    return dispatch => {
        Axios.get("/manage/admin/detail", {
            params:{
                id:id
            }
        }).then((res) => {
            if (res.success) {
                dispatch(getAccountList(res.data));
            } else {
                message.error(res.message);
            }
        })
    }
}
//获取单位/部门
export const getCompanyList = (list) => ({
    type:get_company, data:list
})

export const getDepartment = (department) => ({
    type:get_department, data:department
})

export const getOrganizationList = (list) => ({
    type:get_companyList, data:list
})

export const getDepartmentList = (list) => ({
    type:get_departmentList, data:list
})

export const getOrganization = (pageNum, pageSize) => {
    return dispatch => {
        Axios.get("/manage/organization/list", {
            params:{
                pageNum:pageNum,
                pageSize:pageSize
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getOrganizationList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}
export const getDepartments = (pageNum, pageSize) => {
    return dispatch => {
        Axios.get("/manage/organization/department/list", {
            params:{
                pageNum:pageNum,
                pageSize:pageSize
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getDepartmentList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}
export const createOrganization = (account) => {
    return dispatch => {
        Axios.post("/manage/organization/add", account).then((res) => {
            if (res.success) {
                message.success("新增成功");
                dispatch(getOrganization(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const delOrganization = (id) => {
    return dispatch => {
        Axios.post("/manage/admin/delete", {
            id:id
        }).then((res) => {
            if (res.success) {
                message.success("删除成功");
                dispatch(getOrganization(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}

export const createDepartment = (account) => {
    return dispatch => {
        Axios.post("manage/organization/department/add", account).then((res) => {
            if (res.success) {
                message.success("新增成功");
                dispatch(getDepartments(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const delDepartment = (id) => {
    return dispatch => {
        Axios.post("manage/organization/department/delete", {
            id:id
        }).then((res) => {
            if (res.success) {
                message.success("删除成功");
                dispatch(getDepartments(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const editDepartment = (account) => {
    return dispatch => {
        Axios.post("manage/organization/department/edit",account).then((res) => {
            if (res.success) {
                message.success("编辑成功");
                dispatch(getDepartments(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}

//获取组织集合
export const getCompany = () => {
    return dispatch => {
        Axios.get("/wechat/organization/list").then((res) => {
            if (res.success) {
                const list =res.data;
                const department = [];
                const item = res.data;
                for (let i in item) {
                    department[i] = {};
                    department[i]["label"] = item[i].name;
                    department[i]["value"] = item[i].id;
                    department[i]["children"] = [];
                    Axios.get("/wechat/organization/department/list", {
                        params:{
                            organizationId:item[i].id,
                        }
                    }).then((res) => {
                        if (res.success) {
                            const list = res.data;
                            for (let j in list) {
                                department[i]["children"][j] = {
                                    label:list[j].departmentName,
                                    value:list[j].departmentId
                                };
                                dispatch(getDepartment(department));
                            }
                        } else {
                            message.error(res.message);
                        }
                    })
                }
                dispatch(getCompanyList(list));
            } else {
                message.error(res.message);
            }
        })
    }
}

//角色列表
export const getRoleList = (role) => ({
    type:get_role, data:role
})

export const getRole = (pageNum, pageSize) => {
    return dispatch => {
        Axios.get("/manage/role/list", {
            params:{
                pageNum:pageNum,
                pageSize:pageSize
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getRoleList(list));

                }
            } else {
                message.error(res.message);
            }
        })
    }
}

export const createRole = (account) => {
    return dispatch => {
        Axios.post("/manage/role/create", account).then((res) => {
            if (res.success) {
                message.success("新增成功");
                dispatch(getRole(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const delRole = (id) => {
    return dispatch => {
        Axios.post("/manage/role/delete", {
            id:id
        }).then((res) => {
            if (res.success) {
                message.success("删除成功");
                dispatch(getRole(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}

export const editRole = (account) => {
    return dispatch => {
        Axios.post("/manage/role/update", account).then((res) => {
            if (res.success) {
                message.success("修改成功");
                dispatch(getRole(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const getRoleDetail = (id) => {
    return dispatch => {
        Axios.get("/manage/role/detail", {
            params:{
                roleId:id
            }
        }).then((res) => {
            if (res.success) {
                dispatch(getRoleList(res.data));
            } else {
                message.error(res.message);
            }
        })
    }
}

//获取资产大类、品类、名录、资产列表
export const getAssetList = (list) => ({
    type:get_asset, data:list
})
export const getParentList = (list) => ({
    type:get_parent, data:list
})

export const getAllParentList = (list) => ({
    type:get_AllParent, data:list
})

export const getCategoryList = (list) => ({
    type:get_category, data:list
})
export const getDirectoryList = (list) => ({
    type:get_directory, data:list
})

export const getAsset = (pageNum, pageSize,searchList) => {
    let page={
            pageNum:pageNum,
            pageSize:pageSize,
    }
    return dispatch => {
        Axios.get("/manage/asset/list", {
            params:{
                ...page,...searchList
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getAssetList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}


export const getAssetDetail = (id) => {
    return dispatch => {
        Axios.get("/wechat/asset/detail", {
            params:{
                id:id
            }
        }).then((res) => {
            if (res.success) {
                dispatch(getAssetList(res.data));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const recycleAsset  = (id) => {
    return dispatch => {
        Axios.post('/wechat/asset/recycle', {
            "assetId": id
        }).then((res) => {
            if (res.success) {
                message.success("回收成功");
                dispatch(getAsset(1,10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const createAsset = (account) => {
    return dispatch => {
        Axios.post("/wechat/asset/add",account).then((res) => {
            if (res.success) {
                message.success("新增成功");
                dispatch(getAsset(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
//获取资产大类
export const getParent = (pageNum, pageSize) => {
    return dispatch => {
        Axios.get("/manage/asset/parent/list", {
            params:{
                pageNum:pageNum,
                pageSize:pageSize
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data
                    dispatch(getParentList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}
export const getAllParent = (accessKey) => {
    return dispatch => {
        Ax.get("/common/parent/list", {
            params:{
                accessKey:defaultState.accessKey,
            }
        }).then((res) => {
            if (res.success) {
                const list = res.data
                dispatch(getAllParentList(list));
             }else{
                message.error(res.message);
            }
        })
    }
}

export const createParent = (name) => {
    return dispatch => {
        Axios.post("/manage/asset/add/parent", {
            name:name
        }).then((res) => {
            if (res.success) {
                message.success("新增成功");
                dispatch(getParent(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const editParent = (account) => {
    return dispatch => {
        Axios.post("/manage/asset/edit/parent", account).then((res) => {
            if (res.success) {
                message.success("编辑成功");
                dispatch(getParent(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
    }

export const getCategory = (pageNum, pageSize) => {
    return dispatch => {
        Axios.get("/manage/asset/category/list", {
            params:{
                pageNum:pageNum,
                pageSize:pageSize
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.list.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getCategoryList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}
export const createCategory = (account) => {
    return dispatch => {
        Axios.post("/wechat/asset/add/category", account).then((res) => {
            if (res.success) {
                message.success("新增成功");
                dispatch(getCategory(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const editCategory = (account) => {
    return dispatch => {
        Axios.post("/manage/asset/edit/category ", account).then((res) => {
            if (res.success) {
                message.success("编辑成功");
                dispatch(getCategory(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const getDirectory = (pageNum, pageSize) => {
    return dispatch => {
        Axios.get("/manage/asset/directory/list", {
            params:{
                pageNum:pageNum,
                pageSize:pageSize
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getDirectoryList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}

export const createDirectory = (account) => {
    return dispatch => {
        Axios.post("/wechat/asset/add/assetDirectory", account).then((res) => {
            if (res.success) {
                message.success("新增成功");
                dispatch(getDirectory(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const editDirectory = (account) => {
    return dispatch => {
        Axios.post("/manage/asset/edit/directory", account).then((res) => {
            if (res.success) {
                message.success("编辑成功");
                dispatch(getDirectory(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}

//不动产
export const getBuildList = (role) => ({
    type:get_build, data:role
})

export const getBuild = (pageNum, pageSize,searchList) => {
    let page={
        pageNum:pageNum,
        pageSize:pageSize
    }
    return dispatch => {
        Axios.get("/manage/building/list", {
            params:{
              ...page,...searchList
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getBuildList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}

export const createBuild = (account) => {
    return dispatch => {
        Axios.post("/manage/building/create", account).then((res) => {
            if (res.success) {
                message.success("新增成功");
                dispatch(getBuild(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const delBuild = (id) => {
    return dispatch => {
        Axios.post("/manage/building/delete", {
            id:id
        }).then((res) => {
            if (res.success) {
                message.success("删除成功");
                dispatch(getBuild(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const buildDetail = (id) => {
    return dispatch => {
        Axios.get("/manage/building/detail", {
            params:{
                id:id
            }
        }).then((res) => {
            if (res.success) {
                dispatch(getBuildList(res.data));
            } else {
                message.error(res.message);
            }
        })
    }
}

//空间
export const getRoomList = (role) => ({
    type:get_room, data:role
})

export const getRoom = (pageNum, pageSize,searchList) => {
    let page={
        pageNum:pageNum,
        pageSize:pageSize
    }
    return dispatch => {
        Axios.get("/manage/room/list", {
            params:{
              ...page,...searchList
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getRoomList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}

export const createRoom = (account) => {
    return dispatch => {
        Axios.post("/manage/room/create", account).then((res) => {
            if (res.success) {
                message.success("新增成功");
                dispatch(getRoom(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const delRoom = (id) => {
    return dispatch => {
        Axios.post("/manage/room/delete", {
            id:id
        }).then((res) => {
            if (res.success) {
                message.success("删除成功");
                dispatch(getRoom(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const roomDetail = (id) => {
    return dispatch => {
        Axios.get("/manage/room/detail", {
            params:{
                id:id
            }
        }).then((res) => {
            if (res.success) {
                dispatch(getRoomList(res.data));
            } else {
                message.error(res.message);
            }
        })
    }
}
//获取空间对应资产
export const getRoomAssetList = (list) => ({
    type:get_roomAsset, data:list
})

export const getRoomAsset = (pageNum, pageSize,roomId,store) => {
    return dispatch => {
        Axios.get("/manage/room/asset/list", {
            params:{
                roomId:roomId,
                pageNum:pageNum,
                pageSize:pageSize,
                store:store,
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getRoomAssetList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}

//分配部门
export const changeDepartment = (account) => {
    return dispatch => {
        Axios.post("manage/room/update/department",account).then((res) => {
            if (res.success) {
                message.success("分配成功");
                dispatch(getRoom(1, 10));
            } else {
                message.error(res.message);
            }
        })
    }
}

//仓库
export const getStoreList = (store) => ({
    type:get_store, data:store
})

export const getStore = (pageNum, pageSize,searchList) => {
    let page={
        pageNum:pageNum,
        pageSize:pageSize
    }
    return dispatch => {
        Axios.get("/manage/room/store/list", {
            params:{
                ...page,...searchList
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getStoreList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}

//日志
export const getLogList = (store) => ({
    type:get_log, data:store
})

export const getLog = (pageNum, pageSize) => {
    return dispatch => {
        Axios.get("/manage/log/list", {
            params:{
                pageNum:pageNum,
                pageSize:pageSize
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getLogList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}

//申请列表
export const getApplyList = (store) => ({
    type:get_applyRecord, data:store
})

export const getApply = (store) => ({
    type:get_applyDetail, data:store
})

export const getApplyRecord= (pageNum, pageSize,searchList) => {
    let page={
        pageNum:pageNum,
        pageSize:pageSize,
        status:0
    }
    return dispatch => {
        Axios.get("/manage/asset/applyRecord/list", {
            params:{
               ...page,...searchList
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    res.data.data.forEach((item, index) => {
                        item["key"] = (pageNum - 1) * pageSize + index + 1;
                    })
                    const list = res.data;
                    dispatch(getApplyList(list));
                }
            }else{
                message.error(res.message);
            }
        })
    }
}
export const getApplyDetail = (id) => {
    return dispatch => {
        Axios.get("/manage/asset/applyRecord/detail", {
            params:{
                id:id
            }
        }).then((res) => {
            if (res.success) {
                dispatch(getApply(res.data));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const consentApply = (id) => {
    return dispatch => {
        Axios.post("/wechat/asset/agree", { id:id }).then((res) => {
            if (res.success) {
                message.success("审批成功");
                dispatch(getApplyRecord(1,10,0));
            } else {
                message.error(res.message);
            }
        })
    }
}
export const refuseApply = (account) => {
    return dispatch => {
        Axios.post("/wechat/asset/refuse",account).then((res) => {
            if (res.success) {
                dispatch(getApplyRecord(1,10,0));
            } else {
                message.error(res.message);
            }
        })
    }
}

// 资产统计
export  const getAssetTotal=(list)=>({
    type:get_assetCount,data:list
})

export const getAssetCount= () => {
    return dispatch => {
        Axios.get("/manage/statistic/parent/data").then((res) => {
            if (res.success) {
                if (res.data != null) {
                    const list = res.data;
                    dispatch(getAssetTotal(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}
export const getCategoryCount= (id) => {
    return dispatch => {
        Axios.get("/manage/statistic/category/data",{
            params:{
                parentId:id
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    const list = res.data;
                    dispatch(getAssetTotal(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}
export const getDirectoryCount= (id) => {
    return dispatch => {
        Axios.get("/manage/statistic/directory/data",{
            params:{
                categoryId:id
            }
        }).then((res) => {
            if (res.success) {
                if (res.data != null) {
                    const list = res.data;
                    dispatch(getAssetTotal(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}

//获取城市
export  const getAddressList=(list)=>({
    type:get_address,data:list
})

export const getAddress= () => {
    return dispatch => {
        Ax.get("/common/getAddressList").then((res) => {
            if (res.success) {
                if (res.data != null) {
                    const list = res.data;
                    dispatch(getAddressList(list));
                }
            } else {
                message.error(res.message);
            }
        })
    }
}






//导出模块
export const exportAlert = () => {
    return dispatch => {
        notification.open({
            message: '导出提示',
            description: '表格导出可能需要部分时间，请耐心等待',
            onClick: () => {
                console.log('Notification Clicked!');
            },
        });
    }
}

export const exportAsset = () => {
    return dispatch => {
        dispatch(exportAlert());
        exportFrom.get("/manage/asset/export").then((res) => {})
    }
}
export const exportBuild = () => {
    return dispatch => {
        dispatch(exportAlert());
        exportFrom.get("/manage/building/export").then((res) => {})
    }
}
export const exportParent = () => {
    return dispatch => {
        dispatch(exportAlert());
        exportFrom.get("/manage/asset/parent/export").then((res) => {})
    }
}
export const exportCategory= () => {
    return dispatch => {
        dispatch(exportAlert());
        exportFrom.get("/manage/asset/category/export").then((res) => {})
    }
}
export const exportDirectory= () => {
    return dispatch => {
        dispatch(exportAlert());
        exportFrom.get("/manage/asset/directory/export").then((res) => {})
    }
}
export const exportRoom= () => {
    return dispatch => {
        dispatch(exportAlert());
        exportFrom.get("/manage/room/export",{
            parms:{
                store:0
            }
            }).then((res) => {})
    }
}
export const exportStore = () => {
    return dispatch => {
        dispatch(exportAlert());
        exportFrom.get("/manage/room/export",{
            parms:{
                store:1
            }
        }).then((res) => {})
    }
}
export const exportApplyRecord = () => {
    return dispatch => {
        dispatch(exportAlert());
        exportFrom.get("/manage/asset/applyRecord/export").then((res) => {})
    }
}
export const exportRole = () => {
    return dispatch => {
        dispatch(exportAlert());
        exportFrom.get("/manage/role/export").then((res) => {})
    }
}
export const exportAdmin = () => {
    return dispatch => {
        dispatch(exportAlert());
        exportFrom.get("/manage/admin/export").then((res) => {})
    }
}