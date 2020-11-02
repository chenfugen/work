import React,{ Component } from "react"
import { Layout } from 'antd';
import PropTypes from "prop-types"
import  Header from "../header/header"
import  Sider from "../nav/sider"
import "./home.scss"

export default class home extends  Component{
     static propTypes={
         children:PropTypes.object,
         display: PropTypes.string.isRequired,
         userInfo: PropTypes.object.isRequired,
         getUser: PropTypes.func.isRequired,
    }
    state = {
        height:"",
        width:"",
        collapsed: false,
    };
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    componentDidMount(){
        const height=window.innerHeight-80;
        const width=window.innerwidth-150;
        this.setState({height,width});
    }
    componentWillReceiveProps(next){
       if(Object.keys(next.userInfo).length===0){
           this.props.getUser();
       }
    }
    render() {
        const {children,display,userInfo}=this.props;
        const {collapsed,height,width}=this.state;
        const user=userInfo===""?{}:userInfo;
        return(
            <div>
                <Layout>
                    <Sider  collapsed={collapsed} display={display}  defaultSelected={"statistics"}></Sider>
                    <Layout style={{width:width}}>
                        <Header changeSider={this.toggleCollapsed}  display={display} collapsed={collapsed} userInfo={user}></Header>
                        <div style={{ minHeight:height,overflowY:"auto"}}>
                            {React.Children.map(children, (child, i) => {
                                return child
                            })}
                        </div>
                    </Layout>
                </Layout>
            </div>
        )
    }
}
