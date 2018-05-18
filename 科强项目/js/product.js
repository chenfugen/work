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
	$("#main a").mouseover(function(){
		var i=$(this).index();
		if(i==0){
		$(".msg1").stop().animate({left:50+"px"},800)
		}
		if(i==1){
		$(".msg2").stop().animate({left:100+"px"},800)
		}
		if(i==2){

		$(".msg3").stop().animate({left:200+"px"},800)
		}
		$("#main a").eq(i).stop().animate({width:"665px"},800).siblings().stop().animate({width:"11.4%"},800);
	})
   	$("#main a").mouseout(function(){
   		var i=$(this).index();
   		if(i==0){
   		$(".msg1").stop().animate({left:-280+"px"},300);
   		}
   			if(i==1){
   		$(".msg2").stop().animate({left:-280+"px"},300);
   		}
   				if(i==2){
   		$(".msg3").stop().animate({left:-280+"px"},300);
   		}
   		$("#main a").eq(i).stop().animate({width:"290px"},800).siblings().stop().animate({width:"290px"},800);
   	});
})