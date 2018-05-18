<div id="userRecord">
	<header class="ui-header ui-header-positive ui-border-b">
		<i class="ui-icon-return" style="font-size:15px;" onclick="location='#/register'">返回</i>
		<h1>活动记录</h1>
	</header>
    <section class="ui-container ui-whitespace">
		<table class="nav">
			<tr>
			  <td>登记用户</td>
			  <td>登记电话</td>
			  <td>登记时间</td>
			</tr>
			<tr ng-repeat="register in registerList">
			  <td>{{register.username}}</td>
			  <td>{{register.mobile}}</td>
			  <td>{{register.Regtime |date:"yyyy/MM/dd"}}</td>
			</tr>
			<tr ng-if="registerList==''">
			   <td></td> 
			   <td>暂无数据</td> 
			   <td></td> 
			</tr>
		</table>
	</section>
</div>