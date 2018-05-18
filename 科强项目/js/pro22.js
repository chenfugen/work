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
	
	var imag=["img/img5/img8.png","img/img5/img8.png","img/img5/img9.png","img/img5/img10.png","img/img5/img11.png"]
	var msgs=["Top-Tech3伺服专用控制系统","A6F3s伺服专用控制系统","F3系列-A6F3高端注塑机控制系统","F5系列-A6F5高端注塑机控制系统"]
	var index=0;
	
    $("#bleft").click(function(){
    	if(index==3){
    	 index=0;
    	}else{
    		index++;
    	}
    	  $("#imgbox img").attr({src:imag[index]});
    	  $("#imgbox img").css({opacity:"0.5"}).animate({opacity:"1"},800);
    	  $("#msg").text(msgs[index])
    })
	$("#bright").click(function(){
    	if(index==0){
    	 index=3;
    	}else{
    		index--;
    	}
    	  $("#imgbox img").attr({src:imag[index]});
    	  $("#imgbox img").css({opacity:"0.5"}).animate({opacity:"1"},800);
    	  $("#msg").text(msgs[index])
    })
	
	$("#main li").click(function(){
		var i=$(this).index();
		$("#main li:not("+i+")").css({"background":"#cbcbcb"});
		$("#main li").eq(i).css({"background":"#72BF44"});
		$("#main .detail:not("+i+")").css({"display":"none"});
		$("#main .detail").eq(i).css({"display":"block"});
	})
	
	

	})
