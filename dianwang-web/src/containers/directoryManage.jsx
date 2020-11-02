import {connect} from "react-redux"
import {getHome,getDirectory,createDirectory,getParent,getCategory,exportDirectory,editDirectory} from "../redux/actions"
import  directoryManage from "../views/assetConfigure/directoryManage"

export default connect(
    state=>({directory:state.directory,category:state.category,parent:state.parent}),
    { getHome,getDirectory,createDirectory,getParent,getCategory,exportDirectory,editDirectory}
)(directoryManage)