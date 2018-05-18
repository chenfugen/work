$(function() {
			$("#b_left a").hover(function() {

				var i = $(this).index();
				if(i == 7) {
					$("header .nav0o").stop().animate({
						opacity: "1"
					}, 500);
				}
				if(i == 9) {
					$("header .nav2o").stop().animate({
						opacity: "1"
					}, 500);
				}
				if(i == 10) {
					$("header .nav3o").stop().animate({
						opacity: "1"
					}, 500);
				}
				if(i == 11) {
					$("header .nav4o").stop().animate({
						opacity: "1"
					}, 500);
				}
				if(i == 12) {
					$("header .nav5o").stop().animate({
						opacity: "1"
					}, 500);
				}
			}, function() {
				$("header .nav0o").stop().animate({
					opacity: "0"
				}, 500);
				$("header .nav2o").stop().animate({
					opacity: "0"
				}, 500);
				$("header .nav3o").stop().animate({
					opacity: "0"
				}, 500);
				$("header .nav4o").stop().animate({
					opacity: "0"
				}, 500);
				$("header .nav5o").stop().animate({
					opacity: "0"
				}, 500);
			})
			var times = null;
			$(".earth").hover(function() {
				var deg = 0;
				times = setInterval(function() {
					deg += 3;
					$(".earth").css("transform", "rotate(" + deg + "deg)")
				}, 50)

			}, function() {
				$(".earth").css("transform", "rotate(0deg)")
				clearInterval(times);
			})

			$("#main li").click(function(){
		     var i=$(this).index();
		     $("#main li:not("+i+")").css({"background":"#cbcbcb"});
		     $("#main li").eq(i).css({"background":"#72BF44"});
		     if (i==0) {
		     	 $(".detail").html("<p>"+">内置8种语言"+"</p>"+
					"<p>"+">可远程联网控制"+"</p>"+
					"<p>"+">强大U盘功能，实现程序升级、数据上传下载、画面截屏等功能"+"</p>"+
					"<p>"+">动作波形实时显示"+"</p>")
		     }
		     if (i==1) {
		     	 $(".detail").html("<p>"+">500组警报、500组操作记录"+"</p>"+
					"<p>"+">100组模具资料（U盘无限扩展）"+"</p>"+
					"<p>"+">100组监测数据"+"</p>"+
					"<p>"+">实时记录压力、速度、电子尺、IO点等波形"+"</p>"+"<p>"+">驱动器数学化参数设置界面"+"</p>"
					+"<p>"+">参数设置多重提示"+"</p>")
		     }
		     if (i==2) {
		     	 $(".detail").html("<p>"+">显示：7”~12.1”TFT液晶显示屏"+"</p>"+
					"<p>"+"800*480/800*600分辨率"+"</p>"+
					"<p>"+"16:9宽屏显示"+"</p>"+
					"<p>"+">接口：USB2.0、100M网络接口"+"</p>"+
					"<p>"+">其他：特种材料面膜"+"</p>"+
					"<p>"+">20万次轻触按钮"+"</p>")
		     }
		    
		   })
		})