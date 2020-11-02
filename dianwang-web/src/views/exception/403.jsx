import React,{ Component } from "react"
import { withRouter } from 'react-router-dom'
import { Result, Button } from 'antd'
import "./error.scss"
class error403 extends  Component{
      render() {
        return(
        <div className="bg">
            <Result
                status="403"
                title="403"
                subTitle="抱歉，你无权访问该页面。"
                extra={<Button type="primary" onClick={() => this.props.history.push('/home')}>回到首页</Button>}
            />
        </div>
        )
    }
}
export default withRouter(error403)