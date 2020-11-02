import React,{ Component } from "react"
import PropTypes from "prop-types"
import {Modal, Form, Input, Button} from 'antd';
import Contents from "../../components/content/content"
import Tables from "../../components/table/table"
import {formItemLayout,tailFormItemLayout }from "../../static/js/from"
import cookie from "react-cookies";
import department from "../organizeManage/department";
const {confirm} = Modal;

class parent extends  Component{
    static propTypes={
        getHome:PropTypes.func.isRequired,
        getParent:PropTypes.func.isRequired,
        parent:PropTypes.object.isRequired,
        createParent:PropTypes.func.isRequired,
        editParent:PropTypes.func.isRequired,
        exportParent:PropTypes.func.isRequired,
    }
    state={
        confirmDirty:false,
        visible:false,
        id:"",
        activeName:"新增",
        method:"新增",
        name:""
    }
    componentDidMount(){
        this.props.getParent(1,10);
        this.props.getHome();
    }
    changePageSize = (pageNum, pageSize) => {
        this.props.getParent(pageNum, pageSize)
    }
    changePageNum = (pageNum, pageSize) => {
        this.props.getParent(pageNum, pageSize)
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {
                if (this.state.method == "新增") {
                    this.props.createParent(item.name)
                }else{
                    const account = {
                        id:this.state.id,
                        name:item.name,
                    }
                    this.props.editParent(account)
                }
                this.setState({
                    visible:false,
                });
                this.props.form.resetFields();
            }
        });
    };
    add=()=>{
        this.setState({
            visible:true,
        });
    }
    handleCancel = e => {
        this.setState({
            visible:false,
        });
    };
    detail= id => {
        console.log(id);
    }
    edit= asset => {
        this.setState({
            visible:true,
            activeName:"编辑",
            method:"编辑",
            id:asset.id,
            name:asset.name,
        });
    }

    delete = id => {
        const {delAccount} = this.props;
        confirm({
            title:'删除',
            content:'您确定要删除该账户吗?',
            okText:'确认',
            okType:'danger',
            cancelText:'取消',
            onOk() {
                delAccount(id)
            },
            onCancel() {
            },
        });
    }
    derived=()=>{
        cookie.save("fileName","资产分类列表");
       this.props.exportParent();
    }
    render() {
        const {parent}=this.props;
        const {activeName,name}=this.state;
        const {getFieldDecorator} = this.props.form;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'资产分类',
                dataIndex:'name',
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            },
            {
                title:'操作 ',
                render:(asset) => <span> <span className="primary" onClick={this.edit.bind(this, asset)}> 编辑 </span> </span>
        //             &nbsp;&nbsp;
        // <span className="danger" onClick={this.delete.bind(this, asset.id)}> 删除 </span>
            }
        ];
        return(
            <div>
                <Contents pagesTitle={{first:"后勤资产管理",second:"分类管理"}} >
                    <Tables  isAdd isExport derived={this.derived} add={this.add} data={parent} columns={columns} changePageSize={this.changePageSize}
                            changePageNum={this.changePageNum}/>
                </Contents>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="资产分类（大类）">
                            {getFieldDecorator('name', {
                                initialValue:name,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入资产分类（大类）!',
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
                </Modal>
            </div>
        )
    }
}
const classifyManage = Form.create({name:'parent'})(parent);
export default  classifyManage