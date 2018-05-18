//
app.controller('UserC', function ($scope, $location,Users){

    if(storage.getUser()){
        $scope.isLogin=true;
        $scope.user=storage.getUser();
       // trace($scope.user);
        /*getUser(function (user) {
            trace(user)
            global.userMsg=$scope.user = user;
        });*/
    }else{
        $scope.isLogin=false;
    }
     $scope.isText=false;
	if($scope.user && ($scope.user.ID=='af99cf82-5131-41d0-a630-144cb254e126' || $scope.user.ID=='dfd37857-6c16-4ddd-932a-9155431d1061' || $scope.user.ID=='091a34b3-359b-4940-a0df-5994bbc076f1')){
		trace(JSON.stringify(storage.getUser()));
		$scope.isText=true;
	}
	
    global.lastPath="/user";
    $scope.gotoPage=function(s){
        if($scope.isLogin){
            $location.path(s);
        }else{
            $location.path("/login");
        }
    }
});
//
app.controller('UserLoginiC', function ($scope, $location, Users,Merchants){
    var reset = function () {
        $scope.phone = '';
        $scope.password = '';
    };
    var check = function () {
        if (!$scope.phone || $scope.phone.toString().length != 11) {
            $.toptip('请输入有效的手机号码', 'warning');
            return false;
        }
        if (!$scope.password) {
            $.toptip('请输入密码', 'warning');
            return false;
        }
        return true;
    };

    reset();
    $scope.login = function () {
        if(!check())return;

        $.showLoading('请稍后');
        var data = {};
        if (window.app.scope.weixinUserinfo) {
            data = {
                phone: $scope.phone,
                password: $scope.password,
                unionID: window.app.scope.weixinUserinfo.unionid,
                openID: window.app.scope.weixinUserinfo.openid,
                type: 0
            };
        }
        else {
            data = {
                phone: $scope.phone,
                password: $scope.password
            };
        }

        Users.passwordLogin(data, function (user) {
            storage.addUser(user);
            reset();
            $.hideLoading();
            if(global.lastPath.indexOf('/lysproducts')!=-1 || global.lastPath.indexOf('/lysinfo')!=-1 ){
                getDataMerchant();
                $location.path('/reserve/'+$scope.merchant.ID);
            }else{
                $location.path(global.lastPath);
            }
        }, function (e) {
            $.hideLoading();
            $.toptip('密码错误', 'error');
            return false;
        });
    };
     $scope.back=function(){
         if(global.lastPath.indexOf('/lysproducts')!=-1 || global.lastPath.indexOf('/lysinfo')!=-1 ){
            // trace(11,global.lastPath)
             $location.path(global.lastPath);
         }else{
             $location.path('/user');
         }

     }
    function getDataMerchant(){
        if(storage.getEtiquetter()){
            $scope.merchant=JSON.parse(storage.getEtiquetter());
            //calculate($scope.merchant);
        }else{
            $scope.merchant = Merchants.get({ id: $routeParams.id });
        }
    }
});
//
app.controller('UserSmsLoginC', function ($scope, $location,$timeout, Users,NoteMessages){
    var reset = function () {
        $scope.phone = '';
        $scope.verification = '';
    };
     var check_v = function () {
        if (!$scope.phone || $scope.phone.toString().length != 11) {
            $.toptip('请输入有效的手机号码', 'warning');
            return false;
        }
        return true;
    };
    var check_l = function () {
        if (!$scope.phone || $scope.phone.toString().length != 11) {
            $.toptip('请输入有效的手机号码', 'warning');
            return false;
        }
        if (!$scope.verification) {
            $.toptip('请输入验证码', 'warning');
            return false;
        }
        return true;
    };
    var wait=60;
    var timer = function () {   	
        if (wait == 0) {
            $(".verify").text('获取验证码');
            $scope.isSended = false;
            wait = 60;
            $timeout.cancel(timer);

        } else {
            $(".verify").text( wait + '秒后可重发');
            $scope.isSended = true;
            wait--;
            $timeout(function () {
                    timer();
                },
                1000);
        }
    };
    reset();
    $scope.sendVer = function () {
        if (check_v() && !$scope.isSended) {
            timer();
            NoteMessages.SendVerification({ phone: $scope.phone });
        }
    };

    $scope.login = function () {
        if(!check_l())return;
        $.showLoading('请稍后');
        var data = {};
        if (window.app.scope.weixinUserinfo) {
            data = {
                phone: $scope.phone,
                verification: $scope.password,
                unionID: window.app.scope.weixinUserinfo.unionid,
                openID: window.app.scope.weixinUserinfo.openid,
                type: 0
            };
        }
        else {
            data = {
                phone: $scope.phone,
                password: $scope.password
            };
        }

        /*Users.exist({ phone: $scope.phone }, function (data) {
         $.hideLoading();
         if (data.data == 'true') {
         $location.path('/logincode/' + $scope.phone);
         }
         else if (data.data == 'false') {

         $.toptip('该手机号还未注册，请注册后再登录', 'warning');
         }
         });*/

        var unionID = '';
        var openID = '';
        var type = '';

        if (window.app.scope.weixinUserinfo) {
            unionID = window.app.scope.weixinUserinfo.unionid;
            openID = window.app.scope.weixinUserinfo.openid;
            type = 0;
        }

        Users.smsLogin({
            phone: $scope.phone,
            verification: $scope.verification,
            unionID: unionID,
            openID: openID,
            type: type
        }, function (user) {
            storage.addUser(user);
            reset();
            $.hideLoading();
            $location.path(global.lastPath);
        }, function () {
            $.hideLoading();
            $.toptip('验证码错误', 'warning');
            return false;
        });

    };
});

app.controller('UserAccountC', function ($scope, $location,$upload,Users){
    $scope.user=storage.getUser();
    if(!$scope.user){$location.path('/login');}
    var util = {
    uploadImage: function (imageURL, onSuccess, onFail) {
       // $.afui.showMask('上传中...');

        var ft = new FileTransfer();
        ft.upload(imageURL,config.webAPI.address + 'api/Files/Image',
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
    }
    }
    $scope.uploadImage = function() {
					if(navigator.camera) {
						$.afui.actionsheet(
							[{
								text: '拍照',
								handler: function() {
									util.capturePhoto(function(imageURL) {
										util.uploadImage(imageURL, onSuccess);
									});
								}
							}, {
								text: '从手机相册选择',
								handler: function() {
									util.getPhoto(function(imageURL) {
										util.uploadImage(imageURL, onSuccess);
									});
								}
							}]);
					} else {
						$('#imgupload02').click();
					}
				};

				$scope.upload = [];
				$scope.onFileSelect = function($files) {
					//$files: an array of files selected, each file has name, size, and type.
					for(var i = 0; i < $files.length; i++) {
						var $file = $files[i];
						(function(index) {
							$scope.upload[index] = $upload.upload({
								url: config.webAPI.address + 'api/Files/Image', // webapi url
								method: 'POST',
								file: $file
							}).progress(function(evt) {
								// get upload percentage
								console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
							}).success(function(data, status, headers, config) {
								// file is uploaded successfully
								//console.log(data);
								onSuccess(data, false);
							}).error(function(data, status, headers, config) {
								// file failed to upload
								console.log(data);
							});
						})(i);
					}
				}

				$scope.abortUpload = function(index) {
					$scope.upload[index].abort();
				}

				function onSuccess(data, isApply) {
					var imageURL = '';
					if(data.response) {
						imageURL = data.response;
					} else if(data) {
						imageURL = data;
					}
					$scope.user.HeadImg = imageURL.replace('"', '').replace('"', '');
					if(isApply == undefined) {
						isApply = true;
					}
					if(isApply) {
						$scope.$apply();
					}
			      Users.save($scope.user, function () {
                    $.toast("修改成功");
                    storage.addUser($scope.user);
                });
				}				
    $scope.hasOrders=true;
    
   // $scope.user=global.userMsg;
    $scope.modify=function(s){
        var title="";
        var autoTxt="";
        var param="";
        switch(s){
            case "head":
                return;
                break;
            case "name":
                title='编辑姓名';
                autoTxt=$scope.user.TrueName;
                param="TrueName";
                break;
            case "tel":
                title='编辑联系方式';
                autoTxt=$scope.user.Phone;
                param="Phone";
                break;
            case "address":
                title='编辑地址';
                autoTxt=$scope.user.Address;
                param="Address";
                break;
            default:
                return;
                break;
        }      
        $.prompt({
            title: title,
            text: '',
            input:autoTxt,
            empty: false, // 是否允许为空
            onOK: function (input) {
                //点击确认
                $scope.user[param]=input;
                trace( $scope.user)
                Users.save($scope.user, function () {
                    $.toast("修改成功");
                    storage.addUser($scope.user);
                });
            },
            onCancel: function () {
                //点击取消
            }
        });
    }
});

app.controller('UserSettingC', function ($scope, $location){
    if(storage.getUser()){
        $scope.isLogin=true;
    }else{
        $scope.isLogin=false;
    }
    $scope.isOpen=global.isUseDateOnLine;
    if($scope.isOpen){
        $('.weui-switch').attr('checked',"checked");
    }

    $scope.setReadType=function(e){
        if( e.target.checked){
            global.isUseDateOnLine=true;
        }else{
            global.isUseDateOnLine=false;
        }
        $scope.isOpen=global.isUseDateOnLine;
    };
    $scope.showLogout = function () {
        $.actions({
            actions: [{
                text: '确认退出',
                className: 'ui-txt-warning',
                onClick: function () {
                    storage.delUser();
                    location.href = '#/user';
                }
            }]
        });
    };

});

app.controller('UserPasswordC', function ($scope,$http,$location,NoteMessages,$timeout){
    $scope.user=storage.getUser();  
    if(!$scope.user){$location.path('/login');}
    var wait = 60;
    var reset = function () {
        $scope.password1 = '';
        $scope.password2 = '';
    };
    var check = function () {
        if (!$scope.password1 || $scope.password1.toString().length<6 || $scope.password1.toString().length>32) {
            $.toptip('请输入不少于6个字符的新密码', 'warning');
            return false;
        }
        if (!$scope.password2) {
            $.toptip('请输入确认密码', 'warning');
            return false;
        }else if($scope.password1.toString()!=$scope.password2.toString()){
            $.toptip('请确认两次密码输入一致', 'warning');
            return false;
        }
        return true;
    };
    var timer = function () {   	
        if (wait == 0) {
            $(".verify").text('获取验证码');
            $scope.isSended = false;
            wait = 60;
            $timeout.cancel(timer);

        } else {
            $(".verify").text( wait + '秒后可重发');
            $scope.isSended = true;
            wait--;
            $timeout(function () {
                    timer();
                },
                1000);
        }
    };
    reset();
    $scope.submit=function(){
        if(!check()){return}
         $http({
				method: 'POST',
				url: config.webAPI.address + 'api/Users/ResetPassword/' + $scope.user.Phone+"/"+$scope.password1 +"/"+$scope.verification
			}).success(function(msg) {
			$.toptip('修改密码成功，请重新登录', 'warning');	
			storage.delUser();
			$location.path('/login');
			})
    }
    $scope.sendVer = function (){   	  	
        if(!check()){return}
        if ( !$scope.isSended) {
            timer();
            NoteMessages.SendVerification({ phone:$scope.user.Phone});
        }
    };
});                                                                                 
app.controller('UserHistoryOrdersC', function ($scope, $location,Orders,Merchants){
    if(storage.getOrder()){storage.delOrder();}
    $scope.hasOrders=false;
    if(storage.getUser()){
       getData();
    }else{
       global.lastPath="/historyOrders";
        $location.path("/login");
    }

    $scope.gotoPage=function(order,page){
        storage.addOrder(order);
        $location.path("/"+page+"/"+order.ID);
    }
//您还没有进行过交易，交易结果后的订单可在此查询！
    function getData(){
        $.showLoading('请稍后');
        Orders.user({ uid: storage.getUser().ID}, function (data) {
            var d={};
            $scope.orders = [];
            var len=data.length;
            if(data && len>0){
                var createT="";
                var nowT="";
                for (var i=0;i<len;i++){
                    data[i].Tip="订单交易关闭";
                    switch (data[i].State){
                        case -3:
                        case -2:
                        case -1:
                        case 2:
                        case 3:
                            data[i].Tip="订单交易取消";
                            break;
                        case 6:
                        case 7:
                            data[i].Tip="订单交易成功";
                            break;
                        default :
                            continue;
                    }
                    if(data[i].State==0 || data[i].State==1 || data[i].State==4 || data[i].State==5){
                        continue;
                    }
                    data[i].CreateDate=new Date(data[i].CreateDate).format("yyyy-MM-dd hh:mm:ss");

                    $scope.orders.push(data[i]);
                    trace($scope.orders[i]);
                    data[i].funeralDir= Merchants.get({ id:data[i].MID }, function () {
                        //$.hideLoading();
                    });
                }
                $scope.hasOrders=true;
            }else{
                $scope.hasOrders=false;
                $('#tip').html("您还没有进行过交易，交易结果后的订单可在此查询！");
            }
            //$('.ui-loading-wrap').hide();
            $.hideLoading();
        });
    }
});

app.controller('UserHistoryOrdersEvaluateC', function ($scope, $location,Orders,Merchants,PublicPraises,$routeParams){
    var publicPraise = {
        PCType: 1,
        OID:"",
        MID:"",
        UID:"",
        Phone:""
    };
    if(storage.getUser()){
        publicPraise.UID=storage.getUser().ID;
        publicPraise.Phone=storage.getUser().Phone;
        if(storage.getOrder()){
            publicPraise.OID=storage.getOrder().ID;
            publicPraise.MID=storage.getOrder().MID;
            publicPraise.UName=storage.getOrder().TrueName;
        }else{
            if($routeParams.id){
                Orders.get({id: $routeParams.id}, function (data) {
                    publicPraise.OID=data.ID;
                    publicPraise.MID=data.MID;
                    publicPraise.UName=data.TrueName;
                });
            }else{
                $location.path("/historyOrders");
            }
        }
    }else{
        global.lastPath="/historyOrders";
        $location.path("/login");
    }

    $scope.evaluates=[{"id":1,"title":"响应速度","showTip":"非常好","value":5},{"id":2,"title":"专业程度","showTip":"非常好","value":5},{"id":3,"title":"服务态度","showTip":"非常好","value":5}];
   // $scope.evaluates=[{"title":"响应时间","showTip":"","value":5,"RestimeNum": 5, "MajorNum": 5, "MannerNum":5},{"title":"专业程度","RestimeNum": 5, "MajorNum": 5, "MannerNum":5},{"title":"服务态度","RestimeNum": 5, "MajorNum": 5, "MannerNum":5}];
    $scope.scores=[{num:1,tip:'很差'},{num:2,tip:'一般'},{num:3,tip:'好'},{num:4,tip:'很好'},{num:5,tip:'非常好'}];
    $scope.setScore=function(score,item){
        if(score.num==item.value && score.num!=1){
            item.value=score.num-1;
            item.showTip=$scope.scores[item.value-1].tip;
        }else{
            item.value=score.num;
            item.showTip=score.tip;
        }
    }
    function postUpdateState(id, reason, state) {
		$.showLoading('请稍后');
		var obj = {};
		obj.ID = id;
		obj.Reason = reason; //"客户取消服务！";
		obj.State = state; //3;
		Orders.updateState(obj, function() {
			$.hideLoading();					
			 $.toptip('已评价', 'success');
			 $location.path('/historyOrders');
		});
	}
    $scope.submit=function(){
        publicPraise.RestimeNum=$scope.evaluates[0].value;
        publicPraise.MajorNum=$scope.evaluates[1].value;
        publicPraise.MannerNum=$scope.evaluates[2].value;
        publicPraise.PQContent=$scope.content;
        PublicPraises.save(publicPraise, function () {           
            postUpdateState(publicPraise.OID, "客户评价完成", 7);
        });
    }

    /* window.orderEvaluate = {};
     window.orderEvaluate.scope = $scope;

     $.showLoading('请稍后');
     $scope.order = Orders.get({ id: $routeParams.id }, function () {
         $.hideLoading();
     });

     $(".ui-one-star i, .ui-two-star i,.ui-three-star i").on('click',function () {
         var i = $(this).attr("title"); //当前选中的星级
         var parentCss = $(this).parent("div").attr("class").replace("ui-order-ayout ", "");  //获取父节点除ui-order-ayout的样式
         $("." + parentCss + " i").each(function (index) {
             if ($(this).hasClass("c_alizarin")) {
                 if (index >= i) {
                     $(this).removeClass("ui-ico-star c_alizarin ui-txt-f26");
                     $(this).addClass("ui-ico-grade c_alizarin ui-txt-f26");
                 }
             }
             if (index <= i) {
                 $(this).removeClass("ui-ico-grade c_alizarin ui-txt-f26");
                 $(this).addClass("ui-ico-star c_alizarin ui-txt-f26");
             }
         });
         if (parentCss == "ui-one-star") {
             $(".ui-order-shade01").html($(this).attr("val"));
             window.orderEvaluate.scope.restimeNum = parseInt(i) + 1;
         }
         else if (parentCss == "ui-two-star") {
             $(".ui-order-shade02").html($(this).attr("val"));
             window.orderEvaluate.scope.majorNum = parseInt(i) + 1;

         } else if (parentCss == "ui-three-star") {
             $(".ui-order-shade03").html($(this).attr("val"));
             window.orderEvaluate.scope.mannerNum = parseInt(i) + 1;
         }

     });
     //默认星级为5星
     $('.ui-one-star i[title="4"]').click();
     $('.ui-two-star i[title="4"]').click();
     $('.ui-three-star i[title="4"]').click();

     $scope.submit = function () {
         if (!$scope.restimeNum || !$scope.majorNum || !$scope.mannerNum) {
             $.toptip('请评价', 'warning');
             return false;
         }

         var sprice;

         $scope.order.OrdersPriceDataObjects.forEach(function (price) {
             if (price.PType == 1) {
                 sprice = price.Price;
             }
         });

         var publicPraise = {
             PCType: 1,
             OID: $scope.order.ID,
             MID: $scope.order.MID,
             SName: '一条龙服务',
             SPrice: sprice,
             UName: $scope.order.TrueName,
             PQContent: $scope.content,
             RestimeNum: $scope.restimeNum,
             MajorNum: $scope.majorNum,
             MannerNum: $scope.mannerNum,
         };
         PublicPraises.save(publicPraise, function () {
             $.toptip('已评价', 'success');
             $location.path('/orderview');
         });
     };*/

});

app.controller('UserHistoryOrdersDetailC', function ($scope, $location,$routeParams,Orders,Merchants,PublicPraises){
    if(storage.getUser()){
        getData();
       // $scope.mer=storage.getUser();
        /*if(storage.getOrder()){
            $scope.order=storage.getOrder();
        }else{
            if($routeParams.id){
                Orders.get({id: $routeParams.id}, function (data) {
                    $scope.order=data;
                });
            }else{
                $location.path("/historyOrders");
            }
        }*/
    }else{
        global.lastPath="/historyOrders";
        $location.path("/login");
    }
    $scope.deleteOrder=function(order){
        $.actions({
            title: '是否删除该订单？',
            actions: [{
                text: '确定',
                className: 'ui-txt-warning',
                onClick: function () {
                    $.showLoading('请稍后');
                    Orders.clientDelete({ id: order.ID }, function () {
                        $.hideLoading();
                        $.toast('已删除订单');
                        $location.path("/historyOrders");
                    });
                }
            }]
        });

    }
    function getData(){
        Orders.get({id: $routeParams.id}, function (data) {
            if(!data.Reason || data.Reason!=""){
                switch (data.State){

                    case -3:
                        data.Reason="预约超时（5分钟超时)";
                        break;
                    case -2:
                        data.Reason="拒绝接单（商家拒绝）";
                        break;
                    case -1:
                        data.Reason="取消预约（客户5分钟内取消）";
                        break;
                    case 2:
                        data.Reason="取消订单（接单后未付款时商家取消订单）";
                        break;
                    case 3:
                        data.Reason="取消订单（接单后未付款时客户取消订单）";
                        break;
                    case 6:
                        data.Reason="订单全款/未评价";
                        break;
                    case 7:
                        data.Reason="订单全款/已评价";
                        break;
                    default :
                        break;
                }
            }
            $scope.order=data;
            $scope.order.Discount = 0;

            $scope.funeralDir= Merchants.get({ id:data.MID }, function () {
                //$.hideLoading();
            });
             Orders.getDiscount({ id: data.ID }, function(d) { //data.ID//$routeParams.id      
						var data=JSON.parse(angular.toJson(d))
						if(data.length>0) {
							$scope.order.Discount = data[0].Price;
						} else {
							$scope.order.Discount = 0;
						}					
					});
            $scope.goodsList= Orders.goodsList({id:data.ID }, function (d) {//data.ID//$routeParams.id
                var len= d.length;
                data.TotalPrice=0;
                for (var i=0;i<len;i++){
                    data.TotalPrice+=d[i].MGPrice;
                }
            });
            if(data.State==7){
                $scope.evaluates=PublicPraises.user({ uid:storage.getUser().ID,oid:$routeParams.id }, function (obj) {
                    /*if(!obj)return;
                     var len=parseInt(obj.length);

                     if(len>0){
                     var o={
                     "ID": "bbb213ba-d3f3-421e-a51e-c97cb2619b61",
                     "PCType": 1,
                     "OID": "59c8f00b-b372-4d0f-be96-29fb42739d92",
                     "MID": "3537aa40-829c-4a86-ab51-b2592af0cd1a",
                     "SName": null,
                     "SPrice": 0,
                     "UID": "af99cf82-5131-41d0-a630-144cb254e126",
                     "UName": "lm",
                     "PQContent": "这个这个这个礼仪师很负责",
                     "CreateDate": "2017-06- 06 16:07:03",
                     "RestimeNum": 2,
                     "MajorNum": 3,
                     "MannerNum": 4,
                     "TotalScore": 3,
                     "State": 0,
                     "Reply": null,
                     "ReplyDate": "0001-01-01T00:00:00",
                     "Extf1": null,
                     "Extf2": null,
                     "Extf3": null,
                     "Extf4": null,
                     "Extf5": null
                     };
                     obj[1]=o;

                     }
                     trace($scope.evaluates)*/
                });
            }
        });
    }
    function getOrderData(){

    }
});



app.controller('UserHistoryOrdersEvaluationC', function ($scope, $location){

});
app.controller('UserAddressEditC', function ($scope, $location){
    $scope.hasOrders=true;

});
//
app.controller('UserAddressC', function ($scope, $location,Users){
    /*$scope.hasAddress=true;
     $scope.add=function(){
     $.prompt({
     title: '添加地址',
     text: '',
     input: "",
     empty: false, // 是否允许为空
     onOK: function (input) {
     //点击确认
     $scope.user.Address=input;
     Users.save($scope.user, function () {
     //$location.path('/addresspage');
     $.toast("修改成功");
     });
     },
     onCancel: function () {
     //点击取消
     }
     });
     }
     $scope.editor=function(){

     }
     $scope.delete=function(){

     }*/
});
