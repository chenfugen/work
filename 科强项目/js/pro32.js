$(function(){
	$("#b_left a").hover(function(){
		
	var i=$(this).index();
	   if (i==7) {
		$("header .nav0o").stop().animate({opacity:"1"},500);		
	}
	     if (i==9) {
		$("header .nav2o").stop().animate({opacity:"1"},500);		
	}
		if (i==10) {
		$("header .nav3o").stop().animate({opacity:"1"},500);
	}
		if (i==11) {
		$("header .nav4o").stop().animate({opacity:"1"},500);
	}
		if (i==12) {
		$("header .nav5o").stop().animate({opacity:"1"},500);
	}
    },function(){
	 $("header .nav0o").stop().animate({opacity:"0"},500);
	 $("header .nav2o").stop().animate({opacity:"0"},500);
	  $("header .nav3o").stop().animate({opacity:"0"},500);
	   $("header .nav4o").stop().animate({opacity:"0"},500);
	    $("header .nav5o").stop().animate({opacity:"0"},500);
	})
	var times=null;
	$(".earth").hover(function(){
		var deg=0;
	  times=setInterval(function(){
	  	deg+=3;
         $(".earth").css("transform","rotate("+deg+"deg)")
	  },50)	
    
	},function(){    
         $(".earth").css("transform","rotate(0deg)")
          clearInterval(times);
})
	
	var imag=["img/img5/pro32.png","img/img5/pro33.png","img/img5/pro34.jpg","img/img5/pro34.jpg","img/img5/pro35.jpg","img/img5/pro36.jpg","img/img5/pro37.jpg","img/img5/pro38.jpg","img/img5/pro39.jpg","img/img5/pro40.png"]
	var msgs=["正泰电器","拱东医疗","上海力卡","苏泊尔","波尔集团","曼胡默尔集团","法雷奥集团","延锋集团","上海力卡","苏泊尔"];
	var index=0;
    $("#bleft").click(function(){
    	if(index==9){
    	 index=0;
    	}else{
    		index++;
    	}
    	  $("#imgbox img").attr({src:imag[index]});
    	  $("#imgbox img").css({opacity:"0.3"}).animate({opacity:"1"},800);
    	  $("#msg").text(msgs[index]);
    	  
    })
	$("#bright").click(function(){
    	if(index==0){
    	 index=9;
    	}else{
    		index--;
    	}
    	  $("#imgbox img").attr({src:imag[index]});
    	  $("#imgbox img").css({opacity:"0.3"}).animate({opacity:"1"},800);
    	  $("#msg").text(msgs[index])
    	  $("#main .detail:not("+index+")").css({"display":"none"});
		   $("#main .detail").eq(index).css({"display":"block"});
    })
	
	})