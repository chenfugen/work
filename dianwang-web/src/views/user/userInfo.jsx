import React,{ Component } from "react"
import { Descriptions  } from 'antd'
import { withRouter } from 'react-router-dom'
import PropTypes from "prop-types"
import  Contents from "../../components/content/content"
class userInfo extends  Component{
    static propTypes={
        getUser: PropTypes.func.isRequired,
        userInfo: PropTypes.object.isRequired,
        getHome: PropTypes.func.isRequired,
    }
    componentDidMount(){
        this.props.getHome();
        this.props.getUser();
    }
    render() {
        const {userInfo}=this.props;
        return(
            <div>
                <Contents pagesTitle={{first:"用户管理",second:"个人详情"}} >
                    <div style={{margin:"20px"}}>
                        <Descriptions title="用户信息">
                            <Descriptions.Item label="真实姓名">{userInfo.realName===null?"--":userInfo.realName}</Descriptions.Item>
                            <Descriptions.Item label="联系方式">{userInfo.userName}</Descriptions.Item>
                            <Descriptions.Item label="角色">{userInfo.roleName}</Descriptions.Item>
                            <Descriptions.Item label="属性">{userInfo.type===1?"管理员":"操作员"}</Descriptions.Item>
                            <Descriptions.Item label="所属组织">{userInfo.organizationName}{userInfo.departmentName}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{userInfo.createTime}</Descriptions.Item>
                        </Descriptions>
                    </div>

                </Contents>
            </div>
        )
    }
}
export default withRouter(userInfo)