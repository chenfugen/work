import React,{ Component } from "react"
import PropTypes from "prop-types"
import {Modal, Form, Input, Button, Select, InputNumber, Divider, Cascader, Table} from 'antd';
import Contents from "../../components/content/content"
import Search from "../../components/search/search"
import Tables from "../../components/table/table"
import {exportStore} from "../../redux/actions";
import cookie from "react-cookies";
const {TextArea} = Input;
const {confirm} = Modal;
const {Option} = Select;
class store extends  Component{
    static propTypes={
        getHome:PropTypes.func.isRequired,
        getStore:PropTypes.func.isRequired,
        stores:PropTypes.object.isRequired,
        getCompany:PropTypes.func.isRequired,
        companyList:PropTypes.array.isRequired,
        roomAsset:PropTypes.array.isRequired,
        getRoomAsset:PropTypes.func.isRequired,
        exportStore:PropTypes.func.isRequired,
        build:PropTypes.object.isRequired,
        getBuild:PropTypes.func.isRequired,
    }
    state = {
        confirmDirty:false,
        visible:false,
        id:"",
        activeName:"新增",
        method:"新增",
        searchList:{},
        display:"none",
        buildingId:"",
        organizationId:"",
        floor:0,
        rooomId:"",
        number:0,
        size:0,
        description:"",
        store:"",
        storeName:""
    }
    componentDidMount(){
        this.props.getStore(1,10);
        this.props.getHome();
        this.props.getCompany();
        this.props.getBuild(1, 100);
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {

                // if (this.state.method == "新增") {
                //     this.props.createRoom(account)
                // } else {
                //     account["id"] = this.state.id;
                //     this.props.editRoom(account)
                // }
                this.setState({
                    visible:false,
                    display:"none"
                });
                this.props.form.resetFields();
            }
        });
    };
    changePageSize = (pageNum, pageSize) => {
        const {searchList}=this.state;
        this.props.getStore(pageNum, pageSize,searchList)
    }
    changePageNum = (pageNum, pageSize) => {
        const {searchList}=this.state;
        this.props.getStore(pageNum, pageSize,searchList)
    }
    handleCancel = e => {
        this.setState({
            visible:false,
            isPermission:false,
        });
    };
    add = () => {
        this.setState({
            visible:true,
            activeName:"新增",
            method:"新增",
            buildingId:"",
            floor:0,
            number:0,
            size:0,
            description:"",
            store:"",
            storeName:""
        });
        this.props.form.resetFields();
    }
    handleSelectChange = value => {
        if (value === 1) {
            this.setState({display:"block"})
        } else {
            this.setState({display:"none"})
        }
    };
    delete = id => {
        //const {delAccount} = this.props;
        confirm({
            title:'删除',
            content:'您确定要删除该仓库吗?',
            okText:'确认',
            okType:'danger',
            cancelText:'取消',
            onOk() {
             ///   delAccount(id)
            },
            onCancel() {
            },
        });
    }
    searchAsset = (value) => {
        const {getRoomAsset}=this.props;
        getRoomAsset(1,100,value.id,1);
        this.setState({visible:true, activeName:"查看资产", detail:value,rooomId:value.id,buildingId:value.buildingId,store:value.store});
    }
    changeAssetPageSize = (pageNum, pageSize) => {
        const {getRoomAsset}=this.props;
        const {rooomId,store}=this.state;
        getRoomAsset(pageNum, pageSize,rooomId,store)
    }
    changeAssetPageNum = (pageNum, pageSize) => {
        const {getRoomAsset}=this.props;
        const {rooomId,store}=this.state;
        getRoomAsset(pageNum, pageSize,rooomId,store)
    }
    derived=()=>{
        cookie.save("fileName","仓库列表数据")
        this.props.exportStore();
    }
    search=(value)=>{
        const {getStore}=this.props;
        this.setState({searchList:value})
          getStore(1,10,value)
    }
    assetDetail=()=>{
        const {rooomId,buildingId,store} = this.state;
        this.props.history.push('/assetManage?buildingId='+buildingId +"&roomId="+rooomId+"-"+store);
    }
    clearSearch=()=>{
        this.setState({searchList:{}})
        const {getStore}=this.props;
        getStore(1,10);
    }
    render() {
        const { stores,companyList,roomAsset,build}=this.props;
        const buildList = build.total == undefined ? [] : build.data;
        const {activeName} = this.state;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'仓库名称 ',
                dataIndex:'storeName',
            },
            {
                title:'空间名称',
                dataIndex:'number',
            },
            {
                title:'楼层',
                dataIndex:'floor',
            },
            {
                title:'空间(㎡)',
                dataIndex:'size',
                render:(size)=>size===""?"--":size
            },
            {
                title:'所属不动产',
                dataIndex:'buildingName',
            },
            {
                title:'使用组织',
                dataIndex:'organizationName',
            },
            {
                title:'描述',
                dataIndex:'description',
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            },
            {
                title:'操作 ',
                render:(role) => <span><span className="primary" onClick={this.searchAsset.bind(this, role)}> 资产查看 </span>&nbsp;&nbsp; <span className="danger" onClick={this.delete.bind(this, role.id)}> 删除 </span></span>
            }];
        const searchList=[
            {
                title:"仓库名称",
                dataIndex:'storeName',
                type:"string",
                value:""
            },
            {
                title:"空间名称",
                dataIndex:'number',
                type:"string",
                value:""
            },
            {
                title:"所属不动产",
                dataIndex:'buildingName',
                type:"selectbBuild",
                value:undefined,
                list:buildList
            },
            {
                title:"使用组织",
                dataIndex:'organizationId',
                type:"select",
                value:[],
                list:companyList
            }
        ]
        //查询资产
        const assetsColumns = [
            {
                title:'资产编码 ',
                dataIndex:'assetNum',
            },
            {
                title:'资产名称 ',
                dataIndex:'model',
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            },
        ]
        return(
            <div>
                <Contents pagesTitle={{first:"不动产管理",second:"仓库管理"}} >
                    <div>
                        <Search search={this.search} searchList={searchList} clearSearch={this.clearSearch}></Search>
                        <span className="divider"> <Divider dashed /></span>
                        <Tables  isExport derived={this.derived} data={stores} columns={columns} changePageSize={this.changePageSize}
                                changePageNum={this.changePageNum}/>
                    </div>
                </Contents>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <div>
                        <span className="primary bottomLeft"  onClick={this.assetDetail}> 资产详情 </span>
                    </div>
                    <Table rowKey={row => row.key} columns={assetsColumns} dataSource={roomAsset} pagination={{pageSize:5}} />
                </Modal>
            </div>
        )
    }
}
const storeManage = Form.create({name:'store'})(store);
export default  storeManage