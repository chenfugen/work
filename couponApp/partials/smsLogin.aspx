<div id="smsLogin">
	<header class="ui-header ui-header-positive ui-border-b">
		<i class="ui-icon-return" style="font-size:15px;" onclick="location='#/'">返回</i>
		<h1>短信登录</h1>
	</header>
	<section class="ui-container">
	<form action="#" class="ui-whitespace">
         <input type="text" ng-model="phone" placeholder="请输入手机号" class="phone" />
         <label>
         <input type="text" ng-model="Vcode" placeholder="验证码" class="Vcode" />
         <input type="button" value="获取验证码"  class="getCode" />
          </label>
        <input type="button" value="登 录" class="ui-btn-lg" style="background: #13B193;color:white;margin-top:10px;font-size: 15px;" ng-click="login()" />
    </form>
	</section>
</div>