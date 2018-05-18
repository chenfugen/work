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
function traceJSON(s){trace(JSON.stringify(s))};
//配置地址
var config = {
    webAPI: {
        address:'http://202.91.245.20:3000/'
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
    }
};

//util 工具类
var util = {

    uploadImage: function (imageURL, onSuccess, onFail) {
        $.afui.showMask('上传中...');

        var ft = new FileTransfer();
        ft.upload(imageURL, config.webAPI.address + 'api/Files/Image',
            function (data) {
                onSuccess(data);
                $.hideLoading();
            }, onFail);
    },
    capturePhoto: function (onSuccess, onFail) {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: true
        });
    },
    getPhoto: function (onSuccess, onFail) {
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
        });
    },
    guid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },
    delHtmlTag: function (str) {//去掉所有的html标签
        if (str != "" && str != undefined)
            return str.replace(/<[^>]+>/g, "");//去掉所有的html标签
        else
            return "";
    },
    limit: function (str, num) {  //截取
        if (str != "" && str != undefined) {
            var objLength = str.length;
            if (objLength > num)
                return str.substring(0, num) + "...";
            return str;
        } else
            return "";
    },
    utf16to8: function (str) { //转码-二维码
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    },
    getQueryString: function (name) {

        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },  
    systemIs:function (){
        var a=navigator.userAgent;
        var s="wx";
        if (a.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {//微信
            if(util.getQueryString('state') == 'wx' && util.getQueryString('code')){
                s="wxGZH";
            }
            return s;
        } else {
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
    }
};

//全局变量
var global={
    city:"杭州市",
    system:"pc",//判断系统　　先判断是否为微信  微信公众号　再
    lastPath:"/",//记录历史地址
    isUseDateOnLine:true,//礼仪师数据是否是时刷新
     isWxReady:false,
	wxCallback:null,
};
global.system=util.systemIs();

//存储
var USER='USER';
var FuneralDir="FuneralDir";//mortician  ETIQUETTE etiquette
var MERCHANTS="MERCHANTS";//Merchants
var GOODS="GOODS";//Merchants
var storage={
    addUser:function(user){
        var obj={};
        obj.ID=user.ID;
        obj.UserName=user.UserName;
        obj.TrueName=user.TrueName;
        obj.HeadImg=user.HeadImg;
        obj.Phone=user.Phone;
        obj.Address=user.Address;
        obj.Sex=user.Sex;
        obj.TypeID=user.TypeID;
        obj.State=user.State;
        window.localStorage.setItem(USER, JSON.stringify(obj));
    },
    getUser:function(){
        if(window.localStorage.getItem(USER)){
            return JSON.parse(window.localStorage.getItem(USER));
        }
        return false;
    },
    delUser:function(){
        window.localStorage.removeItem(USER);
    },

    addFuneralDir:function(etiquette){
        var obj={};
        obj.ID=etiquette.ID;
        obj.HeadImg=etiquette.HeadImg;
        obj.Address=etiquette.Address;
        obj.MName=etiquette.MName;
        obj.Remark=etiquette.Remark;
        obj.Phone=etiquette.Phone;
        obj.BusName=etiquette.BusName;
        obj.BusID=etiquette.BusID;
        obj.BusRemark=etiquette.BusRemark;
        obj.BusImg=etiquette.BusImg;
        obj.PublicPraiseScore=etiquette.PublicPraiseScore;
        obj.OrderCount=etiquette.OrderCount;
        obj.Fullstar=etiquette.Fullstar;
        obj.Halfstar=etiquette.Halfstar;
        obj.Emptystar=etiquette.Emptystar;
        obj.MonthOrderCount=etiquette.MonthOrderCount;
        obj.TRestimeNum =etiquette.TRestimeNum;
		obj.TMajorNum =etiquette.TMajorNum;
		obj.TMannerNum =etiquette.TMannerNum;
	    obj.TTotalScore =etiquette.TTotalScore;
        window.sessionStorage.setItem(FuneralDir, JSON.stringify(obj));
    },
    getFuneralDir:function(){
        if(window.sessionStorage.getItem(FuneralDir)){
            return JSON.parse(window.sessionStorage.getItem(FuneralDir));
        }
        return false;
    },
    delFuneralDir:function(){
        window.sessionStorage.removeItem(FuneralDir);
    },

    addMerchants:function(merchants){
        var obj={};
        obj=merchants;
        window.sessionStorage.setItem(MERCHANTS, JSON.stringify(obj));
    },
    getMerchants:function(){
        if(window.sessionStorage.getItem(MERCHANTS)){
            return JSON.parse(window.sessionStorage.getItem(MERCHANTS));
        }
        return false;
    },
    delMerchants:function(){
        window.sessionStorage.removeItem(MERCHANTS);
    },

    addGoods:function(pro){
        var obj={};
        obj=pro;
        window.sessionStorage.setItem(GOODS, JSON.stringify(obj));
    },
    getGoods:function(){
        if(window.sessionStorage.getItem(GOODS)){
            return JSON.parse(window.sessionStorage.getItem(GOODS));
        }
        return false;
    },
    delGoods:function(){
        window.sessionStorage.removeItem(GOODS);
    },

    addOrder:function(pro){
        var obj={};
        obj.ID=pro.ID;
        obj.MID=pro.MID;
        obj.UID=pro.UID;
        obj.OrdersPrice=pro.OrdersPrice;
        obj.DingPrice=pro.DingPrice;
        obj.TrueName=pro.TrueName;
        obj.CreateDate=pro.CreateDate;
        obj.State=pro.State;
        window.sessionStorage.setItem("ORDER", JSON.stringify(obj));
    },
    getOrder:function(){
        if(window.sessionStorage.getItem("ORDER")){
            return JSON.parse(window.sessionStorage.getItem("ORDER"));
        }
        return false;
    },
    delOrder:function(){
        window.sessionStorage.removeItem("ORDER");
    },
    addWxData:function(user){
        var obj={};
        obj.appId=user.appId;
        obj.timestamp=user.timestamp;
        obj.nonceStr=user.nonceStr;
        obj.signature=user.signature;
        obj.openid=user.openid;
        window.sessionStorage.setItem("WX", JSON.stringify(obj));
    },
    getWxData:function(){
        if(window.sessionStorage.getItem("WX")){
            return JSON.parse(window.sessionStorage.getItem("WX"));
        }
        return false;
    },
    delWxData:function(){
        window.sessionStorage.removeItem("WX");
    },
}

//短信
var sms={
    isValid:false,
    phone:"",
    code:"",
    sendVer:function(){

    }

}


//根据分值算实　半　空星个数
function getStars(score){
    var obj={full:0,half:0,empty:0};
    var f=Math.floor(score);
    var c=Math.ceil(score);
    var r=Math.round(score);
    if(f!=c){
        if(c==r){
        	obj.full=c;
            obj.half=0;
            obj.empty=0;
        }else{
        	obj.full=f;
            obj.half=1;
            obj.empty=0;
        }
    }else{
        obj.full=f;
        obj.half=0;
        obj.empty=5-f;
    }
    return obj;
}


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

////////////////////////////////////////////////////////////////////////////////////////

////状态值：　-3：超时5分　　　-2：拒绝　　　-1：客户5分内取消　　　0：待接单　　　1：执行中　　　2：接单未付礼仪师取消　　3：接单未付客户取消　　4：完成

function toUtf8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
        }
    }
    return out;
}


function gotoLoginPage(returnUrl, transition) {
    window.login.scope.returnUrl = returnUrl;
    if (!transition) {
        transition = 'up';
    }
    $.afui.loadContent("#loginpage", false, false, transition);
}

function gotoConfirmation(order, returnUrl) {
    if (!returnUrl) {
        returnUrl = '#orderpage';
    }

    var full;
    var deposit;

    order.OrdersPriceDataObjects.forEach(function (price) {
        if (price.PType == 1) {
            full = price.Price;
        }
        else if (price.PType == 2) {
            deposit = price.Price;
        }
    });

    var payment = {};

    if (order.State == 2) {
        payment = {
            tradeNo: order.OCode + '-2',
            subject: '千柏渡（预约服务订金）',
            body: '千柏渡（预约服务订金）',
            price: deposit
        };
    }
    else if (order.State == 4) {
        payment = {
            tradeNo: order.OCode + '-1',
            subject: '千柏渡（服务尾款）',
            body: '千柏渡（服务尾款）',
            price: full - deposit
        };
    }

    window.confirmation.scope.payment = payment;
    window.confirmation.scope.returnUrl = returnUrl;
    $.afui.loadContent("#confirmation", false, false, 'slide');
}

function setPayment(order) {
    var full;
    var deposit;
    var preferential = 0;  //优惠

    order.OrdersPriceDataObjects.forEach(function (price) {
        if (price.PType == 1) {
            full = price.Price;
        }
        else if (price.PType == 2) {
            deposit = price.Price;
        }
    });

    order.OrderCouponDataObjects.forEach(function (price) {
        preferential += price.Price;
    })


    var payment = {};

    if (order.State == 2) {
        payment = {
            tradeNo: order.OCode + '-2',
            subject: '千柏渡（预约服务订金）',
            body: '千柏渡（预约服务订金）',
            price: deposit
        };
    }
    else if (order.State == 4) {
        payment = {
            tradeNo: order.OCode + '-1',
            subject: '千柏渡（服务尾款）',
            body: '千柏渡（服务尾款）',
            price: full - deposit - preferential
        };
    }

    return payment;
}

function uploadImage(onSuccess) {
    $.afui.actionsheet(
        [{
            text: '拍照',
            handler: function () {
                util.capturePhoto(function (imageURL) {
                    util.uploadImage(imageURL, onSuccess);
                });
            }
        },
            {
                text: '从手机相册选择',
                handler: function () {
                    util.getPhoto(function (imageURL) {
                        util.uploadImage(imageURL, onSuccess);
                    });
                }
            }]);
}

var push = {
    setBaiduPush: function (appid, user_id, channel_id) {
        if (auth()) {
            $.post(config.webAPI.address + 'api/BaiduPushes', {
                UID: getUserID(),
                AppID: appid,
                UserID: user_id,
                ChannelID: channel_id,
                State: 1
            });
        }
    },
    startWork: function () {
        //百度云推送
        baidu_push.startWork(config.baidu.push.apiKey, function (data) {
            if (data.type == 'onbind') {
                push.setBaiduPush(data.data.appId, data.data.userId, data.data.channelId);
            }
        });
    }
};

function showretrie(t) {
    $(".retrie dt a").removeClass('up');
    $('.downlist').hide();
    t.addClass('up');
    $('.downlist').eq($(".retrie dt a").index(t[0])).show();
    $('.mask').show();
};


