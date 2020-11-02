import {connect} from "react-redux"
import {getHome,getApplyDetail,consentApply,refuseApply} from "../redux/actions"
import  applyDetail from "../views/applyManage/applyDetail"

export default connect(
    state=>({applyRecord:state.applyRecord}),
    { getHome,getApplyDetail,consentApply,refuseApply}
)(applyDetail)
