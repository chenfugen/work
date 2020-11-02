import {connect} from "react-redux"
import {getHome,getAssetCount} from "../redux/actions"
import  parentColumn from "../views/columnStatistics/parentColumn"

export default connect(
    state=>({assetCount:state.assetCount}),
    { getHome,getAssetCount}
)(parentColumn)