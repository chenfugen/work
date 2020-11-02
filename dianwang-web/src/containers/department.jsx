import {connect} from "react-redux"
import {getHome,getDepartments,createDepartment,getOrganization,delDepartment,editDepartment} from "../redux/actions"
import  department from "../views/organizeManage/department"

export default connect(
    state=>({departmentList:state.departmentList,organization:state.organization}),
    { getHome,getDepartments,createDepartment,getOrganization,delDepartment,editDepartment}
)(department)