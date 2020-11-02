import React,{ Component } from "react"
import { Descriptions  } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from "prop-types"
import  Contents from "../../components/content/content"
class userInfo extends  Component{
    static propTypes={
        getHome: PropTypes.func.isRequired,
        getAccountDetail: PropTypes.func.isRequired,
        account: PropTypes.object.isRequired,
    }
    componentDidMount(){
        this.props.getHome();
        this.props.getAccountDetail(this.props.match.params.id);
    }
    render() {
        const {account}=this.props;
        console.log(account)
        return(
            <div>
                <Contents pagesTitle={{first:"系统管理",second:"账户管理",three:"账户详情",url:"#/account"}} >
                    <div style={{margin:"20px"}}>
                        <Descriptions title="用户信息">
                            <Descriptions.Item label="真实姓名">{account.realName===null?"--":account.realName}</Descriptions.Item>
                            <Descriptions.Item label="用户名">{account.userName}</Descriptions.Item>
                            <Descriptions.Item label="角色名">{account.roleName}</Descriptions.Item>
                            <Descriptions.Item label="属性">{account.type===1?"管理员":"操作员"}</Descriptions.Item>
                            <Descriptions.Item label="是否登录">{account.manageLogin===1?"是":"否"}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{account.createTime}</Descriptions.Item>

                        </Descriptions>
                    </div>
                </Contents>
            </div>
        )
    }
}
export default withRouter(userInfo)