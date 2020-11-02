import React, {Component} from "react"
import {withRouter} from 'react-router-dom'
import {Layout, Icon, Descriptions, Menu, Form, Dropdown, Modal, Input, Button, message} from 'antd';
import cookie from 'react-cookies';
import PropTypes from "prop-types"
import "./header.scss"
import "../../static/css/iconfont.css"
import {formItemLayout, tailFormItemLayout} from "../../static/js/from";
import md5 from "md5";

const {Header} = Layout;
const {confirm} = Modal;

class head extends Component {
    static propTypes = {
        changeSider:PropTypes.func.isRequired,
        collapsed:PropTypes.bool.isRequired,
        display:PropTypes.string.isRequired,
        userInfo:PropTypes.object.isRequired
    }
    state = {
        confirmDirty:false,
        visible:false,
        activeName:"用户详情",
    }
    toggle = () => {
        this.props.changeSider();
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.$Axios.post("/manage/account/update/password", {
                    oldPassword:this.CalcuMD5(values.oldPassword),
                    newPassword:this.CalcuMD5(values.password),
                }).then((res) => {
                    if (res.success) {
                        message.success("修改成功");
                        this.setState({
                            visible:false,
                        });
                        cookie.remove("user");
                        this.props.history.push("/login");
                    } else {
                        message.error(res.message);
                    }
                })
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

    compareToFirstPassword = (rule, value, callback) => {
        const {form} = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码您输入的不一样!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const {form} = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force:true});
        }
        callback();
    };
    exit = () => {
        confirm({
            title:'友情提醒',
            content:'您确定要退出吗?',
            onOk:() => {
                cookie.remove("token");
                window.location.href = '/'
            },
            onCancel:() => {
            },
        });
    }
    handleCancel = e => {
        this.setState({
            visible:false,
        });
    };
    userInfo = () => {
        this.setState({
            visible:true,
            activeName:"用户详情",
        });
    }
    changePassword = () => {
        this.setState({
            visible:true,
            activeName:"修改密码",
        });
    }

    render() {
        const {collapsed, display, userInfo} = this.props;
        const {activeName} = this.state;
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Header style={{background:'#fff', padding:0, display:display}}>
                    <Icon
                        className="trigger"
                        style={{fontSize:"20px"}}
                        type={collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                    />
                    <div className="admin">
                        <Dropdown overlay={() => {
                            return (
                                <Menu>
                                    <Menu.Item>
                                        <a className="cell" rel="用户详情" onClick={this.userInfo}>
                                            用户详情
                                        </a>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <a className="cell" rel="修改密码" onClick={this.changePassword}>
                                            修改密码
                                        </a>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <a className="cell" rel="修改密码" onClick={this.exit}>
                                            退出
                                        </a>
                                    </Menu.Item>
                                </Menu>
                            )
                        }}>
                            <a className="ant-dropdown-link">
                                &nbsp; &nbsp; {userInfo.userName}  &nbsp; <Icon type="down"/>
                            </a>
                        </Dropdown>
                    </div>
                    <span className="head"></span>
                </Header>
                <Modal
                    title={activeName}
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    {
                        activeName==="用户详情"?( <Descriptions column={1}>
                            <Descriptions.Item label="用户名">{userInfo.userName}</Descriptions.Item>
                            <Descriptions.Item label="真实姓名">{userInfo.realName === null ? "--" : userInfo.realName}</Descriptions.Item>
                            <Descriptions.Item label="属性">{userInfo.type === 1 ? "管理员" : "操作员"}</Descriptions.Item>
                            <Descriptions.Item label="创建时间">{userInfo.createTime}</Descriptions.Item>
                        </Descriptions>):
                     (
                        <Form   {...formItemLayout}  onSubmit={this.handleSubmit}>
                        <Form.Item   label="原密码">
                        {getFieldDecorator('oldPassword', {
                            rules:[
                                {
                                    required:true,
                                    message:'请输入您的原密码!',
                                },
                                {
                                    validator:this.validateToNextPassword,
                                },
                            ],
                        })(<Input.Password/>)}
                        </Form.Item>
                        <Form.Item label="新密码">
                        {getFieldDecorator('password', {
                            rules:[
                                {
                                    required:true,
                                    message:'请输入您的新密码!',
                                },
                                {
                                    validator:this.validateToNextPassword,
                                },
                            ],
                        })(<Input.Password/>)}
                        </Form.Item>
                        <Form.Item label="确认新密码">
                        {getFieldDecorator('confirm', {
                            rules:[
                                {
                                    required:true,
                                    message:'请再次输入您的新密码!',
                                },
                                {
                                    validator:this.compareToFirstPassword,
                                },
                            ],
                        })(<Input.Password onBlur={this.handleConfirmBlur}/>)}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                        确认修改
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

const header = Form.create({name:'head'})(head);
export default withRouter(header);