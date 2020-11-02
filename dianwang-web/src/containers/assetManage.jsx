import {connect} from "react-redux"
import {getHome,getAsset,recycleAsset,getDirectory,getCategory,createAsset,getParent,exportAsset,getBuild,getRoom} from "../redux/actions"
import  assetManage from "../views/assetManage/asset"

export default connect(
    state=>({category:state.category,directory:state.directory,asset:state.asset,parent:state.parent,room:state.room,build:state.build}),
    { getHome,getAsset,recycleAsset,getDirectory,getCategory,createAsset,getParent,exportAsset,getBuild,getRoom}
)(assetManage)