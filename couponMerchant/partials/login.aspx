<div id="loginPage">
	<header class="ui-header ui-header-positive ui-border-b">
		<h1>短信登录</h1>
	</header>
	<section class="ui-container">
		<form action="#" class="ui-whitespace">
			<div class="itemc">
			<input type="text" ng-model="myname" placeholder="用户名/邮箱/手机号" class="userName" />
			<input type="password" ng-model="password" placeholder="输入密码" class="password" />
			<!--<input type="text" ng-model="verifyCode" style="width:35%;float: left;" placeholder="请输入验证码" /><img id="verifyImage" style="cursor:hand" title="点击刷新验证码" onclick="this.src='/mob/tool/verifyimage?time=' + new Date()" src="/mob/tool/verifyimage" height="34" class="left" />
			<a href="javascript:void(0)" onclick="document.getElementById('verifyImage').src='/mob/tool/verifyimage?time=' + new Date()" src="/mob/tool/verifyimage?time=' + new Date()" class="left">换一张</a>-->
            </div>
            <div class="check" ng-model="isRemember">
            	<input type="checkbox"  class="checkbox">
            	<span>记住密码</span>
            	<a href="#/smsLogin" style="float:right;">短信登录</a>
            </div>
			<input type="button" value="登 录" class="ui-btn-lg" style="background: #13B193;color:white;margin-top:10px;" ng-click="login()" />
		</form>
	</section>
</div>