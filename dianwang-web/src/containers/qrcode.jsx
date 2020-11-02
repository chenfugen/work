import {connect} from "react-redux"
import {changeHome,getHome} from "../redux/actions"
import  qrcode from "../views/systemManage/qrcode"

export default connect(
    state=>({display:state.displays}),
    { changeHome,getHome }
)(qrcode)