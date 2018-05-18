<div id="userMsg">
	<header class="ui-header ui-header-positive ui-border-b">
		<i class="ui-icon-return" style="font-size:15px;" onclick="location='#/myAccount'">返回</i>
		<h1>个人详情</h1>
	</header>
	<section class="ui-container">
		<ul class="ui-list ui-border-tb">
			<li class="ui-border-t">
				<div class="ui-list-info">
					<h4 class="ui-nowrap">&nbsp;&nbsp;&nbsp;头像</h4>
				</div>
				<div class="ui-avatar">
					<span style="background-image:url(http://placeholder.qiniudn.com)"></span>
				</div>

			</li>
		</ul>
		<div class="ui-form ui-border-t">
			<form action="#">
				<div class="ui-form-item ui-form-item-show  ui-border-b" onclick="location='#/userMsg'">
					<label for="#">&nbsp;&nbsp;&nbsp;昵称</label>
					<input type="text" class="ui-txt-info" ng-model="user.UserName">
				</div>
				<div class="ui-form-item ui-form-item-show ui-border-b">
					<label for="#">&nbsp;&nbsp;&nbsp;手机号</label>
					<input type="text" class="ui-txt-info" ng-model="user.Mobile">
				</div>
				<div class="ui-form-item ui-form-item-show ui-border-b">
					<label for="#">&nbsp;&nbsp;&nbsp;邮箱</label>
					<input type="text" class="ui-txt-info" ng-model="user.Email">
				</div>
				<div class="ui-form-item ui-form-item-show ui-border-b">
					<label for="#">&nbsp;&nbsp;&nbsp;地址</label>
					<select id="provinceId" name="provinceId" style="margin-left:75px;font-size:12px;color: #777;width:70px;">
						<option selected="selected" value="-1">请选择</option>
					</select>
					<select id="cityId" name="cityId" style="font-size:12px;color: #777;width:70px;">
						<option selected="selected" value="-1">请选择</option>
					</select>
					<select id="regionId" name="regionId" style="font-size:12px;color: #777;width:70px;">
						<option selected="selected" value="-1">请选择</option>
					</select>
				</div>
				<div class="ui-form-item ui-form-item-show ui-border-b">
					<label for="#">详细地址</label>
					<input type="text" class="ui-txt-info" ng-model="user.Address" placeholder="请输入详细地址">
				</div>
			</form>
			<div class="ui-btn-wrap ui-footer-positive" ng-click="changeInfro()">
				<button class="ui-btn-lg">
                                    信息修改   
                </button>
			</div>
		</div>
	</section>
</div>
