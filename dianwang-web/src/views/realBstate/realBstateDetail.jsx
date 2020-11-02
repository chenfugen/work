import React,{ Component } from "react"
import { withRouter } from 'react-router-dom'
import PropTypes from "prop-types"
import { Descriptions } from 'antd'
import  Contents from "../../components/content/content"
class userInfo extends  Component{
    static propTypes={
        getHome: PropTypes.func.isRequired,
        buildDetail: PropTypes.func.isRequired,
        build:PropTypes.object.isRequired,
    }
    componentDidMount(){
        this.props.getHome();
        this.props.buildDetail(this.props.match.params.id);
    }

    render() {
        const {build}=this.props;
        return(
            <div>
                <Contents pagesTitle={{first:"不动产管理",second:"不动产管理",three:"不动产详情",url:"#/realEstateManage"}} >
                    <div style={{margin:"20px"}}>
                        <Descriptions title="不动产信息">
                            <Descriptions.Item label="不动产名称">{build.name}</Descriptions.Item>
                            <Descriptions.Item label="楼号">{build.number}</Descriptions.Item>
                            <Descriptions.Item label="地面层高">{build.upstairs}</Descriptions.Item>
                            <Descriptions.Item label="地下层高">{build.downstairs}</Descriptions.Item>
                            <Descriptions.Item label="产权所属">{build.belongto}</Descriptions.Item>
                            <Descriptions.Item label="描述">{build.belongto}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{build.createTime}</Descriptions.Item>
                            <Descriptions.Item label="详细地址">{build.province}{build.city}{build.region}{build.address}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </Contents>
            </div>
        )
    }
}
export default withRouter(userInfo)