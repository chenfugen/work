function setCookie(e,o){var t=new Date;t.setTime(t.getTime()+2592e6),document.cookie=e+"="+escape(o)+";expires="+t.toGMTString()}function getCookie(e){var o,t=new RegExp("(^| )"+e+"=([^;]*)(;|$)");return(o=document.cookie.match(t))?unescape(o[2]):null}function delCookie(e){var o=new Date;o.setTime(o.getTime()-1);var t=getCookie(e);null!=t&&(document.cookie=e+"="+t+";expires="+o.toGMTString())}