import {connect} from "react-redux"
import {getHome,getParent,createParent,exportParent,editParent} from "../redux/actions"
import  classifyManage from "../views/assetConfigure/classifyManage"

export default connect(
    state=>({userInfo:state.userInfo,parent:state.parent}),
    { getHome,getParent,createParent,exportParent,editParent}
)(classifyManage)