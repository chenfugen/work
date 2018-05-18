//轮播图
$('.carousel').carousel({
	interval: 2000
})

//城市选择
$(".selectCity").bind("change", function() {
	var cityAddress = $(this).children('option:selected').val();
	if(cityAddress == 0) {
		window.location.href = "index.html";
	} else {
		window.location.href = "http://sh.idukou.com";
	}
})
//让底部栏固定在底部
//header+nav高度为
var minHeight = $(window).height() - $('#footer').height() - 140;
$("#home").css("min-height", minHeight);
$("#companyNew").css("min-height", minHeight);
$("#merchants").css("min-height", minHeight);
$("#cemetery").css("min-height", minHeight);
$("#sysnews").css("min-height", minHeight);
$("#sysnew").css("min-height", minHeight);
$("#merchantMsg").css("min-height", minHeight);
$("#cemeteryMap").css("min-height", minHeight);
$("#userOrders").css("min-height", minHeight);
$("#nearMerchant ").css("min-height", minHeight);
$("#business").css("min-height", minHeight);
$("#about").css("min-height", minHeight);
$("#allmap").css("min-height", minHeight);
$("#personalCenter").css("min-height", minHeight);

window.scrollTo(0, 0); //滚动条初始值为0

//登录存储
var USER = 'USER';
var storage = {
	addUser: function(user) {
		var obj = {};
		obj.ID = user.ID;
		obj.UserName = user.UserName;
		obj.TrueName = user.TrueName;
		obj.HeadImg = user.HeadImg;
		obj.Phone = user.Phone;
		obj.Address = user.Address;
		obj.Sex = user.Sex;
		obj.TypeID = user.TypeID;
		obj.State = user.State;
		window.localStorage.setItem(USER, JSON.stringify(obj));
	},
	getUser: function() {
		if(window.localStorage.getItem(USER)) {
			return JSON.parse(window.localStorage.getItem(USER));
		}
		return false;
	},
	delUser: function() {
		window.localStorage.removeItem(USER);
	}
}

//信息框
	$("#msgClose").click(function() {
		$('#msgBox').modal('hide');
	})

//判断登录
function logining() {
	if(storage.getUser()) {
		$(".login").css({ "display": "none" });
		$(".logged").css({ "display": "block" });
		$(".userName").text(storage.getUser().TrueName);
	} else {
		$(".login").css({ "display": "block" })
		$(".logged").css({ "display": "none" })
	}
}
logining();
//退出登录
function exit() {
	storage.delUser();
	if((window.location.href).indexOf("personalCenter")>0){
		window.location.href="http://www.idukou.com";
	}else{		
		window.location.reload();
	}
}
//顶部导航栏
function nav(n) {
	$(".mainbav li").not(n).removeClass("active");
	$(".mainbav li").eq(n).addClass("active");
}

$(".mainbav li").click(function() {
	var i = $(this).index();
	nav(i);
})

//关于我们页-左导航栏
function num(i) {
	$(".nav-left ul li a").not(i).css({ "color": "#636363" })
	$(".nav-left ul li a").eq(i).css({ "color": "#13B193" })
	$(".content div").not(i).css({ "display": "none" })
	switch(i) {
		case 0:
			$(".infro").css({ "display": "block" });
			break;
		case 1:
			$(".employment").css({ "display": "block" });
			break;
		case 2:
			$(".connection").css({ "display": "block" });
			break;
		case 3:
			$(".LawRules").css({ "display": "block" });
			break;
		case 4:
			$(".companyMsg").css({ "display": "block" });
			$(".companyMsg div").css({ "display": "block" });
			break;
	}
}

$('.nav-left ul li').click(function() {
	var i = $(this).index();
	num(i);
})


//个人中心页-左导航栏
function nowNum(i) {
	$(".personalNav ul li a").not(i).css({ "color": "#636363" })
	$(".personalNav ul li a").eq(i).css({ "color": "#13B193" })
 	$(".intro").css({ "display": "none" })
 	$(".orderList").css({ "display": "none" })
 	$(".coupons").css({ "display": "none" })
	switch(i) {
		case 0:
			$(".intro").css({ "display": "block" });
			break;
		case 1:
			$(".orderList").css({ "display": "block" });
			break;
		case 2:
			$(".coupons").css({ "display": "block" });
			break;
	}
}

$('.personalNav ul li').click(function() {
	var i = $(this).index();
	nowNum(i);
})
