import {connect} from "react-redux"
import {getHome} from "../redux/actions";
import  changePassword from "../views/user/changePassword"


export default connect(
    state=>({display:state.displays}),
    {getHome}
)(changePassword)