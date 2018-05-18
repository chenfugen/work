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

	for (var i = 0; i <10; i++) {
		$(".imgbox").eq(i).css({left:i*250+"px"});
	}
	 var i=-500;
	 var j=3;
	 $(".imgbox").eq(3).css({"zIndex":"99","width":"350px","height":"450px","top":"-20px","left":"720px"})
	 $(".imgbox:eq(3) img").css({"zIndex":"99","width":"350px","height":"410px","top":"-10px"})
	 $("#m_left").click(function(){	     	
	 	 if (i<0) {
	 	 	 i+=250;	  	 	 
	 	}else{
	 		$(".imgs").css({marginLeft:"-1500px"});
	 		i=-1250;
	 	}
	 	$(".imgs").stop().animate({marginLeft:i+"px"},500);
	  if (j==1) {
	 	   j=7;
          $(".imgbox").eq(j-1).animate({"opacity":"1","zIndex":"99","width":"350px","height":"450px","top":"-20px","left":(j-1)*250-50+"px"},500);
	 	 $(".imgbox:eq("+(j-1)+") img").css({"zIndex":"99","width":"350px","height":"410px","top":"-10px"},500)
	 	  $(".imgbox").eq(1).animate({"opacity":"0.7","zIndex":"1","width":"250px","height":"410px","top":"0px","left":250+"px"},500);
	 	   $(".imgbox:eq(1) img").animate({"zIndex":"1","width":"250px","height":"380px"},500);
	 	   }
	 	 $(".imgbox").eq(j-1).animate({"opacity":"1","zIndex":"99","width":"350px","height":"450px","top":"-20px","left":(j-1)*250-50+"px"},500);
	 	 $(".imgbox:eq("+(j-1)+") img").css({"zIndex":"99","width":"350px","height":"410px","top":"-10px"},500)
	 	  $(".imgbox").eq(j).animate({"opacity":"0.7","zIndex":"1","width":"250px","height":"410px","top":"0px","left":j*250+"px"},500);
	 	   $(".imgbox:eq("+j+") img").animate({"zIndex":"1","width":"250px","height":"380px"},500);	  
	 	  j--;

	 	  //if(i==2)

	 })
	 $("#m_right").click(function(){
	 	  if (i>-1750) {
	 	  	i-=250;
	 	  }else{
            $(".imgs").css({marginLeft:"-250px"});
	 		i=-500;
	 	  }
	 	$(".imgs").stop().animate({marginLeft:i+"px"},500);
        if (j==8) {
	 	   j=2;
          $(".imgbox").eq(j+1).animate({"opacity":"1","zIndex":"99","width":"350px","height":"450px","top":"-20px","left":(j+1)*250-50+"px"},500);
	 	 $(".imgbox:eq("+(j+1)+") img").css({"zIndex":"99","width":"350px","height":"410px","top":"-10px"},500)
	 	  $(".imgbox").eq(8).animate({"opacity":"0.7","zIndex":"1","width":"250px","height":"410px","top":"0px","left":8*250+"px"},500);
	 	   $(".imgbox:eq(8) img").animate({"zIndex":"1","width":"250px","height":"380px"},500);
	 	   }
	 	 $(".imgbox").eq(j+1).animate({"opacity":"1","zIndex":"99","width":"350px","height":"450px","top":"-20px","left":(j+1)*250-50+"px"},500);
	 	 $(".imgbox:eq("+(j+1)+") img").css({"zIndex":"99","width":"350px","height":"410px","top":"-10px"},500)
	 	  $(".imgbox").eq(j).animate({"opacity":"0.7","zIndex":"1","width":"250px","height":"410px","top":"0px","left":j*250+"px"},500);
	 	   $(".imgbox:eq("+j+") img").animate({"zIndex":"1","width":"250px","height":"380px"},500);	  
	 	  j++;


	 })
})