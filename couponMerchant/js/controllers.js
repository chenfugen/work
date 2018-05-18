'use strict';
app.controller('AppController', function($scope, $location) {
	window.app = {};
	window.app.scope = $scope;
});

//登录页
app.controller('loginC', function($scope, $location, $http, user) {
	var state;
	//登录验证
	$scope.verifyLogin = function(accountName, password, verifyCode) {
		if(accountName == undefined) {
			tip("请输入帐号名");
			return false;
		}
		if(password == undefined) {
			tip("请输入密码");
			return false;
		}
		//		if(state) {
		//			if(verifyCode == undefined) {
		//				tip("请输入验证码");
		//				return false;
		//			}
		//		}
		return true;
	}
	//判断是否已登录过
	if(getCookie('bma')) {
		$location.path("/user");
	}
	//是否获取环境
	if(!getCookie('bmasid')) {
		$.get(config.webAPI.address + "mob/account/login", function() {
		})
	}
	//判断是否记住密码
	var statue = document.getElementsByClassName("checkbox")[0];
	if(localStorage.getItem("myname") && localStorage.getItem("password")) {
		$scope.myname = localStorage.getItem("myname");
		$scope.password = localStorage.getItem("password");
		statue.checked = true;
		$scope.isRemember = 0;
	} else {
		$scope.isRemember = 0;
		statue.checked = false;
	}

	//是否记住密码
	statue.onclick = function() {
		state = false;
		if($scope.verifyLogin($scope.myname, $scope.password, $scope.verifyCode)) {
			if(this.checked) {
				$scope.isRemember = 0;
				localStorage.setItem("myname", $scope.myname);
				localStorage.setItem("password", $scope.password);
			} else {
				localStorage.clear();
			}
		} else {
			statue.checked = false;
		}
	}

	//点击登录
	$scope.login = function() {
		state = true;
		$scope.verifyLogin($scope.myname, $scope.password, $scope.verifyCode)
		$scope.user = {};
		$scope.user.myname = $scope.myname;
		$scope.user.password = $scope.password;
		$scope.user.verifyCode = $scope.verifyCode;
		$scope.user.isRemember = $scope.isRemember;
		$http({
			method: "POST",
			url: config.webAPI.address + "mob/account/login",
			data: $scope.user
		}).success(function(msg) {
			if(msg.state == "success") {
				$location.path("/user");
				tip(msg.content);
			} else {
				tip(msg.content[0].msg);
			}
		})
	}
});

//个人中心
app.controller('userC', function($scope, $location, $http) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}

	$http({
		method: "GET",
		url: config.webAPI.address + "mob/OfflineOrder/GetStoreInfo "
	}).success(function(msg) {
		//console.log(msg)
		$scope.myName = msg.Name;
	})

	//核销记录
	$scope.goCouponRecord = function() {
		$location.path("/couponRecord");
	}
	//退出
	$scope.exit = function() {
		$http({
			method: "GET",
			url: config.webAPI.address + 'mob/account/logout'
		}).success(function(data) {
			$location.path("/login");
		})
	}
})
//核销页
app.controller('cancelCouponC', function($scope, $location, $http) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
	//7749826549661518 
	$scope.cancel = function() {
		if($scope.coupons == undefined) {
			tip("请输入优惠券号");
			return false;
		}
		if($scope.coupons.length != 16) {
			tip("请输入正确的优惠券号");
			return false;
		}
		$http({
			method: "POST",
			url: config.webAPI.address + "mob/OfflineOrder/ConfirmCoupon?couponsn=" + $scope.coupons
		}).success(function(msg) {
			//console.log(msg)
			//错误提醒
			if(msg.state == "errorResult") {
				tip(msg.content)
				return false;
			}
			$scope.coupon = msg;
			$(".ui-dialog").dialog("show");
			$scope.cancelCoupon = function() {
				$http({
					method: "POST",
					url: config.webAPI.address + "mob/OfflineOrder/ConfirmOrder?couponsn=" + $scope.coupons
				}).success(function(msg) {
					$(".ui-dialog").dialog("hide")
					$scope.coupons = "";
					tip(msg.content);
				})
			}
			$scope.close = function() {
				$(".ui-dialog").dialog("hide");
			}
		})
	}

	$http({
		method: "GET",
		url: 'http://202.91.245.20:3000/api/Weixin/JsApi?url=' + "http://mall.idukou.com/couponmerchant/index.aspx"
	}).success(function(msg) {
		//console.log(msg)
		wx.config({
			debug: false,
			appId: msg.appId,
			timestamp: msg.timestamp,
			nonceStr: msg.nonceStr,
			signature: msg.signature,
			jsApiList: [
				'checkJsApi',
				'scanQRCode'
			]
		});
		wx.error(function(res) {
			tip("出错了：" + res.errMsg);
		});
		wx.ready(function() {
			wx.checkJsApi({
				jsApiList: ['scanQRCode'],
				success: function(res) {}
			})
		});
		jq('#scanQRCode1').click(function() {
			//tip(2)
			var ua = navigator.userAgent.toLowerCase();
			var isWeixin = ua.indexOf('micromessenger') != -1;
			if(!isWeixin) {
				tip("请在微信客户端打开使用");
			}
		/*wx.scanQRCode({
				needResult: 1,
				desc: 'scanQRCode desc',
			    success: function(res) {
				tip(JSON.stringify(res));
			}
		}); */
			wx.scanQRCode({
				needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				success: function(res) {
					var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果					
					var code = result.split(",");
					$scope.coupons = code[code.length - 1];
					$scope.$apply();
				}
			});
		});
	}).error(function(msg) {
		console.log(msg)
	})
})
//登记页
app.controller('registerC', function($scope, $location, $http) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
	$scope.focus = 1;
	$scope.couponState = function(e) {
		$scope.focus = e;
	}
	//商家活动
	$http({
		method: "GET",
		url: config.webAPI.address + "storeadmin/CommercialActivity/CommercialActivityListFromActStore"
	}).success(function(msg) {
		$scope.Mactivities = msg.CommercialActivityList;
	})
	//平台活动
	$.getJSON(config.webAPI.address + "storeadmin/CommercialActivity/CommercialActivityList?state=1", function(data) {
		$scope.Sactivities = data.CommercialActivityList;
		//console.log(data.CommercialActivityList)
	})
	$scope.register = function(e) {
		$(".register").dialog("show");
		$(".close").click(function() {
			$(".ui-dialog").dialog("hide");
			$scope.phone = "";
		});
	$scope.confirm = function() {
			$http({
				method: "GET",
				url: config.webAPI.address + "storeadmin/CommercialActivity/RegistrationActivity?mobile=" + $scope.phone + "&commactid=" + e
			}).success(function(msg) {
				$(".register").dialog("hide");
				$(".prompt .content").text(msg);
				$(".prompt").dialog("show");
				$scope.phone = "";
				$scope.viewLog = function() {
					$location.path("/userRecord/" + e)
				}
			})
		}
	}
	$scope.goRecord = function(e) {
		$location.path("/userRecord/" + e)
	}
})
//核销记录页
app.controller('couponRecordC', function($scope, $location, $http) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
	//核销记录表
	$http({
		method: "GET",
		url: config.webAPI.address + "mob/coupon/getcouponusedlog"
	}).success(function(msg) {
		console.log(msg)
		$scope.couponList = msg.CouponUsedLogList
	})
})

//短信登录
app.controller('smsLoginC', function($scope, $location, $http, $routeParams) {

	//倒计时 
	function Countdown(obj) {
		var time = 60;
		var timeGo = window.setInterval(function() {
			time = time - 1;
			if(time <= 0) {
				window.clearInterval(timeGo);
				obj.val('重新发送');
				$(".getCode").removeAttr("disabled");
			} else {
				obj.val('(' + time + ')秒后重新发送');
				$('.getCode').attr('disabled', "true")
			}
		}, 1000);
	}
	//登录验证   
	$(".getCode").click(function() {
		var loginTel = $(".phone").val();
		var getCode = $(".getCode");
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if(loginTel.length != 11 || !myreg.test($scope.phone)) {
			tip("请输入正确手机号码");
			return false;
		}
		$.getJSON(config.webAPI.address + "/mob/account/SendSMSLogin", {
			mobile: $scope.phone
		}, function(msg) {
			if(msg.state == "success") {
				Countdown(getCode)
			}
			tip(msg.content);
		})
	})

	$scope.login = function() {
		var loginTel = $(".phone").val();
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if(loginTel.length == 0 || loginTel.length != 11 || !myreg.test(loginTel)) {
			tip("请输入手机号码");
			return false;
		}
		if(!$scope.Vcode) {
			tip("请输入验证码");
			return false;
		}
		$http({
			method: "POST",
			url: config.webAPI.address + "mob/account/LoginBySMS",
			data: {
				mobile: $scope.phone,
				smsCode: $scope.Vcode
			}
		}).success(function(data) {
			//console.log(msg);		
			if(data.state == "success") {
				$location.path("/user");
				tip(data.content);
			} else {
				tip(data.content[0].msg);
			}
		})
	}
})
app.controller('userRecordC', function($scope, $location, $http, $routeParams) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
	var id = $routeParams.id;
	$http({
		method: "get",
		url: config.webAPI.address + "storeadmin/CommercialActivity/GetRegActUserList?CommActId=" + id
	}).success(function(msg) {
		console.log(msg);
		$scope.registerList = msg.RegUserList;
	})
})
//我的账户
app.controller('myAccountC', function($scope, $location, $http) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
})
//个人详情
app.controller('userMsgC', function($scope, $location, $http) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
	$http({
		method: "GET",
		url: config.webAPI.address + "mob/ucenter/UserInfo"
	}).success(function(msg) {
		//console.log(msg)
		$scope.user = msg[0].UserInfo;
		if(msg[1] == null) {
			var user = {};
			user.isGuestSC = 1;
			user.scSubmitType = 0;
			user.provinceId = -1; //省id
			user.cityId = -1; //市id
			user.countyId = -1; //县或区id
			msg[1] = user;
		}
		//绑定省列表
		bindProvinceList(document.getElementById("provinceId"), msg[1].ProvinceId);
		if(msg[1].CityId > 0) {
			bindCityList(msg[1].ProvinceId, document.getElementById("cityId"), msg[1].CityId);
			bindCountyList(msg[1].CityId, document.getElementById("regionId"), msg[1].RegionId);
		}

		//绑定省列表的改变事件
		$("#provinceId").change(function() {
			var selectedProvinceId = jq(this).find("option:selected").val();
			if(selectedProvinceId > 0) {
				$("#regionId").html("<option value='-1'>请选择</option>");
				bindCityList(selectedProvinceId, document.getElementById("cityId"));
			}
			//绑定市列表的改变事件
			$("#cityId").change(function() {
				var selectedCityId = jq(this).find("option:selected").val();
				if(selectedCityId > 0) {
					bindCityList(selectedCityId, document.getElementById("regionId"));
				}
			})
		})

		$scope.changeInfro = function() {
			var newuser = {};
			newuser.UserName = $scope.user.UserName;
			newuser.Mobile = $scope.user.Mobile;
			newuser.Email = $scope.user.Email;
			newuser.RegionId = document.getElementById("regionId").value;
			newuser.NickName = msg[0].UserInfo.NickName;
			newuser.IdCard = msg[0].UserInfo.IdCard;
			newuser.Bday = msg[0].UserInfo.Bday;
			newuser.Avatar = msg[0].UserInfo.Avatar;
			newuser.RealName = msg[0].UserInfo.RealName;
			newuser.Bio = msg[0].UserInfo.Bio;
			newuser.Address = $scope.user.Address;
			$http({
				method: "POST",
				data: newuser,
				url: config.webAPI.address + "mob/ucenter/EditUser"
			}).success(function(msg) {
				tip(msg.content);
			}).error(function(msg){
				tip("修改失败，稍后重试");
			})
		}
	})
})
//修改密码
app.controller('alterPasswordC', function($scope, $location, $http) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
	$scope.checked = true;
	$http({
		method: "GET",
		url: config.webAPI.address + "mob/ucenter/GetUserPartInfo"
	}).success(function(msg) {
		$scope.user = msg;
		console.log(msg)
		//倒计时 
		function Countdown(obj) {
			var time = 60;
			var timeGo = window.setInterval(function() {
				time = time - 1;
				if(time <= 0) {
					window.clearInterval(timeGo);
					obj.val('重新发送验证码');
					$(".getVcode").removeAttr("disabled");
				} else {
					obj.val('(' + time + ')秒后重新发送');
					$('.getVcode').attr('disabled', "true")
				}
			}, 1000);
		}

		//获取验证码
		$(".getVcode").click(function() {
			var getCode = $(".getVcode");
			if(!$scope.user.Mobile || $scope.user.Mobile.toString().length != 11 || !(/^1[34578]\d{9}$/.test($scope.user.Mobile))) {
				tip("请输入有效的手机号码");
				return false;
			}
			var smsAddress = config.webAPI.address + "mob/ucenter/SendVerifyMobile";
			$.post(smsAddress, function(data) {
				if(JSON.parse(data).state == "success") {
					Countdown(getCode)
				} else {
					tip("发送失败,请重试")
				}
			})
		})

		$scope.checkUser = function() {
			$http({
				method: "POST",
				data: {
					moibleCode: $scope.code
				},
				url: config.webAPI.address + "mob/ucenter/VerifyMobile?act=updatePassword&mode=mobile"
			}).success(function(msg) {
				if(msg.state == "success") {
					$scope.checked = false;
					tip('验证成功');
					$scope.changePassword = function() {
						console.log(config.webAPI.address + "mob/ucenter/updatepassword?v=" + msg.content)
						$http({
							method: "POST",
							data: {
								password: $scope.newPassword,
								confirmPwd: $scope.checkPassword
							},
							url: config.webAPI.address + "mob/ucenter/updatepassword?v=" + encodeURIComponent(msg.content)
						}).success(function(msg) {
							if(msg.state == "success") {
								$(".ui-dialog").dialog("show");
								$scope.exit = function() {
									$http({
										method: "GET",
										url: config.webAPI.address + 'mob/account/logout'
									}).success(function(data) {
										$location.path("/login");
									})
								}
							}
						})
					}
				} else {
					tip(msg.content);
				}
			})
		}
	})
})