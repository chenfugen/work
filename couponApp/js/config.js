//配置地址
var config = {
	webAPI: {
		address: 'http://192.168.1.20/'
	}
};
var app = angular.module('IDukou', ['ngRoute', 'IDukouFilters', 'IDukouServices'])
	.config(function() {});

//跨域配置
app.config(function($httpProvider) { // CORS post跨域配置
	$httpProvider.defaults.useXDomain = true;
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	$httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	var param = function(obj) { // 修改angularjs $http.post的默认传参方式
		var query = '',
			name, value, fullSubName, subName, subValue, innerObj, i;

		for(name in obj) {
			value = obj[name];

			if(value instanceof Array) {
				for(i = 0; i < value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if(value instanceof Object) {
				for(subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if(value !== undefined && value !== null)
				query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		}

		return query.length ? query.substr(0, query.length - 1) : query;
	};

	$httpProvider.defaults.transformRequest = [function(data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	}];

	delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

/*rounters*/
app.config(function($routeProvider) {
	//路由配置
	$routeProvider
		//首页
		.when('/', {
			controller: 'loginC',
			templateUrl: 'partials/login.aspx?' + Math.random()
		})
		//个人中心
		.when('/user', {
			controller: 'userC',
			templateUrl: 'partials/user.aspx?' + Math.random()
		})
		//优惠券
		.when('/myCoupon', {
			controller: 'myCouponC',
			templateUrl: 'partials/myCoupon.aspx?' + Math.random()
		})
		//我的账户
		.when('/myAccount', {
			controller: 'myAccountC',
			templateUrl: 'partials/myAccount.aspx?' + Math.random()
		})
		//领券中心
		.when('/getCoupon/:guid', {
			controller: 'getCouponC',
			templateUrl: 'partials/getCoupon.aspx?' + Math.random()
		})

		//用户详情
		.when('/userMsg', {
			controller: 'userMsgC',
			templateUrl: 'partials/userMsg.aspx?' + Math.random()
		})
		//修改密码
		.when('/alterPassword', {
			controller: 'alterPasswordC',
			templateUrl: 'partials/alterPassword.aspx?' + Math.random()
		})
		//订单页
		.when('/order', {
			controller: 'orderC',
			templateUrl: 'partials/order.aspx?' + Math.random()
		})
		//订单详情
		.when('/orderMsg/:oid', {
			controller: 'orderMsgC',
			templateUrl: 'partials/orderMsg.aspx?' + Math.random()
		})
		//短信登录
		.when('/smsLogin', {
			controller: 'smsLoginC',
			templateUrl: 'partials/smsLogin.aspx?' + Math.random()
		})
		.otherwise({
			redirectTo: '/'
		});
})

/*filter*/
var filtersModule = angular.module('IDukouFilters', []);
filtersModule.filter('imageSrc', function() {
	return function(img) {
		if(img) {
			img = config.webAPI.address + "upload/store/1/product/show/thumb60_60/" + img;
		} else {
			img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjZEREZGMUE4ODQ5MTFFNTlBQ0FDRDE1QzM0NzM4NzEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NjZEREZGMUI4ODQ5MTFFNTlBQ0FDRDE1QzM0NzM4NzEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NkRERkYxODg4NDkxMUU1OUFDQUNEMTVDMzQ3Mzg3MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo2NkRERkYxOTg4NDkxMUU1OUFDQUNEMTVDMzQ3Mzg3MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pr0VlogAAAXbSURBVHja7JvZTjJN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';
		}
		return img;
	};
});
filtersModule.filter('trust2Html', ['$sce', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
}])
filtersModule.filter('storyType', ['$sce', function($sce) {
	return function(val) {
		switch(val) {
			case 1:
				val = "平台通用";
				break;
			case 2:
				val = "店铺专用";
				break;
		}
		return val;
	};
}])

filtersModule.filter('orderState', ['$sce', function($sce) {
	return function(val) {
		switch(val) {
			case 20:
				val = "等待付款";
				break;
			case 40:
				val = "确认中";
				break;
			case 60:
				val = "已确认";
				break;
			case 80:
				val = "备货中";
				break;
			case 100:
				val = "已发货";
				break;
			case 120:
				val = "已收货";
				break;
			case 140:
				val = "锁定";
				break;
			case 160:
				val = "取消";
				break;
		}
		return val;
	};
}])

/*services*/
var servicesModle = angular.module('IDukouServices', ['ngResource']);
servicesModle.factory('user', function($resource) {
	return $resource(config.webAPI.address + 'mob/?' + Math.random(), {}, {
		Login: {
			url: config.webAPI.address + 'mob/account/login',
			method: 'POST',
		},
	})
})

//读取cookies
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
//写cookies
function setCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//删除cookies
function delCookie(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = getCookie(name);
	if(cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
