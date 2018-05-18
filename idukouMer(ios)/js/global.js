/**
 * Created by Administrator on 2017/2/15.
 */
/*配置*/
var config = {
    webAPI: {
        //address: 'http://192.168.1.151:30001/'
        //address: 'http://localhost:60852/'
        address: 'http://api.idukou.com:3000/'
    },
    file: {
        imageRoot: 'http://img.idukou.com/'
    },
    sms: {
        template: {
            verification: '08A74B1F-5C99-46FC-A0DD-E49919A78EA6',
            verifyCode: '7b9a2aa5-9944-48be-9602-176ed4cedc75'
        }
    },
    baidu: {
        push: {
            apiKey: 'hoq3wex5MblhGc0j48DwcMPk'
        }
    },
    wx:{
        appID:'wxdad1a4a51aa17928',
        appsecret:'5c45776792a683c423b609bccf4f2d80',
        access_token:'WC63_hP2k3TbuGmd6ztsA9TESq3q3YsVmoUg1yj1fOQcoCYptHjdNxcGReX4dOlGcUvUgkHmHXxMinBIuNoQGDEYME08b7tQ4mZVki8Xj3Wl7MozBRgrM4oIsjmeRw2cVXYcACAYAB'
    }
}

/*通用工具方法*/
var util={
    //判断设备 返回值对应　微信:wx  苹果(IPAD 手机 pc):ios  安卓：android  其它手机系统:　mobileOther PC:pc
    machineIs:function (){
        var a=navigator.userAgent;
        var s="wx";
        if (a.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {//微信
            /*//判断方法二：
             function z() {//返回为空　ＰＣ或手机端　　　有数值为微信，即版本号
             var a = navigator.userAgent.toLowerCase().match(/micromessenger\/(\d+\.\d+\.\d+)/) || navigator.userAgent.toLowerCase().match(/micromessenger\/(\d+\.\d+)/);
             return a ? a[1] : ""
             }*/
            return s;
        } else {
            /*//移动设备
             var a = navigator.userAgent.toLowerCase();   //浏览器的用户代理设置为小写，再进行匹配
             var isIpad = a.match(/ipad/i) == "ipad";   //或者利用indexOf方法来匹配
             var isIphoneOs = a.match(/iphone os/i) == "iphone";
             var isAndroid = a.match(/android/i) == "android";
             */
            var isMidp = a.toLowerCase().match(/midp/i) == "midp";  //移动信息设备描述MIDP是一套Java应用编程接口，多适用于塞班系统
            var isUc7 = a.toLowerCase().match(/rv:1.2.3.4/i) == "rv:1.2.3.4";  //CVS标签
            var isUc = a.toLowerCase().match(/ucweb/i) == "ucweb";
            var isCe = a.toLowerCase().match(/windows ce/i) == "windows ce";
            var isWM = a.toLowerCase().match(/windows mobil/i) == "windows mobil";

            var isAndroid = a.indexOf('Android') > -1 || a.indexOf('Linux') > -1; //g
            var isIOS = !!a.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端   IPAD 为ＴＲＵＥ
            if(isIOS){
                s="ios";
            }else{
                if(isAndroid){
                    s="android";
                }else{
                    if(isMidp || isUc7 || isUc || isCe || isWM){
                        s="mobileOther";
                    }else{
                        s="pc";
                    }
                }
            }
            return s;
        }
    },

    getTime:function(){
        var d=new Date();
        return d.getTime();
    },
    /*判断元素是否为HTMLElement元素*/
    isHTMLElement:function (obj) {
        var d = document.createElement("div");
        try {
            d.appendChild(obj.cloneNode(true));
            return obj.nodeType == 1 ? true : false;
        } catch (e) {
            return obj==window || obj==document;
        }
    }
}

/*尝用调试*/
function trace(){
    var i,len=0;
    len=arguments.length;
    if(len==1){
        console.log(arguments[0]);
    }else{
        var str ="";
        for(i=0;i<len;i++){
            str += '※第'+(i+1)+'值：'+arguments[i]+'　　';//+'\n';
        }
        console.log(str);
    }
}
function trace1(el){
    var str ="";
    for(var i=1;i<arguments.length;i++){
        str += '※第'+(i)+'值：'+arguments[i]+'　　';//+'\n';
    }
    if(util.isHTMLElement(el)){
        el.innerHTML=str;
    }else{
        console.log(str);
    }
}

/*控制*/

window.onresize = function(){myResize();}
window.onload=function(){myResize();info=document.getElementById("a");};

//解决移动端CLICK事件延迟300MS  引用FASTCLICK 插件
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

function myResize(){
    lys.refresh();
    lys2.refresh();
    //trace1(document.getElementById("a"),window.screen.availHeight)
}
///////////////////////lyslist-礼仪师详细页
var lys={
    elObj:{},
    state:1,
    divideTop:0,
    leftArr:[],
    rightArr:[],
    curMenu:0,
    lastMenu:0,
    mainPosition:{top:0,bottom:62},
    tt:"",
    ///先判断是否需要
    a:"",
    b:"",
    c:"",
    /*
     * state= 1  页面1　上层 高度固定
     * state= 2  页面2　下层　内嵌滚动
     * */
    refresh:function (){
        if(!(this.elObj && this.elObj.divide))return;
        elObj.main.display="none";
        document.getElementById("mask1").style.height=parseInt(window.document.body.offsetHeight-this.mainPosition.top-this.mainPosition.bottom)+"px";//642
        this.divideTop=parseInt(elObj.divide.getBoundingClientRect().top)- a.maskMin;//this.elObj.divide.offsetTop;
        var i,len=0;
        this.rightArr[this.rightArr.length-1].el.style.height=0;

        c.maskLen=parseInt(window.document.body.offsetHeight-a.maskMin-this.mainPosition.top-this.mainPosition.bottom)- a.maskMin- c.maskMin;
        //trace1(document.getElementById("a"),window.screen.availHeight,c.maskLen, a.maskLen)
        for (i=0,len=this.rightArr.length;i<len;i++){//for (var i in this.rightArr){
            this.rightArr[i].top=this.rightArr[i].el.offsetTop;
            if(i==len-1){
                if(this.rightArr[i].el.offsetHeight<c.maskLen){
                    this.rightArr[i].el.style.height=(c.maskLen)+"px";//-parseInt(b.el.style.marginTop)
                   // this.rightArr[i].el.style.background="#ff0000";
                }
                //trace1(document.getElementById("a"),c.maskLen,this.rightArr[this.rightArr.length-1].el.style.height)
            }
        }
        this.a.refresh();
        this.b.refresh();
        this.c.refresh();
        elObj.main.display="block";
    },
    creat:function (){
        info=document.getElementById("a");
        elObj=this.elObj={
            main:document.getElementById("wrapper"),
            btn:document.getElementById("backTop"),
            left:document.getElementById("leftNav"),
            right:document.getElementById("rightNav"),
            divide:document.getElementById("sli")
        };
        document.getElementById("mask1").style.height=parseInt(window.document.body.offsetHeight-this.mainPosition.top-this.mainPosition.bottom)+"px";
        a=this.a=new Roll(document.getElementById("mask1"),elObj.main);
        b=this.b=new Roll(document.getElementById("mask2"),elObj.left,elObj.divide,a);
        c=this.c=new Roll(document.getElementById("mask3"),elObj.right,elObj.divide,a);

        state=this.state;
        divideTop=this.divideTop;
        leftArr=this.leftArr;
        rightArr=this.rightArr;
        curMenu=this.curMenu;
        lastMenu=this.lastMenu;
        tt=this.tt;

        cssOnMenu=this.cssOnMenu;
        cssOutMenu=this.cssOutMenu;

        elObj.main.display="none";
        init();
        function init(){

            divideTop=parseInt(elObj.divide.getBoundingClientRect().top)- a.maskMin;//offsetTop;
            leftArr=b.el.getElementsByTagName("li");
            var list=c.el.getElementsByClassName("item-list");
            var i,len=0;
            var obj;
            for (i=0,len=list.length;i<len;i++){
                obj={};
                obj.el=list[i];
                obj.id=i;
                obj.top=list[i].offsetTop;
                rightArr.push(obj);
                if(i==len-1){
                    if(list[i].offsetHeight<c.maskLen){
                        list[i].style.height=(c.maskLen)+"px";//-parseInt(b.el.style.marginTop)
                        //list[i].style.background="#ffff00";
                    }
                }
            }
            a.refresh();
            b.refresh();
            c.refresh();

            elObj.btn.addEventListener("click",clickToTop);
            elObj.left.addEventListener("click",clickLeft);
            elObj.right.addEventListener("transitionend", function(){ //动画结束时事件
                clearTimeout(outCheck);
            }, false);

            leftOn();
            a.on();
            elObj.main.display="block";
        }

        a.rolling=function(){
            if(state==1){
                if(a.rollCurY>=divideTop){
                    a.rollCurY=divideTop;
                }
            }else if(state==2){
                //强制回到状态1
                checkState();
                return false;
            }
            return true;
        }
        a.rollEnd=function(){
            if(state==1){
                if(a.rollCurY>=divideTop){
                    a.rollCurY=divideTop;
                    state=2;
                    elObj.btn.style.display="block";
                    openSub();
                }else{
                    state=1;
                    elObj.btn.style.display="none";
                }
            }else if( state==2){
                checkState();
                return false;
            }
            // trace1(document.getElementById("a"),state,a.rollCurY,divideTop,c.maskMin, c.maskLen, c.rollMin, c.rollMax, c.el.getBoundingClientRect().top,elObj.divide.getBoundingClientRect().top,21)
            return true;
        }

        b.rolling=subRolling;
        c.rolling=function (){
            subRolling();
            outCheck();
            return true;
        }

        b.rollEnd=function (){
            if(state==1){
                checkState();
                return false;
            }else{
                if(b.rollCurY<=0 && c.rollCurY<=0){
                    state=1;
                    clickToTop();
                    return false;
                }else{
                    if(!b.enabled){
                        b.moveTo(0,100);
                        return false;
                    }
                }
            }
            return true;

        }
        c.rollEnd=function (){
            if(state==1){
                checkState();
                return false;
            }else{
                if(b.rollCurY<=0 && c.rollCurY<=0){
                    state=1;
                    clickToTop();
                    return false;
                }else{
                    if(!c.enabled){
                        c.moveTo(0,100);
                        return false;
                    }
                }
            }
            tt = setTimeout(outCheck, 50);
            return true;
        };

        function subRolling(){
            if(state==1){
                checkState();
                return false;
            }
            return true;
        }

        function outCheck(){
            var i,len,j=0;
            var max=c.rollCurY;
            var s="";
            for (i=0,len=rightArr.length;i<len;i++ ){
                if(max>=rightArr[i].top){
                    j=i;
                }else{
                    break;
                }
            }
            if(j==0){
                curMenu=0;
            }else{
                curMenu=rightArr[j].id;// parseInt(s.substring(4));
            }
            leftOn();
            lastMenu=curMenu;
        };


        function checkState(){
            if(state==1){
                if(a.rollCurY>=divideTop) {
                    a.rollCurY= 0;
                    a.moveTo(0);
                }
                if(!a.isOn){
                    a.on();
                }
                if(b.isOn){
                    b.off();
                    b.rollCurY=0;
                    b.moveTo(0);
                }
                if(c.isOn){
                    c.off();
                    c.rollCurY=0;
                    c.moveTo(0);
                }
            }else if(state==2){
                a.rollCurY=divideTop;
                a.moveTo(divideTop);
                if(a.isOn){
                    a.off();
                }
                if(!b.isOn){
                    b.on();
                }
                if(!c.isOn){
                    c.on();
                }
            }
        }
        /*function checkSite(){
            if(a.rollCurY>=divideTop){
                a.rollCurY=divideTop;
                a.moveTo(divideTop);
                if(a.isOn){
                    a.off();
                }
                if(!b.isOn){
                    b.on();
                }
                if(!c.isOn){
                    c.on();
                }
                state=2;
                elObj.btn.style.display="block";
            }else{
                if(!a.isOn){
                    a.on();
                }
                if(b.isOn){
                    b.off();
                    b.rollCurY=0;
                    b.moveTo(0);
                }
                if(c.isOn){
                    c.off();
                    c.rollCurY=0;
                    c.moveTo(0);
                }
                state=1;
                elObj.btn.style.display="none";
            }
        };*/
        function openSub(){
            a.off();
            b.on();
            c.on();
        }
        function closeSub(){
            b.off();
            c.off();
            a.on();
        }
        function clickToTop(){
            a.moveTo(0,200,"back");
            b.moveTo(0,0);
            c.moveTo(0,0);
            state=1;
            closeSub();
            elObj.btn.style.display="none";
        }
        function clickLeft(ev){
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            if(target.nodeName.toLowerCase() == "li"){
                var id=target.getAttribute("value");
                curMenu=parseInt(id.substring(4))-1;
                leftOn();
                lastMenu=curMenu;
                c.rollCurY=rightArr[curMenu].top;//itemArr[curMenu];
                c.moveTo(-rightArr[curMenu].top,1000,"release");
                ev.stopPropagation();
                //target.style.background = "green";
            }
        }

        function leftOn(){
            leftArr[lastMenu].className="left-nav-out";
            leftArr[curMenu].className="left-nav-on";
        }
    }
}

/*组件*/
/////////////////////滚动条
function Roll(m,el,p,paRoll){
    this.el=el;
    this.mask=m;
    this.maskMin=m?parseInt(m.getBoundingClientRect().top):0;//到浏览器视窗的位置距离
    this.maskLen=m?parseInt(m.offsetHeight):parseInt(window.screen.availHeight);
    this.rollMin=0;//到MASK的距离，包含margin padding;
    this.rollMax=parseInt(this.el.offsetHeight-this.maskLen);
    this.rollDownY=0;//用getBoundingClientRect()计算以MASK为边的距离
    this.rollCurY=0;//同上
    this.mouseDownY=0;
    this.mouseCurY=0;
    this.enabled=false;///内容不够多不需要滚动
    this.isOn=false;
    this.event=[];
    this.curTime=0;


    init(this);
    function init(th){
        if(p){
            th.maskMin=th.mask?parseInt(th.mask.getBoundingClientRect().top)- parseInt(p.getBoundingClientRect().top):0;
        }else{
            th.maskMin=th.mask?parseInt(th.mask.getBoundingClientRect().top):0;
        }
        if(paRoll){
            th.maskLen=parseInt(paRoll.maskLen-th.maskMin);//(th.maskMin-paRoll.maskMin));
            th.maskMin+=paRoll.maskMin;
        }else{
            th.maskLen=th.mask?parseInt(th.mask.offsetHeight):parseInt(window.document.body.offsetHeight-th.maskMin);//window.screen.availHeight
        }

        th.rollMin=parseInt(th.el.offsetTop);
        th.rollMax=parseInt(th.el.offsetHeight-th.maskLen+th.rollMin);//parseInt(th.el.getBoundingClientRect().top-);//

        if(th.rollMax<=0){
            th.rollMax=0;
            th.mask.style.height=parseInt(th.maskLen-th.rollMin)+"px";
            //th.el.style.background="#ff0000"
            th.el.style.height=parseInt((th.maskLen-th.rollMin)-(th.el.style.marginTop))+"px";
            th.enabled=false;
        }else{
            th.enabled=true;
        }
        //trace("@id"+th.el.getAttribute("id"),"maskMin:"+th.maskMin, "maskLen:"+th.maskLen, "rollMax:"+th.rollMax,"rollMin:"+th.rollMin,th.el.offsetTop,th.mask.offsetTop);
        return;
    }


    //对外
    this.refresh=function(){
        init(this);
    }
    this.rolling=function(){return true};
    this.rollEnd=function(){return true};
    this.moveTo=function(i,s,type){
        if(s){
            this.el.style.transitionDuration=s+"ms";
        }else{
            this.el.style.transitionDuration="0ms";
        }
        this.el.style.transform="translate(0px, "+i+"px) translateZ(0px)";
        switch(type){
            case "line":
                this.el.style.transitionTimingFunction="cubic-bezier(0,0,.1,1)";
                break;
            case "back":
                this.el.style.transitionTimingFunction="cubic-bezier(0,0,.1,1)";
                break;
            case "release":
                this.el.style.transitionTimingFunction="cubic-bezier(0, 0.46, 0.02, 0.94)";
                break;
            default :
                this.el.style.transitionTimingFunction="linear";
                break;
        }
    }
}
var info=document.getElementById("a");
Roll.prototype.on=function (){
    info=document.getElementById("a");
    var t=this;
    var cur=0;
    var lastMouseY=0;
    var lastTime=0;
    var lastSpeed=0;
    var callBack=true;
    var touch="";
    var touchId=-1;//只处理一个手指问题
    var touchEl="";
    var isMoved=false;
    t.isOn=true;
    addE();
    function addE(){
        if(util.machineIs()=="pc"){
            t.el.style.cursor="pointer";
            t.el.addEventListener("mousedown",mStart,false);
            t.el.addEventListener("mouseup",mEnd);
            t.el.addEventListener("mouseout ",mEnd);
            //t.el.addEventListener("mouseover ",mE);
            t.el.addEventListener('wheel', wheel);
            t.event=[[t.el,"mousedown",mStart],[t.el,"mouseup",mEnd],[t.el,"mouseout ",mEnd],[t.el,"wheel",wheel]];//[t.el,"mousemove",mMove],
        }else{
            t.el.addEventListener("touchstart",tStart,false);
            t.el.addEventListener("touchmove",tMove);
            t.el.addEventListener("touchend",end);
            t.el.addEventListener('wheel', wheel);
            t.event=[[t.el,"touchstart",tStart],[t.el,"touchmove",tMove],[t.el,"touchend",end],[t.el,"wheel",wheel]];
        }
    };

    function wheel(e){
        e.preventDefault();
    };
    function start(){
        isMoved=false;
        lastSpeed=0;
        //t.mask.getBoundingClientRect().top-t.maskMin 兼容值
        t.rollDownY=-parseInt(t.el.getBoundingClientRect().top)+t.maskMin+t.rollMin+ t.mask.getBoundingClientRect().top- t.maskMin;
        t.rollCurY=t.rollDownY;
        cur=t.rollCurY;
        lastTime=t.downTime=util.getTime();
        if(t.enabled){
            t.moveTo(-t.rollCurY,0);
        }
        //trace1(info,"START==el:"+t.el.getAttribute("id"),"rollDownY:"+t.rollDownY,"mouseDownY:"+t.mouseDownY,"t.rollCurY"+t.rollCurY);
    };
    function move(){
        isMoved=true;
        t.curTime=util.getTime();
        cur=-(t.mouseCurY-t.mouseDownY)+t.rollDownY;
        if(cur<0){//t.rollMin){
            t.rollCurY=-parseInt((t.mouseCurY-t.mouseDownY)*0.4);//t.rollMin-parseInt((t.mouseCurY-t.mouseDownY)*0.4);
        }else if(cur> t.rollMax){
            t.rollCurY=t.rollMax-parseInt((t.mouseCurY-t.mouseDownY)*0.4);
        }else{
            t.rollCurY=cur;//-(t.mouseCurY-t.mouseDownY)*t.rollMax/t.maskLen+t.rollDownY ;
        }
        callBack=t.rolling();
        if(!callBack)return;
        t.moveTo(-t.rollCurY,0);
        //计算移动最后的速度
        if(t.curTime-lastTime==0){
            lastSpeed=0;
        }else{
            lastSpeed=(t.mouseCurY-lastMouseY)/(t.curTime-lastTime);
        }
        lastMouseY= t.mouseCurY;
        lastTime=t.curTime;
        //trace1(info,"MOVE==el:"+t.el.getAttribute("id"),"rollDownY:"+t.rollDownY,"mouseCurY:"+t.mouseCurY,"t.rollCurY"+t.rollCurY, "cur:"+cur);
    };
    function end(e){
        if(touchEl!=e.currentTarget)return;
        if(!isMoved){return;}
        touchEl="";
        touchId=-1;
        var e = e || window.event;
        var target = e.target || e.srcElement;
        if(t.enabled){
            cur=-(500)*lastSpeed+t.rollCurY;
            t.rollCurY=parseInt(cur);
            callBack=t.rollEnd();
        }else{
            callBack=t.rollEnd();
            t.rollCurY= t.rollMin;
        }
       // trace1(info,"END==el:"+t.el.getAttribute("id"),"lastSpeed:"+lastSpeed,"t.rollCurY"+t.rollCurY);

        if(!callBack){return;}

        if (t.rollCurY <0) {// t.rollMin
            t.rollCurY=0;//t.rollMin;
            t.moveTo((-1) *0,500,"back");//rollMin
            //下拉刷新操作
        } else if (t.rollCurY > t.rollMax) {
            t.rollCurY=t.rollMax;
            t.moveTo((-1) * t.rollMax,500,"back");
        }else{
            t.moveTo(-t.rollCurY,500,"back");
        }

    };

    function mStart(e){
        t.el.addEventListener("mousemove",mMove);
        var e = e || window.event;//obj.el=el;var el= e.currentTarget||e.srcElement;//IE没有e.target，有e.srcElement
        touchEl= e.currentTarget;
        lastMouseY=t.mouseDownY=parseInt(e.screenY);
        start();
    };
    function tStart(e){
        var e = e || window.event;//obj.el=el;var el= e.currentTarget||e.srcElement;//IE没有e.target，有e.srcElement
        touchEl= e.currentTarget;
        if(touchId==-1){
            touch=e.targetTouches[0];
            touchId=touch.identifier;
            lastMouseY=t.mouseDownY=parseInt(touch.pageY);
            start();
        }
    };

    function mMove(e){
        e.preventDefault();//return;
        t.mouseCurY=parseInt(e.screenY);
        move();
    };
    function tMove(e) {
        e.preventDefault();//return;
        touch=e.targetTouches[0];
        if (touch.identifier== touchId) {
            t.mouseCurY = parseInt(touch.pageY);
            move();
        }
    };
    function mEnd(e){
        t.el.removeEventListener("mousemove",mMove);
        end(e);
    }

}
Roll.prototype.off=function (){
    this.isOn=false;
    for(var i in this.event){
        this.event[i][0].removeEventListener(this.event[i][1], this.event[i][2]);
    }
}


/////////////////////////////