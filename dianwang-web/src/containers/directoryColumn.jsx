import {connect} from "react-redux"
import {getHome,getDirectoryCount} from "../redux/actions"
import  directoryColumn from "../views/columnStatistics/directoryColumn"

export default connect(
    state=>({assetCount:state.assetCount}),
    { getHome,getDirectoryCount}
)(directoryColumn)