import {connect} from "react-redux"
import {getHome,roomDetail} from "../redux/actions"
import  spaceDetail from "../views/realBstate/spaceDetail"

export default connect(
    state=>({room:state.room}),
    { getHome,roomDetail}
)(spaceDetail)