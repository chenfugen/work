import React,{ Component } from "react"
import PropTypes from "prop-types"
import  Contents from "../../components/content/content"
import {Modal, Form, Input, Button,Select} from 'antd';
import {formItemLayout, tailFormItemLayout} from "../../static/js/from"
import  Tables from "../../components/table/table"
import {editDepartment} from "../../redux/actions";
const {confirm} = Modal;
const {Option} = Select;
class departmentList extends  Component{
    static propTypes={
        getHome:PropTypes.func.isRequired,
        getDepartments:PropTypes.func.isRequired,
        departmentList:PropTypes.object.isRequired,
        createDepartment:PropTypes.func.isRequired,
        organization:PropTypes.object.isRequired,
        getOrganization:PropTypes.func.isRequired,
        delDepartment:PropTypes.func.isRequired,
        editDepartment:PropTypes.func.isRequired,
    }
    state = {
        confirmDirty:false,
        visible:false,
        activeName:"新增",
        method:"新增",
        id:"",
        name:"",
        organizationId:"",
        departmentUserName:"",
    }
    componentDidMount(){
        this.props.getHome();
        this.props.getDepartments(1,10);
        this.props.getOrganization(1,100);
    }
    changePageSize = (pageNum, pageSize) => {
        this.props.getDepartments(pageNum, pageSize)
    }
    changePageNum = (pageNum, pageSize) => {
        this.props.getDepartments(pageNum, pageSize)
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {
                const account = {
                    organizationId:item.organizationId,
                    username:item.username,
                    name:item.name,
                }
                if (this.state.method === "新增") {
                    this.props.createDepartment(account)
                } else {
                    if(this.state.name!==item.name){
                        account["name"] =item.name;
                    }
                    account["id"] = this.state.id;
                    this.props.editDepartment(account)
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
    add=()=>{
        this.setState({
            visible:true,
            activeName:"新增",
            method:"新增",
            name:"",
            organizationId:"",
            departmentUserName:"",
        });
    }
    delete = id => {
        const {delDepartment} = this.props;
        confirm({
            title:'删除',
            content:'您确定要删除该组织部门吗?',
            okText:'确认',
            okType:'danger',
            cancelText:'取消',
            onOk() {
               delDepartment(id)
            },
            onCancel() {
            },
        });
    }
    edit=(department)=>{
        this.setState({
            visible:true,
            activeName:"编辑",
            method:"编辑",
            id:department.departmentId,
            name:department.departmentName,
            organizationId:[department.organizationId],
            username:department.departmentUserName,
        });
    }
    derived=()=>{
        console.log(2)
    }
    render() {
        const {departmentList,organization}=this.props;
        var arr = Object.keys(organization);
        const list = arr.length == 0 ? [] : organization.data === undefined ? organization.list : organization.data;
        const {activeName,name,organizationId,username} = this.state;
        const {getFieldDecorator} = this.props.form;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'所属单位',
                dataIndex:'organizationName',
            },
            {
                title:'部门名称',
                dataIndex:'departmentName',
            },
            {
                title:'负责人',
                dataIndex:'departmentUserName',
                render:(departmentUserName)=>departmentUserName===null?"--":departmentUserName
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            },
            {
                title:'操作 ',
                width:150,
                render:(department) => <span><span className="primary" onClick={this.edit.bind(this, department)}> 编辑 </span>&nbsp;&nbsp;<span className="danger" onClick={this.delete.bind(this, department.departmentId)}> 删除 </span></span>
            }];
        return(
            <div>
                <Contents pagesTitle={{first:"组织管理",second:"部门管理"}}>
                    <Tables isAdd isExport derived={this.derived} add={this.add}  data={departmentList} columns={columns} changePageSize={this.changePageSize}
                            changePageNum={this.changePageNum}/>
                </Contents>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="所属单位">
                            {getFieldDecorator('organizationId', {
                                initialValue:organizationId,
                                rules:[{required:true, message:'请选择所属单位!'}],
                            })(
                                <Select
                                    placeholder="请选择所属单位"
                                >
                                    {
                                        list.map((c, index) => <Option value={c.id} key={index}>{c.name}</Option>)
                                    }
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label="部门名称">
                            {getFieldDecorator('name', {
                                initialValue:name,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入部门名称!',
                                        whitespace:true
                                    }],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="部门负责人">
                            {getFieldDecorator('username', {
                                initialValue:username,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入部门负责人名字!',
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
const department=Form.create({name:'departmentList'})(departmentList);

export default department