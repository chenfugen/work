$(function(){
	$("#b_left a").hover(function(){
	var i=$(this).index();	
	     if (i==8) {
		$("header .nav1o").stop().animate({opacity:"1"},500);		
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
	 $("header .nav1o").stop().animate({opacity:"0"},500);
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
	

  var i=0; 
  var j=4;  
	$("#htop").click(function(){
	var tops=parseFloat($("#main ul").css("top"));
		if (tops<0&&tops>=-360) {
			 j--;
		 $("#main ul").animate({top:-90*j+"px"},500); 
		 }     
	})

	$("#hbottom").click(function(){
		var tops=parseFloat($("#main ul").css("top"));
		if (tops>=-270) {
			 i++;
		 $("#main ul").animate({top:-90*i+"px"},500);
           
		}
  
	})
	
})