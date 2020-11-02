import {connect} from "react-redux"
import {getHome,getLog} from "../redux/actions"
import  log from "../views/systemManage/log"

export default connect(
    state=>({logList:state.logList}),
    { getHome,getLog}
)(log)