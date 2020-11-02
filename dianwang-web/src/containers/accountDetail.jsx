import {connect} from "react-redux"
import {getHome,getAccountDetail} from "../redux/actions"
import  accountDetail from "../views/systemManage/accountDetail"

export default connect(
    state=>({userInfo:state.userInfo,account:state.account}),
    { getHome,getAccountDetail}
)(accountDetail)