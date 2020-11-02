import {connect} from "react-redux"
import {getHome,getCategoryCount} from "../redux/actions"
import  categoryColumn from "../views/columnStatistics/categoryColumn"

export default connect(
    state=>({assetCount:state.assetCount}),
    { getHome,getCategoryCount}
)(categoryColumn)