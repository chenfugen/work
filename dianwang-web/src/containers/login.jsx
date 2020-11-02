import {connect} from "react-redux"
 import {changeHome,getHome} from "../redux/actions"
import  Login from "../views/login/login"

export default connect(
    state=>({display:state.displays}),
    { changeHome,getHome }
)(Login)