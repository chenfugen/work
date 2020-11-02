import React,{ Component } from "react"
import { withRouter } from 'react-router-dom'
import PropTypes from "prop-types"
import { Form, Input,Button,message} from 'antd';
import md5 from "md5";
import cookie from 'react-cookies';
import  Contents from "../../components/content/content"
class RegistrationForm extends  Component{
    static propTypes={
        getHome: PropTypes.func.isRequired,
    }
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
               this.$Axios.post("/manage/account/update/password",{
                   oldPassword:this.CalcuMD5(values.oldPassword),
                   newPassword:this.CalcuMD5(values.password),
               }).then((res)=>{
                   if(res.success){
                       message.success("修改成功");
                       cookie.remove("user");
                       this.props.history.push("/login");
                   }else{
                       message.error(res.message);
                   }
               })
            }
        });
    };
    //加密方法
    CalcuMD5=(pwd)=> {
        pwd = md5(pwd);
        pwd=pwd.toUpperCase();
        return pwd;
    }
    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码您输入的不一样!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };


    componentDidMount(){
        this.props.getHome();
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        return(
            <div>
                <Contents pagesTitle={{first:"用户管理",second:"修改密码"}} >
                    <div style={{margin:"20px 20px 0px 20px",width:"400px"}}>
                        <Form   {...formItemLayout}  onSubmit={this.handleSubmit}>
                            <Form.Item   label="原密码">
                                {getFieldDecorator('oldPassword', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入您的原密码!',
                                        },
                                        {
                                            validator: this.validateToNextPassword,
                                        },
                                    ],
                                })(<Input.Password />)}
                            </Form.Item>
                            <Form.Item label="新密码">
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入您的新密码!',
                                        },
                                        {
                                            validator: this.validateToNextPassword,
                                        },
                                    ],
                                })(<Input.Password />)}
                            </Form.Item>
                            <Form.Item label="确认新密码">
                                {getFieldDecorator('confirm', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请再次输入您的新密码!',
                                        },
                                        {
                                            validator: this.compareToFirstPassword,
                                        },
                                    ],
                                })(<Input.Password onBlur={this.handleConfirmBlur} />)}
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit">
                                    确认修改
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Contents>
            </div>
        )
    }
}
const changePassword = Form.create({ name: 'changePassword' })(RegistrationForm);
export default withRouter(changePassword)