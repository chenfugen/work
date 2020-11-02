import {connect} from "react-redux"
import {getHome,getStore,getCompany,getRoomAsset,exportStore,getBuild} from "../redux/actions"
import  storeManage from "../views/realBstate/storeManage"

export default connect(
    state=>({stores:state.stores,companyList:state.companyList,roomAsset:state.roomAsset,build:state.build}),
    { getHome,getStore,getCompany,getRoomAsset,exportStore,getBuild}
)(storeManage)