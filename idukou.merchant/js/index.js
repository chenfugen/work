
//���ø������ĳ�ʼ���
$(".all_list").focus();
var width = $("body").width();
width = parseInt(width) * 0.73 - 2 + "px";
$(".all_list").css("width", width);
$(".bottom_nav").css("width", $("body").width());
$(".menus").css("height", $(window).height() * 0.85);
$(".all_list").css("height", $(window).height() * 0.85);
$(".pa_bo").css("height", $(window).height() * 0.7)


//��ֹ���ֻ��ʱ�˵�������������������ͻ
$("body").css({"height": "100%", "overflow": "hidden"});
$("html").css({"height": "100%", "overflow": "hidden"});
//console.log($("#l3").offset().top)
//��Ʒ��������Ŀ��ID
var type = ["l1", "l2", "l3","l4","l5"];
//�ж��Ƿ��ڹ�����
var ff = 0;
var timeId, timeId2;

//���iPhone5 transform:����Ч
// if ($(window).width() >50) {
//     $(".pic img").css("transform", "translate(-60%,-60%)");

// } else {
//     $(".pic img").css("margin", "-50%");
// }

//�жϵ�ǰ���ڵ�λ��Ϊ���ʵ���Ŀ������ʽ

//timeId = window.setTimeout("skipHref()", 200);
//function skipHref() {
//  if (ff == 1) {
//  } else {
//      $.each(type,function (i) {
//          if ($("#"+ type[i]).offset().top< $(window).height() * 0.1) {
//              $(".menus li").removeClass("active");
//              $(".menus a").removeClass("active");
//              $("a[href=#" + type[i] + "]").parent().addClass("active");
//              $("a[href=#" + type[i] + "]").addClass("active");
//
//              var text = $("a[href=#" + type[i] + "]").text();
//              $(".title").removeClass("active");
//              $("p:contains(" + text + ")").addClass("active");
//          }
//
//      });
//      timeId = window.setTimeout("skipHref()", 200);
//  }
//
//  $(".all_list").focus();
//
//}
///* ê����ת */
//var j = 0, posL = [], posO = {};
//function aSkip(o) {
//  clearTimeout(timeId);
//  ff = 1;
//  timeId2 = window.setTimeout("isStop()", 200);
//  $(".menus li").removeClass("active");
//  $(".menus a").removeClass("active");
//  var text = $(o).text();
//  $(".title").removeClass("active");
//  $("p:contains(" + text + ")").addClass("active");
//  $(o).addClass("active");
//  $(o).parent().addClass("active");
//
//  //ƽ����ת
//  if (j == 0) {
//      $.each(type, function (i, item) {
//          posO.id = "#" + type[i];
//           posO.top = $("#" + type[i]).offset().top + $(".all_list").scrollTop();
//          posL[i] = posO;
//          posO = {};
//      });
//      $.each(posL, function (i, item){
//          if ($(o).attr("href") == item.id) {
//              $(".all_list").animate({scrollTop:item.top},700);
//          }
//      });
//      j++;
//
//  } else {
//      $(".all_list").stop();
//      $.each(posL, function (i, item) {
//          if ($(o).attr("href") == item.id) {
//              $(".all_list").animate({scrollTop:item.top}, 700);
//          }
//      });
//  }
//
//
//};


////ê�����Ӻ��ж϶����Ƿ����
//function isStop() {
//  //alert($(".all_list").is(":animated"))
//  if ($(".all_list").is(":animated")) {
//      ff = 1;
//      timeId2 = window.setTimeout("isStop()", 200);
//  } else {
//      ff = 0;
//      clearTimeout(timeId2);
//  }
//}
//
////��������
//$(".all_list").on("scrollstop", function () {
//  if (ff == 0) {
//      //console.log("?");
//      timeId = window.setTimeout("skipHref()", 200);
//  } else {
//      clearTimeout(timeId);
//  }
//
//
//});

