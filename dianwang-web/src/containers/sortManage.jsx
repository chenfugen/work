import {connect} from "react-redux"
import {getHome,getCategory,getAllParent,createCategory,exportCategory,editCategory} from "../redux/actions"
import  sortManage from "../views/assetConfigure/sortManage"

export default connect(
    state=>({category:state.category,allParent:state.allParent}),
    { getHome,getCategory,getAllParent,createCategory,exportCategory,editCategory}
)(sortManage)