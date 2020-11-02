import {connect} from "react-redux"
import {getHome,buildDetail} from "../redux/actions"
import  realBstateDetail from "../views/realBstate/realBstateDetail"

export default connect(
    state=>({build:state.build}),
    { getHome,buildDetail}
)(realBstateDetail)