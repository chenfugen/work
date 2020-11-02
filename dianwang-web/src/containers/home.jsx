import {connect} from "react-redux"
import {getUser} from "../redux/actions"
import  home from "../components/home/home"

export default connect(
    state=>({display:state.displays,userInfo:state.userInfo}),
    {getUser}
)(home)