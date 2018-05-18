var util = {
    uploadImage: function (imageURL, onSuccess, onFail) {
       // $.afui.showMask('上传中...');

        var ft = new FileTransfer();
        ft.upload(imageURL,APIaddress + 'api/Files/Image',
            function (data) {
                onSuccess(data);
                //$.afui.hideMask();
            }, function (data) {
                if (onFail) {
                    onFail(data);
                }
            });
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
    prompt: function (str, type) {
        var t = 'warning';
        if (type) {
            t = type;
        }
        var opts = {
            message: "<span>" + str + "</span>",
            position: "tc",
            delay: 1500,
            autoClose: true,//have to click the message to close. Bool "true"or"false"
            type: t// 提示状态颜色 可选 "success" "error" "warning"
        };
        //$.afui.toast(opts);
    },
    loading: function () {
//      $.afui.popup({
//          message: '<i class="ui-loading"></i>'
//      });
    }
};

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
