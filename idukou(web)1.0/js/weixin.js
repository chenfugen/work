app.controller('TextC',function($scope,Weixin,$location){
    //var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa567fd1a65074ab9&redirect_uri=' + encodeURIComponent($location.$$absUrl) + '&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect';
   // $location.href = url;//var fromurl = $location.href;
    $scope.data={isEnbalePay:false,prepay_id:"",paySign:""};
    $scope.con="";
    var dd={};
    $scope.postData = {gzhID: "", buiness: "", price: "", name: ""};
    $scope.submit = function () {

        var fromurl = $location.href;
        alert(JSON.stringify($location));
        var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa567fd1a65074ab9&redirect_uri=' + encodeURIComponent(fromurl) + '&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect';
        $location.href = url;
        return;
        if(util.systemIs==='wxGZH'){



        }


        var data =storage.getWxData();//{appId:'wxa567fd1a65074ab9',timestamp=user.timestamp,nonceStr:'f0dd1013d38c4533bf2f809f957ad444',signature:'791AEC103891419D3ACB3062A244547B',openid=user.openid};
        alert(111 + JSON.stringify(data));
        //if(!data)return;
        var d = {};
        var ss="1707111502259" + Math.ceil(Math.random() * 1000 + 1) + "1";
        Weixin.unifiedOrder({
            openid: 'ozfH8w4iKURHSRL3z-0SROfuoQFg',
            out_trade_no: ss,
            body: "租金",
            total_fee: "1"
        }, function (e) {

            alert("统一下单OK:" + JSON.stringify(e.data));
            $scope.data.isEnbalePay=true;
            e.data.out_trade_no=ss;
            dd=e.data = JSON.parse(e.data);
            dd.out_trade_no=ss;
            $scope.con=JSON.stringify(dd);
        });
    };

    $scope.paybegin=function(){
        //traceJSON(dd);
        $scope.con=JSON.stringify(dd)+"beginPay:";
        wx.chooseWXPay({
            timestamp: dd.timeStamp.toString(), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: dd.nonceStr.toString(), // 支付签名随机串，不长于 32 位
            package:dd.package.toString(), //  统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: dd.signType.toString(), // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: dd.paySign.toString(), // 支付签名
            success: function (res) {
                alert("支付成功:"+JSON.stringify(res));//{errMsg:'chooseWXPay:ok'}
                Weixin.getNotify(null,function(e){
                    alert("PayOver:"+JSON.stringify(e));
                },function(e){
                    alert("PayOverError:"+JSON.stringify(e));
                    //
                });
                Weixin.postSearch({out_trade_no:dd.out_trade_no},function(e){
                    //e=JSON.parse(e);
                    alert("PaySearchOver:"+JSON.stringify(e));
                    e=JSON.parse(e.data);
                    $scope.con=JSON.stringify(dd)+"=////////////=订单查询:"+JSON.stringify(e);
                },function(e){
                    alert("PaySearchOverError:"+JSON.stringify(e));
                })
            }
        });
    };
    $scope.postText=function(){
        Weixin.postSearch({out_trade_no:dd.out_trade_no},function(e){
            alert("PaySearchOver1:"+JSON.stringify(e));

            e=JSON.parse(e);
            alert("PaySearchOver1:"+2352);
            $scope.con=JSON.stringify(dd)+"=////////////?=订单查询:"+JSON.stringify(e);
        },function(e){
            alert("PaySearchOverError2:"+JSON.stringify(e));
        })
    }



    /////////
    $scope.submit1 = function () {
        var data =storage.getWxData();//{appId:'wxa567fd1a65074ab9',timestamp=user.timestamp,nonceStr:'f0dd1013d38c4533bf2f809f957ad444',signature:'791AEC103891419D3ACB3062A244547B',openid=user.openid};
        alert(111 + JSON.stringify(data));
        //if(!data)return;
        var d = {};
        var ss="1707111502259" + Math.ceil(Math.random() * 1000 + 1) + "1";
        Weixin.unifiedOrder({
            openid: 'ozfH8w4iKURHSRL3z-0SROfuoQFg',
            out_trade_no: ss,
            body: "租金",
            total_fee: "1"
        }, function (e) {

            alert("统一下单OK:" + JSON.stringify(e.data));
            $scope.data.isEnbalePay=true;
            e.data.out_trade_no=ss;
            dd=e.data = JSON.parse(e.data);
            dd.out_trade_no=ss;
            $scope.con=JSON.stringify(dd);
        });
    };

})