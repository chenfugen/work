import React,{ Component } from "react"
import { withRouter } from 'react-router-dom'
import PropTypes from "prop-types"
import {Descriptions } from 'antd'
import  Contents from "../../components/content/content"
class userInfo extends  Component{
    static propTypes={
        getHome: PropTypes.func.isRequired,
        roomDetail: PropTypes.func.isRequired,
        room:PropTypes.object.isRequired,
    }
    componentDidMount(){
        this.props.getHome();
        this.props.roomDetail(this.props.match.params.id);
    }

    render() {
        const {room}=this.props;
        return(
            <div>
                <Contents  pagesTitle={{first:"不动产管理",second:"空间管理",three:"空间详情",url:"#/spaceManage"}} >
                    <div style={{margin:"20px"}}>
                        <Descriptions title="不动产空间详情">
                            <Descriptions.Item label="所属不动产">{room.buildingName}</Descriptions.Item>
                            <Descriptions.Item label="楼层">{room.floor}</Descriptions.Item>
                            <Descriptions.Item label="所属组织">{room.organizationName}</Descriptions.Item>
                            <Descriptions.Item label="楼号">{room.number}</Descriptions.Item>
                            <Descriptions.Item label="空间(平方)">{room.size}</Descriptions.Item>
                            <Descriptions.Item label="是否仓库">{room.store===1?"是":"否"}</Descriptions.Item>
                            <Descriptions.Item label="仓库名称">{room.description}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{room.createTime}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </Contents>
            </div>
        )
    }
}
export default withRouter(userInfo)