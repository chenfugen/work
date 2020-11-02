import {connect} from "react-redux"
import {getHome,getRole,createRole,editRole,delRole,getAllParent,exportRole} from "../redux/actions"
import  authority from "../views/systemManage/authority"

export default connect(
    state=>({userInfo:state.userInfo,role:state.role,allParent:state.allParent}),
    { getHome,getRole,createRole,editRole,delRole,getAllParent,exportRole}
)(authority)