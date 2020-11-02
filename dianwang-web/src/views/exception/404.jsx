import React,{ Component } from "react"
import { withRouter } from 'react-router-dom'
import { Result, Button } from 'antd'
import "./error.scss"
class error404 extends  Component{
    render() {
        return(
            <div className="bg">
                <Result
                    status="404"
                    title="404"
                    subTitle="抱歉，您访问的页面不存在。"
                    extra={<Button type="primary" onClick={() => this.props.history.push('/home')}>回到首页</Button>}
                />
            </div>
        )
    }
}
export default withRouter(error404)