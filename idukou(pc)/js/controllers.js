'use strict';
app.controller('AppController', function($scope, $http, $location, Business, $rootScope) {
	//隐藏底部栏链接
	var opencloseCemetery = true;
	var opencloseCity = true;
	$(".opencloseCemetery").click(function() {
		$(".hideLinkCemetery").toggle();
		if(opencloseCemetery) {
			$(".opencloseCemetery").css("transform", "rotate(-180deg)");
			opencloseCemetery = false;
		} else {
			$(".opencloseCemetery").css("transform", "rotate(-360deg)");
			opencloseCemetery = true;
		}
	})

	$(".opencloseCity").click(function() {
		$(".hideLinkCity").toggle();
		if(opencloseCity) {
			$(".opencloseCity").css("transform", "rotate(-180deg)");
			opencloseCity = false;
		} else {
			$(".opencloseCity").css("transform", "rotate(-360deg)");
			opencloseCity = true;
		}
	})

	$scope.goAbout = function(num) {
		nav(3);
		$location.path("/about/" + num);
	}
	//logo
	$scope.goHome = function() {
		nav(0);
		$location.path("/");
	}

	//登录框	     
	$(".btn-default").click(function() {
		$('header .row').css({
			"margin-left": ($(window).width() - 1170 - 16) / 2
		});
		$('#footer .row').css({
			"margin-left": ($(window).width() - 1170 - 48) / 2
		});
		$('#update-win').modal('hide');
	})
	$(".btn-login").click(function() {
		$('header .row').css({
			"margin-left": ($(window).width() - 1170) / 2
		});
		$('#footer .row').css({
			"margin-left": ($(window).width() - 1170) / 2
		});
		$('#update-win').modal('show');
	})

	//倒计时 
	function Countdown(obj) {
		var time = 60;
		var timeGo = window.setInterval(function() {
			time = time - 1;
			if(time <= 0) {
				window.clearInterval(timeGo);
				obj.text('重新发送验证码');
				$(".getCode").removeAttr("disabled");
			} else {
				obj.text('(' + time + ')秒后重新发送');
				$('.getCode').attr('disabled', "true")
			}
		}, 1000);
	}
	//登录验证   
	$(".getCode").click(function() {
		var loginTel = $(".telephone").val();
		var getCode = $(".getCode");
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if(loginTel.lengt == 0 || loginTel.length != 11 || !myreg.test(loginTel)) {
			$(".phoneWarn").css("display", "block")
		} else {
			$(".phoneWarn").css("display", "none")
		}
		var smsAddress = config.webAPI.address + "api/NoteMessages/SendVerification/" + loginTel + "/" + config.sms.template.verifyCode;
		$.post(smsAddress, function(data) {
			if(data == "发送成功") {
				Countdown(getCode)
			} else {
				alert("发送失败,请重试")
			}
		})
	})

	// 登录
	$scope.login = function() {
		var loginTel = $(".telephone").val();
		var authcode = $(".authcode").val();
		var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
		if(loginTel.length == 0 || loginTel.length != 11 || !myreg.test(loginTel)) {
			$(".phoneWarn").css("display", "block")
			return false;
		} else {
			$(".phoneWarn").css("display", "none")
		}
		if(authcode.length == 0) {
			$(".codeWarn").css("display", "block")
			return false;
		} else {
			$(".codeWarn").css("display", "none")
		}
		var loginUrl = config.webAPI.address + "api/Users/SMSLogin/" + loginTel + "/" + authcode + "?type=0";
		$http({
			method: 'POST',
			url: loginUrl
		}).success(function(msg) {
			//console.log(msg);
			var user = {
				Phone: msg.Phone,
				ID: msg.ID,
				TrueName: msg.TrueName,
				Address: msg.Address,
				HeadImg: msg.HeadImg,
				type: 0
			};
			storage.addUser(user);
			logining()
			$('#update-win').modal('hide');
		}).error(function(data) {
			alert("登录失败,请检查验证码是否正确");
		})
	}
})
//首页
app.controller('homeC', function($scope, $http, $location, Business, Merchants, Adview, Cemeterys, SysNews, Orders, Users, LinkMan) {
	nav(0);
	$scope.morticianLoading = true;
	$scope.businessLoading = true;
	$scope.cemeteryLoading = true;

	//推荐礼仪师
	Merchants.get({
		pageNumber: 1,
		pageSize: 4,
		sort: "SortID",
		city: "杭州市"
	}, function(data) {
		$scope.morticianLoading = false;
		if(data == null) {
			$(".morticianList").html("暂无数据")
		} else {
			data.MerchantDataObjectList.forEach(function(merchant) {
				var star = getStars(merchant.TTotalScore);
				merchant.Fullstar = star.full;
				merchant.Halfstar = star.half;
				merchant.Emptystar = star.empty;
			})
			$scope.morticianList = data.MerchantDataObjectList
		}
	})
	//品牌商家
	Business.get({
		pageNumber: 1,
		pageSize: 5,
		city: "杭州市"
	}, function(obj) {
		$scope.businessLoading = false;
		if(obj == null) {
			$(".businessList").html("暂无数据")
		} else {
			$scope.businessList = obj.BusinessDataObjectList;
		}
	})

	//广告位
	Adview.get({
		city: "杭州市",
		type: 2
	}, function(data) { //花圈店
		$scope.AdviewBusiness = data[0];
	})

	//精选陵园
	Cemeterys.get({
		pageNumber: 1,
		pageSize: 4,
		city: "杭州市"
	}, function(data) {
		$scope.cemeteryLoading = false;
		if(data == null) {
			$(".cemeteryList").html("暂无数据")
		} else {
			$scope.cemeteryList = data.CemeteryDataObjectList;
			$scope.goCemeteryMap = function(id) {
				nav(-1);
				$location.path("/cemeteryMap/" + id);
			}
		}
	})
	//广告位
	Adview.get({
		city: "杭州市",
		type: 1
	}, function(data) { //花圈店
		$scope.AdviewCemetery = data[0];
	})

	//了解更多
	SysNews.get({
		pageNumber: 1,
		pageSize: 3,
		typeNum: 0
	}, function(data) { //花圈店	    
		$scope.stories = data.SysNewsDataObjectList[0];
		$scope.storyList = data.SysNewsDataObjectList;
		$scope.storyList.shift();

	})

	SysNews.get({
		pageNumber: 1,
		pageSize: 3,
		typeNum: 1
	}, function(data) {
		$scope.geomancies = data.SysNewsDataObjectList[0];
		$scope.geomancyList = data.SysNewsDataObjectList;
		$scope.geomancyList.shift();

	})

	SysNews.get({
		pageNumber: 1,
		pageSize: 3,
		typeNum: 2
	}, function(data) {
		$scope.news = data.SysNewsDataObjectList[0];
		$scope.newList = data.SysNewsDataObjectList;
		$scope.newList.shift();

	})
	$scope.goSysnews = function(typeNum) {
		nav(-1);
		$location.path("/sysnews/" + typeNum);
	}
	$scope.goSysnew = function(id) {
		nav(-1);
		$location.path("/sysnew/" + id);
	}
	$scope.goMerchant = function(id) {
		nav(1);
		$location.path("/merchantMsg/" + id);
	}
	$scope.goNear = function() {
		nav(-1);
		$location.path("/nearMerchant");
	}
	
	
	
	//倒计时 
	function Countdown(obj) {
		var time = 60;
		var timeGo = window.setInterval(function() {
			time = time - 1;
			if(time <= 0) {
				window.clearInterval(timeGo);
				obj.text('重新发送验证码');
				$(".getVcode").removeAttr("disabled");
			} else {
				obj.text('(' + time + ')秒后重新发送');
				$('.getVcode').attr('disabled', "true")
			}
		}, 1000);
	}
	//获取验证码
	$(".getVcode").click(function(){
		var getCode = $(".getVcode");
		if(!$scope.phone || $scope.phone.toString().length != 11 || !(/^1[34578]\d{9}$/.test($scope.phone))) {
			alert('请输入有效的手机号码', 'warning');
			return false;
		}
        var smsAddress = config.webAPI.address + "api/NoteMessages/SendVerification/" + $scope.phone + "/" + config.sms.template.verifyCode;
		$.post(smsAddress, function(data) {
			if(data == "发送成功") {
				Countdown(getCode)
			} else {
				alert("发送失败,请重试")
			}
		})
  })
	//立即预约
	$scope.addOrder = function() {
		if(!$scope.phone || $scope.phone.toString().length != 11 || !(/^1[34578]\d{9}$/.test($scope.phone))) {
			alert('请输入有效的手机号码', 'warning');
			return false;
		}
		if(!$scope.Vcode) {
			alert('请输入验证码', 'warning');
			return false;
		}
		//注册或登录
		Users.GetOrCreate({
			phone: $scope.phone
		}, function(msg) {
			$scope.order = {};
			var user = {
				Phone: msg.Phone,
				ID: msg.ID,
				TrueName: msg.TrueName,
				Address: msg.Address,
				HeadImg: msg.HeadImg,
				type: 0
			};
			$scope.order.Phone = $scope.phone;
			$scope.order.Verification = $scope.Vcode;
			$scope.order.TrueName = msg.TrueName;
			$scope.order.UID = msg.ID;			
			LinkMan.get({
				city: "杭州市"
			}, function(msg) {
				$scope.order.MID = msg[0].Mid;
				$scope.merchantPhone = msg[0].Phone;
				Orders.save($scope.order, function(data) {							
					if(data.Extf3==0){
						alert(data.Verification)
						return false;
					}
					$('header .row').css({
						"margin-left": ($(window).width() - 1170) / 2
					});
					$('#msgBox').modal('show');
					storage.addUser(user);
					logining();
					$scope.phone = "";
					$scope.Vcode = "";
				})
			})
		})
	}
})
//礼仪师列表页
app.controller('merchantsC', function($scope, $http, $location, Merchants) {
	nav(1);
	$scope.morticianLoading = true;
	$scope.pageNum = 1;
	$scope.focus = 0;

	function init() {
		Merchants.get({
			pageNumber: $scope.pageNum,
			pageSize: 8,
			sort: "SortID",
			city: "杭州市"
		}, function(data) {
			$scope.morticianLoading = false;
			if(data == null) {
				$(".morticianList").html("暂无数据")
			} else {
				data.MerchantDataObjectList.forEach(function(merchant) {
					var star = getStars(merchant.TTotalScore);
					merchant.Fullstar = star.full;
					merchant.Halfstar = star.half;
					merchant.Emptystar = star.empty;
				})
				$scope.morticianList = data.MerchantDataObjectList;
				$scope.pages = data.Pagination.TotalPages;
				//				console.log($scope.morticianList);
				$scope.goMerchant = function(e) {
					$location.path("/merchantMsg/" + e.ID);
				}
				$scope.page = function(i) {
					$scope.pageNum = i + 1;
					$scope.focus = i;
					init();
				}
				$scope.pre = function() {
					if($scope.pageNum > 1) {
						$scope.pageNum--;
						$scope.focus--;
						init();
					}
				}
				$scope.next = function() {
					if($scope.pageNum < $scope.pages) {
						$scope.pageNum++;
						$scope.focus++;
						init();
					}
				}
			}

		})
	}
	init();
})
//陵园页
app.controller('cemeteriesC', function($scope, $http, $location, Cemeterys) {
	nav(2);
	$scope.cemeteryLoading = true;
	$scope.pageNum = 1;
	$scope.focus = 0;

	function init() {
		Cemeterys.get({
			pageNumber: $scope.pageNum,
			pageSize: 5,
			city: "杭州市"
		}, function(data) {
			$scope.cemeteryLoading = false;
			if(data == null) {
				$(".cemeteryList").html("暂无数据")
			} else {
				$scope.cemeteryList = data.CemeteryDataObjectList;
				$scope.pages = data.Pagination.TotalPages;
				$scope.goCemeteryMap = function(id) {
					$location.path("/cemeteryMap/" + id);
				}
				//console.log($scope.cemeteryList[0].CemImg)
				$scope.page = function(i) {
					$scope.pageNum = i + 1;
					$scope.focus = i;
					init();
				}
				$scope.pre = function() {
					if($scope.pageNum > 1) {
						$scope.pageNum--;
						$scope.focus--;
						init();
					}
				}
				$scope.next = function() {
					if($scope.pageNum < $scope.pages) {
						$scope.pageNum++;
						$scope.focus++;
						init();
					}
				}
			}
		})
	}
	init();
})

//陵园地图
app.controller('cemeteryMapC', function($scope, $http, $location, Cemeterys, $routeParams) {
	$scope.cemeteryMapLoading = true;
	console.log($routeParams.id);
	Cemeterys.getMsg({
		id: $routeParams.id,
	}, function(data) {
		$scope.cemeteryMapLoading = false;
		if(data == null) {
			$(".cemeteryMap").html("暂无数据")
		} else {
			//console.log(data);
			// 百度地图API功能
			var map = new BMap.Map("allmap");
			map.centerAndZoom(new BMap.Point(116.331398, 39.897445), 16);
			map.enableScrollWheelZoom(true);

			// 用经纬度设置地图中心点
			map.clearOverlays();
			var new_point = new BMap.Point(data.Y, data.X);
			var marker = new BMap.Marker(new_point); // 创建标注
			map.addOverlay(marker); // 将标注添加到地图中
			map.panTo(new_point);
		}
	})
})

//商家列表
app.controller('businessC', function($scope, $http, $location, Business) {
	nav(-1);
	$scope.businessLoading = true;
	$scope.pageNum = 1;
	$scope.focus = 0;

	function init() {
		Business.get({
			pageNumber: $scope.pageNum,
			pageSize: 8,
			city: "杭州市"
		}, function(obj) {
			$scope.businessLoading = false;
			if(obj == null) {
				$(".businessList").html("暂无数据")
			} else {
				$scope.businessList = obj.BusinessDataObjectList;
				$scope.pages = obj.Pagination.TotalPages;
				console.log($scope.businessList)
				$scope.page = function(i) {
					$scope.pageNum = i + 1;
					$scope.focus = i;
					init();
				}
				$scope.pre = function() {
					if($scope.pageNum > 1) {
						$scope.pageNum--;
						$scope.focus--;
						init();
					}
				}
				$scope.next = function() {
					if($scope.pageNum < $scope.pages) {
						$scope.pageNum++;
						$scope.focus++;
						init();
					}
				}
			}
		})
	}
	init();
})

//套餐页面
app.controller('comboC', function($scope, $http, $location, Orders, Users) {
	nav(-1);
	//倒计时 
	function Countdown(obj) {
		var time = 60;
		var timeGo = window.setInterval(function() {
			time = time - 1;
			if(time <= 0) {
				window.clearInterval(timeGo);
				obj.text('重新发送验证码');
				$(".getVcode").removeAttr("disabled");
			} else {
				obj.text('(' + time + ')秒后重新发送');
				$('.getVcode').attr('disabled', "true")
			}
		}, 1000);
	}
	//获取验证码
	$(".getVcode").click(function(){
		var getCode = $(".getVcode");
		if(!$scope.phone || $scope.phone.toString().length != 11 || !(/^1[34578]\d{9}$/.test($scope.phone))) {
			alert('请输入有效的手机号码', 'warning');
			return false;
		}
        var smsAddress = config.webAPI.address + "api/NoteMessages/SendVerification/" + $scope.phone + "/" + config.sms.template.verifyCode;
		$.post(smsAddress, function(data) {
			if(data == "发送成功") {
				Countdown(getCode)
			} else {
				alert("发送失败,请重试")
			}
		})
  })
	$scope.addOrder = function() {
		if(!$scope.phone || $scope.phone.toString().length != 11 || !(/^1[34578]\d{9}$/.test($scope.phone))) {
			alert('请输入有效的手机号码', 'warning');
			return false;
		}
		if(!$scope.Vcode) {
			alert('请输入验证码', 'warning');
			return false;
		}
		//注册或登录
		Users.GetOrCreate({
			phone: $scope.phone
		}, function(msg) {
			$scope.order = {};
			var user = {
				Phone: msg.Phone,
				ID: msg.ID,
				TrueName: msg.TrueName,
				Address: msg.Address,
				HeadImg: msg.HeadImg,
				type: 0
			};
			$scope.order.Phone = $scope.phone;
			$scope.order.Verification = $scope.Vcode;
			$scope.order.TrueName = msg.TrueName;
			$scope.order.UID = msg.ID;
			$scope.order.MID = "d7574f90-4883-4f63-9774-0322a63b2929";
			$scope.merchantPhone = "18367034444";
			Orders.save($scope.order, function(data) {		
					if(data.Extf3==0){
						alert(data.Verification);
						return false;
					}
					$('header .row').css({
						"margin-left": ($(window).width() - 1170) / 2
					});
					$('#msgBox').modal('show');
					storage.addUser(user);
					logining();
					$scope.phone = "";
					$scope.Vcode = "";
				  
				})
		})
	}
})

//孝道故事、风水玄学、行业资讯列表页
app.controller('sysnewsC', function($scope, $http, $location, SysNews, $routeParams) {
	$scope.sysnewsLoading = true;
	$scope.pageNum = 1;
	$scope.focus = 0;

	function init(typeNum) {
		SysNews.get({
			pageNumber: $scope.pageNum,
			pageSize: 4,
			typeNum: typeNum
		}, function(data) {
			$(".titleList li").eq(typeNum).addClass("titleActive");
			$scope.sysnewsLoading = false;
			if(data == null) {
				$(".articleList").html("暂无数据")
			} else {
				$scope.storyList = data.SysNewsDataObjectList;
				$scope.pages = data.Pagination.TotalPages;
				$scope.page = function(i) {
					$scope.pageNum = i + 1;
					$scope.focus = i;
					init(typeNum);
				}
				$scope.pre = function() {
					if($scope.pageNum > 1) {
						$scope.pageNum--;
						$scope.focus--;
						init(typeNum);
					}
				}
				$scope.next = function() {
					if($scope.pageNum < $scope.pages) {
						$scope.pageNum++;
						$scope.focus++;
						init(typeNum);
					}
				}
			}
		})
	}
	init($routeParams.typeNum);
	$(".titleList li").click(function() {
		$(this).siblings().removeClass("titleActive");
		$scope.pageNum = 1;
		$scope.focus = 0;
		init($(this).index());

	})
	$scope.goSysnew = function(id) {
		$location.path("/sysnew/" + id);
	}
})

//孝道故事、风水玄学、行业资讯内容页
app.controller('sysnewC', function($scope, $http, $location, SysNews, $routeParams) {
	$scope.sysnewLoading = true;
	$(this).siblings().removeClass("titleActive");
	SysNews.getMsg({
		id: $routeParams.id
	}, function(data) {
		//		console.log(data)
		$scope.sysnewLoading = false;
		if(data == null) {
			$(".articleList").html("暂无数据")
		} else {
			$scope.sysnew = data.NContent;
			$(".titleList li").eq(data.Type).addClass("titleActive");
		}
	})
	//	console.log($routeParams.index)
	$scope.goSysnews = function(e) {
		$location.path("/sysnews/" + e);
	}
})
//关于我们
app.controller('aboutC', function($scope, $http, $routeParams, $location, SysNews) {
	nav(3);
	$scope.pageNum = 1;
	$scope.focus = 0;
	//关于我们页-左导航栏
	num($routeParams.num - 1);
	SysNews.get({
		pageNumber: $scope.pageNum,
		pageSize: 4,
		typeNum: 6
	}, function(data) {
		$scope.MsgList = data.SysNewsDataObjectList;
		$scope.pages = data.Pagination.TotalPages;
		//		console.log($scope.MsgList);
		$scope.page = function(i) {
			$scope.pageNum = i + 1;
			$scope.focus = i;
		}
		$scope.pre = function() {
			if($scope.pageNum > 1) {
				$scope.pageNum--;
				$scope.focus--;
			}
		}
		$scope.next = function() {
			if($scope.pageNum < $scope.pages) {
				$scope.pageNum++;
				$scope.focus++;
			}
		}
		//跳转详情页
		$scope.goMsg = function(e) {
			$location.path("/companyNew/" + e);
		}
	})
})
//公司新闻
app.controller('companyNewC', function($scope, $http, $location, $routeParams, SysNews) {
	SysNews.getMsg({
		id: $routeParams.id
	}, function(data) {
		$scope.content = data.NContent;
		console.log($scope.content);
	})
})

//礼仪师详情页
app.controller('merchantMsgC', function($scope, $http, $location, $routeParams, Merchants, MerchantCase, Services, Orders, MerchantGoods, Users) {
	Merchants.getMerchant({
		id: $routeParams.id
	}, function(data) {
		$scope.merchant = data;
		var star = getStars($scope.merchant.TTotalScore);
		$scope.merchant.Fullstar = star.full;
		$scope.merchant.Halfstar = star.half;
		$scope.merchant.Emptystar = star.empty;
	
	//倒计时 
	function Countdown(obj) {
		var time = 60;
		var timeGo = window.setInterval(function() {
			time = time - 1;
			if(time <= 0) {
				window.clearInterval(timeGo);
				obj.text('重新发送验证码');
				$(".getVcode").removeAttr("disabled");
			} else {
				obj.text('(' + time + ')秒后重新发送');
				$('.getVcode').attr('disabled', "true")
			}
		}, 1000);
	}
	//获取验证码
	$(".getVcode").click(function(){
		var getCode = $(".getVcode");
		if(!$scope.phone || $scope.phone.toString().length != 11 || !(/^1[34578]\d{9}$/.test($scope.phone))) {
			alert('请输入有效的手机号码', 'warning');
			return false;
		}
        var smsAddress = config.webAPI.address + "api/NoteMessages/SendVerification/" + $scope.phone + "/" + config.sms.template.verifyCode;
		$.post(smsAddress, function(data) {
			if(data == "发送成功") {
				Countdown(getCode)
			} else {
				alert("发送失败,请重试")
			}
		})
  })
      //电话预约
		$scope.addOrder = function(e) {
			if(!$scope.phone || $scope.phone.toString().length != 11 || !(/^1[34578]\d{9}$/.test($scope.phone))) {
				alert('请输入有效的手机号码', 'warning');
				return false;
			}
			if(!$scope.Vcode) {
			alert('请输入验证码', 'warning');
			return false;
		}
			//注册或登录
			Users.GetOrCreate({
				phone: $scope.phone
			}, function(msg) {
				$scope.order = {};
				var user = {
					Phone: msg.Phone,
					ID: msg.ID,
					TrueName: msg.TrueName,
					Address: msg.Address,
					HeadImg: msg.HeadImg,
					type: 0
				};
				$scope.order.Phone = $scope.phone;
				$scope.order.Verification = $scope.Vcode;
				$scope.order.TrueName = msg.TrueName;
				$scope.order.UID = msg.ID;
				$scope.order.MID = e.ID;
				$scope.merchantPhone = e.Phone;

				//生成订单
				Orders.save($scope.order, function(data) {							
					if(data.Extf3==0){
						alert(data.Verification);
						return false;
					}
					$('header .row').css({
						"margin-left": ($(window).width() - 1170) / 2
					});
					$('#msgBox').modal('show');
					storage.addUser(user);
					logining();
					$scope.phone = "";
					$scope.Vcode = "";
				})
			})
		}

	})
	MerchantCase.get({
		mid: $routeParams.id
	}, function(data) {
		$scope.riteList = data;
		if(!$scope.riteList || $scope.riteList.length == 0) {
			$scope.riteList = false;
		}
	})
	Services.get({
		mid: $routeParams.id
	}, function(data) {
		$scope.services = data;
		if(!$scope.services || $scope.services.length == 0) {
			$scope.services = false;
		} else {
			$scope.services.forEach(function(service) {
				MerchantGoods.getByType({
					tid: service.ID
				}, function(msg) {
					service.merchantGoods = msg;
				})
			})
		}
	})
	$scope.focus = 0;

	function getTOP(i) { //点击获取滚动条高度
		var x = $(".goodlist").eq(0).offset().top;
		for(var j = 0; j < i; j++) {
			x += $(".goodlist ul").eq(j).height();
		}
		return x + (i) * 60;
	}

	$scope.selectSevice = function(i) {
		$scope.focus = i;
		$(window).scrollTop(getTOP(i));
	}
})

//用户订单
app.controller('userOrdersC', function($scope, $http, $location, $routeParams, Orders, Merchants) {
	//	nav(-1);
	$scope.userOrdersLoading = true;
	Orders.getList({
		uid: storage.getUser().ID
	}, function(data) {
		$scope.userOrdersLoading = false;
		if(data == null) {
			$(".userOrder").html("暂无数据");
		} else {
			$scope.userOrderList = data;
			if(!$scope.userOrderList || $scope.userOrderList.length == 0) {
				$scope.userOrderList = false;
			} else {
				$scope.userOrderList.forEach(function(userOrder) {
					Merchants.getMerchant({
						id: userOrder.MID
					}, function(msg) {
						userOrder.merchant = msg;
					})

				})
				//点击删除弹框
				$scope.delOrder = function(id) {
					//console.log(id);
					Orders.del({
						id: id,
						delstate: -3
					}, function(data) {
						$('header .row').css({
							"margin-left": ($(window).width() - 1170) / 2
						});
						$('#delForOrder').modal('show');
						$(".btn-default").click(function() {
							$('#delForOrder').modal('hide');
							window.location.reload();
						})
					})
				}
				//退出订单回到首页
				$scope.exitToIndex = function() {
					storage.delUser();
					$location.path("/home/");
				}
			}

		}
	})
})

//附近礼仪师
app.controller('nearMerchantC', function($scope, $http, $location, Merchants) {
	$scope.morticianLoading = true;
	var map, geolocation;
	//加载地图，调用浏览器定位服务
	map = new AMap.Map('container', {
		resizeEnable: true
	});
	map.plugin('AMap.Geolocation', function() {
		geolocation = new AMap.Geolocation({
			enableHighAccuracy: true, //是否使用高精度定位，默认:true
			timeout: 10000, //超过10秒后停止定位，默认：无穷大
			buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
			zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			buttonPosition: 'RB'
		});
		// map.addControl(geolocation);
		geolocation.getCurrentPosition();
		AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
		AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
	});
	//解析定位结果
	function onComplete(data) {
		//console.log('经度：' + data.position.getLng() + '纬度：' + data.position.getLat());
		$scope.nearMerchant = true;
		Merchants.nearMerchant({
			pageNumber: 1,
			pageSize: 4,
			sortName: "city",
			sortOrder: "杭州市",
			longitude: data.position.getLat(),
			latitude: data.position.getLng()
		}, function(data) {
			$scope.morticianLoading = false;
			if(data == null) {
				$(".morticianList").html("暂无数据");
			} else {
				data.MerchantDataObjectList.forEach(function(merchant) {
					var star = getStars(merchant.TTotalScore);
					merchant.Fullstar = star.full;
					merchant.Halfstar = star.half;
					merchant.Emptystar = star.empty;
				})
				$scope.morticianList = data.MerchantDataObjectList;
				$scope.goMerchant = function(e) {
					$location.path("/merchantMsg/" + e.ID);
				}
			}
		});
	}
	//解析定位错误信息
	function onError(data) {
		alert("非常抱歉,你的浏览器版本不支持定位功能");
		//推荐礼仪师
		Merchants.get({
			pageNumber: 1,
			pageSize: 4,
			sort: "SortID",
			city: "杭州市"
		}, function(data) {
			$scope.morticianLoading = false;
			if(data == null) {
				$(".morticianList").html("暂无数据")
			} else {
				data.MerchantDataObjectList.forEach(function(merchant) {
					var star = getStars(merchant.TTotalScore);
					merchant.Fullstar = star.full;
					merchant.Halfstar = star.half;
					merchant.Emptystar = star.empty;
				})
				$scope.morticianList = data.MerchantDataObjectList
			}
		})
	}
})

//个人中心
app.controller('personalCenterC', function($scope, $http, $routeParams, $location, Users, Orders, Merchants, Conpou) {
	$scope.introLoading = true;
	$http({
		method: 'GET',
		url: config.webAPI.address + 'api/Users/' + storage.getUser().ID
	}).success(function(data) {
		$scope.introLoading = false;
		$scope.personalMsg = data;
		//提交信息
		$(".submitBtn").click(function() {
			if(!$scope.personalMsg.TrueName) {
				alert("请输入姓名！");
				return false;
			}
			if(!$scope.personalMsg.Phone || $scope.personalMsg.Phone.length != 11 || !(/^1[34578]\d{9}$/.test($scope.personalMsg.Phone))) {
				alert("请输入正确手机号！");
				return false;
			}
			if(!$scope.personalMsg.Address) {
				alert("请输入地址！");
				return false;
			}

			var updateUrl = config.webAPI.address + "api/Users/Update";
			$http.post(config.webAPI.address + 'api/Users/Update', $scope.personalMsg).success(function(data) {
				if(data) {
					$('#successAfter').modal('show');
					var user = {
						Phone: data.Phone,
						ID: data.ID,
						TrueName: data.TrueName,
						Address: data.Address,
						HeadImg: data.HeadImg,
						type: 0
					};
					storage.addUser(user);
					$(".btn-default").click(function() {
						$('#delForOrder').modal('hide');
						window.location.reload();
					})
					//					window.location.reload();
				}

			});
		})

	}).error(function(data) {
		console.log("获取数据错误");

	})

	//订单列表
	$scope.userOrdersLoading = true;
	Orders.getList({
		uid: storage.getUser().ID
	}, function(data) {
		$scope.userOrdersLoading = false;
		if(data == null) {
			$(".userOrder").html("暂无数据");
		} else {
			$scope.userOrderList = data;
			if(!$scope.userOrderList || $scope.userOrderList.length == 0) {
				$scope.userOrderList = false;
			} else {
				$scope.userOrderList.forEach(function(userOrder) {
					//礼仪师的资料
					Merchants.getMerchant({
						id: userOrder.MID
					}, function(msg) {
						userOrder.merchant = msg;
					})

				})
				//点击删除弹框
				$scope.delOrder = function(id) {
					//console.log(id);
					Orders.del({
						id: id,
						delstate: -3
					}, function(data) {
						$('header .row').css({
							"margin-left": ($(window).width() - 1170) / 2
						});
						$('#delForOrder').modal('show');
						$(".btn-default").click(function() {
							$('#delForOrder').modal('hide');
							//重新调用接口
							$scope.userOrdersLoading = true;
							Orders.getList({
								uid: storage.getUser().ID
							}, function(data) {
								$scope.userOrdersLoading = false;
								if(data == null) {
									$(".userOrder").html("暂无数据");
								} else {
									$scope.userOrderList = data;
									if(!$scope.userOrderList || $scope.userOrderList.length == 0) {
										$scope.userOrderList = false;
									} else {
										$scope.userOrderList.forEach(function(userOrder) {
											Merchants.getMerchant({
												id: userOrder.MID
											}, function(msg) {
												userOrder.merchant = msg;
											})

										})

									}

								}
							})

						})
					})
				}

			}

		}
	})
	
	//优惠券
	console.log(storage.getUser().Phone)
	$scope.couponLoading = true;
	$http({
		method:'GET',
		url:config.webAPI.address+'api/Conpou/GetAllCouponByUPhone/'+storage.getUser().Phone
	}).success(function(data) {
		$scope.couponLoading=false;
		if (data.length==0) {
			$(".coupons").html("暂无数据");
		} else{
			$scope.couponList=data;
//			console.log(data);
		}
		
	}).error(function(data) {
		console.log(优惠券获取错误)
	})
})

//{"ID":"0162ffed-0395-4e6e-900a-b59daab836a1","TrueName":"恩heng","HeadImg":null,"Phone":"15993505565","Address":"新青年"}