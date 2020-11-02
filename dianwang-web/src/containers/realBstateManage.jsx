import {connect} from "react-redux"
import {getHome,getBuild,createBuild,delBuild,exportBuild} from "../redux/actions"
import  realBstateManage from "../views/realBstate/realBstateManage"

export default connect(
    state=>({addressList:state.addressList,build:state.build}),
    { getHome,getBuild,createBuild,delBuild,exportBuild}
)(realBstateManage)
