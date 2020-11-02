import {connect} from "react-redux"
import {getHome,getAssetDetail} from "../redux/actions"
import  assetDetail from "../views/assetManage/assetDetail"

export default connect(
    state=>({asset:state.asset}),
    { getHome,getAssetDetail}
)(assetDetail)