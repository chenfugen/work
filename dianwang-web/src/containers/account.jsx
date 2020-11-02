import {connect} from "react-redux"
import {getHome,getAccount,createAccount,delAccount,editAccount,getCompany,exportAdmin} from "../redux/actions"
import  account from "../views/systemManage/account"

export default connect(
    state=>({account:state.account,companyList:state.companyList,department:state.department}),
    { getHome,getAccount,createAccount,delAccount,editAccount,getCompany,exportAdmin}
)(account)