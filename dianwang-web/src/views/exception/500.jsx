import React,{ Component } from "react"
import { withRouter } from 'react-router-dom'
import { Result, Button } from 'antd'
import "./error.scss"
class error500 extends  Component{
    render() {
        return(
            <div className="bg">
                <Result
                    status="500"
                    title="500"
                    subTitle="抱歉，服务器出错了。"
                    extra={<Button type="primary" onClick={() => this.props.history.push('/home')}>回到首页</Button>}
                />
            </div>
        )
    }
}
export default withRouter(error500)