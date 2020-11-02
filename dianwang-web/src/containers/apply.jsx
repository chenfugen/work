import {connect} from "react-redux"
import {getHome,getApplyRecord,consentApply,refuseApply,getApplyDetail,getAllParent,exportApplyRecord} from "../redux/actions"
import  apply from "../views/applyManage/apply"

export default connect(
    state=>({applyRecord:state.applyRecord,applyDetail:state.applyDetail,allParent:state.allParent}),
    { getHome,getApplyRecord,consentApply,refuseApply,getApplyDetail,getAllParent,exportApplyRecord}
)(apply)