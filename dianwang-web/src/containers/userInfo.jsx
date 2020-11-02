import {connect} from "react-redux"
import {getUser,getHome} from "../redux/actions"
import  userInfo from "../views/user/userInfo"

export default connect(
    state=>({display:state.displays,userInfo:state.userInfo}),
    {getUser,getHome}
)(userInfo)