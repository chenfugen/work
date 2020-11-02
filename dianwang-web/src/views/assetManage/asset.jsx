import React, {Component} from "react"
import PropTypes from "prop-types"
import {withRouter} from 'react-router-dom'
import {Modal, Form, Button, Select, InputNumber, Cascader, message, Input, Descriptions, Divider} from 'antd';
import Contents from "../../components/content/content"
import Tables from "../../components/table/table"
import {formItemLayout, tailFormItemLayout} from "../../static/js/from"
import cookie from 'react-cookies';
import Search from "../../components/search/search"
import "./asset.scss"

const {confirm} = Modal;
const {Option} = Select;

class asset extends Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
        getAsset:PropTypes.func.isRequired,
        asset:PropTypes.object.isRequired,
        recycleAsset:PropTypes.func.isRequired,
        createAsset:PropTypes.func.isRequired,
        directory:PropTypes.object.isRequired,
        getDirectory:PropTypes.func.isRequired,
        getCategory:PropTypes.func.isRequired,
        category:PropTypes.object.isRequired,
        getParent:PropTypes.func.isRequired,
        parent:PropTypes.object.isRequired,
        exportAsset:PropTypes.func.isRequired,
        getRoom:PropTypes.func.isRequired,
        room:PropTypes.object.isRequired,
        getBuild:PropTypes.func.isRequired,
        build:PropTypes.object.isRequired,
    }
    state = {
        confirmDirty:false,
        visible:false,
        activeName:"新增",
        method:"新增",
        searchList:{},
        attribute:[],
        categoryList:[],
        buildList:[],
        asssetList:[],
        categoryId:"",
        assetDirectoryId:"",
        nums:1,
        isAdd:true,
    }

    componentDidMount() {
        if(this.props.location.search===""){
            this.props.getAsset(1, 10);

        }else {
            let searchList={};
            const query = this.props.location.search ;
            const arr = query.split('&')
            if(arr.length>1){
                searchList[ arr[0].split("?")[1].split("=")[0]]=arr[0].split("?")[1].split("=")[1];
                if(arr[1].split("=")[0]==="roomId"){
                    searchList[arr[1].split("=")[0]]=arr[1].split("=")[1].split("-")[0];
                    searchList["store"]=Number(arr[1].split("=")[1].split("-")[1]);
                }else{
                    searchList[arr[1].split("=")[0]]=arr[1].split("=")[1];
                }
            }else{
                if(query.split("?")[1].split("=")[0]==="model"){
                    searchList[query.split("?")[1].split("=")[0]]=decodeURIComponent(query.split("?")[1].split("=")[1]);
                }else{
                    searchList[query.split("?")[1].split("=")[0]]=query.split("?")[1].split("=")[1];
                }
            }
        console.log(searchList)
            this.setState({searchList});
            this.props.getAsset(1,10,searchList)
        }
        this.props.getParent(1,10);
        this.props.getCategory(1, 100);
        this.props.getDirectory(1, 100);
        this.props.getHome();
        this.props.getRoom(1,100);
        this.props.getBuild(1,100);
    }
    componentWillReceiveProps(next) {
        if (next.category.list !== undefined && next.directory.data !== undefined) {
            const categoryList = [];
            const category = next.category.list;
            const parent = next.parent.data;
            for (let i in parent) {
                categoryList[i] = {
                    label:parent[i].name,
                    value:parent[i].id,
                    children:[
                        {
                            label:"全部",
                            value:"",
                        }
                    ]
                };
                for (let j in category) {
                    if (parent[i].id === category[j].parentId) {
                        categoryList[i]["children"].push({
                            label:category[j].categoryName,
                            value:category[j].categoryId,
                        });
                    }
                }
            }
            this.setState({categoryList})
        }
        if (next.room.data !== undefined && next.build.data !== undefined) {
            const buildList = [];
            const build = next.build.data;
            const room = next.room.data;
            for (let i in build) {
                buildList[i] = {
                    label:build[i].name,
                    value:build[i].id,
                    children:[
                        {
                            label:"全部",
                            value:"",
                        }
                    ]
                };
                for (let j in room) {
                    if (build[i].id === room[j].buildingId) {
                        buildList[i]["children"].push({
                            label:room[j].number,
                            value:room[j].id+"-"+room[j].store,
                        });
                    }
                }
            }
            this.setState({buildList})
        }
    }

    changePageSize = (pageNum, pageSize) => {
        const {searchList}=this.state;
        this.props.getAsset(pageNum, pageSize,searchList)
    }
    changePageNum = (pageNum, pageSize) => {
        const {searchList}=this.state;
        this.props.getAsset(pageNum, pageSize,searchList)
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {
                if (this.state.isAdd) {
                    const account = {
                        categoryId:item.asssetList[0],
                        assetDirectoryId:item.asssetList[1],
                        nums:item.nums,
                        assetAttribute:""
                    }
                    this.props.createAsset(account);
                } else {
                    message.error("请选择具体设备的资产");
                }
                this.setState({
                    visible:false,
                    display:"none"
                });
                this.props.form.resetFields();
            }
        });
    };

    add = () => {
        this.setState({
            visible:true,
            activeName:"新增",
            method:"新增",
            categoryId:"",
            assetDirectoryId:"",
            nums:""
        });
        this.props.form.resetFields();
    }
    handleCancel = e => {
        this.setState({
            visible:false,
        });
    };
    detail = id => {
        this.props.history.push('/assetDetail/' + id);
    }
    recycle = id => {
        const {recycleAsset} = this.props;
        confirm({
            title:'资产回收',
            content:'您确定要回收该资产吗?',
            okText:'回收',
            cancelText:'取消',
            onOk() {
                recycleAsset(id);
            },
            onCancel() {
            },
        });
    }
    selectCategory = value => {
        if (value.length == 1) {
            message.error("请选择具体设备的资产");
            this.setState({isAdd:false});
        } else {
            this.setState({isAdd:true});
        }
    }
    derived = () => {
        cookie.save("fileName","资产列表数据");
        this.props.exportAsset();
    }
    search=(value)=>{
        const {getAsset}=this.props;
       let searchList={
           factory:value.factory,
           model: value.model,
           parentId:value.parentId===undefined?"":value.parentId[0],
           categoryId:value.parentId===undefined?"":value.parentId[1],
           repairStatus: value.repairStatus,
           assetNum: value.assetNum,
           status: value.status,
           buildingId:value.build===undefined?"":value.build[0],
           roomId:value.build===undefined?"":value.build[1].split("-")[0],
           store:value.build===undefined?"":value.build[1].split("-")[1],
       }
        this.setState({searchList});
         getAsset(1,10,searchList);
    }
    clearSearch=()=>{
        this.setState({searchList:{}})
        const {getAsset}=this.props;
        getAsset(1,10);
    }
    searchAttribute=(value)=>{
        const attribute=JSON.parse(value);
        this.setState({attribute:attribute, visible:true,activeName:"查看属性"});
    }
    render() {
        const {asset} = this.props;
        const {activeName, asssetList, nums,categoryList,attribute,searchList,buildList} = this.state;
        const assetClass=searchList.parentId===undefined && searchList.categoryId===undefined?undefined:[searchList.parentId,searchList.categoryId];
        const buildClass=searchList.buildingId===undefined && searchList.roomId===undefined?undefined:[searchList.buildingId,searchList.roomId+"-"+searchList.store];
        const model=searchList.model===undefined?"":searchList.model;
        const {getFieldDecorator} = this.props.form;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
                fixed:'left',
            },
            {
                title:'资产分类',
                width:150,
                dataIndex:'parentName',
                fixed:'left',
            },
            {
                title:'资产品类',
                dataIndex:'categoryName',
            },
            {
                title:'资产名录 ',
                dataIndex:'model',
            },
            {
                title:'资产编码 ',
                dataIndex:'assetNum',
                width:150
            },
            {
                title:'品牌/厂家',
                dataIndex:'factory',
            },
            {
                title:'属性 ',
                dataIndex:'attribute',
                render:(attribute) =>attribute===null||attribute===""?"--":JSON.parse(attribute).length===0?"--":(<span style={{textDecoration:"underline", color:"#229794", cursor:"pointer"}}
                                                                 onClick={this.searchAttribute.bind(this, attribute)}>查看 </span>)
            },
            {
                title:'所属不动产 ',
                dataIndex:'storeBuildingName',
                render:(storeBuildingName) =>storeBuildingName===null?"--":storeBuildingName
            },
            {
                title:'房间号 ',
                render:(asset) =>asset.status===0?asset.storeRoomNum:asset.roomNum
            },
            {
                title:'状态 ',
                dataIndex:'status',
                render:(status) => status == 0 ? (
                    <div className="assetStatus"><span className="stock"></span><span> 在库</span></div>) : status == 1 ? (
                    <div className="assetStatus"><span className="user"></span><span> 在用</span></div>) : (
                    <div className="assetStatus"><span className="recycle"></span><span> 回收</span></div>)
            },
            {
                title:'是否维修',
                dataIndex:'repairStatus',
                render:(repairStatus) => repairStatus == 0 ? (
                    <div className="repairStatus"><span className="false"></span><span> 否</span></div>) : (
                    <div className="repairStatus"><span className="true"></span><span> 是</span></div>)
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            },
            {
                title:'操作 ',
                fixed:'right',
                width:150,
                render:(asset) => <span> <span className="primary"
                                               onClick={this.detail.bind(this, asset.id)}> 详情 </span> &nbsp;&nbsp;<span
                    className="primary" style={{display:asset.status === 1 ?"inline-block": "none" }}
                    onClick={this.recycle.bind(this, asset.id)}>  回收  &nbsp;&nbsp;  </span>
                 </span>
                // <span className="danger" onClick={this.delete.bind(this, asset.id)}> 删除 </span>
            }];
        const status=[
            {
                name:"在库",
                id:0,
            },
            {
                name:"在用",
                id:1,
            },{
                name:"回收",
                id:2,
            }
        ]
        const repairStatus=[
            {
                name:"是",
                id:1,
            },
            {
                name:"否",
                id:0,
            }
        ]
        const searchs = [
            {
                title:"资产分类",
                dataIndex:'parentId',
                type:"cascader",
                value:assetClass,
                list:categoryList
            },
            {
                title:"资产名录",
                dataIndex:'model',
                type:"string",
                value:model
            },
            {
                title:"资产编码",
                dataIndex:'assetNum',
                type:"string",
                value:""
            },
            {
                title:"品牌/厂家",
                dataIndex:'factory',
                type:"string",
                value:""
            },
            {
                title:'状态 ',
                dataIndex:'status',
                type:"select",
                value:undefined,
                list:status
            },
            {
                title:'是否维修 ',
                dataIndex:'repairStatus',
                type:"select",
                value:undefined,
                list:repairStatus
            },
            {
                title:'所属不动产 ',
                dataIndex:'build',
                type:"cascader",
                value:buildClass,
                list:buildList,
            }
        ]

        return (
            <div>
                <Contents pagesTitle={{first:"资产管理", second:"资产列表"}}>
                    <div>
                        <Search search={this.search} searchList={searchs} clearSearch={this.clearSearch}></Search>
                        <span className="divider"> <Divider dashed /></span>
                        <Tables width={1100}  isAdd isExport derived={this.derived} add={this.add} data={asset}  columns={columns} changePageSize={this.changePageSize}
                                changePageNum={this.changePageNum}/>
                    </div>
                </Contents>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    {
                        activeName==="新增"?(
                            <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                                <Form.Item label="所属资产">
                                    {getFieldDecorator('asssetList', {
                                        initialValue:asssetList,
                                        rules:[
                                            {type:'array', required:true, message:'请选择详所属资产!'},
                                        ],

                                    })(<Cascader options={categoryList} onChange={this.selectCategory} placeholder="所属资产"/>)}
                                </Form.Item>
                                <Form.Item label="数量">
                                    {getFieldDecorator('nums', {initialValue:nums, rules:[
                                    {required:true, message:'请输入'},
                                        ],})(<InputNumber min={1} max={1000}/>)}
                                </Form.Item>
                                {/*{*/}
                                {/*assetAttribute.map((c, index) =>*/}
                                {/*<Form.Item label={c.title}>*/}
                                {/*{getFieldDecorator(c.value, {*/}
                                {/*initialValue:c.value,*/}
                                {/*rules:[*/}
                                {/*{*/}
                                {/*required:true,*/}
                                {/*message:'请输入对应属性!',*/}
                                {/*whitespace:true*/}
                                {/*}],*/}
                                {/*})(<Input/>)}*/}
                                {/*</Form.Item>*/}
                                {/*)*/}
                                {/*}*/}
                                <Form.Item  {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit">
                                        确认
                                    </Button>
                                </Form.Item>
                            </Form>
                        ):(
                            <div>
                                {
                                    attribute.map((item,index)=>{
                                        return(
                                            <Descriptions key={index} column={1}>
                                                <Descriptions.Item label={item.title}>{item.value}</Descriptions.Item>
                                            </Descriptions>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                </Modal>
            </div>
        )
    }
}

const assetManage = Form.create({name:'asset'})(asset);
export default withRouter(assetManage)