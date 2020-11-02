import React,{ Component } from "react"
import { withRouter } from 'react-router-dom'
import "./login.scss";
import {Input, Button, Col, Row,message} from 'antd';
import PropTypes from "prop-types"
import cookie from 'react-cookies';
import md5 from "md5";
import Identify from "../../components/code/code"

const InputGroup = Input.Group;

class Login extends  Component{
    state={
        userName:"",
        password:"",
        code:"",
        codeId:"",
        accessKey:"d272e7b4bdc048b587acc768c8c9e34e",
        height:"",
        isShowName:"none",
        isShowpassword:"none",
        isShowCode:"none",
        usernameWarn:"账号错误",
        passwordWarn:"密码错误",
        codeWarn:"验证码",
    }
    static propTypes={
        changeHome: PropTypes.func.isRequired,
        display: PropTypes.string.isRequired,
    }
    handleUsenameChange=(event)=>{
        const userName=event.target.value;
        if(userName===""){
            this.setState({ isShowName:"block",usernameWarn:"请输入账号",userName });
        }else{
            this.setState({ isShowName:"none",userName});
        }
    }
    handlePasswordChange=(event)=>{
        const password=event.target.value;
        if(password===""){
            this.setState({ isShowpassword:"block",passwordWarn:"请输入密码",password });
        }else{
            this.setState({ isShowpassword:"none",password});
        }
    }
    handleCodeChange=(event)=>{
        const code=event.target.value;
        if(code===""){
            this.setState({ isShowCode:"block",codeWarn:"请输入验证码",code});
        }else{
            this.setState({ isShowCode:"none",code});
        }
    }
    //加密方法
    CalcuMD5=(pwd)=> {
        pwd = md5(pwd);
        pwd=pwd.toUpperCase();
        return pwd;
    }
    //登录
    componentDidMount(){
       const {changeHome}=this.props;
       changeHome();
        const height=window.innerHeight;
        this.setState({height})
    }
    handleSubmit=(event)=>{
        const {userName,code,password,codeId,accessKey}=this.state;
        if(userName===""){
            this.setState({ isShowName:"block",usernameWarn:"请输入账号",userName });
            return false
        }
        if(password===""){
            this.setState({ isShowpassword:"block",passwordWarn:"请输入密码",password });
            return false
        }
        if(code===""){
            this.setState({ isShowCode:"block",codeWarn:"请输入验证码",password });
            return false
        }
        this.$Ax.post("/manage/account/login",{
            userName:userName,
            password:this.CalcuMD5(password),
            code:code,
            codeId:codeId,
            accessKey:accessKey,
        }).then((res) => {
            if (res.success) {
                cookie.save("user",JSON.stringify(res.data));
                this.props.history.push('/statistics');
            }else{
                this.refs.getCodeButton.getCode();
                this.setState({codeId:"",code:""});
                message.error(res.message);
            }
        })
    }
    getCode=(res)=>{
        this.setState({codeId:res.codeId});
    }
    render() {
        const {height,isShowName,isShowpassword,usernameWarn,passwordWarn,userName,password,code,codeWarn,isShowCode}=this.state;
        return(
            <div className="loginBg" style={{height}} >
              <div className="loginBox">
                  <div className="logo"></div>
                  <Input
                      size="large"
                      placeholder="账号"
                      className="userName"
                      value={userName} onChange={this.handleUsenameChange}
                  />
                  <p  className="warn"><span style={{display: isShowName}}>{usernameWarn}</span></p>
                  <Input
                      size="large"
                      placeholder="密码"
                      className="userPass"
                      type="password"
                      value={password} onChange={this.handlePasswordChange}
                  />
                  <p className="warn"><span style={{display: isShowpassword}}>{passwordWarn}</span></p>
                  <div className="code" >
                      <InputGroup  size="large">
                          <Row gutter={3}>
                              <Col span={14}>
                                  <Input
                                      size="large"
                                      placeholder="验证码"
                                      value={code} onChange={this.handleCodeChange}
                                  />
                              </Col>
                              <Col span={10}>
                                    <Identify contentHeight={40} contentWidth={100} getCode={this.getCode }  ref="getCodeButton" />
                              </Col>
                          </Row>
                      </InputGroup>
                  </div>
                  <p className="warn"><span style={{display: isShowCode}}>{codeWarn}</span></p>
                  <Button type="primary" size="large" onClick={this.handleSubmit} block className="loginButto"> 登录 </Button>
              </div>
                <div className="Copyright">海大物联科技有限公司</div>
            </div>
        )
    }
}
export default withRouter(Login)
