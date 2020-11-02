import React, {Component} from "react"
import {Modal, Form, Input, Button, Select, InputNumber, Cascader, Table, Divider, message} from 'antd';
import PropTypes from "prop-types"
import Contents from "../../components/content/content"
import Tables from "../../components/table/table"
import {formItemLayout, tailFormItemLayout} from "../../static/js/from";
import Search from "../../components/search/search"
import "./realBstate.scss"
import cookie from "react-cookies";

const {TextArea} = Input;
const {confirm} = Modal;
const {Option} = Select;

class room extends Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
        room:PropTypes.object.isRequired,
        getRoom:PropTypes.func.isRequired,
        createRoom:PropTypes.func.isRequired,
        delRoom:PropTypes.func.isRequired,
        getCompany:PropTypes.func.isRequired,
        getBuild:PropTypes.func.isRequired,
        build:PropTypes.object.isRequired,
        department:PropTypes.array.isRequired,
        changeDepartment:PropTypes.func.isRequired,
        roomAsset:PropTypes.array.isRequired,
        getRoomAsset:PropTypes.func.isRequired,
        exportRoom:PropTypes.func.isRequired,
    }
    state = {
        confirmDirty:false,
        visible:false,
        id:"",
        activeName:"新增",
        method:"新增",
        searchList:{},
        detail:{},
        display:"none",
        buildingId:undefined,
        departmentId:"",
        changeDepartmentId:"",
        rooomId:"",
        organization:"",
        departmentList:"",
        floor:0,
        number:0,
        size:"0",
        description:"",
        store:0,
        storeName:""
    }

    componentDidMount() {
        this.props.getHome();
        this.props.getRoom(1, 10);
        this.props.getCompany();
        this.props.getBuild(1, 100);
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {
                const account = {
                    verifyLevel:item.verifyLevel,
                    buildingId:item.buildingId,
                    organizationId:item.organization[0],
                    departmentId:item.organization[1],
                    floor:item.floor,
                    number:item.number,
                    size:item.size,
                    description:item.description,
                    store:item.store,
                    storeName:item.storeName
                }
                if (this.state.method == "新增") {
                    this.props.createRoom(account)
                }
                this.setState({
                    visible:false,
                    display:"none"
                });
                this.props.form.resetFields();
            }
        });
    };
    changeDepartment = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {
                const {changeDepartmentId} = this.state;
                const account = {
                    departmentId:item.departmentId,
                    id:changeDepartmentId
                }
                this.props.changeDepartment(account);
                this.setState({
                    visible:false,
                    display:"none"
                });
                this.props.form.resetFields();
            }
        });
    };
    delete = (id) => {
        const {delRoom} = this.props;
        confirm({
            title:'删除',
            content:'您确定要删除该不动产空间吗?',
            okText:'确认',
            okType:'danger',
            cancelText:'取消',
            onOk() {
                delRoom(id)
            },
            onCancel() {
            },
        });
    }
    changePageSize = (pageNum, pageSize) => {
        const {searchList}=this.state;
        this.props.getRoom(pageNum, pageSize,searchList)
    }
    changePageNum = (pageNum, pageSize) => {
        const {searchList}=this.state;
        this.props.getRoom(pageNum, pageSize,searchList)
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
    handleCancel = e => {
        this.setState({
            visible:false,
        });
    };
    add = () => {
        this.setState({
            visible:true,
            activeName:"新增",
            method:"新增",
            buildingId:undefined,
            organizationId:"",
            floor:0,
            number:"",
            size:0,
            description:"",
            store:0,
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
    detail = (id) => {
        this.props.history.push('/spaceDetail/' + id);
    }
    derived = () => {
        cookie.save("fileName","空间列表数据")
        this.props.exportRoom();
    }
    merge=(selectedRows)=>{
        message.info("抱歉，正在开发中。。。");
    }
    search=(value)=>{
        const {getRoom}=this.props;
        let searchList={
            number:value.number,
            buildingName:value.buildingName,
            organizationId:value.organization[0],
            departmentId:value.organization[1],
        }
        this.setState({searchList})
        getRoom(1,10,searchList)
    }
    clearSearch=()=>{
        this.setState({searchList:{}})
        const {getRoom}=this.props;
        getRoom(1,10);
    }


    searchAsset = (value) => {
        const {getRoomAsset}=this.props;
        getRoomAsset(1,100,value.id,value.store);
        this.setState({visible:true, activeName:"查看资产", detail:value,rooomId:value.id,buildingId:value.buildingId,store:value.store});
    }
    assetDetail=()=>{
        const {rooomId,buildingId,store} = this.state;
        this.props.history.push('/assetManage?buildingId='+buildingId +"&roomId="+rooomId+"-"+store);
    }
    allocation = (asset) => {
        let list = [];
        const {department} = this.props;
        department.map((item, index) => {
            if (item.value === asset.organizationId) {
                list = item.children;
            }
        })
        this.setState({
            visible:true,
            activeName:"分配部门",
            organizationId:asset.organizationId,
            changeDepartmentId:asset.id,
            departmentList:list
        });
    }

    render() {
        const {room, companyList, build, department,roomAsset} = this.props;
        const buildList = build.total == undefined ? [] : build.data;
        const {activeName, display, buildingId, departmentId, organization, floor, number, size, description, store, storeName, detail, departmentList} = this.state;
        const {getFieldDecorator} = this.props.form;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'空间名称',
                dataIndex:'number',
            },
            {
                title:'楼层（层）',
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
                render:(asset) => asset.organizationName + asset.departmentName

            },
            {
                title:'是否分配部门',
                render:(asset) => asset.departmentId === null ? (
                    <span style={{textDecoration:"underline", color:"#229794", cursor:"pointer"}}
                          onClick={this.allocation.bind(this, asset)}>分配</span>) : ("是")
            },
            {
                title:'是否仓库 ',
                dataIndex:'store',
                render:(store) => store == 0 ? (
                    <div className="store"><span className="false"></span><span> 否</span></div>) : (
                    <div className="store"><span className="true"></span><span> 是</span></div>)
            },
            {
                title:'仓库名称 ',
                dataIndex:'storeName',
                render:(storeName) => storeName ==null ? "--" : storeName
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            },
            {
                title:'操作 ',
                fixed:'right',
                width:200,
                render:(role) => <span><span className="primary"
                                             onClick={this.searchAsset.bind(this, role)}> 资产查看 </span>&nbsp;&nbsp;<span
                    className="primary" onClick={this.detail.bind(this, role.id)}> 详情 </span>&nbsp;&nbsp; <span
                    className="danger" onClick={this.delete.bind(this, role.id)}> 删除 </span></span>
            }];

        //搜索条件
        const searchList = [
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
                title:"所属组织",
                dataIndex:'organization',
                type:"organization",
                value:[]
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
                title:'使用人 ',
                dataIndex:'user',
                render:(user) => user==="" || user===null?"--":user
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            },
        ]
        return (
            <div>
                <Contents pagesTitle={{first:"不动产管理", second:"空间管理"}} >
                    <div>
                        <Search search={this.search} searchList={searchList} department={department} clearSearch={this.clearSearch}></Search>
                        <span className="divider"> <Divider dashed /></span>
                        <Tables  isAdd isExport isMerge merge={this.merge} derived={this.derived} add={this.add} data={room} columns={columns} changePageSize={this.changePageSize}
                                changePageNum={this.changePageNum}/>
                    </div>
                </Contents>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                    width={600}
                >
                    {
                        activeName === "新增" ? (
                            <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                                <Form.Item label="所属不动产">
                                    {getFieldDecorator('buildingId', {
                                        initialValue:buildingId,
                                        rules:[{required:true, message:'请选择所属不动产!'}],
                                    })(
                                        <Select
                                            placeholder="请选择所属不动产"
                                        >
                                            {
                                                buildList.map((c, index) => <Option value={c.id}
                                                                                    key={index}>{c.name}{c.number}幢</Option>)
                                            }
                                        </Select >,
                                    )}
                                </Form.Item>
                                <Form.Item label="所属组织">
                                    {getFieldDecorator('organization', {
                                        initialValue:organization,
                                        rules:[
                                            {type:'array', required:true, message:'请选择你的单位!'},
                                        ],
                                    })(<Cascader options={department} changeOnSelect />)}
                                </Form.Item>
                                <Form.Item label="使用楼层">
                                    {getFieldDecorator('floor', {
                                        initialValue:floor, rules:[
                                            {required:true, message:'请输入'},
                                        ],
                                    })(<InputNumber min={1} max={10}/>)}
                                </Form.Item>
                                <Form.Item label="房间号" extra="格式示例:501、505~506（区间）、501,501,503(批量)">
                                    {getFieldDecorator('number', {
                                        initialValue:number,
                                        rules:[
                                            {
                                                required:true,
                                                message:'请输入房间号!',
                                                whitespace:true
                                            }],
                                    })(<TextArea placeholder="请输入"/>)}
                                </Form.Item>
                                <Form.Item label="空间(平方)">
                                    {getFieldDecorator('size', {
                                        initialValue:size, rules:[
                                            {required:true, message:'请输入'},
                                        ],
                                    })(<Input placeholder="请输入房间号"/>)}
                                </Form.Item>
                                <Form.Item label="描述">
                                    {getFieldDecorator('description', {
                                        initialValue:description, rules:[
                                            {
                                                required:true,
                                                message:'请输入描述!',
                                                whitespace:true
                                            }],
                                    })(<TextArea placeholder="请输入描述" />)}
                                </Form.Item>
                                <Form.Item label="是否仓库">
                                    {getFieldDecorator('store', {
                                        initialValue:store,
                                        rules:[{required:true, message:'请选择是否做仓库!'}],
                                    })(
                                        <Select
                                            placeholder="请选择是否做仓库"
                                            onChange={this.handleSelectChange}
                                        >
                                            <Option value={1}>是</Option>
                                            <Option value={0}>否</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item style={{display}} label="仓库名称">
                                    {getFieldDecorator('storeName', {
                                        initialValue:storeName,
                                        rules:[
                                            {
                                                required:false,
                                                message:'请输入仓库名称!',
                                                whitespace:true
                                            }],
                                    })(<Input/>)}
                                </Form.Item>
                                <Form.Item  {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit">
                                        确认
                                    </Button>
                                </Form.Item>
                            </Form>
                        ) : activeName === "查看资产" ? (
                            <div>
                                <span className="primary bottomLeft"  onClick={this.assetDetail}> 资产详情 </span>
                                <Table rowKey={row=>row.key} columns={assetsColumns} pagination={{pageSize:5}}  dataSource={roomAsset} />
                            </div>
                        ) : (
                            <Form   {...formItemLayout} onSubmit={this.changeDepartment}>
                                <Form.Item label="部门名称">
                                    {getFieldDecorator('departmentId', {
                                        initialValue:departmentId,
                                        rules:[{required:true, message:'请选择分配部门!'}],
                                    })(
                                        <Select
                                            placeholder="请选择是否做仓库"
                                        >
                                            {
                                                departmentList.map((c, index) => <Option value={c.value}
                                                                                         key={index}>{c.label}</Option>)
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item  {...tailFormItemLayout}>
                                    <Button type="primary" htmlType="submit">
                                        确认
                                    </Button>
                                </Form.Item>
                            </Form>
                        )
                    }
                </Modal>
            </div>
        )
    }
}

const spaceManage = Form.create({name:'room'})(room);

export default spaceManage