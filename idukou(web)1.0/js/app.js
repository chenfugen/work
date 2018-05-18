var app = angular.module('IDukou', ['ngRoute','IDukouFilters', 'IDukouServices',  'ngAnimate', 'angularFileUpload'])
    .config(function () {
    });
//葬礼司仪Funeral directors   / FuneralDir

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    // Overide $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        if (subName.indexOf("$") == -1) {
                            subValue = value[subName];
                            fullSubName = name + '[' + subName + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '='
                        + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return angular.isObject(data) && String(data) !== '[object File]'
            ? param(data)
            : data;
    }];
}]);
/*rounters*/
app.config(function ($routeProvider) {
    //路由配置
    $routeProvider
         //首页
        .when('/', {
            controller: 'onepageC',
            templateUrl: 'partials/index.html?' + Math.random()
        })
        //////////////礼仪师
        .when('/home', {
            controller: 'HomeC',
            templateUrl: 'partials/home.html?' + Math.random()
        })       
        .when('/orientation', {
            controller: 'HomeLocationC',
            templateUrl: 'partials/home_orientation.html?' + Math.random()
        })
        .when('/lysinfo/:id', {//funeral director
            controller: 'HomeMorticianC',
            templateUrl: 'partials/home_lys_info.html?' + Math.random()
        })
        .when('/reserve/:id', {
            controller: 'MorticianReserveC',
            templateUrl: 'partials/home_lys_reserve.html?' + Math.random()
        })
         .when('/subscribe/:id', {
            controller: 'MorticianSubscribeC',
            templateUrl: 'partials/home_lys_subscribe.html?' + Math.random()
        })
        .when('/evaluations/:id', {
            controller: 'MorticianEvaluationsC',
            templateUrl: 'partials/home_lys_info_evaluations.html?' + Math.random()
        })
        .when('/business/:id',{
            controller: 'MorticianBusinessC',
            templateUrl: 'partials/home_lys_info_business.html?' + Math.random()
        })
        .when('/lysproducts/:id', {
            controller: 'MorticianProductsC',
            templateUrl: 'partials/home_lys_products.html?' + Math.random()
        })
        .when('/lysproduct/:id', {
            controller: 'MorticianProductC',
            templateUrl: 'partials/home_lys_products_detail.html?' + Math.random()
        })
         ////商家列表
          .when('/merchantList', {
            controller: 'merchantListC',
            templateUrl: 'partials/merchantList.html?' + Math.random()
        })
         .when('/merchantCases', {
            controller: 'merchantCasesC',
            templateUrl: 'partials/merchantCases.html?' + Math.random()
        })
        //////////订单
        .when('/order', {
            controller: 'OrderListC',
            templateUrl: 'partials/order.html?' + Math.random()
        })
        .when('/orderdetail/:id', {
            controller: 'OrderListDetailC',
            templateUrl: 'partials/order_detail.html?' + Math.random()
        })
        .when('/ordercord/:id', {
            controller: 'OrderCordC',
            templateUrl: 'partials/order_cord.html?' + Math.random()
        })


        //////////我的
        .when('/user', {
            controller: 'UserC',
            templateUrl: 'partials/user.html?' + Math.random()
        })
        .when('/address', {
            controller: 'UserAddressC',
            templateUrl: 'partials/user_address.html?' + Math.random()
        })

        .when('/login', {
            controller: 'UserLoginiC',
            templateUrl: 'partials/user_login.html?' + Math.random()
        })
        /*.when('/forget',{
            controller: 'UserForgetC',
            templateUrl: 'partials/user_login_forget.html?' + Math.random()
        })*/
        .when('/smsLogin',{
            controller: 'UserSmsLoginC',
            templateUrl: 'partials/user_login_smsLogin.html?' + Math.random()
        })
        .when('/historyOrders',{
            controller: 'UserHistoryOrdersC',
            templateUrl: 'partials/user_historyOrders.html?' + Math.random()
        })
        .when('/historyEvaluate/:id',{
            controller: 'UserHistoryOrdersEvaluateC',
            templateUrl: 'partials/user_historyOrders_evaluate.html?' + Math.random()
        })
        .when('/historyDetail/:id',{
            controller: 'UserHistoryOrdersDetailC',
            templateUrl: 'partials/user_historyOrders_detail.html?' + Math.random()
        })
        .when('/historyEvaluation/:id',{
            controller: 'UserHistoryOrdersEvaluationC',
            templateUrl: 'partials/user_historyOrders_evaluation.html?' + Math.random()
        })

        .when('/addressEdit',{
            controller: 'UserAddressEditC',
            templateUrl: 'partials/user_address_editor.html?' + Math.random()
        })
        .when('/about', {
            controller: '',
            templateUrl: 'partials/user_about.html?' + Math.random()
        })
        .when('/rule',{
            controller: '',
            templateUrl: 'partials/user_login_rule.html?' + Math.random()
        })
        .when('/setting',{
            controller: 'UserSettingC',
            templateUrl: 'partials/user_setting.html?' + Math.random()
        })
        .when('/account',{
            controller: 'UserAccountC',
            templateUrl: 'partials/user_account.html?' + Math.random()
        })
        .when('/password',{
            controller: 'UserPasswordC',
            templateUrl: 'partials/user_setting_password.html?' + Math.random()
        })
        
        //新闻
         .when('/news',{
            controller: 'newC',
            templateUrl: 'partials/news.html?' + Math.random()
        })  
         .when('/new_msg/:id',{
            controller: 'newMsgC',
            templateUrl: 'partials/new_msg.html?' + Math.random()
        })  
        .when('/story',{
            controller: 'storyC',
            templateUrl: 'partials/story.html?' + Math.random()
        }) 
        .when('/story_msg/:id',{
            controller: 'storyMsgC',
            templateUrl: 'partials/story_msg.html?' + Math.random()
        }) 
         .when('/geomancy',{
            controller: 'geomancyC',
            templateUrl: 'partials/geomancy.html?' + Math.random()
        }) 
        .when('/geomancy_msg/:id',{
            controller: 'geomancyMsgC',
            templateUrl: 'partials/geomancy_msg.html?' + Math.random()
        })  
        
        //微信
        .when('/text',{
            controller: 'TextC',
            cache:'false',
            templateUrl: 'partials/text.html?' + Math.random()
        })
        
        //白事用品
        .when('/feteGoods',{
            controller: 'feteGoodsC',
            templateUrl: 'partials/feteGoods.html?' + Math.random()
        })
        
        //白事用品
        .when('/feteService',{
            controller: 'feteServiceC',
            templateUrl: 'partials/feteService.html?' + Math.random()
        })
        
         //白事用品
        .when('/riteMsg/:id',{
            controller: 'riteMsgC',
            templateUrl: 'partials/rite_msg.html?' + Math.random()
        })
        
         .otherwise({
            redirectTo: '/'
        });
})

/*filter*/
var filtersModule = angular.module('IDukouFilters', []);
filtersModule.filter('range', function () {
    return function (n) {
        var res = [];
        for (var i = 0; i < n; i++) {
            res.push(i);
        }
        return res;
    };
});
filtersModule.filter('ranges', function () {
    return function (n) {
    	n=parseInt(n)
        var res = [];
        for (var i =1; i < n+1; i++) {
            res.push(i);
        }
        return res;
    };
});
filtersModule.filter('imageSrc', function () {
    return function (img) {
        if (img) {
            img = config.file.imageRoot + img;
        }
        else {
            img ='img/ico_gray.png';
        }
        return img;
    };
});

filtersModule.filter('hideName', function () {
    return function (name) {
      if(!isNaN(name)){
      	name=name.substring(0,3)+"****"+name.substring(7,11);
      }
        return name;
    };
});
filtersModule.filter('makeComment', function () {
    return function (s) {
        if (!s) {
            s = "系统默认好评！";
        }
        return s;
    };
});
filtersModule.filter('autoMerchantName',function(){
    return function (s) {
        if (!s) {
            s = "商家暂未更新！";
        }
        return s;
    };
});
filtersModule.filter('orderPrice', function () {
    return function (orderPrice, ptype) {
        if (orderPrice) {
            for (var i = 0; i < orderPrice.length; i++) {
                if (orderPrice[i].PType == ptype) {
                    return orderPrice[i].Price.toFixed(2);
                }
            }
        }
    };
});
filtersModule.filter('orderStateTip', function () {
    return function (type) {
        switch (type) {
            case -3:
                type = '已超时订单';
                break;
            case -2:
                type = '被拒绝订单';
                break;
            case -1:
                type = '已取消订单';
                break;
            case 0:
                type = '预约中';
                break;
            case 1:
                type = '服务中';
                break;
            case 2:
                type = '商家取消订单';
                break;
            case 3:
                type = '客户取消订单';
                break;
            case 4:
                type = '待确认';
                break;
            case 5:
                type = '待付款';
                break;
            case 6:
                type = '待评价';
                break;
            case 7:
                type = '已完成订单';
                break;
            default:
                type = '无效订单';
                break;
        }
        return type;
    };
});
filtersModule.filter('orderStateBtnName', function () {
    return function (type) {
        switch (type) {
            case -3:
            case -2:
            case -1:
            case 2:
            case 3:
            case 1:
                type = '';
                break;
            case 4:
                type = '订单确认';
                break;
            case 5:
                type = '付款码';
                break;
            case 6:
                type = '去评价';
                break;
            case 7:
                type = '追加评价';
                break;
            default:
                type = '无效订单';
                break;
        }
        return type;
    };
});
filtersModule.filter('dateformat',function(){
    return function (date,type) {
        var d=date;
        d=new Date(d).format(type);
        /*switch (type) {
            case "yyyy-MM-dd":
                new Date(d).format(type);
                break;
            case 'yyyy-M-d':
                type = '提醒接单';
                break;
            default:
                type = '无效订单';
                break;
        }*/
        return d;
    };
})
    filtersModule.filter('imageSrc', function() {
			return function(img) {
				if(img) {
					img = config.file.imageRoot + img;
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
/*services*/
var servicesModle = angular.module('IDukouServices', ['ngResource']);
servicesModle.factory('Users', function ($resource) {
    return $resource(config.webAPI.address + 'api/Users?' + Math.random(), {}, {
        smsLogin: {
            url: config.webAPI.address + 'api/Users/SMSLogin/:phone/:verification',
            method: 'POST',
            params: {
                phone: '@phone',
                verification: '@verification',
                unionID: '@unionID',
                openID: '@openID',
                type: '@type'
            }
        },
        passwordLogin: {
            url: config.webAPI.address + 'api/Users/PasswordLogin/:phone/:password',
            method: 'POST',
            params: {
                phone: '@phone',
                password: '@password',
                unionID: '@unionID',
                openID: '@openID',
                type: '@type'
            }
        },
        weixinLogin: {
            url: config.webAPI.address + 'api/Users/WeixinLogin/:unionID',
            method: 'POST',
            params: {
                unionID: '@unionID'
            }
        },
        setPassword: {
            url: config.webAPI.address + 'api/Users/SetPassword/:phone/:password',
            method: 'POST',
            params: {
                phone: '@phone',
                password: '@password'
            }
        },
        resetPassword: {
            url: config.webAPI.address + 'api/Users/ResetPassword/:phone/:password/:verification',
            method: 'POST',
            params: {
                phone: '@phone',
                password: '@password',
                verification: '@verification'
            }
        },
        get: {
            url: config.webAPI.address + 'api/Users/:id?' + Math.random(),
            method: 'GET',
            params: {
                id: '@id'
            }
        },
        exist: {
            url: config.webAPI.address + 'api/Users/Exist/:phone?' + Math.random(),
            method: 'GET',
            params: {
                phone: '@phone'
            },
            transformResponse: function (data, headers) {
                return { data: data };
            }
        },
        getByWeixin: {
            url: config.webAPI.address + 'api/Users/Weixin/:unionID?' + Math.random(),
            method: 'GET',
            params: {
                unionID: '@unionID'
            }
        },
        save: {
            url: config.webAPI.address + 'api/Users/Update',
            method: 'POST',
            params: {
                phone: '@phone'
            }
        },
        GetOrCreate: {
            url: config.webAPI.address + 'api/Users/GetOrCreate/:phone',
            method: 'POST',
            params: {
                phone: '@phone'
            }
        }
    });
});
servicesModle.factory('Weixin', function ($resource) {
    return $resource(config.webAPI.address + 'api/Weixin/JsApi?0.32353587177219834&url=http:%2F%2Fwx.idukou.com', {}, {//Weixin/:code?' + Math.random(), {}, {
        get: {
            method: 'GET',
            params: {
                code: '@code'
            }
        },
        unifiedOrder: {
            url: config.webAPI.address + 'api/Weixin/Pay/UnifiedOrder',
            method: 'POST'
        },
        getJsApi: {
            url: config.webAPI.address + 'api/Weixin/JsApi?' + Math.random(),
            method: 'GET',
            params: {
                url: '@url'
            }
        },
          getUser:{
            url: config.webAPI.address + 'api/Weixin/:code' ,
            method: 'GET',
            params: {
                code: '@code'
            }
        },
        getNotify:{
            url: config.webAPI.address + 'api/Pay/WeixinPayNotify?' + Math.random(),
            method: 'POST',
            params: {
				appId:'@appId',
				nonceStr:'@nonceStr',
				notify_url:'@notify_url',
				package:'@package',
				paySign:'@paySign',
				signType:'@signType',
				timeStamp:'@timeStamp'
            }
        },
        text:{
           //url: 'http://localhost:60852/'+ 'api/Orders/UpdateState?' + Math.random(),//'http://localhost:60852/'
            url: config.webAPI.address + 'api/Files/Image',
            method: 'POST',
            params: {
            }
        },
        postSearch:{
            url: config.webAPI.address + 'api/Weixin/Search',
            method: 'POST',
            params: {
            }
        }
    });
});

servicesModle.factory('news', function ($resource) {
    return $resource(config.webAPI.address + 'api/SysNews/:type', {}, {
        get: {
            method: 'GET',
            isArray:true,
            params: {
                type: '@type'
            }
        },
        getMsg:{
        	url: config.webAPI.address +'api/SysNews/GetSysNewDataObjectByID/:id',
        	method: 'GET',
            params: {
                id: '@id'
            }
        }
    });
});

servicesModle.factory('Merchants', function ($resource) {
    return $resource(config.webAPI.address + 'api/Merchants?' + Math.random(), {}, {
    	 query: {
        	url: config.webAPI.address+'api/Merchants/GetMerchantsForPage/:pageNumber/:pageSize?'+ Math.random(),
            method: 'GET',
            isArray: true,
            params: {
          	    pageNumber:'@pageNumber',
          	    pageSize:'@pageSize',
                sortName: '@sortName',
                sortOrder: '@sortOrder'
            }
        },
        get: {
            url: config.webAPI.address + 'api/Merchants/:id?' + Math.random(),
            method: 'GET',
            params: {
                id: '@id'
            }
        },
    });
});

servicesModle.factory('Services', function ($resource) {
    return $resource(config.webAPI.address + 'api/MerchantGoodsTypes?' + Math.random(), {}, {
        merchantOnline: {
            url: config.webAPI.address + 'api/MerchantGoodsTypes/:mid?'+ Math.random(),
            method: 'GET',
            isArray: true,
            params: {
                mid: '@mid'
            }
        },
        /*menuDetail:{
            url: config.webAPI.address + 'api/MerchantGoods/:mid/:tid/1/0?'+ Math.random(),
            method: 'GET',
            isArray: true,
            params: {
                mid: '@mid',
                tid:'@tid'
            }
        }*/
    });
    /*return $resource(config.webAPI.address + 'api/Services?' + Math.random(), {}, {
        merchantOnline: {
            url: config.webAPI.address + 'api/Services/:mid/:state?' + Math.random(),
            method: 'GET',
            isArray: true,
            params: {
                mid: '@mid',
                state: 2
            }
        }
    });*/
});
servicesModle.factory('NoteMessages', function ($resource) {
    return $resource(config.webAPI.address + 'api/NoteMessages/Send?' + Math.random(), {}, {
        SendVerification: {
            url: config.webAPI.address + 'api/NoteMessages/SendVerification/:phone/:templateID?' + Math.random(),
            method: 'POST',
            params: {
                phone: '@phone',
                templateID: config.sms.template.verification
            }
        },
        PostVerification: {
            url: config.webAPI.address + 'api/NoteMessages/SendVerification/:phone/:templateID?' + Math.random(),
            method: 'POST',
            params: {
                phone: '@phone',
                templateID: config.sms.template.verifyCode
            }
        },
        checkVerification: {
            url: config.webAPI.address + 'api/NoteMessages/CheckVerification/:phone/:verification?' + Math.random(),
            method: 'POST',
            params: {
                phone: '@phone',
                verification: '@verification'
            }
        }
    });
});
servicesModle.factory('PublicPraises', function ($resource) {
    return $resource(config.webAPI.address + 'api/PublicPraises?' + Math.random(), {}, {
        query: {
            url: config.webAPI.address + 'api/PublicPraises/:mid/:search?' + Math.random(),
            method: 'GET',
            isArray: true,
            params: {
                mid: '@mid',
                search: '@search'
            }
        },
        save: {
            method: 'POST'
        },
        user: {
            url: config.webAPI.address + 'api/PublicPraises/GetPublicPraiseForUser/:uid/:oid?' + Math.random(),
            method: 'GET',
            isArray:true,
            params:{
                uid:'@uid',
                oid:'@oid'
            }
        },
    });
});
servicesModle.factory('MerchantGoods', function ($resource) {
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
servicesModle.factory('Orders', function ($resource) {
    return $resource(config.webAPI.address + 'api/Orders?' + Math.random(), {}, {
        save: {
            method: 'POST'
        },
        user: {
            url: config.webAPI.address + 'api/Orders/User/:uid?' + Math.random(),
            method: 'GET',
            isArray: true,
            params: {
                uid: '@uid'
            }
        },
        cancel: {
            url: config.webAPI.address + 'api/Orders/Cancel/:id?' + Math.random(),
            method: 'POST',
            params: {
                id: '@id'
            }
        },
        isReserving: {
            url: config.webAPI.address + 'api/Orders/GetOrderForReRequest/:uid?' + Math.random(),
            method: 'GET',
            params: {
                uid: '@uid'
            }
        },
        /*merchantDelete: {
            url: config.webAPI.address + 'api/Orders/Delete/:id/:delstate?' + Math.random(),
            method: 'POST',
            params: {
                id: '@id',
                delstate: -4
            }
        },*/
        clientDelete: {
            url: config.webAPI.address + 'api/Orders/Delete/:id/:delstate?' + Math.random(),
            method: 'POST',
            params: {
                id: '@id',
                delstate: -3
            }
        },
        update: {
            url: config.webAPI.address + 'api/Orders/Update?' + Math.random(),
            method: 'POST'
        },
        updateState: {
            url: config.webAPI.address + 'api/Orders/UpdateState?' + Math.random(),
            method: 'POST',
            params: {
                /*id: '@id',
                reason: -3,
                state:0*/
            }
        },
        get: {
            url: config.webAPI.address + 'api/Orders/getOrdersInfo/:id?' + Math.random(),
            method: 'GET',
            params: {
                id: '@id'
            }
        },
        getDiscount:{
            url: config.webAPI.address + 'api/Orders/GetOrderCouponByOid/:id?'+ Math.random(),
            method: 'GET',
            isArray:true,
            params: {
                id: '@id'
            }
        },
        goodsList: {
            url: config.webAPI.address + 'api/Orders/getOrdersgoods/:id?' + Math.random(),
            method: 'GET',
            isArray:true,
            params: {
                id: '@id'
            }
        },
        /*payFull: {
            url: config.webAPI.address + 'api/Orders/Full/:id?price=:price&' + Math.random(),
            method: 'POST',
            params: {
                id: '@id',
                price: '@price'
            }
        },*/
        remind: {
            url: config.webAPI.address + 'api/Orders/Remind/:id?' + Math.random(),
            method: 'POST',
            params: {
                id: '@id'
            }
        },
        creatPrice:{
            url: config.webAPI.address + 'api/Orders/CreateOrdersPrice?' + Math.random(),
            method: 'POST',
            params: {
                oid: '@oid',
                price:'@price',
                ptype:'@ptype',
                state:'@state'
            }
        },
        /*countPending: {
            url: config.webAPI.address + 'api/Orders/Merchant/Pending/Count/:id?' + Math.random(),
            method: 'GET',
            params: {
                id: '@id'
            }
        },*/
    });
});
servicesModle.factory('DateNow', function ($http) {
    var dateNow={};
    dateNow.get=function(){
        $http({
            method: 'GET',
            url: config.webAPI.address + 'api/Date/Now?' + Math.random()
        }).success(function(data) {
            trace(data)
            return data;
        }).error(function (data, header, config, status) {
                //处理响应失败
                return data
        });
    }
    return dateNow;

   /* $http({
        method: 'GET',
        url: config.webAPI.address + 'api/Date/Now?' + Math.random()
    }).success(function(data) {
        return data;
    });*/
   /* $resource.get(config.webAPI.address + 'api/Date/Now?' + Math.random(), config).then(successCallback, errorCallback);*/
    /*var User = $resource(config.webAPI.address + 'api/Date/Now?' + Math.random(), {});
    var user = User.get({}, function() {

        //user.abc = true;
        //user.$save();
    });
    return user*/
    /*return $resource(config.webAPI.address + 'api/Date/Now?' + Math.random(), {}, {
        get: {
            method: 'GET',
        }
    });*/
});

///////
/*directive*/
/*
app.directive('repeatFinish', function ($timeout) {
    return {
        link: function(scope,element,attr){
            if (scope.$last === true) {
                $timeout(function () {
                    var emitMessage = attr.repeatFinish || 'repeatFinish';
                    $timeout(function () {
                        scope.$eval(emitMessage);})
                });
            }
        }
    }
});*/
servicesModle.factory('MerchantCase', function ($resource) {
    return $resource(config.webAPI.address + 'api/MerchantCase?' + Math.random(), {}, {
        get: {
            url: config.webAPI.address + 'api/MerchantCase/GetCase/:id?' + Math.random(),
            method: 'GET',
            params: {
                id: '@id'
            }
        },
    });
});