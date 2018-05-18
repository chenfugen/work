<div id="register">
	<header class="ui-header ui-header-positive ui-border-b">
		<i class="ui-icon-return" style="font-size:15px;" onclick="location='#/user'">返回</i>
		<h1>登记中心</h1>
	</header>
	<section class="ui-container">
	   <ul class="nav">
	   	<li ng-click="couponState(1)" ng-class="{focus:1==focus}">平台活动</li>
	   	<li ng-click="couponState(2)" ng-class="{focus:2==focus}">我的活动</li>
	   </ul>
	   <ul class="ui-whitespace" style="margin-top:45px;">
	   	  <li ng-if="focus==2" class="Mactivities" ng-repeat="activity in Mactivities">
	   	  	 <p class="ActName">{{activity.ActName}}</p>  	   	  	 
	   	  	 <p class="StoreName">活动描述：{{activity.ActDesc}}</p>
	   	  	 <p class="ActTime">活动时间：{{activity.StartTime |date:"yyyy-MM-dd"}} ~ {{activity.EndTime |date:"yyyy-MM-dd"}}</p>  
	   	  	 <input type="button" ng-click="register(activity.CommActId)" value="登 记"  />	 
	   	  	 <input type="button" ng-click="goRecord(activity.CommActId)" value="登记查询" />
	   	  </li>
	   	  <li ng-if="focus==1" class="Sactivities" ng-repeat="activity in Sactivities">
	   	  	 <p class="ActName">{{activity.ActName}}</p>  	   	  	 
	   	  	 <p class="StoreName">活动描述：{{activity.ActDesc}}</p>
	   	  	 <p class="ActTime">活动时间：{{activity.StartTime |date:"yyyy-MM-dd"}} ~ {{activity.EndTime |date:"yyyy-MM-dd"}}</p>  
	   	  	 <input type="button" ng-click="register(activity.CommActId)" value="登 记"  />
	   	  	<input type="button" ng-click="goRecord(activity.CommActId)" value="登记查询" />
	   	  </li>
	   </ul>
	</section>
	<div class="ui-dialog register">
		<div class="ui-dialog-cnt cordbox">
			<header class="ui-dialog-hd ui-border-b">
				<h3>输入您的电话</h3>
				<i class="ui-dialog-close close" data-role="button"></i>
			</header>
			<div class="ui-dialog-bd">
				<input type="text" style="line-height:3rem;border:1px solid #eee;padding-left:10px;border-radius:5px 5px;" ng-model="phone" value="" placeholder="输入登记号码">
			</div>
			<div class="ui-dialog-ft">
				<button type="button" class="close" data-role="button">取消</button>
				<button type="button" ng-click="confirm()" data-role="button">确定</button>
			</div>
		</div>
	</div>
	
	<div class="ui-dialog prompt">
		<div class="ui-dialog-cnt cordbox">
			<header class="ui-dialog-hd ui-border-b">
				<h3>温馨提示</h3>
			</header>
			<div class="ui-dialog-bd">
				<span class="content"></span>
			</div>
			<div class="ui-dialog-ft">
				<button type="button"  class="close" data-role="button">返回</button>
				<button type="button" ng-click="viewLog()" data-role="button">查看记录</button>
			</div>
		</div>
	</div>
</div>