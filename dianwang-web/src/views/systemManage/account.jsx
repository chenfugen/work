import React, {Component} from "react"
import PropTypes from "prop-types"
import { withRouter } from 'react-router-dom'
import {Modal, Form, Input, Select, Cascader, Button, message, Divider} from 'antd';
import md5 from "md5";
import Contents from "../../components/content/content"
import Tables from "../../components/table/table"
import {formItemLayout,tailFormItemLayout }from "../../static/js/from"
import Search from "../../components/search/search"
import "./account.scss"
import cookie from "react-cookies";
const {confirm} = Modal;
const {Option} = Select;

class accountForm extends Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
        getAccount:PropTypes.func.isRequired,
        account:PropTypes.object.isRequired,
        createAccount:PropTypes.func.isRequired,
        editAccount:PropTypes.func.isRequired,
        delAccount:PropTypes.func.isRequired,
        getCompany:PropTypes.func.isRequired,
        department:PropTypes.array.isRequired,
        exportAdmin:PropTypes.func.isRequired,
    }
    state = {
        confirmDirty:false,
        visible:false,
        id:"",
        activeName:"新增",
        isAdd:true,
        searchList:{},
        roleList:[],
        display:"none",
        userName:"",
        password:"",
        realName:"",
        roleId:"",
        type:"",
        manageLogin:0,
        organization:"",
        method:"新增"
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, item) => {
            if (!err) {
                if (this.state.isAdd) {
                    const account = {
                        userName:item.userName,
                        password:this.CalcuMD5(item.password),
                        realName:item.realName,
                        roleId:item.roleId,
                        type:item.type,
                        manageLogin:item.manageLogin,
                        organizationId:item.organization[0],
                        departmentId:item.organization[1],
                    }

                    if (this.state.method == "新增") {
                        this.props.createAccount(account)
                    } else {
                        account["id"] = this.state.id;
                        this.props.editAccount(account)
                    }
                    this.setState({
                        visible:false,
                        display:"none"
                    });
                    this.props.form.resetFields();
                }else{
                    message.error("请选择对应的组织部门！");
                }
            }
        });
    };
    //加密方法
    CalcuMD5 = (pwd) => {
        pwd = md5(pwd);
        pwd = pwd.toUpperCase();
        return pwd;
    }
    handleConfirmBlur = e => {
        const {value} = e.target;
        this.setState({confirmDirty:this.state.confirmDirty || !!value});
    };

    handleSelectChange = value => {
        if (value === 1) {
            this.setState({display:"block"})
        } else {
            this.setState({display:"none"})
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const {form} = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force:true});
        }
        callback();
    };

    showModal = (item) => {
        const {roleList}=this.state;
        this.setState({
            visible:true,
            id:item.id,
            display:item.type==1?"block":"none",
            activeName:"编辑",
            method:"编辑",
            userName:item.userName,
            password:"",
            realName:item.realName,
            roleId:item.roleId,
            type:item.type,
            manageLogin:item.manageLogin,
            organization:[item.organizationId,item.departmentId],
        });
    };

    handleOk = e => {
        console.log(e);
        this.setState({
            visible:false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible:false,
        });
    };
    getRole = () => {
        this.$Ax.get("/common/role/list", {
            params:{
                accessKey:"d272e7b4bdc048b587acc768c8c9e34e",
            }
        }).then((res) => {
            if (res.success) {
                this.setState({roleList:res.data})
            } else {
                message.error(res.message);
            }
        })
    }

    componentDidMount() {
        this.getRole();
        this.props.getCompany();
        this.props.getHome();
        this.props.getAccount(1, 10);
    }
    selectCategory = value => {
        if (value.length == 1) {
            message.error("请选择对应的组织部门！");
            this.setState({isAdd:false});
        } else {
            this.setState({isAdd:true});
        }
    }
    add = () => {
        this.setState({
            visible:true,
            activeName:"新增",
            method:"新增",
            userName:"",
            password:"",
            realName:"",
            roleId:"",
            type:"",
            manageLogin:0,
            organization:"",
        });
        this.props.form.resetFields();
    }
    derived = () => {
        cookie.save("fileName","系统用户列表")
        this.props.exportAdmin();
    }
    changePageSize = (pageNum, pageSize) => {
        const {searchList}=this.state;
        this.props.getAccount(pageNum, pageSize,searchList)
    }
    changePageNum = (pageNum, pageSize) => {
        const {searchList}=this.state;
        this.props.getAccount(pageNum, pageSize,searchList)
    }
    detail = id => {
        this.props.history.push('/accountDetail/'+id);
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
    search=(value)=>{
        const {getAccount}=this.props;
        this.setState({searchList:value})
        getAccount(1,10,value)
    }
    clearSearch=()=>{
        this.setState({searchList:{}})
        const {getAccount}=this.props;
        getAccount(1,10);
    }
    render() {
        const {account, department} = this.props;
        const {activeName, roleList, display, userName, password, realName, roleId, type, manageLogin,organization} = this.state;
        const {getFieldDecorator} = this.props.form;
        const columns = [
            {
                title:'序号',
                dataIndex:'key',
            },
            {
                title:'系统用户',
                dataIndex:'userName',
            },
            {
                title:'真实姓名',
                dataIndex:'realName',
                render:(realName) =>  realName==null?"--":realName
            },
            {
                title:'角色名 ',
                dataIndex:'roleName',
            },
            {
                title:'角色类型 ',
                dataIndex:'type',
                render:(type) =>  type==1?"管理员":"员工"
            },
            {
                title:'是否登录 ',
                dataIndex:'manageLogin',
                render:(manageLogin) =>  manageLogin==0?(<div className="manageLogin"><span className="false"></span><span> 否</span></div>) : (
            <div className="manageLogin"><span className="true"></span><span> 是</span></div>)
            },
            {
                title:'创建时间 ',
                dataIndex:'createTime',
            },
            {
                title:'操作 ',
                fixed:'right',
                width:200,
                render:(account) => <span> <span className="primary" onClick={this.showModal.bind(this, account)}> 编辑 </span> &nbsp;&nbsp;
                    <span className="primary" onClick={this.detail.bind(this,  account.id)}> 详情 </span> &nbsp;&nbsp;
                    <span className="danger" onClick={this.delete.bind(this, account.id)}> 删除 </span>  </span>
            }];
        const isLogin=[
            {
                name:"是",
                id:1,
            },
            {
                name:"否",
                id:0,
            }
        ]
        const typeStatus=[
            {
                name:"管理员",
                id:1,
            },
            {
                name:"员工",
                id:0,
            }
        ]

        const searchList = [
            {
                title:'系统用户',
                dataIndex:'username',
                type:"string",
                value:""
            },
            {
                title:'真实姓名',
                dataIndex:'realName',
                type:"string",
                value:""
            },
            {
                title:'角色名 ',
                dataIndex:'roleName',
                type:"string",
                value:""
            },
            {
                title:'角色类型 ',
                dataIndex:'type',
                type:"select",
                value:undefined,
                list:typeStatus
            },
            {
                title:'是否登录 ',
                dataIndex:'manageLogin',
                type:"select",
                value:undefined,
                list:isLogin
            }
    ]

        return (
            <div>
                <Contents pagesTitle={{first:"系统管理", second:"账户管理"}}>
                    <div>
                        <Search search={this.search} searchList={searchList} clearSearch={ this.clearSearch }></Search>
                        <span className="divider"> <Divider dashed /></span>
                    <Tables width={1200}  isAdd isExport derived={this.derived} add={this.add}  data={account} columns={columns} changePageSize={this.changePageSize}
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
                        <Form.Item label="账号">
                            {getFieldDecorator('userName', {
                                initialValue:userName,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入账号!',
                                        whitespace:true
                                    }],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                initialValue:password,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入您的密码!',
                                    },
                                    {
                                        validator:this.validateToNextPassword,
                                    },
                                ],
                            })(<Input.Password/>)}
                        </Form.Item>
                        <Form.Item label="真实姓名">
                            {getFieldDecorator('realName', {
                                initialValue:realName,
                                rules:[
                                    {
                                        required:true,
                                        message:'请输入真实姓名!',
                                        whitespace:true
                                    }],
                            })(<Input/>)}
                        </Form.Item>
                        <Form.Item label="角色">
                            {getFieldDecorator('roleId', {
                                initialValue:roleId,
                                rules:[{required:true, message:'请选择角色!'}],
                            })(
                                <Select
                                    placeholder="请选择角色"
                                    onChange={this.handleSelectChange}
                                >
                                    {
                                        roleList.map((c, index) => <Option value={c.id} key={index}>{c.name}</Option>)
                                    }
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label="属性">
                            {getFieldDecorator('type', {
                                initialValue:type,
                                rules:[{required:true, message:'请选择属性!'}],
                            })(
                                <Select
                                    placeholder="请选择属性"
                                    onChange={this.handleSelectChange}
                                >
                                    <Option value={1}>管理员</Option>
                                    <Option value={2}>员工</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item style={{display}} label="是否登录">
                            {getFieldDecorator('manageLogin', {
                                initialValue:manageLogin,
                                rules:[{required:true, message:'请选择是否有权限登录!'}],
                            })(
                                <Select
                                    placeholder="是否登录"
                                >
                                    <Option value={1}>登录</Option>
                                    <Option value={0}>不登录</Option>
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item label="单位">
                            {getFieldDecorator('organization', {
                                initialValue:organization,
                                rules:[
                                    {type:'array', required:true, message:'请选择你的单位!'},
                                ],
                            })(<Cascader options={department} onChange={this.selectCategory} />)}
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

const account = Form.create({name:'account'})(accountForm);
export default withRouter(account);