$(function(){
	$("#main a").hover(function(){
		var i=$(this).index()/2;
		if(i%2==0){
		$("#main a").eq(i).stop().animate({"margin-left":"15px"},500)
	   }else{
	   	$("#main a").eq(i).stop().animate({"margin-left":"-15px"},500)
	   }   	
	  },function(){
	  	var i=$(this).index()/2;
	  	if(i%2==0){
		$("#main a").eq(i).stop().animate({"margin-left":"0px"},500)
	   }else{
	   	$("#main a").eq(i).stop().animate({"margin-left":"0px"},500)
	   }   	
	  })
	
	$("#main a").hover(function(){
		var i=$(this).index()/2+1;
		if(i==1){
		$("#main .detail_1").stop().animate({opacity:"1"},500)
		}
				if(i==2){
		$("#main .detail_2").stop().animate({opacity:"1"},500)
		}
						if(i==3){
		$("#main .detail_3").stop().animate({opacity:"1"},500)
		}
								if(i==4){
		$("#main .detail_4").stop().animate({opacity:"1"},500)
		}
        	   if(i==5){
  	  $("#main .detail_5").stop().animate({opacity:"1"},500)
  	  }
		if(i==6){
		$("#main .detail_6").stop().animate({opacity:"1"},500)
		}
  },function(){
  	   var i=$(this).index()/2+1;
  	   if(i==1){
  	  $("#main .detail_1").stop().animate({opacity:"0"},500)
  	  }
  	    	   if(i==2){
  	  $("#main .detail_2").stop().animate({opacity:"0"},500)
  	  }
  	    	    	   if(i==3){
  	  $("#main .detail_3").stop().animate({opacity:"0"},500)
  	  }
  	    	    	    	   if(i==4){
  	  $("#main .detail_4").stop().animate({opacity:"0"},500)
  	  }
  	    	    	    	    	   if(i==5){
  	  $("#main .detail_5").stop().animate({opacity:"0"},500)
  	  }
  	    	    	    	    	    	   if(i==6){
  	  $("#main .detail_6").stop().animate({opacity:"0"},500)
  	  }
  })
})
