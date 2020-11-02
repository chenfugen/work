import {connect} from "react-redux"
import {getHome,getOrganization,createOrganization,delOrganization} from "../redux/actions"
import  organization from "../views/organizeManage/organization"

export default connect(
    state=>({organization:state.organization,delOrganization}),
    { getHome,getOrganization,createOrganization}
)(organization)