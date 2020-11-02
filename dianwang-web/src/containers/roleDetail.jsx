import {connect} from "react-redux"
import {getHome,getRoleDetail,getParent} from "../redux/actions"
import  roleDetail from "../views/systemManage/roleDetail"

export default connect(
    state=>({role:state.role,parent:state.parent}),
    { getHome,getRoleDetail,getParent}
)(roleDetail)
