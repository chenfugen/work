$(function(){
	$('#banner').flexslider({
		controlNav:true,
		directionNav:true,
		animationLoop: true,
		prevText: "",           //String: Set the text for the "previous" directionNav item
        nextText: ""  
	});
	function css(){
	var widths = $(window).width();
	var widthimg=$(".slides li img").width();
	var widthf=$(".flex-control-nav").width();
	var w=-(widthimg-widths)/2;
	var w2=(widths-1210)/2;
	//$(".flex-control-nav").css("width", widths-w2);
	//$(".flex-control-nav").css("padding-right", w2);
	if(widths > 1210) {
			$(".flex-prev").css("left", w2);
			$(".flex-next").css("right", w2);
			$(".maptw").css("left", w2);
			
		}else {
			$(".flex-prev").css("left", 0);
			$(".flex-next").css("right", 0);
			$(".maptw").css("left", 0);
		}	
	if(widths < widthimg) {
			$(".slides li img").css("margin-left", w);
			
		}else {
			$(".slides li img").css("margin-left", 0);
		}	
	 setTimeout(css);
}
css();

$(".nav ul li").hover(function(){
			$(this).find("div.dao").show();
			$(this).find("div.dao").stop().animate({opacity:1},800);
			$(this).addClass('navo');
		},function(){
			$(this).find("div.dao").stop().animate({opacity:0},100);
			$(this).find("div.dao").hide();
			$(this).removeClass('navo');
});
	

$(".nav .daol a").each(function(i){
		$(this).hover(function(){
			$(this).addClass("xdao").siblings().removeClass("xdao");
			$(".daor:eq("+i+")").show().siblings(".daor").hide();
		})
})

$(".hbn li").each(function(i){
		$(this).hover(function(){
			$(this).addClass("hbno").siblings().removeClass("hbno");
			$(".bm:eq("+i+")").show().siblings(".bm").hide();
		})
})

$(".gct ul li").hover(function(){
		$(this).find("div.gcts").stop().animate({bottom:'-40',opacity:0},200);
		$(this).find("div.gctx").stop().animate({left:'0',opacity:1},400);
		},function(){
		$(this).find("div.gcts").stop().animate({bottom:'0',opacity:1},400);
		$(this).find("div.gctx").stop().animate({left:'-280',opacity:0},200);
});

$(".jobs").click(function(){
			$(this).toggleClass("currentDd").siblings(".jobs").removeClass("currentDd");
			$(this).next(".jobx").slideToggle(500).siblings(".jobx").slideUp(500);
	})	

/*$(".gct ul li").hover(function(){
	$(this).find(".gctx").stop().animate({height:"200px"},400);
	$(this).find(".gctx h3").stop().animate({paddingTop:"60px"},400);
},function(){
	$(this).find(".gctx").stop().animate({height:"40px"},400);
	$(this).find(".gctx h3").stop().animate({paddingTop:"0px"},400);
})*/


});






