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
	
    var times=null;
    var index=0;
    //切图
    var imag=["img/img2/yuan.jpg","img/img2/yuan2.jpg","img/img2/yuan3.jpg","img/img2/yuan4.jpg","img/img2/yuan5.jpg","img/img2/yuan6.jpg","img/img2/yuan7.jpg","img/img2/yuan8.png","img/img2/yuan9.jpg"]
     var imgs = document.getElementById("imgs");
     var msg=document.getElementById("detail");
     var msgs=["野外拓展：为提高集体凝聚力、团队协作度，公司组织了一次野外拓展活动，也可以让大家得到锻炼。","野外拓展：大家积极参加公司的野外拓展，提高自己身体素质",
     "三清山：三清山壮美的奇峰怪石、云海佛光、日出晚霞之下，或许能让我们体会到道骨仙风.","三清山：三清山壮美的奇峰怪石、云海佛光、日出晚霞之下，或许能让我们体会到道骨仙风。","野外拓展：为提高集体凝聚力、团队协作度，公司组织了一次野外拓展活动，也可以让大家得到锻炼。","野外拓展：大家积极参加公司的野外拓展，提高自己身体素质",
     "三清山：三清山壮美的奇峰怪石、云海佛光、日出晚霞之下，或许能让我们体会到道骨仙风.","三清山：三清山壮美的奇峰怪石、云海佛光、日出晚霞之下，或许能让我们体会到道骨仙风。"," 海南三亚：公司组织去三亚游玩，三亚有“东方夏威夷”之称"]
        
      function startmove(){
      	if(index<imag.length-1){
      		index++;         
      	 }
      	  else{
      	  	index=0;
      	  }
      	  $("#imglist img").attr({src:imag[index]});
      	  $("#imglist img").css({opacity:"0.5"}).animate({opacity:"1"},1000);
      	  msg.innerHTML=msgs[index];
      }
    times=setInterval(startmove,2000);

   var back = document.getElementById("m_left");
   var next = document.getElementById("m_right");
   back.onclick=function(){
   	clearInterval(times);
   	 if (index==0) { 
   	  index =8;
     }else{
     	index--;
     }
   	$("#imglist img").attr({src:imag[index]});
    $("#imglist img").css({opacity:"0.5"}).animate({opacity:"1"},1000);
   	 msg.innerHTML=msgs[index];
   	 times=setInterval(startmove,2000);
   }
   next.onclick=function(){
   	clearInterval(times);
   	if (index<imag.length-1) {
   		index++;   
   }else{ 
    index = 0; 
   }
    $("#imglist img").attr({src:imag[index]});
     $("#imglist img").css({opacity:"0.5"}).animate({opacity:"1"},1000);
    msg.innerHTML=msgs[index];
   times=setInterval(startmove,2000);
   }










//   function starMove(){
// if (index<imag.length-1) {    
//    imgs.src = imag[++index];
//    msg.innerHTML=msgs[++index];
// }else{ 
//  index = 0;
//  imgs.src =imag[index]; 
//  msg.innerHTML=msgs[index];
//  
// }
// }
//   times = setInterval(starMove,2000);

})