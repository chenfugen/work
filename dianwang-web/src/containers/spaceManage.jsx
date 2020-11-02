import {connect} from "react-redux"
import {getHome,getRoom,createRoom,delRoom,getCompany,getBuild,changeDepartment,getRoomAsset,exportRoom} from "../redux/actions"
import  spaceManage from "../views/realBstate/spaceManage"

export default connect(
    state=>({userInfo:state.userInfo,room:state.room,build:state.build,department:state.department,roomAsset:state.roomAsset}),
    { getHome,getRoom,createRoom,delRoom,getCompany,getBuild,changeDepartment,getRoomAsset,exportRoom}
)(spaceManage)