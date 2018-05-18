<div id="alterPassword">
	<header class="ui-header ui-header-positive ui-border-b">
		<i class="ui-icon-return" style="font-size:15px;" onclick="location='#/myAccount'">返回</i>
		<h1>修改密码</h1>
	</header>
	<section class="ui-container">
		<div class="ui-form ui-border-t" ng-show="checked">
			<form action="#" style="position:relative;">
				<div class="ui-form-item ui-form-item-show  ui-border-b">
					<label for="#">账 号</label>
					<input type="text" class="ui-txt-info" value="{{user.UserName}}" readonly>
				</div>
				<div class="ui-form-item ui-form-item-show  ui-border-b">
					<label for="#">电 话</label>
					<input type="text" class="ui-txt-info" value="{{user.Mobile}}" readonly>
				</div>
				<div class="ui-form-item ui-form-item-show  ui-border-b">
					<label for="#">验证码</label>
					<input type="text" class="ui-txt-info code" ng-model="code" placeholder="验证码">				
				</div>	
				<input type="button" value="获取验证码"  class="getVcode" />
			</form>
			<div class="ui-btn-wrap ui-footer-positive" ng-click="checkUser()">
				<button class="ui-btn-lg">
                                  身份验证   
                </button>
			</div>
		</div>
		<div class="ui-form ui-border-t" ng-hide="checked">
			<form action="#">
				<div class="ui-form-item ui-form-item-show ui-border-b">
					<label for="#">新密码</label>
					<input type="password" class="ui-txt-info" ng-model="newPassword" value="" placeholder="请输入新密码">
				</div>
				<div class="ui-form-item ui-form-item-show ui-border-b">
					<label for="#">确认密码</label>
					<input type="password" class="ui-txt-info" ng-model="checkPassword" value="" placeholder="确认新密码">
				</div>
			</form>
			<div class="ui-btn-wrap ui-footer-positive" ng-click="changePassword()">
				<button class="ui-btn-lg">
                                  修改密码   
            </button>
			</div>
		</div>
		<div class="ui-dialog" style="text-align: center;">
			<div class="ui-dialog-cnt">
				<div class="ui-dialog-bd">
					<div>
						<h4>提示</h4>
						<div>修改密码成功！</div>
					</div>
				</div>
				<div class="ui-dialog-ft ui-btn-group">
					<button type="button" data-role="button" class="select" ng-click="exit()">重新登录</button>
				</div>
			</div>
		</div>
	</section>
</div>