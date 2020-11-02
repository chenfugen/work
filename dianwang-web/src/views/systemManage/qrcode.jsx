import React, {Component} from "react"
import PropTypes from "prop-types"
import  Process from "../../axios/env"
import Contents from "../../components/content/content"
import "./account.scss"
import {Button} from "antd";
class qrcode extends Component {
    static propTypes = {
        getHome:PropTypes.func.isRequired,
    }
    state = {

    };

    componentDidMount() {
        this.props.getHome();
    }
    download=()=>{
        var img = document.getElementById('qrcodeImg'); // 获取要下载的图片
        var url = img.src;                            // 获取图片地址
        var a = document.createElement('a');          // 创建一个a节点插入的document
        var event = new MouseEvent('click')           // 模拟鼠标click点击事件
        a.download = 'H5入口二维码'                  // 设置a节点的download属性值
        a.href = url;                                 // 将图片的src赋值给a节点的href
        a.dispatchEvent(event)
    }
    render() {
        return (
            <div>
                <Contents pagesTitle={{first:"系统管理", second:"H5二维码"}}>
                    <div>
                        {
                            process.env.NODE_ENV=== "production"?(
                                <img src={require('../../static/image/H5Url-pro.png')}   className="qrcode" id="qrcodeImg" alt="二维码图片"/>
                            ):(
                                <img src={require('../../static/image/H5Url-dev.png')}    className="qrcode" id="qrcodeImg" alt="二维码图片"/>
                            )
                        }
                        <Button type="primary"  className="download" onClick={this.download}>
                            点击下载
                        </Button>
                    </div>
                </Contents>
            </div>
        )
    }
}

export default qrcode;