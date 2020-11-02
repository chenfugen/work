import React, {Component} from "react"
import { withRouter } from 'react-router-dom'
import {Layout, Menu} from 'antd'
import navList from "../../static/js/navList"
import "./sider.scss"
import "../../static/css/iconfont.css"
import PropTypes from "prop-types";

const {Sider: Nav} = Layout;
const { SubMenu } = Menu;
class sider extends Component {
    static propTypes = {
        defaultOpenKeys: PropTypes.string,
        defaultSelected: PropTypes.string,
        collapsed: PropTypes.bool.isRequired,
        display: PropTypes.string.isRequired,
    }
    rootSubmenuKeys = [];
    state = {
        height: "",
        navList:navList,
    }

    componentDidMount() {
        navList.map((c, index) => this.rootSubmenuKeys.push(c.moduleId))
        const height = window.innerHeight;
        this.setState({height})
    }

    onselect=(item)=>{
     this.props.history.push('/'+item.key);
    }

    render() {
        const {height, navList} = this.state;
        const {collapsed, defaultSelected, defaultOpenKeys,display} = this.props
        return (
            <div>
                <Nav className="siderHeight" style={{height,display,overflowY:"auto"}}  width="220" collapsed={collapsed}>
                   <div className={collapsed?"hideLogo":"logo"}/>
                    <Menu
                        defaultSelectedKeys={defaultSelected}
                        defaultOpenKeys={defaultOpenKeys}
                        mode="inline"
                        theme="dark"
                        onSelect={this.onselect}
                    >
                        {
                        navList.map((c, index) => {
                        if(c.children.length > 0) {
                        return (
                        <SubMenu
                        key={c.moduleId}
                        title={
                        <span>
                        <i className={"iconfont" + " " + (c.icon)}/>&nbsp;&nbsp;
                        <span className="moduleId">{c.name}</span>
                        </span>
                        }
                        >
                        {
                        c.children.map((i, key) => <Menu.Item
                        key={i.childId}>
                            {i.name}
                        </Menu.Item>)
                        }
                        </SubMenu>
                        )
                        }else{
                        return(
                        <Menu.Item key={c.moduleId}>
                        <i className={"iconfont" + " " + (c.icon)}/>&nbsp;&nbsp;
                        <span className="moduleId">
                        {c.name}
                        </span>
                        </Menu.Item>
                        )
                        }
                        }
                        )
                        }
                    </Menu>
                </Nav>
            </div>
        )
    }
}
export default withRouter(sider)
