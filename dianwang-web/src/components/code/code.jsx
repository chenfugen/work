import React,{ Component } from "react"
import PropTypes from "prop-types"
export default class Identify extends  Component{
    state={
        fontSizeMin:25,
        fontSizeMax:35,
        backgroundColorMin:200,
        backgroundColorMax:220,
        dotColorMin:60,
        dotColorMax:120,
        identifyCode:"",
        contentWidth:"",
        contentHeight:"",
        codeId:"",
    }
    static propTypes={
        getCode: PropTypes.func.isRequired,
        contentWidth: PropTypes.number.isRequired,
        contentHeight: PropTypes.number.isRequired,
    }
    // 生成一个随机数
    randomNum= (min, max)=>{
        return Math.floor(Math.random() * (max - min) + min)
    }
    // 生成一个随机的颜色
    randomColor =(min, max)=> {
        let r = this.randomNum(min, max)
        let g = this.randomNum(min, max)
        let b = this.randomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
    }
    drawPic=()=>{
        const {identifyCode,contentWidth,contentHeight}=this.state;
        let canvas = document.getElementById('s-canvas')
        let ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textBaseline = 'bottom'
        // 绘制背景
        ctx.fillStyle = this.randomColor(this.state.backgroundColorMin, this.state.backgroundColorMax)
        ctx.fillRect(0, 0, contentWidth, contentHeight)
        // 绘制文字
        for (let i = 0; i < identifyCode.length; i++) {
            this.drawText(ctx, identifyCode[i], i)
        }
        this.drawLine(ctx)
        this.drawDot(ctx)
        canvas.style.border="1px solid #d9d9d9";
        canvas.style.borderRadius="3px 3px";
    }
    drawText =(ctx, txt, i) =>{
        const {contentWidth,contentHeight}=this.props;
        ctx.fillStyle = this.randomColor(50, 160) //随机生成字体颜色
        ctx.font = this.randomNum(this.state.fontSizeMin, this.state.fontSizeMax) + 'px SimHei' //随机生成字体大小
        let x = (i + 1) * (contentWidth / (this.state.identifyCode.length + 1))
        let y = this.randomNum(this.state.fontSizeMax, contentHeight - 5)
        var deg = this.randomNum(-30, 30)
        // 修改坐标原点和旋转角度
        ctx.translate(x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(txt, 0, 0)
        // 恢复坐标原点和旋转角度
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
    }
    drawLine =(ctx)=> {
        const {contentWidth,contentHeight}=this.props;
        // 绘制干扰线
        for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = this.randomColor(100, 200)
            ctx.beginPath()
            ctx.moveTo(this.randomNum(0,contentWidth), this.randomNum(0, contentHeight))
            ctx.lineTo(this.randomNum(0,contentWidth), this.randomNum(0, contentHeight))
            ctx.stroke()
        }
    }
    drawDot =(ctx) =>{
        // 绘制干扰点
        for (let i = 0; i < 30; i++) {
            ctx.fillStyle = this.randomColor(0, 255)
            ctx.beginPath()
            ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
            ctx.fill()
        }
    }
   getCode=()=>{
            this.$Ax.get("/common/getCheckCode",{
                params:{
                    accessKey:"d272e7b4bdc048b587acc768c8c9e34e",
                }
            }).then((res) => {
                this.setState({identifyCode:res.data.code,codeId:res.data.codeId});
                this.drawPic();
                this.props.getCode(res.data);
            })
   }
    componentDidMount(){
       this.getCode();
    }
      render() {
        const {contentWidth,contentHeight}=this.props;
        return(
            <div>
                <canvas id="s-canvas" width={contentWidth} height={contentHeight} onClick={this.getCode}></canvas>
            </div>
        )
    }
}