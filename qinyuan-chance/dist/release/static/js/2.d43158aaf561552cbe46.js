webpackJsonp([2],{"3pyw":function(n,t,e){var a,i;void 0===(i="function"==typeof(a=function(n,t,e){return function(n,t,e,a,i,r){function o(n){return"number"==typeof n&&!isNaN(n)}var s=this;if(s.version=function(){return"1.9.3"},s.options={useEasing:!0,useGrouping:!0,separator:",",decimal:".",easingFn:function(n,t,e,a){return e*(1-Math.pow(2,-10*n/a))*1024/1023+t},formattingFn:function(n){var t,e,a,i,r,o,u=n<0;if(n=Math.abs(n).toFixed(s.decimals),e=(t=(n+="").split("."))[0],a=t.length>1?s.options.decimal+t[1]:"",s.options.useGrouping){for(i="",r=0,o=e.length;r<o;++r)0!==r&&r%3==0&&(i=s.options.separator+i),i=e[o-r-1]+i;e=i}return s.options.numerals.length&&(e=e.replace(/[0-9]/g,function(n){return s.options.numerals[+n]}),a=a.replace(/[0-9]/g,function(n){return s.options.numerals[+n]})),(u?"-":"")+s.options.prefix+e+a+s.options.suffix},prefix:"",suffix:"",numerals:[]},r&&"object"==typeof r)for(var u in s.options)r.hasOwnProperty(u)&&null!==r[u]&&(s.options[u]=r[u]);""===s.options.separator?s.options.useGrouping=!1:s.options.separator=""+s.options.separator;for(var c=0,l=["webkit","moz","ms","o"],d=0;d<l.length&&!window.requestAnimationFrame;++d)window.requestAnimationFrame=window[l[d]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[l[d]+"CancelAnimationFrame"]||window[l[d]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(n,t){var e=(new Date).getTime(),a=Math.max(0,16-(e-c)),i=window.setTimeout(function(){n(e+a)},a);return c=e+a,i}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(n){clearTimeout(n)}),s.initialize=function(){return!(!s.initialized&&(s.error="",s.d="string"==typeof n?document.getElementById(n):n,s.d?(s.startVal=Number(t),s.endVal=Number(e),o(s.startVal)&&o(s.endVal)?(s.decimals=Math.max(0,a||0),s.dec=Math.pow(10,s.decimals),s.duration=1e3*Number(i)||2e3,s.countDown=s.startVal>s.endVal,s.frameVal=s.startVal,s.initialized=!0,0):(s.error="[CountUp] startVal ("+t+") or endVal ("+e+") is not a number",1)):(s.error="[CountUp] target is null or undefined",1)))},s.printValue=function(n){var t=s.options.formattingFn(n);"INPUT"===s.d.tagName?this.d.value=t:"text"===s.d.tagName||"tspan"===s.d.tagName?this.d.textContent=t:this.d.innerHTML=t},s.count=function(n){s.startTime||(s.startTime=n),s.timestamp=n;var t=n-s.startTime;s.remaining=s.duration-t,s.options.useEasing?s.countDown?s.frameVal=s.startVal-s.options.easingFn(t,0,s.startVal-s.endVal,s.duration):s.frameVal=s.options.easingFn(t,s.startVal,s.endVal-s.startVal,s.duration):s.countDown?s.frameVal=s.startVal-(s.startVal-s.endVal)*(t/s.duration):s.frameVal=s.startVal+(s.endVal-s.startVal)*(t/s.duration),s.countDown?s.frameVal=s.frameVal<s.endVal?s.endVal:s.frameVal:s.frameVal=s.frameVal>s.endVal?s.endVal:s.frameVal,s.frameVal=Math.round(s.frameVal*s.dec)/s.dec,s.printValue(s.frameVal),t<s.duration?s.rAF=requestAnimationFrame(s.count):s.callback&&s.callback()},s.start=function(n){s.initialize()&&(s.callback=n,s.rAF=requestAnimationFrame(s.count))},s.pauseResume=function(){s.paused?(s.paused=!1,delete s.startTime,s.duration=s.remaining,s.startVal=s.frameVal,requestAnimationFrame(s.count)):(s.paused=!0,cancelAnimationFrame(s.rAF))},s.reset=function(){s.paused=!1,delete s.startTime,s.initialized=!1,s.initialize()&&(cancelAnimationFrame(s.rAF),s.printValue(s.startVal))},s.update=function(n){if(s.initialize()){if(!o(n=Number(n)))return void(s.error="[CountUp] update() - new endVal is not a number: "+n);s.error="",n!==s.frameVal&&(cancelAnimationFrame(s.rAF),s.paused=!1,delete s.startTime,s.startVal=s.frameVal,s.endVal=n,s.countDown=s.startVal>s.endVal,s.rAF=requestAnimationFrame(s.count))}},s.initialize()&&s.printValue(s.startVal)}})?a.call(t,e,t,n):a)||(n.exports=i)},COzO:function(n,t,e){var a;"undefined"!=typeof self&&self,a=function(n){return function(n){function t(a){if(e[a])return e[a].exports;var i=e[a]={i:a,l:!1,exports:{}};return n[a].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var e={};return t.m=n,t.c=e,t.d=function(n,e,a){t.o(n,e)||Object.defineProperty(n,e,{configurable:!1,enumerable:!0,get:a})},t.n=function(n){var e=n&&n.__esModule?function(){return n.default}:function(){return n};return t.d(e,"a",e),e},t.o=function(n,t){return Object.prototype.hasOwnProperty.call(n,t)},t.p="",t(t.s=0)}([function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=e(1),i=e.n(a),r=e(4),o=e.n(r),s={__countup__:o.a,name:"ICountUp",props:{startVal:{type:Number,required:!1,default:0},endVal:{type:Number,required:!0},decimals:{type:Number,required:!1,default:0},duration:{type:Number,required:!1,default:2},options:{type:Object,required:!1}},data:function(){return{instance:null}},watch:{endVal:{handler:function(n){var t=this;t.instance&&i()(t.instance.update)&&t.instance.update(n)},deep:!1}},methods:{init:function(){var n=this;if(!n.instance){var t=n.$el,e=new o.a(t,n.startVal,n.endVal,n.decimals,n.duration,n.options);e.error||(e.start(function(){return n.$emit("ready",e,o.a)}),n.instance=e)}},uninit:function(){this.instance=null},start:function(n){var t=this;if(t.instance&&i()(t.instance.start)&&i()(n))return t.instance.start(n)},pauseResume:function(){var n=this;if(n.instance&&i()(n.instance.pauseResume))return n.instance.pauseResume()},reset:function(){var n=this;if(n.instance&&i()(n.instance.reset))return n.instance.reset()},update:function(n){var t=this;if(t.instance&&i()(t.instance.update))return t.instance.update(n)}},mounted:function(){this.init()},beforeDestroy:function(){this.uninit()},render:function(n){return n("span",{})}};t.default=s},function(n,t,e){var a=e(2),i=e(3),r="[object AsyncFunction]",o="[object Function]",s="[object GeneratorFunction]",u="[object Proxy]";n.exports=function(n){if(!i(n))return!1;var t=a(n);return t==o||t==s||t==r||t==u}},function(n,t){var e=Object.prototype.toString;n.exports=function(n){return e.call(n)}},function(n,t){n.exports=function(n){var t=typeof n;return null!=n&&("object"==t||"function"==t)}},function(t,e){t.exports=n}])},n.exports=a(e("3pyw"))},K9Qv:function(n,t,e){var a=e("ZIOn");"string"==typeof a&&(a=[[n.i,a,""]]),a.locals&&(n.exports=a.locals);e("FIqI")("40bfdf9a",a,!1,{})},QUOR:function(n,t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=e("COzO"),i={name:"NotFound",components:{ICountUp:e.n(a).a},data:function(){return{startVal:100,endVal:404,decimals:0,duration:2.5,options:{useEasing:!0,useGrouping:!0,separator:",",decimal:".",prefix:"",suffix:""}}},methods:{onReady:function(n,t){n.update(this.endVal)}}},r=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",{attrs:{id:"not-found"}},[e("div",{staticClass:"head"},[e("h1",[n._v(" What have you done? ")]),n._v(" "),e("h5",[n._v(" Now Go Back Using Below LInk ")]),n._v(" "),e("span",{staticClass:"status-code"},[e("ICountUp",{attrs:{startVal:n.startVal,endVal:n.endVal,decimals:n.decimals,duration:n.duration,options:n.options},on:{ready:n.onReady}})],1),n._v(" "),e("h2",[n._v("! ERROR DECETED !")])]),n._v(" "),e("h3",{staticClass:"icon"},[e("Icon",{attrs:{type:"md-bulb",size:"112"}})],1),n._v(" "),e("Button",{attrs:{type:"primary"}},[e("a",{staticStyle:{color:"#fff"},attrs:{href:"/"}},[n._v("GO TO HOME PAGE")])])],1)};r._withStripped=!0;var o={render:r,staticRenderFns:[]},s=o;var u=!1;var c=e("C7Lr")(i,s,!1,function(n){u||e("K9Qv")},"data-v-7400aa74",null);c.options.__file="src/views/common/pages/NotFound.vue";t.default=c.exports},ZIOn:function(n,t,e){(n.exports=e("UTlt")(!0)).push([n.i,"\n#not-found[data-v-7400aa74] {\n  position: fixed;\n  width: 100%;\n  min-height: 100%;\n  text-align: center;\n  color: #fff;\n  background-color: #B396FF\n}\n#not-found .head[data-v-7400aa74] {\n  padding-top: 60px;\n}\n#not-found .status-code[data-v-7400aa74] {\n  color: #5066BF;\n  font-size: 150px;\n}\n#not-found .icon[data-v-7400aa74] {\n  padding: 20px 0 16px;\n}\n","",{version:3,sources:["/Users/nelson/workspace/qinyuan-chance-farm-web/static-files/src/views/common/pages/NotFound.vue"],names:[],mappings:";AACA;EACE,gBAAgB;EAChB,YAAY;EACZ,iBAAiB;EACjB,mBAAmB;EACnB,YAAY;EACZ,yBAAyB;CAC1B;AACD;EACE,kBAAkB;CACnB;AACD;EACE,eAAe;EACf,iBAAiB;CAClB;AACD;EACE,qBAAqB;CACtB",file:"NotFound.vue",sourcesContent:["\n#not-found[data-v-7400aa74] {\n  position: fixed;\n  width: 100%;\n  min-height: 100%;\n  text-align: center;\n  color: #fff;\n  background-color: #B396FF\n}\n#not-found .head[data-v-7400aa74] {\n  padding-top: 60px;\n}\n#not-found .status-code[data-v-7400aa74] {\n  color: #5066BF;\n  font-size: 150px;\n}\n#not-found .icon[data-v-7400aa74] {\n  padding: 20px 0 16px;\n}\n"],sourceRoot:""}])}});