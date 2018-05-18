//配置地址
var config = {
	webAPI: {
		address: 'http://202.91.245.20:3000/'
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

//angular路由配置
var app = angular.module('IDukou', ['ngRoute', 'IDukouFilters', 'IDukouServices']).config(function() {});

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

//路由配置
app.config(function($routeProvider) {
	$routeProvider
		//首页
		.when('/', {
			controller: 'homeC',
			templateUrl: 'partials/home.html?' + Math.random()
		})
		//礼仪师列表页
		.when('/merchants', {
			controller: 'merchantsC',
			templateUrl: 'partials/merchants.html?' + Math.random()
		})
		//陵园列表页
		.when('/cemeteries', {
			controller: 'cemeteriesC',
			templateUrl: 'partials/cemeteries.html?' + Math.random()
		})
		//陵园地图
		.when('/cemeteryMap/:id', {
			controller: 'cemeteryMapC',
			templateUrl: 'partials/cemeteryMap.html?' + Math.random()
		})
		//商家列表页
		.when('/business', {
			controller: 'businessC',
			templateUrl: 'partials/business.html?' + Math.random()
		})
		//套餐页
		.when('/combo', {
			controller: 'comboC',
			templateUrl: 'partials/combo.html?' + Math.random()
		})
		//孝道故事、风水玄学、行业资讯列表页
		.when('/sysnews/:typeNum', {
			controller: 'sysnewsC',
			templateUrl: 'partials/sysnews.html?' + Math.random()
		})
		//孝道故事、风水玄学、行业资讯内容页
		.when('/sysnew/:id', {
			controller: 'sysnewC',
			templateUrl: 'partials/sysnew.html?' + Math.random()
		})
		//公司简介
		.when('/about/:num', {
			controller: 'aboutC',
			templateUrl: 'partials/about.html?' + Math.random()
		})
		//公司新闻内容
		.when('/companyNew/:id', {
			controller: 'companyNewC',
			templateUrl: 'partials/companyNew.html?' + Math.random()
		})
		//礼仪师详情
		.when('/merchantMsg/:id', {
			controller: 'merchantMsgC',
			templateUrl: 'partials/merchantMsg.html?' + Math.random()
		})
		//附近礼仪师
		.when('/nearMerchant/', {
			controller: 'nearMerchantC',
			templateUrl: 'partials/nearMerchant.html?' + Math.random()
		})
		//个人中心
		.when('/personalCenter/', {
			controller: 'personalCenterC',
			templateUrl: 'partials/personalCenter.html?' + Math.random()
		})
		.otherwise({
			redirectTo: '/'
		});
})

//angular过滤器
var filtersModule = angular.module('IDukouFilters', []);
filtersModule.filter('range', function() {
	return function(n) {
		var res = [];
		for(var i = 0; i < n; i++) {
			res.push(i);
		}
		return res;
	};
});
filtersModule.filter('ranges', function() {
	return function(n) {
		n = parseInt(n)
		var res = [];
		for(var i = 1; i < n + 1; i++) {
			res.push(i);
		}
		return res;
	};
});
filtersModule.filter('imgsrc', function() {
	return function(img) {
		if(img) {
			img = config.file.imageRoot + img;
		} else {
			img = 'img/ico_gray.png';
		}
		return img;
	};
});
filtersModule.filter('num', function() {
	return function(n) {
		var res = [];
		for(var i = 1; i < n + 1; i++) {
			res.push(i);
		}
		return res;
	};
});
//字符串转译html
filtersModule.filter('trust2Html', ['$sce', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
}])

//angular工厂服务
var servicesModle = angular.module('IDukouServices', ['ngResource']);
servicesModle.factory('Merchants', function($resource) {
	return $resource(config.webAPI.address + 'api/Merchants?' + Math.random(), {}, {
		getMerchant: {
			url: config.webAPI.address + 'api/Merchants/:id?' + Math.random(),
			method: 'GET',
			params: {
				id: '@id'
			}
		},
		get: {
			url: config.webAPI.address + 'api/Merchants/:pageNumber/:pageSize?' + Math.random(),
			method: 'GET',
			params: {
				pageNumber: '@pageNumber',
				pageSize: '@pageSize',
				sort: '@sort',
				city: '@city'
			}
		},
		nearMerchant: {
			url: config.webAPI.address + 'api/Merchants/GetMerchantsForPage/:pageNumber/:pageSize?' + Math.random(),
			method: 'GET',
			params: {
				pageNumber: '@pageNumber',
				pageSize: '@pageSize',
				sortName: '@sortName',
				sortOrder: '@sortOrder',
				longitude: '@longitude',
				latitude: "@latitude"
			}
		}
	})
});
servicesModle.factory('Business', function($resource) {
	return $resource(config.webAPI.address + 'api/Business?' + Math.random(), {}, {
		get: {
			url: config.webAPI.address + 'api/Business/:pageNumber/:pageSize?' + Math.random(),
			method: 'GET',
			params: {
				pageNumber: '@pageNumber',
				pageSize: '@pageSize',
				city: '@city'
			}
		},
	})
});

servicesModle.factory('Adview', function($resource) {
	return $resource(config.webAPI.address + 'api/Adview?' + Math.random(), {}, {
		get: {
			url: config.webAPI.address + 'api/Adview?' + Math.random(),
			method: 'GET',
			isArray: true,
			params: {
				city: '@city',
				type: '@type'
			}
		},
	});
});

servicesModle.factory('Cemeterys', function($resource) {
	return $resource(config.webAPI.address + 'api/Cemeterys/' + Math.random(), {}, {
		get: {
			url: config.webAPI.address + 'api/Cemeterys/:pageNumber/:pageSize?' + Math.random(),
			method: 'GET',
			params: {
				pageNumber: '@pageNumber',
				pageSize: '@pageSize',
				city: '@city'
			}
		},
		getMsg: {
			url: config.webAPI.address + 'api/Cemeterys/GetCemeteryInfo/:id?' + Math.random(),
			method: 'GET',
			params: {
				id: '@id'
			}
		},
	});
});

servicesModle.factory('SysNews', function($resource) {
	return $resource(config.webAPI.address + 'api/SysNews/' + Math.random(), {}, {
		get: {
			url: config.webAPI.address + 'api/SysNews/:pageNumber/:pageSize/:typeNum?' + Math.random(),
			method: 'GET',
			params: {
				pageNumber: '@pageNumber',
				pageSize: '@pageSize',
				typeNum: '@typeNum'
			}
		},
		getMsg: {
			url: config.webAPI.address + 'api/SysNews/GetSysNewDataObjectByID/:id?' + Math.random(),
			method: 'GET',
			params: {
				id: '@id'
			}
		},
	});
});

servicesModle.factory('Orders', function($resource) {
	return $resource(config.webAPI.address + 'api/Orders?' + Math.random(), {}, {
		save: {
			method: 'POST',
		},
		get: {
			url: config.webAPI.address + 'api/Orders/getOrdersInfo/:id?' + Math.random(),
			method: 'GET',
			params: {
				id: '@id'
			}
		},
		getList: {
			url: config.webAPI.address + 'api/Orders/User/:uid?' + Math.random(),
			method: 'GET',
			isArray: true,
			params: {
				uid: '@uid'
			}
		},
		del: {
			url: config.webAPI.address + 'api/Orders/Delete/:id/:delstate?' + Math.random(),
			method: 'POST',
			params: {
				id: '@id',
				delstate:'@delstate'
			}
		},
	});
});

servicesModle.factory('MerchantCase', function($resource) {
	return $resource(config.webAPI.address + 'api/MerchantCase?' + Math.random(), {}, {
		get: {
			url: config.webAPI.address + 'api/MerchantCase/:mid?' + Math.random(),
			method: 'GET',
			isArray: true,
			params: {
				mid: '@mid'
			}
		},
	});
});

servicesModle.factory('Services', function($resource) {
	return $resource(config.webAPI.address + 'api/MerchantGoodsTypes?' + Math.random(), {}, {
		get: {
			url: config.webAPI.address + 'api/MerchantGoodsTypes/:mid?' + Math.random(),
			method: 'GET',
			isArray: true,
			params: {
				mid: '@mid'
			}
		},
	});
});

servicesModle.factory('MerchantGoods', function($resource) {
	return $resource(config.webAPI.address + 'api/MerchantGoods?' + Math.random(), {}, {
		query: {
			url: config.webAPI.address + 'api/MerchantGoods/:mid/tid:/:state/:sort?' + Math.random(),
			method: 'GET',
			isArray: true,
			params: {
				mid: '@mid',
				tid: '@tid',
				state: 1,
				sort: 0
			}
		},
		getByType: {
			url: config.webAPI.address + 'api/MerchantGoods/GetMerchantGoodsByType/:tid?' + Math.random(),
			method: 'GET',
			isArray: true,
			params: {
				tid: '@tid'
			}
		},
		getgoodstype: {
			url: config.webAPI.address + 'api/MerchantGoodsTypes/:mid?' + Math.random(),
			method: 'GET',
			params: {
				mid: '@mid'
			}
		},
		getgoods: {
			url: config.webAPI.address + 'api/MerchantGoods/:mid/:state/sort?' + Math.random(),
			method: 'GET',
			params: {
				mid: '@mid',
				state: '@state',
				sort: '@sort'
			}
		}
	});
});
servicesModle.factory('LinkMan', function ($resource) {
	 return $resource(config.webAPI.address + 'api/LinkMan?' + Math.random(), {}, {
     get:{
            url: config.webAPI.address + 'api/LinkMan?' + Math.random(),
            method: 'GET',
            isArray:true,
            params: {
                city: '@city'
            }
        },  
     });   
});
servicesModle.factory('Users', function ($resource) {
    return $resource(config.webAPI.address + 'api/Users?' + Math.random(), {}, {
        GetOrCreate: {
            url: config.webAPI.address + 'api/Users/GetOrCreate/:phone',
            method: 'POST',
            params: {
                phone: '@phone'
            }
        },
        get: {
			url: config.webAPI.address + 'api/Users/:id?' + Math.random(),
			method: 'GET',
			params: {
				id: '@id'
			}
		}
//      ,
//		update: {
//			url: config.webAPI.address + 'api/Users/Update' + Math.random(),
//			method: 'POST',
////			isArray: true,
//			params: {
//				
//			}
//		}
    });
});
servicesModle.factory('Conpou', function($resource) {
	return $resource(config.webAPI.address + 'api/Conpou?' + Math.random(), {}, {
		getlist: {
			url: config.webAPI.address + 'api/Conpou/GetAllCouponByUPhone/:phone?' + Math.random(),
			method: 'GET',
//			isArray: true,
			params: {
				phone: '@phone'
			}
		},
	});
});

//根据分值算实　半　空星个数
function getStars(score) {
	var obj = { full: 0, half: 0, empty: 0 };
	var f = Math.floor(score);
	var c = Math.ceil(score);
	var r = Math.round(score);
	if(f != c) {
		if(c == r) {
			obj.full = c;
			obj.half = 0;
			obj.empty = 0;
		} else {
			obj.full = f;
			obj.half = 1;
			obj.empty = 0;
		}
	} else {
		obj.full = f;
		obj.half = 0;
		obj.empty = 5 - f;
	}
	return obj;
}