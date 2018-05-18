$(function(){
	$("#b_left a").hover(function(){		
	var i=$(this).index();
	   if (i==7) {
		$("header .nav0o").stop().animate({opacity:"1"},500);		
	}
	    if (i==8) {
		$("header .nav1o").stop().animate({opacity:"1"},500);		
	}
		if (i==9) {
		$("header .nav2o").stop().animate({opacity:"1"},500);
	}
		if (i==11) {
		$("header .nav4o").stop().animate({opacity:"1"},500);
	}
		if (i==12) {
		$("header .nav5o").stop().animate({opacity:"1"},500);
	}
    },function(){
	 $("header .nav0o").stop().animate({opacity:"0"},500);
	 $("header .nav1o").stop().animate({opacity:"0"},500);
	  $("header .nav2o").stop().animate({opacity:"0"},500);
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

 $(".imgbox img").hover(function(){
$(this).stop().animate({"width":"400px","height":"300px","marginLeft":"-50px"},500)   
  },function(){
$(this).stop().animate({"width":"210px","height":"240px","marginLeft":"0px"},500) 
  })

	})
