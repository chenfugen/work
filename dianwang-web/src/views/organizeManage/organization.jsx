import React,{ Component } from "react"
import PropTypes from "prop-types"
import {Modal, Form, Input, Button,Select} from 'antd';
import  Contents from "../../components/content/content"
import {formItemLayout, tailFormItemLayout} from "../../static/js/from"
import  Tables from "../../components/table/table"
const {confirm} = Modal;
const {TextArea}=Input;
const {Option}=Select
class organizationList extends  Component{
    static propTypes={
        getHome:PropTypes.func.isRequired,
        getOrganization:PropTypes.func.isRequired,
        organization:PropTypes.object.isRequired,
        createOrganization:PropTypes.func.isRequired,
        delOrganization:PropTypes.func.isRequired,
    }
    state = {
        confirmDirty:false,
        visible:false,
        activeName:"新增",
        method:"新增",
        name:"",
        person:"",
        phone:"",
        description:"",
    }
    componentDidMount(){
        this.props.getHome();
        this.props.getOrganization(1,10);
    }
    changePageSize = (pageNum, pageSize) => {
        this.props.getOrganization(pageNum, pageSize)
    }
    changePageNum = (pageNum, pageSize) => {
        this.props.getOrganization(pageNum, pageSize)
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {
                const account = {
                    name:item.name,
                    person:item.person,
                    phone:item.phone,
                    description:item.description,
                }
                if (this.state.method == "新增") {
                    this.props.createOrganization(account)
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
            person:"",
            phone:"",
            description:"",
        });
    }
    delete = id => {
        //const {delOrganization} = this.props;
        confirm({
            title:'删除',
            content:'您确定要删除该组织吗?',
            okText:'确认',
            okType:'danger',
            cancelText:'取消',
            onOk() {
                //delOrganization(id)
            },
            onCancel() {
            },
        });
    }
    derived(){
        console.log(2)
    }
    render() {
        const {organization}=this.props;
        const {activeName, name, person,phone,description} = this.state;
        const {getFieldDecorator} = this.props.form;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'单位名称',
                dataIndex:'name',
                render:(name) =>name===null?"--": name
            },
            {
                title:'单位负责人',
                dataIndex:'person',
                render:(person) =>person===null?"--": person
            },
            {
                title:'联系方式',
                dataIndex:'phone',
                render:(phone) =>phone===null?"--": phone
            },
            {
                title:'描述',
                dataIndex:'description',
                render:(description) =>description===null?"--": description
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            },
            {
                title:'操作 ',
                render:(role) => <span className="danger" onClick={this.delete.bind(this, role.id)}> 删除 </span>
            }];
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>,
        );
        return(
            <div>
                <Contents pagesTitle={{first:"组织管理",second:"单位管理"}}>
                    <Tables isAdd isExport derived={this.derived} add={this.add}  data={organization} columns={columns} changePageSize={this.changePageSize}
                            changePageNum={this.changePageNum}/>
                </Contents>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="单位名称">
                            {getFieldDecorator('name', {
                                initialValue:name,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入单位名称!',
                                        whitespace:true
                                    }],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="单位负责人">
                            {getFieldDecorator('person', {
                                initialValue:person,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入负责人名字!',
                                        whitespace:true
                                    }],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="联系方式">
                            {getFieldDecorator('phone', {
                                initialValue:phone,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入联系电话!',
                                        whitespace:true
                                    }],
                            })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                        </Form.Item>
                        <Form.Item label="描述">
                            {getFieldDecorator('description', {
                                initialValue:description, rules:[
                                    {
                                        required:true,
                                        message:'请输入描述!',
                                        whitespace:true
                                    }],
                            })(<TextArea placeholder="请输入描述" autoSize={{minRows:3, maxRows:5}}/>)}
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
const organization=Form.create({name:'organizationList'})(organizationList);

export default organization