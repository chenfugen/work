import React,{ Component } from "react"
import { withRouter } from 'react-router-dom'
import PropTypes from "prop-types"
import {Descriptions,Modal,List  } from 'antd'
import  Contents from "../../components/content/content"
class userInfo extends  Component{
    static propTypes={
        getRoleDetail: PropTypes.func.isRequired,
        role: PropTypes.object.isRequired,
        parent:PropTypes.object.isRequired,
        getParent:PropTypes.func.isRequired,
    }
    state={
        confirmDirty:false,
        visible:false,
        isPermission:false,
        permissions:[],
    }
    componentDidMount(){
        this.props.getHome();
        this.props.getParent(1,10);
        this.props.getRoleDetail(this.props.match.params.id);
    }
    handleCancel = e => {
        this.setState({
            isPermission:false,
        });
    };
    search = (item) => {
        const {parent} = this.props;
        const permission=JSON.parse(item);
        const permissions = [];
        for(let i=0;i<permission.length;i++){
            for(let j=0;j<parent.data.length;j++){
                if(parent.data[j].id===permission[i]){
                    permissions.push(parent.data[j])
                }
            }
        }
        this.setState({permissions:permissions, isPermission:true});
    }
    render() {
        const {role}=this.props;
        const {permissions}=this.state;
        return(
            <div>
                <Contents pagesTitle={{first:"系统管理",second:"角色管理",three:"账户详情",url:"#/authority"}} >
                    <div style={{margin:"20px"}}>
                        <Descriptions title="用户信息">
                            <Descriptions.Item label="角色名">{role.roleName}</Descriptions.Item>
                            <Descriptions.Item label="角色权限"><span style={{textDecoration:"underline", color:"#229794", cursor:"pointer"}}
                                                                 onClick={this.search.bind(this, role.permissions)}>权限查看 </span></Descriptions.Item>
                            <Descriptions.Item label="属性">{role.verifyLevel===1?"预审":role.verifyLevel===2?"二审":"终审"}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{role.createTime}</Descriptions.Item>
                            <Descriptions.Item label="更新时间">{role.updateTime===null?"--":role.updateTime}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </Contents>
                <Modal
                    title="权限列表"
                    visible={this.state.isPermission}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div>
                        <List
                            bordered
                            dataSource={permissions}
                            renderItem={item => <List.Item>{item.name}</List.Item>}
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}
export default withRouter(userInfo)