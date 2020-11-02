import React, {Component} from "react"
import { withRouter } from 'react-router-dom'
import PropTypes from "prop-types"
import {Modal, Form, Input, Button, Select, Checkbox, Row, Col,List} from 'antd';
import Contents from "../../components/content/content"
import Tables from "../../components/table/table"
import {formItemLayout, tailFormItemLayout} from "../../static/js/from"
import cookie from "react-cookies";
const {confirm} = Modal;
const {Option} = Select;

class role extends Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
        role:PropTypes.object.isRequired,
        getRole:PropTypes.func.isRequired,
        createRole:PropTypes.func.isRequired,
        editRole:PropTypes.func.isRequired,
        delRole:PropTypes.func.isRequired,
        allParent:PropTypes.array.isRequired,
        getAllParent:PropTypes.func.isRequired,
        exportRole:PropTypes.func.isRequired,
    }
    state = {
        confirmDirty:false,
        visible:false,
        isPermission:false,
        permissions:[],
        id:"",
        activeName:"新增",
        method:"新增",
        roleName:"",
        permission:[],
        verifyLevel:""
    }

    componentDidMount() {
        this.props.getHome();
        this.props.getRole(1, 10);
        this.props.getAllParent();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {
                const account = {
                    roleName:item.roleName,
                    permission:JSON.stringify(item.permission),
                    verifyLevel:item.verifyLevel
                }
                if (this.state.method == "新增") {
                    this.props.createRole(account);
                } else {
                    account["id"] = this.state.id;
                    this.props.editRole(account)
                }
                this.setState({
                    visible:false,
                });
                this.props.form.resetFields();
            }
        });
    };
    edit = (item) => {
        this.setState({
            visible:true,
            activeName:"编辑",
            method:"编辑",
            id:item.id,
            roleName:item.roleName,
            permission:JSON.parse(item.permissions),
            verifyLevel:item.verifyLevel
        });
    }
    delete = (id) => {
        const {delRole} = this.props;
        confirm({
            title:'删除',
            content:'您确定要删除该角色吗?',
            okText:'确认',
            okType:'danger',
            cancelText:'取消',
            onOk() {
                delRole(id)
            },
            onCancel() {
            },
        });
    }
    changePageSize = (pageNum, pageSize) => {
        this.props.geRole(pageNum, pageSize)
    }
    changePageNum = (pageNum, pageSize) => {
        this.props.geRole(pageNum, pageSize)
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
            roleName:"",
            permission:[],
            verifyLevel:""
        });
        this.props.form.resetFields();
    }
    search = (item) => {
        const {allParent} = this.props;
        const permission=JSON.parse(item);
        const permissions = [];
        for(let i=0;i<permission.length;i++){
            for(let j=0;j<allParent.length;j++){
                if(allParent[j].id==permission[i]){
                    permissions.push(allParent[j])
                }
            }
        }
        this.setState({permissions:permissions, isPermission:true});
    }
    detail = id => {
        this.props.history.push('/roleDetail/'+id);
    }
    derived = () => {
        cookie.save("fileName","系统角色列表");
        this.props.exportRole();
    }

    render() {
        const {role, allParent} = this.props;
        const {activeName, roleName, permission, verifyLevel, permissions} = this.state;
        const {getFieldDecorator} = this.props.form;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'角色名称',
                dataIndex:'roleName',
            },
            {
                title:'审核等级',
                dataIndex:'verifyLevel',
                render:(verifyLevel) =>verifyLevel===1?"预审":verifyLevel===2?"二审":"终审"
            },
            {
                title:'权限 ',
                dataIndex:'permissions',
                render:(permissions) =>permissions!==null? <span style={{textDecoration:"underline", color:"#229794", cursor:"pointer"}}
                                              onClick={this.search.bind(this, permissions)}>权限查看 </span>:"--"
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            },
            {
                title:'操作 ',
                fixed:'right',
                width:150,
                render:(role) => <span> <span className="primary" onClick={this.edit.bind(this, role)}> 编辑 </span> &nbsp;&nbsp;
                    <span className="primary" onClick={this.detail.bind(this, role.id)}> 详情 </span> &nbsp;&nbsp;
                    <span className="danger" onClick={this.delete.bind(this, role.id)}> 删除 </span>  </span>
            }];


        return (
            <div>
                <Contents pagesTitle={{first:"系统管理", second:"角色管理"}}>
                    <div>
                        <Tables  isAdd isExport isSearch derived={this.derived} add={this.add} data={role} columns={columns} changePageSize={this.changePageSize}
                                changePageNum={this.changePageNum}/>
                    </div>

                </Contents>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label="角色名字">
                            {getFieldDecorator('roleName', {
                                initialValue:roleName,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入账号!',
                                        whitespace:true
                                    }],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="权限">
                            {getFieldDecorator('permission', {
                                initialValue:permission,
                            })(
                                <Checkbox.Group style={{width:'100%'}}>
                                    <Row>
                                        {
                                            allParent.map((c, index) => <Col key={index} span={10}> <Checkbox
                                                value={c.id}>{c.name}</Checkbox></Col>)
                                        }
                                    </Row>
                                </Checkbox.Group>,
                            )}
                        </Form.Item>
                        <Form.Item label="审核等级">
                            {getFieldDecorator('verifyLevel', {
                                initialValue:verifyLevel,
                                rules:[{required:true, message:'请选择审核等级!'}],
                            })(
                                <Select
                                    placeholder="审核等级"
                                >
                                    <Option value={1}>预审</Option>
                                    <Option value={2}>二审</Option>
                                    <Option value={3}>终审</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item  {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">
                                确认
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="权限列表"
                    visible={this.state.isPermission}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <div>
                            <List
                                bordered
                                dataSource={permissions}
                                renderItem={item => <List.Item>{item.name}</List.Item>}
                            />
                    </div>
                </Modal>
            </div>
        )
    }
}

const authority = Form.create({name:'role'})(role);
export default withRouter(authority);