import React,{ Component } from "react"
import { withRouter } from 'react-router-dom'
import PropTypes from "prop-types"
import {Descriptions,Divider  } from 'antd'
import  Contents from "../../components/content/content"
class userInfo extends  Component{
    static propTypes={
        getHome: PropTypes.func.isRequired,
        getAssetDetail: PropTypes.func.isRequired,
        asset:PropTypes.object.isRequired,
    }
    state={
        asset:"" ,
        store:""
    }
    componentDidMount(){
        this.props.getHome();
        this.props.getAssetDetail(this.props.match.params.id);
    }

   componentWillReceiveProps(next){
        if(next.asset.asset!=undefined){
            this.setState({asset:next.asset.asset,store:next.asset.store})
        }
   }
    render() {
        const {asset,store}=this.state;
        return(
            <div>
                <Contents  pagesTitle={{first:"后勤资产管理",second:"资产管理",three:"资产详情",url:"#/assetManage"}} >
                    <div style={{margin:"20px"}}>
                        <Descriptions title="资产详情">
                            <Descriptions.Item label="资产分类">{asset.parentName}</Descriptions.Item>
                            <Descriptions.Item label="资产品类">{asset.categoryName}</Descriptions.Item>
                            <Descriptions.Item label="资产名录">{asset.model}</Descriptions.Item>
                            <Descriptions.Item label="资产编码">{asset.assetNum}</Descriptions.Item>
                            <Descriptions.Item label="品牌/厂家">{asset.factory}</Descriptions.Item>
                            <Descriptions.Item label="是否维修">{asset.repairStatus===0?(<span className="primary">否</span>):(<span className="danger">是</span>)}</Descriptions.Item>
                            <Descriptions.Item label="状态">{asset.status===0?(<span className="primary">在库</span>):asset.status===1?(<span className="primary">在用</span>):(<span className="danger">回收</span>)}</Descriptions.Item>
                            <Descriptions.Item label="单位">{asset.unit}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{asset.createTime}</Descriptions.Item>
                        </Descriptions>
                        <Divider />
                        <Descriptions title="使用情况">
                            <Descriptions.Item label="使用人">{asset.user===null?"--":asset.user}</Descriptions.Item>
                            <Descriptions.Item label="使用组织">{asset.organizationName===null?"--":asset.organizationName+asset.departmentName}</Descriptions.Item>
                            <Descriptions.Item label="所属空间">{asset.roomNum===null?"--":asset.roomNum}</Descriptions.Item>
                            <Descriptions.Item label="开始使用时间">{asset.useTime===null?"--":asset.useTime}</Descriptions.Item>
                         </Descriptions>
                        <Divider />
                        <Descriptions title="入库情况">
                            <Descriptions.Item label="操作员">{asset.operatorName===null?"--":asset.operatorName}</Descriptions.Item>
                            <Descriptions.Item label="所属组织">{store.organizationName+store.departmentName}</Descriptions.Item>
                            <Descriptions.Item label="入库位置">{store.buildingName+store.number}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </Contents>
            </div>
        )
    }
}
export default withRouter(userInfo)