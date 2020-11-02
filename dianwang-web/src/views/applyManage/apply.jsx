import React, {Component} from "react"
import {withRouter} from 'react-router-dom'
import {Menu, Dropdown, Icon, Modal, Form, Button, Input, Divider,Steps , Descriptions} from 'antd';
import PropTypes from "prop-types"
import Contents from "../../components/content/content"
import Tables from "../../components/table/table"
import "./apply.scss"
import {formItemLayout, tailFormItemLayout} from "../../static/js/from";
import Search from "../../components/search/search"
import cookie from 'react-cookies';

const {confirm} = Modal;
const {TextArea} = Input;
const { Step } = Steps;
class applyLog extends Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
        applyRecord:PropTypes.object.isRequired,
        getApplyRecord:PropTypes.func.isRequired,
        getApplyDetail:PropTypes.func.isRequired,
        consentApply:PropTypes.func.isRequired,
        refuseApply:PropTypes.func.isRequired,
        applyDetail:PropTypes.object.isRequired,
        getAllParent:PropTypes.func.isRequired,
        allParent:PropTypes.array.isRequired,
        exportApplyRecord:PropTypes.func.isRequired,
    }
    state = {
        confirmDirty:false,
        visible:false,
        searchList:{},
        id:"",
        detail:"",
        apply:[],
        verifyStatus:"",
        activeName:"拒绝",
        method:"拒绝",
        description:"",
    };

    componentDidMount() {
       this.setState({verifyStatus:cookie.load("user").verifyStatus})
        this.props.getHome();
        this.props.getApplyRecord(1, 10);
        this.props.getAllParent();
    }
    handleSubmit = e => {
        let {id} = this.state;
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {

                const account = {
                    id:id,
                    refuseReason:item.description,
                }
                if (this.state.method === "拒绝") {
                    this.props.refuseApply(account)
                }
                this.setState({
                    visible:false,
                });
                this.props.form.resetFields();
            }
        });
    };
    handleCancel = e => {
        this.setState({
            visible:false,
        });
    };

    derived=()=> {
        cookie.save("fileName","资产申请记录");
        this.props.exportApplyRecord();
    }

    changePageSize = (pageNum, pageSize) => {
        const {searchList}=this.state;
        this.props.getAsset(pageNum, pageSize,searchList)
    }
    changePageNum = (pageNum, pageSize) => {
        const {searchList}=this.state;
        this.props.getAsset(pageNum, pageSize,searchList)
    }
    detail = id => {
        this.props.getApplyDetail(id);
        this.setState({
            visible:true,
            activeName:"申请详情",
        });
    }
    approval = id => {
        this.setState({id});
    }
    pass = () => {
        const {consentApply} = this.props;
        let {id} = this.state;
        confirm({
            title:'审批通过',
            content:'您确定要同意该资产审批?',
            okText:'确认',
            cancelText:'取消',
            onOk() {
                consentApply(id);
            },
            onCancel() {
            },
        });
    }

    refuse = () => {
        this.setState({
            visible:true,
            activeName:"拒绝",
        });
    }

    search=(value)=>{
        const {getApplyRecord}=this.props;
        this.setState({searchList:value})
        getApplyRecord(1,10,value)
    }
    clearSearch=()=>{
        this.setState({searchList:{}})
        const {getApplyRecord}=this.props;
        getApplyRecord(1,10);
    }

    render() {
        const {applyRecord,applyDetail,allParent} = this.props;
        var arr = Object.keys(applyDetail);
        const detail=arr.length===0?{}:applyDetail.applyRecord;
        const apply=arr.length===0?[]:applyDetail.verifyRecord;
        const {activeName, description,verifyStatus} = this.state;
        const {getFieldDecorator} = this.props.form;
        const menu = (
            <Menu>
                <Menu.Item>
                    <span onClick={this.pass}>通过</span>
                </Menu.Item>
                <Menu.Item>
                    <span onClick={this.refuse}>拒绝</span>
                </Menu.Item>
            </Menu>
        );

        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'资产分类',
                dataIndex:'parentName',
            },
            {
                title:'资产品类',
                dataIndex:'categoryName',
            },
            {
                title:'型号 ',
                dataIndex:'model',
            },
            {
                title:'申领人',
                dataIndex:'applicantName',
            },
            {
                title:'使用组织',
                render:(asset) => asset.organizationName + asset.departmentName
            },
            {
                title:'使用人 ',
                dataIndex:'user',
            },
            {
                title:'申领状态 ',
                width:110,
                render:(asset) => asset.refuse === 1 ?(<div className="status danger"><span className="refuse"></span><span> 已拒绝</span></div>): asset.status === 1 ?(
                    <div className="status"><span className="begin"></span><span> 待审批</span></div>) : asset.status === 2 ?(<div className="status"><span className="ongoing"></span><span> 审批中</span></div>)
                     :(<div className="status"><span className="end"></span><span> 已完成</span></div>)
            },
            {
                title:'申领时间 ',
                dataIndex:'applyTime',
            },
            {
                title:'操作 ',
                fixed:'right',
                width:150,
                render:(asset) => <span> <span className="primary"
                                               onClick={this.detail.bind(this, asset.id)}> 查看 </span> &nbsp;&nbsp;
                    <Dropdown overlay={menu}>
     <a className="ant-dropdown-link" style={{display:asset.verifyStatus+1===verifyStatus && asset.refuse===0 ? "inline-block" : "none"}}
        onClick={this.approval.bind(this, asset.id)}>
      审批 <Icon type="down"/>
    </a>
   </Dropdown></span>
            }];

        const applyStatus=[
            {
                name:"预审批",
                id:1,
            },
            {
                name:"审批中",
                id:2,
            },{
                name:"已完成",
                id:3,
            }
        ]

        const searchList = [
            {
                title:"资产分类",
                dataIndex:'parentId',
                type:"select",
                value:undefined,
                list:allParent
            },
            {
                title:"型号",
                dataIndex:'model',
                type:"string",
                value:""
            },
            {
                title:'申领人',
                dataIndex:'applicantName',
                type:"string",
                value:""
            },
            {
                title:'使用人',
                dataIndex:'user',
                type:"string",
                value:""
            },
            {
                title:'申领状态',
                dataIndex:'status',
                type:"select",
                value:undefined,
                list:applyStatus
            }
        ]
        return (
            <div>
                <Contents pagesTitle={{first:"申领管理", second:"申领列表"}}>
                    <div>
                     <Search search={this.search} searchList={searchList} clearSearch={this.clearSearch}></Search>
                      <span className="divider"><Divider dashed /> </span>
                    <Tables width={1200}  isExport derived={this.derived} data={applyRecord} columns={columns} changePageSize={this.changePageSize}
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
                        activeName === "申请详情" ? (
                            <div className="applyDetail">
                                <p className="applyContent">{detail.organizationName + detail.departmentName + "的" + detail.user + "申请使用" + detail.categoryName + "（" + detail.model + "）"}</p>
                                <p className={detail.refuse===1?"error":detail.verifyStatus===0 ? 'begin':detail.verifyStatus ===1 ? "ongoing" :"end"}></p>
                                <Divider/>
                                <div className="ant-steps ant-steps-vertical">
                                    {
                                        apply.map((c, index) => {
                                            if (c.verifyStatus ===1) {
                                                return (
                                                    <div key={index} className="ant-steps-item ant-steps-item-process ant-steps-item-disabled">
                                                        <div className="ant-steps-item-container">
                                                            <div className="ant-steps-item-tail"></div>
                                                            <div className="ant-steps-item-icon"><span className="ant-steps-icon" style={{fontSize:"12px"}}>初审</span></div>
                                                            <div className="ant-steps-item-content">
                                                                <div className="ant-steps-item-title" style={{width:"100%"}} >{c.operatorName+"("+c.operator+")"} {c.status ===1 ? (<span className="primary"> 同意</span>):(<span className="danger"> 拒绝</span>)}
                                                                    <div className="ant-steps-item-subtitle"  style={{float:"right"}}>{c.createTime}</div>
                                                                </div>
                                                                <div className="ant-steps-item-description">{c.refuseReason===""?"":"拒绝理由："+c.refuseReason}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            } else if (c.verifyStatus === 2) {
                                                return (
                                                    <div  key={index} className="ant-steps-item ant-steps-item-process ant-steps-item-disabled">
                                                        <div className="ant-steps-item-container">
                                                            <div className="ant-steps-item-tail"></div>
                                                            <div className="ant-steps-item-icon"><span className="ant-steps-icon" style={{fontSize:"12px"}}>二审</span></div>
                                                            <div className="ant-steps-item-content">
                                                                <div className="ant-steps-item-title" style={{width:"100%"}} >{c.operatorName+"("+c.operator+")"} {c.status ===1 ? (<span className="primary"> 同意</span>):(<span className="danger"> 拒绝</span>)}
                                                                    <div className="ant-steps-item-subtitle"  style={{float:"right"}}>{c.createTime}</div>
                                                                </div>
                                                                <div className="ant-steps-item-description">{c.refuseReason===""?"":"拒绝理由："+c.refuseReason}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div  key={index} className="ant-steps-item ant-steps-item-process ant-steps-item-disabled">
                                                        <div className="ant-steps-item-container">
                                                            <div className="ant-steps-item-tail"></div>
                                                            <div className="ant-steps-item-icon"><span className="ant-steps-icon" style={{fontSize:"12px"}}>终审</span></div>
                                                            <div className="ant-steps-item-content">
                                                                <div className="ant-steps-item-title" style={{width:"100%"}} >{c.operatorName+"("+c.operator+")"} {c.status ===1 ? (<span className="primary"> 同意</span>):(<span className="danger"> 拒绝</span>)}
                                                                    <div className="ant-steps-item-subtitle"  style={{float:"right"}}>{c.createTime}</div>
                                                                </div>
                                                                <div className="ant-steps-item-description">{c.refuseReason===""?"":"拒绝理由："+c.refuseReason}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                                <Descriptions className="applyMessage" title="资产详情" column={1}>
                                    <Descriptions.Item label="资产分类">{detail.parentName}</Descriptions.Item>
                                    <Descriptions.Item label="资产品类">{detail.categoryName}</Descriptions.Item>
                                    <Descriptions.Item label="型号">{detail.model}</Descriptions.Item>
                                    <Descriptions.Item label="品牌/厂家">{detail.factory}</Descriptions.Item>
                                </Descriptions>
                            </div>
                        ):(
                        <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="描述">
                        {getFieldDecorator('description', {
                            initialValue:description, rules:[
                                {
                                    required:true,
                                    message:'请输入拒绝理由!',
                                    whitespace:true
                                }],
                        })(<TextArea placeholder="请输入拒绝理由" autoSize={{minRows:3, maxRows:5}}/>)}
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

const applyManage = Form.create({name:'applyLog'})(applyLog);
export default withRouter(applyManage);