'use strict';
app.controller('AppController', function($scope, $location) {
	window.app = {};
	window.app.scope = $scope;
});

//登录页
app.controller('loginC', function($scope, $location, $http, user) {
	//var state;
	//登录验证
	$scope.verifyLogin = function(accountName, password, verifyCode) {
		if(accountName == "") {
			tip("请输入帐号名");
			return false;
		}
		if(password == "") {
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
		$scope.verifyLogin($scope.myname, $scope.password, $scope.verifyCode)
		$scope.user = {};
		$scope.user.myname = $scope.myname;
		$scope.user.password = $scope.password;
		//		$scope.user.verifyCode = $scope.verifyCode;
		$scope.user.isRemember = $scope.isRemember;
		$http({
			method: "POST",
			url: config.webAPI.address + "mob/account/login",
			data: $scope.user
		}).success(function(msg) {
			if(msg.state == "success") {
				$location.path("/user");
				tip(msg.content)
			} else {
				tip(msg.content[0].msg)
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
	//我的优惠券
	$scope.myCoupon = function() {
		$location.path("/myCoupon");
	}
	//优惠券中心
	$scope.goCoupon = function() {
		$location.path("/getCoupon/" + 'd7b82729ad7945ba9727163c70692f93');
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
	$http({
		method: "GET",
		url: config.webAPI.address + "mob/ucenter/GetUserPartInfo"
	}).success(function(msg) {
		//console.log(msg)
		$scope.myName = msg.UserName;
		$scope.Mobile = msg.Mobile;

	})

})

//我的优惠券
app.controller('myCouponC', function($scope, $location, $http) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
	$scope.focus = 1;
	$scope.filter = 1;
	$http({
		method: "GET",
		url: config.webAPI.address + 'mob/ucenter/getcouponlist'
	}).success(function(data) {
		data.CouponList.forEach(function(coupon) {
			//console.log(coupon)
			if(coupon.usetime == "1900-01-01T00:00:00" && Date.parse(coupon.useendtime) > Date.parse(new Date())) {
				coupon.bg = 1;
			} else if(coupon.usetime != "1900-01-01T00:00:00" && Date.parse(coupon.useendtime) > Date.parse(new Date())) {
				coupon.bg = 2;
			} else {
				coupon.bg = 3;
			}
		})
		$scope.CouponList = data.CouponList;
		//console.log(data.CouponList)
		$scope.couponState = function(n) {
			$scope.focus = n;
			$scope.filter = n;
		}
		$scope.customFilter = function(coupon) {
			switch($scope.filter) {
				case 1:
					return(coupon.usetime == "1900-01-01T00:00:00" && Date.parse(coupon.useendtime) > Date.parse(new Date()));
				case 2:
					return(coupon.usetime != "1900-01-01T00:00:00" && Date.parse(coupon.useendtime) > Date.parse(new Date()));
				case 3:
					return(coupon.usetime == "1900-01-01T00:00:00" && Date.parse(coupon.useendtime) < Date.parse(new Date()));
				default:
					return true;
			}
		};
	})
	$scope.cord = function(n) {
		jq("#imgcode").JsBarcode(n.couponsn);
		$(".cord").show();
	}
	$(".cord").click(function() {
		$(".cord").hide();
	})

})
//我的账户
app.controller('myAccountC', function($scope, $location, $http) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
})
//领券中心
app.controller('getCouponC', function($scope, $location, $http, $routeParams) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
	$scope.couponed = false;
	$scope.state = true;
	var guid = $routeParams.guid;
	$http({
		method: "GET",
		url: config.webAPI.address + "mob/coupon/getcouptypebyguid?guid=" + guid
	}).success(function(msg) {
		//console.log(msg)
		$scope.coupons = msg;
		if(msg.state == 'errorResult') {
			$scope.state = false;
			tip(msg.content);
		}
	})

	//一键领取
	$scope.getCoupon = function() {
		$('.ui-dialog').show();
	}
	$(".close").click(function() {
		$(".ui-dialog").hide();
	})

	$scope.confirm = function() {
		//18057137840		
		if($scope.phone == null) {
			tip("请输入电话号码");
			return false;
		}
		if($scope.phone.length != 11) {
			tip("电话格式不正确");
			return false;
		}
		$http({
			method: "GET",
			url: config.webAPI.address + "mob/coupon/GetCouponsByOneKey?guid=" + guid + "&phone=" + $scope.phone
		}).success(function(msg) {
			//console.log(msg);
			if(msg.state != "errorResult") {
				$scope.coupons = msg;
				var tips = document.getElementsByClassName("tip")[0];
				$scope.coupons.forEach(function(coupon) {
					if(coupon.ResultState != 0 || coupon.ResultState != 1 || coupon.ResultState != 10) {
						setTimeout(function() {
							tips.style.display = 'none';
						}, 2000)
					}
				})
				$scope.couponed = true;
				$(".ui-dialog").hide();
			} else {
				tip(msg.content);
				$(".ui-dialog").hide();
				$location.path("/getCoupon/" + "d7b82729ad7945ba9727163c70692f93");
			}
		})

	}
});

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
			}).error(function(msg) {
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
//订单页
app.controller('orderC', function($scope, $location, $http) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
	$http({
		method: "GET",
		url: config.webAPI.address + "mob/ucenter/ajaxorderlist"
	}).success(function(msg) {
		if(msg.PageModel.TotalCount > 0) {
			for(var i = 0; i < msg.PageModel.TotalCount; i++) {
				msg.OrderList[i].OrderProduct = msg.OrderProductList[i];
			}
			console.log(msg)
			$scope.orders = msg.OrderList;
			//console.log($scope.orders)
			$scope.goMsg = function(oid) {
				$location.path("/orderMsg/" + oid)
			}
		} else {
			$scope.orders = null;
		}
	})
})
app.controller('orderMsgC', function($scope, $location, $http, $routeParams) {
	//判断是否已登录
	if(!getCookie('bma')) {
		$location.path("/login");
	}
	$http({
		method: "GET",
		url: config.webAPI.address + "mob/ucenter/ajaxorderinfo?oid=" + $routeParams.oid
	}).success(function(msg) {
		console.log(msg)
		$scope.OrderInfo = msg.OrderInfo;
		$scope.OrderProductList = msg.OrderProductList;
		$scope.RegionInfo = msg.RegionInfo;
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