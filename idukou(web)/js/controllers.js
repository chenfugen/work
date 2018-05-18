'use strict';
app.controller('AppController', function($scope, $location, Weixin, Users) {
	window.app = {};
	window.app.scope = $scope;
	var wxData = {};
	$scope.isFromWeixin = false;
	$scope.isWeiXin = true;
	//FastClick
	if(window.FastClick) {
		FastClick.attach(document.documentElement);
	}
	if(global.system == "wx" || global.system == "wxGZH") {
		Weixin.getJsApi({
			url: $location.absUrl().split('#')[0]
		}, function(data) {
			wxData.appId = data.appId;
			wxData.timestamp = data.timestamp;
			wxData.nonceStr = data.nonceStr;
			wxData.signature = data.signature;
			addWXdata();
			//微信 通过config接口注入权限验证配置
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: data.appId, // 必填，公众号的唯一标识
				timestamp: data.timestamp, // 必填，生成签名的时间戳
				nonceStr: data.nonceStr, // 必填，生成签名的随机串
				signature: data.signature, // 必填，签名，见附录1
				jsApiList: ['getLocation', 'chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});

			Weixin.getUser({
				code: util.getQueryString('code')
			}, function(userinfo) {
				if(userinfo && userinfo.openid) {
					initWX();
				} else {}
			});
		});
	}
	wx.ready(function() {
		global.isWxReady = true;
		if(global.wxCallback) {
			global.wxCallback();
			global.wxCallback = null;
		}
		$scope.weixinUserinfo = Weixin.getUser({
			code: util.getQueryString('code')
		}, function(userinfo) {
			if(userinfo && userinfo.openid) {
				initWX();
			} else {}
		});
		//$scope.getCurrentLocation();
	});

	function initWX(userinfo) {
		wxData.openid = userinfo.openid;
		addWXdata();
		if(userinfo && userinfo.unionid) {
			$scope.isFromWeixin = true;
			Users.getByWeixin({
				unionID: userinfo.unionid
			}, function(user) {
				//alert(user)
				if(user && user.ID) {
					//有绑定用户，登录
					Users.weixinLogin({
						unionID: userinfo.unionid
					});
					storage.addUser(user);
					$location.path('/');
				} else {
					//没有绑定用户，注册or绑定
					// $location.path('/registerpage');
					$location.path('/');
				}
			});
		}
		var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa567fd1a65074ab9&redirect_uri=' + encodeURIComponent($location.$$absUrl) + '&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect';
		$location.href = url; //var fromurl = $location.href;
	}

	function addWXdata() {
		if(wxData.appId && wxData.openid) {
			storage.addWxData(wxData);
		} else {
			//alert("无法获取到登录用户ID")
			//alert(wxData.openid+" = "+wxData.appId  )
		}
	}

	//$scope.getCurrentLocation();
	$scope.getUser = function(onSuccess) {
		Users.get({
			id: storage.getUser().ID
		}, function(user) {
			if(user.ID) {
				$scope.user = user;
				onSuccess(user);
			} else {
				$scope.isAuth = false;
				storage.delUser();
			}
		}, function() {
			$scope.isAuth = false;
			storage.delUser();
		});
	};

	$scope.gotoPage = function(url) {
		location.href = url;
	};
});
app.controller('onepageC', function($scope, $http, Merchants, Orders, $location, Cemeterys, Business, Adview, LinkMan, Users) {
	var address;
	$.showLoading("数据加载中", true);
	$(".weui-toast--text").css("display", "block")

	function init() {
		//倒计时 
		function Countdown(obj) {
			var time = 60;
			var timeGo = window.setInterval(function() {
				time = time - 1;
				if(time <= 0) {
					window.clearInterval(timeGo);
					obj.text('重新发送验证码');
					obj.removeAttr("disabled");
				} else {
					obj.text('(' + time + ')秒后重新发送');
					obj.attr('disabled', "true")
				}
			}, 1000);
		}
		//获取验证码
		$(".getVcode").click(function() {
			var getCode = $(".getVcode");
			if(!$scope.phone || $scope.phone.toString().length != 11 || !(/^1[34578]\d{9}$/.test($scope.phone))) {
				$.toptip('请输入有效的手机号码', 'warning');
				return false;
			}
			var smsAddress = config.webAPI.address + "api/NoteMessages/SendVerification/" + $scope.phone + "/" + config.sms.template.verifyCode;
			$.post(smsAddress, function(data) {
				if(data == "发送成功") {
					Countdown(getCode)
				} else {
					$.toptip("发送失败,请重试")
				}
			})
		})
		//电话咨询
		$scope.addOrder = function() {
			if(!$scope.phone || $scope.phone.toString().length != 11 || !(/^1[34578]\d{9}$/.test($scope.phone))) {
				$.toptip('请输入有效的手机号码', 'warning');
				return false;
			}
			if(!$scope.Vcode) {
				$.toptip('请输入验证码', 'warning');
				return false;
			}
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
					city: city
				}, function(msg) {
					$scope.order.MID = msg[0].Mid;
					$.tel({
						title: '礼仪师电话',
						text: '<div style="font-size:24px;color:#5DD7AE;">' + msg[0].Phone + '</div>',
						onOK: function() {
							window.location.href = "tel:" + msg[0].Phone;
						},
						onCancel: function() {}
					})
					//获取详细地址		
					var geocoder = new qq.maps.Geocoder({
						complete: function(result) {
							map.setCenter(result.detail.location);
							$scope.order.Address = result.detail.addressComponents.city + result.detail.addressComponents.district + result.detail.addressComponents.street + result.detail.addressComponents.town + "附近"
							Orders.save($scope.order, function(data) {
								$scope.phone = "";
								$scope.Vcode = "";
								storage.addUser(user);
							})
						}
					})
					var lat = sessionStorage.getItem("positionX")
					var lng = sessionStorage.getItem("positionY")
					var latLng = new qq.maps.LatLng(lat, lng);
					//调用信息窗口
					var info = new qq.maps.InfoWindow({
						map: map
					});
					//调用获取位置方法
					geocoder.getAddress(latLng);
				})
			})
		}

		//推荐礼仪师
		Merchants.getMerchants({
			pageNumber: 1,
			pageSize: 3,
			sort: "SortID",
			city: city
		}, function(msg) {
			if(msg == null || msg == "") {
				$("#merchant").html("<div style='width:100%;text-align:center;line-height:30px;background:white;margin-top:2px;'>暂无数据！</div>")
			} else {
				msg.MerchantDataObjectList.forEach(function(merchant) {
					if(merchant.TTotalScore == 0) {
						merchant.TTotalScore = 3;
						merchant.TRestimeNum = 3;
						merchant.TMajorNum = 3;
						merchant.TMannerNum = 3;
					}
					var star = getStars(merchant.TTotalScore);
					merchant.Fullstar = star.full;
					merchant.Halfstar = star.half;
					merchant.Emptystar = star.empty;
				})
				$scope.merchants = msg.MerchantDataObjectList;
				$scope.learnmore = function(obj) {
					global.morticianid = obj.ID;
					global.lastPath = "/";
					storage.addFuneralDir(obj);
					$location.path("/lysinfo/" + obj.ID); /*#/lysinfo/{{merchant.ID}}*/
				}
			}
		})
		//精选陵园
		Cemeterys.get({
			pageNumber: 1,
			pageSize: 2,
			city: city
		}, function(data) {
			if(data.CemeteryDataObjectList == null || data.CemeteryDataObjectList == "") {
				$("#cemetery").html("<div style='width:100%;text-align:center;line-height:30px;background:white;margin-top:2px;'>暂无数据！</div>")
				$scope.cemeteryList = "";
			} else {
				$("#cemetery").html("");
				for(var i = 0; i < data.CemeteryDataObjectList.length; i++) {
					if(data.CemeteryDataObjectList[i].CemAddr == null) {
						data.CemeteryDataObjectList[i].CemAddr = '';
					}
					if(data.CemeteryDataObjectList[i].Average == 0) {
						data.CemeteryDataObjectList[i].Average = '--';
					}
				}
				$scope.cemeteryList = data.CemeteryDataObjectList;
			}
			$scope.getMap = function(id) {
				window.location.href = "map.html?id=" + id;
			}
		})

		// 推荐商家
		Business.get({
			pageNumber: 1,
			pageSize: 3,
			city: city
		}, function(data) {
			$.hideLoading();
			if(data == null || data == "") {
				$("#store").html("<div style='width:100%;text-align:center;line-height:30px;background:white;margin-top:2px;'>暂无数据！</div>");
				$("#BusinessList").css({
					"display": "none"
				})
			} else {
				$("#BusinessList").css({
					"display": "block"
				});
				$scope.BusinessList = data.BusinessDataObjectList;
				$scope.gostore = function(id) {
					sessionStorage.setItem("id", id);
					$location.path("/business/" + id);
				}
			}
		})
		//广告位
		Adview.get({
			city: city,
			type: 1
		}, function(data) { //陵园
			$scope.adviewCemetery = data[0];
		});
		Adview.get({
			city: city,
			type: 2
		}, function(data) { //花圈店
			$scope.adviewBusiness = data[0];
		});
	}

	//定位
	var citylocation, map, city, marker = null;
	var center = new qq.maps.LatLng(39.9088638893, 116.3973838091);
	map = new qq.maps.Map(document.getElementById('container'), {
		center: center,
		zoom: 13
	});
	//获取城市列表接口设置中心点
	citylocation = new qq.maps.CityService({
		complete: function(result) {
			map.setCenter(result.detail.latLng);
			if(result.detail.name == "杭州市" || result.detail.name == "上海市") {
				city = result.detail.name;
			} else {
				city = "杭州市";
			}
			$scope.selectedSite = city;
			//获取选中的项		
			sessionStorage.setItem("positionX", result.detail.latLng.lat);
			sessionStorage.setItem("positionY", result.detail.latLng.lng);
			sessionStorage.setItem("city", city);
			init();
		}
	});
	if(sessionStorage.getItem("city") != null) {
		city = sessionStorage.getItem("city");
		$scope.selectedSite = city;
		init();
	} else {
		//调用searchLocalCity();方法    根据用户IP查询城市信息。	
		citylocation.searchLocalCity();
		var mapObj = new AMap.Map('iCenter');
		mapObj.plugin('AMap.Geolocation', function() {
			var geolocation = new AMap.Geolocation({
				enableHighAccuracy: true, //是否使用高精度定位，默认:true
				timeout: 10000, //超过10秒后停止定位，默认：无穷大
				maximumAge: 0, //定位结果缓存0毫秒，默认：0
				convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
				showButton: true, //显示定位按钮，默认：true
				buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
				buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
				showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
				showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
				panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
				zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
			});
			geolocation.getCurrentPosition();
			AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
			AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
			function onComplete(e) {
				sessionStorage.setItem("positionX", e.position.lat);
				sessionStorage.setItem("positionY", e.position.lng);
			}

			function onError() {
				console.log("定位出现问题")
				//window.location.reload();
			}
		})
	}
	//城市下拉框
	$("#selector").change(function() {
		$.showLoading("数据加载中", true)
		city = $(this).children('option:selected').val();
		sessionStorage.setItem("city", city);
		init();
	})

	//最佳礼仪师
	$scope.goMerchant = function(id) {
		if(city == "杭州市") {
			global.lastPath = "/";
			global.morticianid = id;
			$location.path("/lysinfo/" + id); /*#/lysinfo/{{merchant.ID}}*/
		}
	}
})
//主 home.html =/
app.controller('HomeC', function($scope, Merchants, $location, $http, $timeout) {
	$scope.loading = false;
	$scope.foot = false;
	$(".weui-toast--text").css({
		"display": "none"
	})
	$scope.autoOrder = ["Distance", "5-PublicPraiseScore.TotalScore", "OrderCount"]; //推荐的默认排序　表达式
	$scope.orderByExpression = $scope.autoOrder; //排序方式　表达式
	$scope.orderByReverse = ""; //倒序或正序
	$scope.filterStyle = ''; //筛选 方式
	var city = sessionStorage.getItem("city");
	$scope.locate = {
		city: city,
		address: ""
	};
	var pageSize = 5,
		pageNumber = 1,
		sortName = "city",
		positionX = sessionStorage.getItem("positionX"),
		positionY = sessionStorage.getItem("positionY");

	//加载数据	
	$.showLoading("数据加载中", true)
	$scope.getData = function() {
		Merchants.query({
			pageNumber: pageNumber,
			pageSize: pageSize,
			sortName: sortName,
			sortOrder: city,
			longitude: positionX,
			latitude: positionY
		}, function(msg) {
			var data = msg.MerchantDataObjectList;
			sessionStorage.setItem("TotalRecords", msg.Pagination.TotalRecords);
			var tempArr = [];
			var tempObj = {};
			var star;
			var len = data.length;
			for(var i = 0; i < len; i++) {
				if(!data[i].HeadImg) continue;
				tempObj = {};
				tempObj.Distance = 0;
				tempObj.Fullstar = 3;
				tempObj.Halfstar = 0;
				tempObj.Emptystar = 2;
				tempObj.PublicPraiseScore = {};
				tempObj.PublicPraiseScore.AllNum = null;
				tempObj.PublicPraiseScore.MajorNum = data[i].TMajorNum;
				tempObj.PublicPraiseScore.RestimeNum = data[i].TRestimeNum;
				tempObj.PublicPraiseScore.MannerNum = data[i].TMannerNum;
				tempObj.PublicPraiseScore.TotalScore = data[i].TTotalScore;
				tempObj.TRestimeNum = data[i].TRestimeNum;
				tempObj.TMajorNum = data[i].TMajorNum;
				tempObj.TMannerNum = data[i].TMannerNum;
				tempObj.TTotalScore = data[i].TTotalScore;
				//距离 
				if(data[i].X && data[i].Y) {
					tempObj.Distance = data[i].Distance;
				}
				//评分　
				if(tempObj.TTotalScore == 0) {
					tempObj.TTotalScore = 3;
					tempObj.TRestimeNum = 3;
					tempObj.TMajorNum = 3;
					tempObj.TMannerNum = 3;
				}
				var star = getStars(tempObj.TTotalScore);
				tempObj.Fullstar = star.full;
				tempObj.Halfstar = star.half;
				tempObj.Emptystar = star.empty;
				tempObj.ID = data[i].ID;
				tempObj.MName = data[i].MName;
				tempObj.Phone = data[i].Phone;
				tempObj.HeadImg = data[i].HeadImg;
				tempObj.Address = data[i].Address;
				tempObj.Province = data[i].Province;
				tempObj.City = data[i].City;
				tempObj.Remark = data[i].Remark;
				tempObj.Summary = data[i].Summary;
				tempObj.OrderCount = data[i].OrderCount;
				tempObj.BusID = data[i].BusID;
				tempObj.BusName = data[i].BusName;
				tempObj.BusRemark = data[i].BusRemark;
				tempObj.BusImg = data[i].BusImg;
				tempObj.MonthOrderCount = data[i].MonthOrderCount;
				tempArr.push(tempObj);
				$scope.loading = false;
				if(i == (msg.Pagination.TotalRecords - 1)) {
					$scope.foot = true;
				}
			}
			$scope.merchants = tempArr; // data;
			$.hideLoading();
			storage.addMerchants(tempArr);
		});
	}

	//滚动加载
	var height = $(window).outerHeight();
	var width = $(window).width();
	$("#homec").css({
		"width": width + "px",
		"height": height + "px",
		"overflow": "scroll"
	});
	var totalheight = 0,
		scrollTop = 50; //定义一个总的高度变量

	function loaddata() {
		var boxHeight = ($(".weui-panel_bd").height() + 2) * pageSize + 85;
		totalheight = parseFloat($("#homec").height()) + parseFloat($("#homec").scrollTop()) //浏览器的高度加上滚动条的高度 
		//console.log(boxHeight, totalheight)
		if(boxHeight <= totalheight) //当文档的高度小于或者等于总的高度的时候，开始动态加载数据
		{
			//加载数据
			pageSize += 5;
			scrollTop += 25;
			if(pageSize < parseInt(sessionStorage.getItem("TotalRecords")) + 5) {
				$scope.loading = true;
				$scope.getData();
			}
		}
	}
	$("#homec").scroll(function() {
		loaddata();
	});
	///排序　筛选  evaluation
	$scope.orderBy = function($event, s) {
		switch(s) {
			case 'dis':
				if($scope.orderByExpression != "Distance") {
					$scope.orderByReverse = "reverse";
				}
				$scope.orderByExpression = "Distance";
				break;
			case 'eva':
				if($scope.orderByExpression != "PublicPraiseScore.TotalScore") {
					$scope.orderByReverse = "";
				}
				$scope.orderByExpression = "PublicPraiseScore.TotalScore";
				break;
			case 'num':
				if($scope.orderByExpression != "OrderCount") {
					$scope.orderByReverse = "";
				}
				$scope.orderByExpression = "OrderCount";
				break;
			case 'recommand':
				$scope.orderByExpression = "Recommand";
				break;
			default:
				if($scope.orderByExpression != $scope.autoOrder) {
					$scope.orderByReverse = "";
				}
				$scope.orderByExpression = $scope.autoOrder;
				break;
		}
		if($scope.orderByExpression != $scope.autoOrder) { //tem== $scope.orderByExpression
			if($scope.orderByReverse == "") {
				$scope.orderByReverse = "reverse";
			} else {
				$scope.orderByReverse = "";
			}
		}
	}

	//商家搜索
	$scope.merchantFilter = function(merchant) {
		switch($scope.filterStyle) {
			case 'recommand':
				return merchant.Distance <= 20000;
			case 'search':
				return merchant.BusName.indexOf(
					$scope.keyword) >= 0;
				break;
			default:
				return true; //merchant.Distance >=0;
		}
	};
	$scope.search = function() {
		$scope.filterStyle = "search";
		if(!$scope.keyword || $scope.keyword == "") {
			$scope.filterStyle = "";
		}
	}
	$scope.clearSearch = function() {
		$scope.filterStyle = "";
		$scope.keyword = ""
	}
	$scope.back = function() {
		$location.path('/');
	};

	$scope.learnmore = function(obj) {
		global.lastPath = "/home";
		global.morticianid = obj.ID;
		storage.addFuneralDir(obj);
		$location.path("/lysinfo/" + obj.ID); /*#/lysinfo/{{merchant.ID}}*/
	}
	storage.delFuneralDir();
	$scope.getData();
});

//主 定位页home_orientation.html =/orientation
app.controller('HomeLocationC', function($scope, $location) {
	var user = storage.getUser();
	$scope.isNeedModify = false; //如果有用户地址则不需要进行添加操作，值为false ，没有则为true 表示需要去添加
	$scope.getUserAdd = function() {
		$("#city").text("当前位置：" + user.Address)
		$scope.userAddress = user.Address;
		$scope.isNeedModify = false;
		if(user.Address.length <= 0) {
			$scope.isNeedModify = true;
		}
	}
	var geocoder, map, getaddressList, marker = null;
	var center = new qq.maps.LatLng(39.916527, 116.397128);
	map = new qq.maps.Map(document.getElementById('container'), {
		center: center,
		zoom: 13
	});
	geocoder = new qq.maps.Geocoder({
		complete: function(result) {
			map.setCenter(result.detail.location);
			$.hideLoading();
			$scope.add = result.detail.address.split("国")[1] + "附近";
			$("#city").text("当前位置：" + $scope.add)
		}
	})

	if(user) {
		$scope.isLogin = true;
		$scope.getUserAdd();
		// $scope.address.user[0]=(JSON.parse(user).Address);
	} else {
		$scope.isLogin = false;
		var lat = sessionStorage.getItem('positionX');
		var lng = sessionStorage.getItem('positionY');
		var latLng = new qq.maps.LatLng(lat, lng);
		//调用信息窗口
		var info = new qq.maps.InfoWindow({
			map: map
		});
		//调用获取位置方法
		geocoder.getAddress(latLng);
	}

	getaddressList = new qq.maps.Geocoder({
		complete: function(result) {
			map.setCenter(result.detail.location);
			//$.hideLoading();
			$scope.add = result.detail.address.split("国")[1] + "附近";
			$("#city").text("当前位置：" + $scope.add)
			$scope.addresslist = result.detail.nearPois;
			$scope.$apply();
		}
	})

	$scope.getCurrentPosition = function() {
		//$.showLoading("定位中", true);
		var lat = sessionStorage.getItem('positionX');
		var lng = sessionStorage.getItem('positionY');
		var latLng = new qq.maps.LatLng(lat, lng);
		//调用信息窗口
		var info = new qq.maps.InfoWindow({
			map: map
		});
		getaddressList.getAddress(latLng);
	}

	$scope.modifyAdd = function() {
		$.prompt({
			title: '用户 - 地址',
			text: '',
			input: '',
			empty: false, // 是否允许为空
			onOK: function(input) {
				//点击确认
				$scope.user.Address = input;
				Users.save($scope.user, function() {
					$.toast("修改成功");
				});
			},
			onCancel: function() {
				//点击取消
			}
		});
	}
	$scope.select = function(e) {
		sessionStorage.setItem("positionX", e.latLng.lat);
		sessionStorage.setItem("positionY", e.latLng.lng);
		$location.path("/home")
	}
});

//礼仪师 详细页home_lys_info.html =/lysinfo/:id
app.controller('HomeMorticianC', function($scope, $http, $routeParams, Merchants, PublicPraises, MerchantGoods, NoteMessages, $location, MerchantCase) {
	$('this').animate({
		scrollTop: 0
	}, 700);
	$scope.comments = {
		RestimeCount: 0,
		MajorCount: 0,
		MannerCount: 0,
		content: null,
		tip: ""
	};
	var evaluateCount = 0;
	getDataMerchant();
	getDataComments();
	var tempVerification = "0000";
	//获取详细地址
	var center = new qq.maps.LatLng(39.916527, 116.397128);
	var map = new qq.maps.Map(document.getElementById('container'), {
		center: center,
		zoom: 13
	});
	//获取详细地址
	var geocoder = new qq.maps.Geocoder({
		complete: function(result) {
			map.setCenter(result.detail.location);
			var Address = result.detail.addressComponents.city + result.detail.addressComponents.district + result.detail.addressComponents.street + result.detail.addressComponents.town + "附近"
			sessionStorage.setItem("address", Address)
		}
	})
	var lat = sessionStorage.getItem("positionX")
	var lng = sessionStorage.getItem("positionY")
	var latLng = new qq.maps.LatLng(lat, lng);
	//调用信息窗口
	var info = new qq.maps.InfoWindow({
		map: map
	});
	//调用获取位置方法
	geocoder.getAddress(latLng);
	//菜单上的预约
	$scope.reserve = function() {
		if(storage.getUser()) {
			$location.path("/reserve/" + $scope.merchant.ID);
		} else {
			global.lastPath = "/lysinfo/" + $scope.merchant.ID;
			$location.path("/subscribe/" + $scope.merchant.ID);
		}
	}

	$scope.back = function() {
		if(global.lastPath.indexOf('/home') != -1) {
			$location.path(global.lastPath);
		} else {
			$location.path('/');
		}
	};
	$scope.gostore = function(id) {
		sessionStorage.setItem("id", id);
		$location.path("/business/" + id);
	}
	$scope.gotoComments = function(merchant) {
		if(merchant.PublicPraiseScore.AllNum > 0) {
			// trace("/#/evaluations/"+merchant.ID)
			$location.path("/evaluations/" + merchant.ID);
		}
	}

	function getDataComments() {
		MerchantCase.query({
			id: $routeParams.id,
			city: sessionStorage.getItem("city"),
			state: 1
		}, function(data) {
			if(data == null || data == "") {
				$("#rite").html("<div style='width:100%;text-align:center;line-height:30px;background:white;margin-top:2px;'>暂无数据！</div>");
			} else {
				$scope.riteList = data;
				$scope.riteMsg = function(id) {
					$location.path("/riteMsg/" + id);
				}
			}
		})
	}

	function getDataMerchant() {
		$scope.merchant = Merchants.get({
			id: $routeParams.id
		}, function(obj) {
			calculate(obj)
		});
	}

	function calculate(obj) {
		evaluateCount = obj.AllNum;
		//trace(obj)
		for(var i in obj.PublicPraiseScore) {
			if(obj.PublicPraiseScore.hasOwnProperty(i)) {
				$scope.comments[i] = obj.PublicPraiseScore[i];
			}
		}
		$scope.comments.RestimeCount = Math.round($scope.comments.RestimeNum);
		$scope.comments.MajorCount = Math.round($scope.comments.MajorNum);
		$scope.comments.MannerCount = Math.round($scope.comments.MannerNum);
	}

	//预约弹出窗　－　预约
	function onClickrReserve() {
		if(!$scope.phone || $scope.phone.length != 11) {
			$("#lysLoginWarning").css("visibility", "visible");
			$("#lysLoginWarning").html("请输入有效的手机号码")
			// $.toptip('请输入有效的手机号码', 'warning');
			return false;
		}
		if(!$scope.verification) {
			$("#lysLoginWarning").css("visibility", "visible");
			$("#lysLoginWarning").html("请输入验证码")
			//$.toptip('请输入验证码', 'warning');
			return false;
		}
		if($scope.verification != tempVerification) {
			NoteMessages.checkVerification({
				phone: $scope.linkphone,
				verification: $scope.verification
			}, function(data) {
				if(!data.result) {
					//$.toptip('验证码错误', 'warning');
					tip('验证码错误');
					//$scope.isVer = '验证码错误';
					return false;
				} else {
					//$scope.isVer = '';
					Users.GetOrCreate({
						phone: $scope.linkphone
					}, function(user) {
						storage.addUser(user);
						$location.path('/subscribe');
					});
					$.closeModal();
				}
			});
		} else {
			Users.GetOrCreate({
				phone: $scope.linkphone
			}, function(user) {
				storage.addUser(user);
				$location.path('/subscribe');
			});
			$.closeModal();
		}
	}

});

//礼仪师 菜单页home_lys_products.html =/lysproducts/:id
app.controller('MorticianProductsC', function($scope, Merchants, $routeParams, $location, Services, MerchantGoods, Users) {
	//$.showLoading("加载中");
	getDataMerchant();

	var check = function() {
		if(!$scope.linkphone || $scope.linkphone.length != 11) {
			tip('请输入有效的手机号码');
			return false;
		}
		if(!$scope.verification) {
			tip('请输入验证码');
			return false;
		}
		return true;
	}
	var isClick = false;
	var lastHeight = 0;
	$scope.data = {
		hasMenu: false,
		tip: "数据加载中……",
		selectedServiceID: 0
	};
	$scope.services = Services.merchantOnline({
		mid: $routeParams.id
	}, function() {
		if(!$scope.services || $scope.services.length == 0) {
			$scope.data.hasMenu = false;
			$scope.data.tip = "更新中，敬请期待!";
			caculateScroll();
			return;
		}

		$scope.data.hasMenu = true;
		var serviceLen = $scope.services.length;
		var lastId = $scope.services[serviceLen - 1].ID; //"";
		for(var i = 0; i < serviceLen; i++) { //$scope.services[i].merchantGoods
			//lastId=$scope.services[i].ID;
			if(i == serviceLen - 1) {
				$scope.services[i].MerchantDataObject = MerchantGoods.getByType({
					tid: $scope.services[i].ID
				}, function(e) {
					var len = e.length;

					if(len == 0) {
						e.noData = true;
						lastHeight = $(".listview-right-pagetitle:last").outerHeight() + $(".listview-right-nodata").outerHeight();
					} else {
						e.noData = false;
						for(var k = 0; k < len; k++) {
							if(!e[k].MGPrice) {
								e[k].MGPrice = "--";
							}
						}
						lastHeight = $(".listview-right-pagetitle:last").outerHeight() + $(".listview-right-hasdata").outerHeight() * len;
					}
					caculateScroll();
				});
			} else {
				$scope.services[i].MerchantDataObject = MerchantGoods.getByType({
					tid: $scope.services[i].ID
				}, function(e) {
					var len = e.length;
					if(len == 0) {
						e.noData = true;
					} else {
						e.noData = false;
						for(var k = 0; k < len; k++) {}
					}
					caculateScroll();
				});
			}
		}
	}, function() {
		$scope.data.hasMenu = false;
	});

	$scope.selectService = function(i, $event) {
		isClick = true;
		$scope.data.selectedServiceID = i;
		$('#listRight').animate({
			scrollTop: getTOP(i) + 'px'
		}, 100, function() {
			isClick = false;
		}); ////
	}
	$scope.learnmore = function(obj, s) {
		obj.Class = s;
		storage.addGoods(obj)
		$location.path("/lysproduct/" + obj.ID);
	}
	//获取详细地址
	var center = new qq.maps.LatLng(39.916527, 116.397128);
	var map = new qq.maps.Map(document.getElementById('container'), {
		center: center,
		zoom: 13
	});
	//获取详细地址
	var geocoder = new qq.maps.Geocoder({
		complete: function(result) {
			map.setCenter(result.detail.location);
			var Address = result.detail.addressComponents.city + result.detail.addressComponents.district + result.detail.addressComponents.street + result.detail.addressComponents.town + "附近"
			sessionStorage.setItem("address", Address)
		}
	})
	var lat = sessionStorage.getItem("positionX")
	var lng = sessionStorage.getItem("positionY")
	var latLng = new qq.maps.LatLng(lat, lng);
	//调用信息窗口
	var info = new qq.maps.InfoWindow({
		map: map
	});
	//调用获取位置方法
	geocoder.getAddress(latLng);
	//菜单上的预约
	$scope.reserve = function() {
		if(storage.getUser()) {
			$location.path("/reserve/" + $scope.merchant.ID);
		} else {
			global.lastPath = "/lysinfo/" + $scope.merchant.ID;
			$location.path("/subscribe/" + $scope.merchant.ID);
		}
	}
	//点击获取滚动条高度
	function getTOP(i) {
		if($scope.services[i].maxH && $scope.services[i].maxH != 0) {
			return $scope.services[i].maxH;
		}
		var x = 0;
		for(var j = 0; j < i; j++) {
			x += $("#listRight").children().eq(j).outerHeight();
		}
		$scope.services[i].maxH = x;
		return x;
	}

	function moveTo(el, i, s, type) {
		if(s) {
			el.style.transitionDuration = s + "ms";
		} else {
			el.style.transitionDuration = "0ms";
		}
		el.style.transform = "translate(0px, " + i + "px) translateZ(0px)";
		switch(type) {
			case "line":
				el.style.transitionTimingFunction = "cubic-bezier(0,0,.1,1)";
				break;
			case "back":
				el.style.transitionTimingFunction = "cubic-bezier(0,0,.1,1)";
				break;
			case "release":
				el.style.transitionTimingFunction = "cubic-bezier(0, 0.46, 0.02, 0.94)";
				break;
			default:
				el.style.transitionTimingFunction = "linear";
				break;
		}
	}

	function caculateScroll() {
		var height = $(window).outerHeight() - $(".fix-top").outerHeight() - $(".fix-bottom").outerHeight();
		var width = $(window).width() - 100;
		//trace(height,lastHeight)
		$("#box").css("height", (height - lastHeight + 5) + "px");
		$("#listLeft").css("height", height + "px");
		$("#listRight").css("height", height + "px");
		var slength = $scope.services.length;
		$("#listRight").scroll(function() {
			if(isClick) return;
			var scorllTop = $(this)[0].scrollTop;
			for(var k = 0; k < slength; k++) {
				if(scorllTop >= getTOP(k)) {
					if($scope.data.selectedServiceID != k) {
						$scope.data.selectedServiceID = k;
					}
				}
			}
			$scope.$apply();
		})
	}

	function getDataMerchant() {
		if(storage.getFuneralDir()) {
			$scope.merchant = storage.getFuneralDir();
			//console.log($scope.merchant)
		} else {
			$scope.merchant = Merchants.get({
				id: $routeParams.id
			});
		}
	}
});

//立即预约页
app.controller('MorticianReserveC', function($scope, $location, Merchants, Orders, NoteMessages, $routeParams) {
	var address = sessionStorage.getItem('address');
	getDataMerchant();
	$scope.order = {};
	$scope.order.MID = $scope.merchant.ID;
	$scope.order.UID = storage.getUser().ID;
	$scope.order.serviceDate = new Date();

	var user = storage.getUser();
	$scope.order.TrueName = user.TrueName;
	$scope.order.Phone = user.Phone;
	$scope.order.Address = address;

	function getDataMerchant() {
		if(storage.getFuneralDir()) {
			$scope.merchant = storage.getFuneralDir();
		} else {
			$scope.merchant = Merchants.get({
				id: $routeParams.id
			});
		}
	}
	var reset = function() {
		$scope.phone = '';
		$scope.verification = '';
	};
	var check = function() {
		if(!$scope.order.TrueName) {
			$.toptip('请输入你的姓名', 'warning');
			return false;
		}
		if(!$scope.order.Phone || $scope.order.Phone.toString().length != 11) {
			$.toptip('请输入有效的手机号码', 'warning');
			return false;
		}
		if(!$scope.order.Verification) {
			$.toptip('请输入验证码', 'warning');
			return false;
		}
		return true;
	};
	//倒计时 
	function Countdown(obj) {
		var time = 60;
		var timeGo = window.setInterval(function() {
			time = time - 1;
			if(time <= 0) {
				window.clearInterval(timeGo);
				obj.text('重新发送验证码');
				obj.removeAttr("disabled");
			} else {
				obj.text('(' + time + ')秒后重新发送');
				obj.attr('disabled', "true")
			}
		}, 1000);
	}
	//获取验证码
	$(".getVcode").click(function() {
		var getCode = $(".getVcode");
		if(!$scope.order.Phone || $scope.order.Phone.toString().length != 11) {
			$.toptip('请输入有效的手机号码', 'warning');
			return false;
		}
		var smsAddress = config.webAPI.address + "api/NoteMessages/SendVerification/" + $scope.order.Phone + "/" + config.sms.template.verifyCode;
		$.post(smsAddress, function(data) {
			if(data == "发送成功") {
				Countdown(getCode)
			} else {
				$.toptip("发送失败,请重试")
			}
		})
	})
	$scope.submit = function() {
		if(!check()) {
			return
		}
		$.showLoading('请稍后', true);
		trace(storage.getUser().ID)
		Orders.isReserving({
			uid: storage.getUser().ID
		}, function(data) {
			if(data) {
				if(!$scope.order.MID) {
					$scope.order.MID = $routeParams.id;
				}
				$scope.order.ServiceDate = $scope.order.serviceDate.getFullYear() + "-" + ($scope.order.serviceDate.getMonth() + 1) + "-" + $scope.order.serviceDate.getDate();
				$scope.order = Orders.save($scope.order, function(order) {
					$.hideLoading();
					$.tel({
						title: '礼仪师电话',
						text: '<div style="font-size:24px;color:#5DD7AE;">' + $scope.merchant.Phone + '</div>',
						onOK: function() {
							window.location.href = "tel:" + $scope.merchant.Phone;
						},
						onCancel: function() {}
					})
					$location.path('/orderdetail/' + order.ID);
				});
			} else {
				$.alert({
					title: '提示 - 已预约请稍候',
					text: '您正预约该礼仪师中，详细可点订单进去查看！',
					onOK: function() {
						//点击确认
						$.hideLoading();
					}
				});
			}
		});
	}
});
//在没有登录的情况下预约
app.controller('MorticianSubscribeC', function($scope, $http, $location, Merchants, Orders, Users, NoteMessages, $routeParams) {
	var address = sessionStorage.getItem('address');
	getDataMerchant();
	$scope.order = {};
	var user = {};
	$scope.order.MID = $scope.merchant.ID;
	$scope.order.serviceDate = new Date();
	$scope.order.Phone = $scope.order.Phone;
	$scope.order.Address = address;

	function getDataMerchant() {
		if(storage.getFuneralDir()) {
			$scope.merchant = storage.getFuneralDir();
		} else {
			$scope.merchant = Merchants.get({
				id: $routeParams.id
			});
		}
	}
	var reset = function() {
		$scope.phone = '';
		$scope.verification = '';
	};
	var check = function() {
		if(!$scope.order.Phone || $scope.order.Phone.toString().length != 11) {
			$.toptip('请输入有效的手机号码', 'warning');
			return false;
		}
		if(!$scope.order.Verification) {
			$.toptip('请输入验证码', 'warning');
			return false;
		}
		return true;
	};
	//倒计时 
	function Countdown(obj) {
		var time = 60;
		var timeGo = window.setInterval(function() {
			time = time - 1;
			if(time <= 0) {
				window.clearInterval(timeGo);
				obj.text('重新发送验证码');
				obj.removeAttr("disabled");
			} else {
				obj.text('(' + time + ')秒后重新发送');
				obj.attr('disabled', "true")
			}
		}, 1000);
	}
	//获取验证码
	$(".getVcode").click(function() {
		var getCode = $(".getVcode");
		if(!$scope.order.Phone || $scope.order.Phone.toString().length != 11) {
			$.toptip('请输入有效的手机号码', 'warning');
			return false;
		}
		var smsAddress = config.webAPI.address + "api/NoteMessages/SendVerification/" + $scope.order.Phone + "/" + config.sms.template.verifyCode;
		$.post(smsAddress, function(data) {
			if(data == "发送成功") {
				Countdown(getCode)
			} else {
				$.toptip("发送失败,请重试")
			}
		})
	})
	$scope.submit = function() {
		if(!check()) {
			return
		}
		$.showLoading('请稍后', true);
		Users.GetOrCreate({
			phone: $scope.order.Phone
		}, function(msg) {
			user = {
				Phone: msg.Phone,
				ID: msg.ID,
				TrueName: msg.TrueName,
				Address: msg.Address,
				HeadImg: msg.HeadImg,
				type: 0
			};
			$scope.order.UID = msg.ID;
			$scope.order.TrueName = msg.TrueName;
			$scope.order = Orders.save($scope.order, function(order) {
				$.hideLoading();
				$location.path('/lysinfo/' + $scope.merchant.ID);
				$.tel({
					title: '礼仪师电话',
					text: '<div style="font-size:24px;color:#5DD7AE;">' + $scope.merchant.Phone + '</div>',
					onOK: function() {
						window.location.href = "tel:" + $scope.merchant.Phone;
					},
					onCancel: function() {}
				})
				storage.addUser(user);
			});
		});
	}
});

//礼仪师 详细页 评价home_lys_info_comment.html =/comment/:id
app.controller('MorticianEvaluationsC', function($scope, $location, PublicPraises, Merchants, $routeParams) {
	$scope.loading = true;
	$scope.record = false;
	$scope.id = storage.getFuneralDir().ID; //sessionStorage.getItem('ETIQUETTE_ID');
	if(!$scope.id) {
		$location.path("/home");
	}
	$scope.filterStyle = "";

	$scope.comments = {
		TotalCount: 0,
		GoodCount: 0,
		NormalCount: 0,
		BadCount: 0,
		RestimeCount: 0,
		MajorCount: 0,
		MannerCount: 0,
		contentCount: 0,
		content: []
	};

	function getData() {
		$scope.merchant = Merchants.get({
			id: $routeParams.id
		}, function(obj) {
			for(var i in obj.PublicPraiseScore) {
				if(obj.PublicPraiseScore.hasOwnProperty(i)) {
					$scope.comments[i] = obj.PublicPraiseScore[i];
				}
			}
			$scope.comments.TotalCount = Math.round($scope.comments.TotalScore);
			$scope.comments.RestimeCount = Math.round($scope.comments.RestimeNum);
			$scope.comments.MajorCount = Math.round($scope.comments.MajorNum);
			$scope.comments.MannerCount = Math.round($scope.comments.MannerNum);
		});

		$scope.allPublicPraises = PublicPraises.query({
			mid: $routeParams.id,
			search: 0
		}, function(obj) {
			$scope.comments.content = $scope.allPublicPraises;
			$scope.comments.contentCount = $scope.comments.content.length;
			$scope.comments.TotalCount = $scope.comments.GoodCount = $scope.comments.NormalCount = $scope.comments.BadCount = 0;
			for(var i = 0; i < obj.length; i++) {
				if(obj[i].TotalScore >= 4) {
					$scope.comments.content[i].level = 'Good';
					$scope.comments.GoodCount++;
				} else {
					if(obj[i].TotalScore >= 2) {
						$scope.comments.content[i].level = 'Normal';
						$scope.comments.NormalCount++;
					} else {
						$scope.comments.content[i].level = 'Bad';
						$scope.comments.BadCount++;
					}
				}
			}
			$scope.loading = false;
			$scope.record = true;
		});
	}
	$scope.myfilter = function(s) {
		if(!s) {
			$scope.filterStyle = "";
		} else {
			$scope.filterStyle = s;
		}
	}
	$scope.commentFilter = function(item) {
		switch($scope.filterStyle) {
			case "good":
				return item.level == "Good";
			case "normal":
				return item.level == "Normal";
			case "bad":
				return item.level == "Bad";
			case "":
				return true;
			default:
				return true;
		}
	}
	//获取详细地址
	var center = new qq.maps.LatLng(39.916527, 116.397128);
	var map = new qq.maps.Map(document.getElementById('container'), {
		center: center,
		zoom: 13
	});

	//获取详细地址
	var geocoder = new qq.maps.Geocoder({
		complete: function(result) {
			map.setCenter(result.detail.location);
			var Address = result.detail.addressComponents.city + result.detail.addressComponents.district + result.detail.addressComponents.street + result.detail.addressComponents.town + "附近"
			sessionStorage.setItem("address", Address)
		}
	})
	var lat = sessionStorage.getItem("positionX")
	var lng = sessionStorage.getItem("positionY")
	var latLng = new qq.maps.LatLng(lat, lng);
	//调用信息窗口
	var info = new qq.maps.InfoWindow({
		map: map
	});
	//调用获取位置方法
	geocoder.getAddress(latLng);
	//菜单上的预约
	$scope.reserve = function() {
		if(storage.getUser()) {
			$location.path("/reserve/" + $scope.merchant.ID);
		} else {
			global.lastPath = "/lysinfo/" + $scope.merchant.ID;
			$location.path("/subscribe/" + $scope.merchant.ID);
		}
	}
	getData();
});
//商家页详情
app.controller('MorticianBusinessC', function($http, $scope, $location, $routeParams, Business, MerchantCase, Merchants) {
	$.showLoading("数据加载中", true)
	Business.query({
		id: $routeParams.id
	}, function(data) {
		if(data == null || data == "") {
			$("#store_msg").html("<div class='ui-center'>还没有任何消息！</div>")
		} else {
			$scope.company = data;
		}
	});
	MerchantCase.getBus({
		city: sessionStorage.getItem("city"),
		busid: $routeParams.id,
		state: 1
	}, function(data) {
		if(data == null || data == "") {
			$("#rite").html("<div style='width:100%;text-align:center;line-height:30px;background:white;margin-top:2px;'>暂无数据</div>");
		} else {
			$scope.riteList = data;
			$scope.riteMsg = function(id) {
				$location.path("/riteMsg/" + id); /*#/lysinfo/{{merchant.ID}}*/
			}
		}
	})
	$http({
		method: 'GET',
		url: config.webAPI.address + 'api/FeteGoods/1/4/' + $routeParams.id + '/' + '2'
	}).success(function(data) {
		if(data == null || data == "") {
			$("#goods").html("<div class='title' style='width:100%;text-align:center;line-height:30px;background:white;margin-top:2px;'>暂无数据</div>");
			$scope.goodList = "";
		} else {
			$("#goods").html("");
			$scope.goodList = data.FeteGoodsDataObjectList;
		}
	})
	Merchants.getMerchantList({
		busid: $routeParams.id
	}, function(msg) {
		$.hideLoading();
		if(msg == null || msg == "") {
			$("#merchantList").html("<div style='width:100%;text-align:center;line-height:30px;background:white;margin-top:2px;'>暂无数据</div>");
		} else {
			msg.forEach(function(merchant) {
				Merchants.get({
					id: merchant.ID
				}, function(data) {
					if(data.TTotalScore == 0) {
						data.PublicPraiseScore.TotalScore = 3.0;
						data.PublicPraiseScore.RestimeNum = 3.0;
						data.PublicPraiseScore.MajorNum = 3.0;
						data.PublicPraiseScore.MannerNum = 3.0;
						data.TMannerNum = 3.0;
						data.TRestimeNum = 3.0;
						data.TMajorNum = 3.0;
						data.TTotalScore = 3.0;
					}
					merchant.rap = data;
					var star = getStars(merchant.rap.TTotalScore)
					var rstr = "";
					for(var i = 0; i < 5; i++) {
						if(i < star.full + star.half) {
							if(star.half > 0 && i == star.full) {
								rstr += '<i class="ui-ico-halfstar color-red" style="color:#FA4343;"></i>';
							} else {
								rstr += '<i class="ui-ico-star color-red" style="color:#FA4343;"></i>';
							}
						} else {
							rstr += '<i class="ui-ico-grade color-red " style="color:#FA4343;"></i>'
						};
					}
					merchant.rstr = rstr + " " + '<label style="font-size:16px;color:#fa4343">' + merchant.rap.TTotalScore.toFixed(1) + '</label>';
				})
			})

			$scope.merchantList = msg;
			$scope.learnmore = function(obj) {
				if(obj.TTotalScore == 0) {
					obj.TTotalScore = 3.0;
					obj.TRestimeNum = 3.0;
					obj.TMajorNum = 3.0;
					obj.TMannerNum = 3.0;
				}
				var star = getStars(obj.TTotalScore)
				obj.Fullstar = star.full;
				obj.Halfstar = star.half;
				obj.Emptystar = star.empty;
				global.lastPath = "/business";
				global.morticianid = obj.ID;
				storage.addFuneralDir(obj);
				$location.path("/lysinfo/" + obj.ID); /*#/lysinfo/{{merchant.ID}}*/
			}
		}
	})
});
//商品详情页
app.controller('MorticianProductC', function($scope, $location, PublicPraises, Merchants) {
	if(storage.getGoods()) {
		$scope.goods = storage.getGoods();
	} else {
		trace("无存储ＧＯＯＤＳ")
	}
});

//礼仪师 order.html =/order
app.controller('OrderListC', function($scope, $location, $http, Orders, Merchants) {
	global.lastPath = "/order";
	if(storage.getUser()) {
		$scope.isLogin = true;
		getData();
	} else {
		$scope.isLogin = false;
		$location.path('/login');
	}
	$scope.cancelOrder = function(order) {
		$.confirm({
			title: '确认是否取消订单？',
			text: '',
			onOK: function() {
				if(order.State == 0) {
					postUpdateState(order.ID, "客户取消预约订单", -1);
				} else {
					postUpdateState(order.ID, "客户取消预约订单", 3);
				}
			},
			onCancel: function() {}
		});
	}
	$scope.deleteOrder = function(order) {
		$.actions({
			title: '是否删除该订单？',
			actions: [{
				text: '确定',
				className: 'ui-txt-warning',
				onClick: function() {
					$.showLoading('请稍后');
					Orders.clientDelete({
						id: order.ID
					}, function() {
						$.hideLoading();
						getData();
						$.toast('已删除订单');
					});
				}
			}]
		});
	}
	$scope.limitShow = function(order) {
		return true;
		if(order.State == 0) {
			if(order.IsTimeout) {
				return false;
			} else {
				return true;
			}
		} else if(order.State == 1 || order.State == 2 || order.State == 3 || order.State == 4) {
			return true;
		} else {
			return false;
		}
	}
	$scope.gotoOrderDetail = function(order) {
		$location.path('/orderdetail/' + order.ID);
	};
	$scope.orderHandle = function(order) {
		switch(order.State) {
			//case 0: //提醒接单
			//Orders.remind({ id: order.ID }, function() {
			//$.toast('已提醒接单');
			//});
			//break;
			case 1: //取消订单
				$.confirm({
					title: '取消订单',
					text: '正在服务中，确认是否取消订单？',
					onOK: function() {
						postUpdateState(order.ID, "客户取消服务！", 3);
					},
					onCancel: function() {

					}
				});
				break;
			case 4:
				$.confirm({
					title: '服务确认',
					text: '服务已下单，确认后不再修改，如有问题请联系礼仪师！',
					onOK: function() {
						Orders.goodsList({
							id: order.ID
						}, function(data) {
							var orderprice = 0;
							for(var i = 0; i < data.length; i++) {
								orderprice += data[i].MGPrice * data[i].OGNum;
							}
							Orders.creatPrice({
								oid: order.ID,
								price: orderprice,
								ptype: 1
							}, function(dd) {
								if(dd) {
									postUpdateState(order.ID, "客户确认服务！", 5);
								}
							})
						})
					},
					onCancel: function() {

					}
				});
				break;
			case 5:
				$location.path('/ordercord/' + order.OCode);
				return;
				$.modal({
					title: "付款码",
					text: '<div class="ui-dialog-bd"><div id="qr_container"style="margin-top:-1rem;"><canvas width="200"height="200"></canvas></div></div>',
					autoClose: false,
					buttons: [{
							text: "刷新",
							onClick: function() {
								$('#qr_container').qrcode({
									render: "canvas",
									height: 200,
									width: 200,
									correctLevel: 0,
									text: "http://m.idukou.com/2017/order_detail.html?id=" + order.OCode
								});
							}
						},
						{
							text: "取消",
							className: "default",
							onClick: function() {
								console.log(3)
							}
						},
					]
				});
				break;
			case 6:
				storage.addOrder(order);
				$location.path("/historyEvaluate/" + order.ID);
				return;
			default:
				$scope.deleteOrder(order);
				break;
		}
	}
	$scope.init = function() {
		getData();
	}

	function getData() {
		$scope.hasOrders = true;
		$.showLoading('加载数据中', true);
		var funeralObj = {};
		Orders.user({
			uid: storage.getUser().ID
		}, function(data) {
			var d = {};
			$scope.orders = [];
			var len = data.length;
			if(data && len > 0) {
				var createT = "";
				var nowT = "";
				for(var i = 0; i < len; i++) {
					data[i].funeralDir = {
						HeadImg: ""
					};
					if(data[i].State == 0) {
						createT = new Date(Date.parse(data[i].CreateDate)).getTime();
						nowT = new Date(Date.parse(data[i].Now)).getTime();
						if((nowT - createT) / 1000 > 300) {
							postUpdateState(data[i].ID, "超时5分钟", -3);
						};
					} else if(data[i].State < 0 || data[i].State == 2 || data[i].State == 3 || data[i].State > 6) {
						continue;
					}
					$scope.orders.push(data[i]);
					if(!funeralObj[data[i].MID]) {
						funeralObj[data[i].MID] = data[i].funeralDir = Merchants.get({
							id: data[i].MID
						}, function() {
							//$.hideLoading();
						});

					} else {
						trace(888)
						data[i].funeralDir = funeralObj[data[i].MID];
					}
				}
			} else {
				$scope.hasOrders = false;
			}
			$.hideLoading();
		});
	}

	function postUpdateState(id, reason, state) {
		$.showLoading('请稍后');
		var obj = {};
		obj.ID = id;
		obj.Reason = reason; //"客户取消服务！";
		obj.State = state; //3;
		Orders.updateState(obj, function() {
			$.hideLoading();
			$.toast("操作成功");
			getData();
			$scope.$applyAsync();
		});
	}
});
//礼仪师订单详情页
app.controller('OrderListDetailC', function($scope, $location, Orders, $routeParams, $interval, Merchants, DateNow, $resource, $http) {
	$scope.timeoutMinute = '';
	$scope.timeoutSecond = '';

	$scope.css = {
		colorObj: {
			'color': ""
		},
		class: '',
		tip: "",
		title: ''
	};
	//$scope.colorObj={'color':"#ff0000"};
	$scope.color = '#00ff00';
	/*$scope.class='ui-ico-close';*/

	if(storage.getUser()) {
		getData();
	} else {
		$location.path('/login');
	}

	var intervalPromise;
	var creatDate;
	var nowDate = 0;
	var interval = function() {
		if($scope.order.State == -3) {
			$interval.cancel(intervalPromise);
			return;
		}
		//倒计时总秒数量
		nowDate = new Date(Date.parse($scope.order.Now)).getTime();
		var intDiff = (creatDate - nowDate) / 1000;
		intervalPromise = $interval(function() {
			if(intDiff <= 0) {
				$interval.cancel(intervalPromise);
				postUpdateState($scope.order.ID, "超时5分钟！", -3);
				return;
			}

			var day = 0,
				hour = 0,
				minute = 0,
				second = 0; //时间默认值

			day = Math.floor(intDiff / (60 * 60 * 24));
			hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
			minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
			second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);

			if(minute <= 9) minute = '0' + minute;
			if(second <= 9) second = '0' + second;
			$scope.timeoutMinute = minute;
			$scope.timeoutSecond = second;

			intDiff--;

			if($routeParams.id) {
				Orders.get({
					id: $routeParams.id
				}, function(order) {
					if(order.State != 0) {
						$interval.cancel(intervalPromise);
						getData();
					}
				});
			}
		}, 1000);
	};

	$scope.init = function() {
		getData();
	};

	$scope.deleteOrder = function(order) {
		$.actions({
			title: '是否删除该订单？',
			actions: [{
				text: '确定',
				className: 'ui-txt-warning',
				onClick: function() {
					$.showLoading('请稍后');
					Orders.clientDelete({
						id: order.ID
					}, function() {
						$.hideLoading();
						$.toast('已删除订单');
						//getData();
						$location.path("/order");
					});
				}
			}]
		});
	}
	$scope.cancelOrder = function(order) {
		$.confirm({
			title: '确认是否取消订单？',
			text: '',
			onOK: function() {
				if(order.State == 0) {
					postUpdateState(order.ID, "客户取消预约订单", -1);
				} else {
					postUpdateState(order.ID, "客户取消预约订单", 3);
				}
			},
			onCancel: function() {}
		});
	}
	$scope.orderHandle = function(order) {
		switch(order.State) {
			case -3:

			case 0: //提醒接单
				//				Orders.remind({ id: order.ID }, function() {
				//					$.toast('已提醒接单');
				//				});
				//				break;
			case 4: //
				$.confirm({
					title: '服务确认',
					text: '服务已下单，确认后不再修改，如有问题请联系礼仪师！',
					onOK: function() {
						postUpdateState(order.ID, "客户确认服务！", 5);
					},
					onCancel: function() {

					}
				});
				break;
			case 5: //付款码
				$location.path('/ordercord/' + order.OCode);
				break;
			case 6: //付款码
				$location.path('/historyEvaluate/' + order.OCode);
				break;
			default:
				trace("状态不在预期:" + order.State);
				break;
		}
	}
	$scope.payfor = function(order) {
		postUpdateState(order.ID, "完成结束服务", 6);
	}
	$scope.comment = function(order) {
		postUpdateState(order.ID, "服务交易结束，已评价", 7);
	}
	$scope.$on('$destroy', function() {
		$interval.cancel(intervalPromise);
	})

	function getData() {
		$.showLoading('请稍后');
		if(!$routeParams.id) return;
		$.showLoading("请稍后");
		var locateDate = new Date();
		$scope.order = Orders.get({
			id: $routeParams.id
		}, function(data) {

			setCss();
			data.TotalPrice = 0;
			data.Discount = 0;
			$scope.funeralDir = Merchants.get({
				id: data.MID
			}, function() {
				//$.hideLoading();
			});
			var d = new Date(Date.parse($scope.order.CreateDate));
			var now = new Date();
			d.setMinutes(d.getMinutes() + 5);
			creatDate = d.getTime(); //+5000;//$scope.order.createDate;
			switch(data.State) {
				case 0:
					interval();
					break;
				case 1:
				case 4:
				case 5:
				case 6:
					//折扣
					$scope.Discount = Orders.getDiscount({
						id: data.ID
					}, function(d) { //data.ID//$routeParams.id
						var data = JSON.parse(angular.toJson(d))
						if(data.length > 0) {
							$scope.order.Discount = data[0].Price;
						} else {
							$scope.order.Discount = 0;
						}
					});
					//订单详情
					$scope.goodsList = Orders.goodsList({
						id: data.ID
					}, function(d) { //data.ID//$routeParams.id
						var len = d.length;
						data.TotalPrice = 0;
						for(var i = 0; i < len; i++) {
							data.TotalPrice += d[i].MGPrice;
						}
					});
					//}
					break;
				case -3:
				case -2:
				case -1:
				case 2:
				case 3:
					trace("error");
					break;
				default:
					break;
			}
			$.hideLoading();
			$scope.$applyAsync();
		});
	}

	function setCss() {
		switch($scope.order.State) {
			case -3:
				$scope.css = {
					colorObj: {
						'color': "#95a5a6"
					},
					color: "#95a5a6",
					class: 'ui-ico-close  ico-big',
					tip: "预约超时",
					title: '订单已关闭'
				};
				break;
			case -2:
				$scope.css = {
					colorObj: {
						'color': "#95a5a6"
					},
					color: "#95a5a6",
					class: 'ui-ico-close  ico-big',
					tip: "商家拒绝接单",
					title: '订单已关闭'
				};
				break;
			case -1:
				$scope.css = {
					colorObj: {
						'color': "#95a5a6"
					},
					color: "#95a5a6",
					class: 'ui-ico-close  ico-big',
					tip: "客户取消预约",
					title: '订单已关闭'
				};
				break;
			case 0:
				$scope.css = {
					colorObj: {
						'color': "#95a5a6"
					},
					color: "#95a5a6",
					class: 'ui-ico-close  ico-big',
					tip: "5分钟内未接单，将自动取消",
					title: '待商家接单'
				};
				break;
			case 1:
				$scope.css = {
					colorObj: {
						'color': "#f39c12"
					},
					color: "#f39c12",
					class: 'ui-ico-orderreceiving  ico-big',
					tip: "礼仪师将上门服务，请保持电话畅通。",
					title: '订单正在执行中'
				};
				break;
			case 2:
				$scope.css = {
					colorObj: {
						'color': "#95a5a6"
					},
					color: "#95a5a6",
					class: 'ui-ico-close  ico-big',
					tip: "商家取消订单",
					title: '订单已关闭'
				};
				break;
			case 3:
				$scope.css = {
					colorObj: {
						'color': "#95a5a6"
					},
					color: "#95a5a6",
					class: 'ui-ico-close ico-big',
					tip: "客户取消订单",
					title: '订单已关闭'
				};
				break;
			case 4:
				$scope.css = {
					colorObj: {
						'color': "#f39c12"
					},
					color: "#f39c12",
					class: 'ui-ico-552cc20c7f521 ico-big',
					tip: "商家已完成服务",
					title: '等待确认订单'
				};
				break;
			case 5:
				$scope.css = {
					colorObj: {
						color: "#95a5a6"
					},
					color: "#f39c12",
					class: 'ui-ico-subscription ico-big',
					tip: "您已确认订单",
					title: '请及时支付订单'
				};
				break;
			case 6:
				$scope.css = {
					colorObj: {
						'color': "#95a5a6"
					},
					color: "#95a5a6",
					class: 'ui-ico-cancel ico-big',
					tip: "订单已付款",
					title: '待评价'
				};
				break;
			case 7:
				$scope.css = {
					colorObj: {
						'color': "#95a5a6"
					},
					color: "#95a5a6",
					class: 'ui-ico-cancel ico-big',
					tip: "",
					title: '交易已结束'
				};
				break;
			default:
				break;
		}
		$scope.$applyAsync();
	}

	function postUpdateState(id, reason, state) {
		$.showLoading('请稍后', true);
		var obj = {};
		obj.ID = id;
		obj.Reason = reason; //"客户取消服务！";
		obj.State = state; //3;
		Orders.updateState(obj, function() {
			$.hideLoading();
			$.toast("操作成功");
			getData();
		});
	}

});
//付款二维码
app.controller('OrderCordC', function($scope, $location) {
	$scope.id = $location.url().substr(11);
	trace("http://m.idukou.com/2017/order_detail.html?id=" + $scope.id)
	if($scope.id.length > 0) {
		$("#barcode").barcode($scope.id, "codabar", {
			barWidth: 1,
			barHeight: 50
		});
		$('#qrcord').qrcode({
			render: "canvas",
			height: 200,
			width: 200,
			correctLevel: 0,
			text: $scope.id
		});

	}
});
//商家列表
app.controller('merchantListC', function($scope, $http, $location, Business) {
	$.showLoading("数据加载中", true)
	Business.getBusiness({
		city: sessionStorage.getItem("city")
	}, function(data) {
		$.hideLoading();
		if(data == null || data == "") {
			$("#store").html("<div style='width:100%;text-align:center;line-height:50px;margin-top:2px;'>暂无数据！</div>");
			$("#BusinessList").css({
				"display": "none"
			})
		} else {
			var msg = [];
			for(var i = 0; i < data.length; i++) {
				if(data[i].BusinessImg != "" && data[i].BusinessImg != null) {
					msg.push(data[i])
				}
			}
			$scope.BusinessList = msg;
			$scope.gostore = function(id) {
				sessionStorage.setItem("id", id);
				$location.path("/business/" + id);
			}
			//console.log(msg.slice(0, 3))
		}
	});
});
//礼仪展示
app.controller('merchantCasesC', function($scope, $http, $location, MerchantCase) {
	var city = sessionStorage.getItem("city");
	$.showLoading("数据加载中", true)
	$http({
		method: 'GET',
		url: config.webAPI.address + 'api/MerchantCase/GetMerchantCases?city=' + city + "&state=" + 1
	}, function(data) {
		$.hideLoading();
		if(data == null || data == "") {
			$("#rite").html("<div class='title' style='width:100%;text-align:center;line-height:30px;background:white;margin-top:2px;'>暂无数据！</div>");
			$scope.riteList = "";
		} else {
			$("#rite").html("");
			$scope.riteList = data;
			$scope.riteMsg = function(id) {
				$location.path("/riteMsg/" + id); /*#/lysinfo/{{merchant.ID}}*/
			}
		}
	})
})

//礼仪展示详情页
app.controller('riteMsgC', function($scope, $http, news, $routeParams, $location, MerchantCase) {
	MerchantCase.get({
		id: $routeParams.id
	}, function(msg) {
		$("body").css({
			"background": "white"
		})
		var width = $(window).width() - 20;
		$("#riteMsg").css({
			"width": width,
			"margin-left": "10px",
			"overflow": "hidden"
		})
		$("#riteMsg").append(msg.Summary);
		$("#riteMsg img").css({
			"width": width,
			"height": "160px"
		})
		$(".riteMsg").append("<p>礼仪师：" + msg.MName + "</p><p>所属公司：" + msg.BName + "</p><p>服务地址：" + msg.UAddress + "</p><p>服务时间：" + msg.CreateDate + "</p>")
		$(".riteMsg p").css({
			"border-top": "1px dashed #eee",
			"padding": "5px 0px"
		})
	})
})

//行业咨询
app.controller('newC', function($scope, $http, news, $location) {
	$.showLoading("数据加载中", true)
	news.get({
		type: 2
	}, function(msg) {
		var data = JSON.parse(angular.toJson(msg))
		$scope.newList = data;
		$.hideLoading();
		$scope.msg = function(e) {
			$location.path("/new_msg/" + e.ID)
		}
	});
})

app.controller('newMsgC', function($scope, $http, news, $routeParams, $location) {
	news.getMsg({
		id: $routeParams.id
	}, function(msg) {
		$(".weui-toast--text").css({
			"display": "none"
		})
		var width = $(window).width();
		$("#container").css({
			"width": width - 20,
			"margin-left": "10px",
			"overflow": "hidden"
		})
		$("#container").append(msg.NContent);
		$("#container img").css({
			"width": width - 20
		})
	});
})
//孝道故事
app.controller('storyC', function($scope, $http, news, $location) {
	$.showLoading("数据加载中", true)
	news.get({
		type: 0
	}, function(msg) {
		var data = JSON.parse(angular.toJson(msg))
		$scope.newList = data;
		$.hideLoading();
		$scope.msg = function(e) {
			$location.path("/story_msg/" + e.ID)
		}
	});
})
app.controller('storyMsgC', function($scope, $http, news, $routeParams, $location) {
	news.getMsg({
		id: $routeParams.id
	}, function(msg) {
		var width = $(window).width();
		$(".weui-toast--text").css({
			"display": "none"
		})
		$("#container").css({
			"width": width - 20,
			"margin-left": "10px",
			"overflow": "hidden"
		})
		$("#container").append(msg.NContent);
		$("#container img").css({
			"width": width - 20
		})
	});

})
//风水玄学
app.controller('geomancyC', function($scope, $http, news, $location) {
	$.showLoading("数据加载中", true)
	news.get({
		type: 1
	}, function(msg) {
		var data = JSON.parse(angular.toJson(msg))
		$scope.newList = data;
		$.hideLoading();
		$scope.msg = function(e) {
			$location.path("/geomancy_msg/" + e.ID)
		}
	});
})
app.controller('geomancyMsgC', function($scope, $http, news, $routeParams, $location) {
	news.getMsg({
		id: $routeParams.id
	}, function(msg) {
		$(".weui-toast--text").css({
			"display": "none"
		})
		var width = $(window).width();
		$("#container").css({
			"width": width - 20,
			"margin-left": "10px",
			"overflow": "hidden"
		})
		$("#container").append(msg.NContent);
		$("#container img").css({
			"width": width - 20
		})
	});
})
//祭祀列表
app.controller('feteGoodsC', function($scope, $http, news, $routeParams, $location) {
	$scope.siftList = false;
	$scope.loading = false;
	$scope.bottom = false;
	$(".weui-toast--text").css({
		"display": "none"
	})
	var city = sessionStorage.getItem("city");
	var classify = -1;
	$.showLoading("正在加载中", true);
	var pageSize = 6,
		pageNumber = 1;

	function init() {
		$http({
			method: 'GET',
			url: config.webAPI.address + 'api/FeteGoods/' + pageNumber + '/' + pageSize + '?city=' + city + "&classify=" + classify
		}).success(function(data) {
			$.hideLoading();
			if(data == null || data == "") {
				$("#goods").html("<div class='title' style='width:100%;text-align:center;line-height:30px;background:white;margin-top:2px;'>暂无数据！</div>");
				$scope.goodList = "";
				$scope.bottom = false;
			} else {
				$("#goods").html("");
				$scope.goodList = data.FeteGoodsDataObjectList;
				sessionStorage.setItem("TotalRecords", data.Pagination.TotalRecords);
				$scope.loading = false;
				for(var i = 0; i < data.FeteGoodsDataObjectList.length; i++) {
					if(i >= 3 && i == (data.Pagination.TotalRecords - 1)) {
						$scope.bottom = true;
					} else {
						$scope.bottom = false;
					}
				}
			}
		})
	}
	init();
	$scope.sift = function() {
		$("#all").css({
			"color": "#666"
		});
		$("#sift").css({
			"color": "#333"
		});
		if($scope.siftList) {
			$scope.siftList = false;
			$(".ui-ico-xiala").css({
				"transform": "rotate(360deg)",
				"color": "#333"
			});
		} else {
			$scope.siftList = true;
			$(".ui-ico-xiala").css({
				"transform": "rotate(180deg)",
				"color": "#333"
			});
			$("#siftList").css({
				"background": "rgba(119,119,119,0.5)",
				"height": $(window).height() - 82
			});
		}
	}
	$scope.all = function() {
		$.showLoading("正在加载中", true);
		$("#sift").css({
			"color": "#666"
		});
		$("#all").css({
			"color": "#333"
		});
		$(".ui-ico-xiala").css({
			"transform": "rotate(360deg)",
			"color": "#666"
		});
		$scope.siftList = false;
		$("#siftList li").css({
			"color": "#bbb"
		});
		classify = -1;
		init();
	}
	$scope.myfilter = function(e) {
		$.showLoading("正在加载中", true);
		$("#siftList li").css({
			"color": "#bbb"
		});
		$("#siftList li").eq(e - 1).css({
			"color": "#333"
		});
		$(".ui-ico-xiala").css({
			"transform": "rotate(360deg)",
			"color": "#333"
		});
		$scope.siftList = false;
		classify = e;
		init();
	}
	$("#fetegoods").css({
		"width": $(window).width() + "px",
		"height": $(window).height() + "px",
		"overflow": "scroll"
	});
	var totalheight = 0;
	$("#fetegoods").scroll(function() {
		var boxHeight = $("#goodlist").height() + 85;
		totalheight = parseFloat($("#fetegoods").height()) + parseFloat($("#fetegoods").scrollTop()); //浏览器的高度加上滚动条的高度 
		$("#siftList").css({
			"background": "rgba(119,119,119,0.5)",
			"height": $(window).height() - 82 + $("#fetegoods").scrollTop()
		});
		//console.log(boxHeight, totalheight)
		if(boxHeight <= totalheight) //当文档的高度小于或者等于总的高度的时候，开始动态加载数据
		{ //加载数据
			pageSize += 6;
			if(pageSize < parseInt(sessionStorage.getItem("TotalRecords")) + 6) {
				$scope.loading = true;
				init();
			}
		}
	})
})
//祭祀服务
app.controller('feteServiceC', function($scope, $http, news, $routeParams, $location) {
	$scope.loading = false;
	$scope.bottom = false;
	$(".weui-toast--text").css({
		"display": "none"
	})
	var city = sessionStorage.getItem("city");
	$.showLoading("正在加载中", true);
	var pageSize = 6,
		pageNumber = 1;

	function init() {
		$http({
			method: 'GET',
			url: config.webAPI.address + 'api/FeteService/' + pageNumber + '/' + pageSize + '?city=' + city
		}).success(function(data) {
			$.hideLoading();
			if(data == null || data == "") {
				$("#fetes").html("<div class='title' style='width:100%;text-align:center;line-height:30px;background:white;margin-top:2px;'>暂无数据！</div>");
				$scope.feteList = "";
			} else {
				$("#fetes").html("");
				//console.log(data)
				$scope.feteList = data.FeteServiceDataObjectList;
				sessionStorage.setItem("TotalRecords", data.Pagination.TotalRecords);
				$scope.loading = false;
				for(var i = 0; i < data.FeteServiceDataObjectList.length; i++) {
					if(i >= 3 && i == (data.Pagination.TotalRecords - 1)) {
						$scope.bottom = true;
					} else {
						$scope.bottom = false;
					}
				}
			}
		})
	}
	init();
	$("#feteService").css({
		"width": $(window).width() + "px",
		"height": $(window).height() + "px",
		"overflow": "scroll"
	});
	var totalheight = 0; //定义一个总的高度变量
	$("#feteService").scroll(function() {
		var boxHeight = $("#fetelist").height() + 45;
		totalheight = parseFloat($("#feteService").height()) + parseFloat($("#feteService").scrollTop()); //浏览器的高度加上滚动条的高度 
		//console.log(boxHeight, totalheight)
		if(boxHeight <= totalheight) //当文档的高度小于或者等于总的高度的时候，开始动态加载数据
		{ //加载数据
			pageSize += 6;
			if(pageSize < parseInt(sessionStorage.getItem("TotalRecords")) + 6) {
				$scope.loading = true;
				init();
			}
		}
	})
})
//套餐页面
app.controller('comboC', function($scope, $http, $location, Orders, LinkMan, Users) {
	window.scrollTo(0, 0);
	//定位
	var citylocation, map, city, marker = null;
	var center = new qq.maps.LatLng(39.9088638893, 116.3973838091);
	map = new qq.maps.Map(document.getElementById('container'), {
		center: center,
		zoom: 13
	});
	city = sessionStorage.getItem("city");
	if(city == "杭州市") {
		$scope.city = true;
	} else {
		$scope.city = false;
	}

	//电话咨询
	$scope.addOrder = function() {
		if(!$scope.phone || $scope.phone.toString().length != 11 || !(/^1[34578]\d{9}$/.test($scope.phone))) {
			$.toptip('请输入有效的手机号码', 'warning');
			return false;
		}
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
			$scope.order.TrueName = msg.TrueName;
			$scope.order.UID = msg.ID;
			LinkMan.get({
				city: city
			}, function(msg) {
				$scope.order.MID = msg[0].Mid;
				$.tel({
					title: '礼仪师电话',
					text: '<div style="font-size:24px;color:#5DD7AE;">' + msg[0].Phone + '</div>',
					onOK: function() {
						window.location.href = "tel:" + msg[0].Phone;
					},
					onCancel: function() {}
				})
				//获取详细地址		
				var geocoder = new qq.maps.Geocoder({
					complete: function(result) {
						map.setCenter(result.detail.location);
						$scope.order.Address = result.detail.addressComponents.city + result.detail.addressComponents.district + result.detail.addressComponents.street + result.detail.addressComponents.town + "附近"
						Orders.save($scope.order, function(data) {
							$scope.phone = "";
							storage.addUser(user);
						})
					}
				})
				var lat = sessionStorage.getItem("positionX")
				var lng = sessionStorage.getItem("positionY")
				var latLng = new qq.maps.LatLng(lat, lng);
				//调用信息窗口
				var info = new qq.maps.InfoWindow({
					map: map
				});
				//调用获取位置方法
				geocoder.getAddress(latLng);
			})
		})
	}
})