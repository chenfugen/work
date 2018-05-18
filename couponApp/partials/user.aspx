<div id="user">
	<header class="ui-header ui-header-positive ui-border-b">
		<h1>个人中心</h1>
	</header>
	<section class="ui-container">
		<ul class="ui-list  ui-border-tb" style="background:url(img/memberBg.png);background-size:100% 100%;">
			<li>
				<div>
					<img src="http://192.168.1.20/mobile/images/member.png" class="memberavatar">
				</div>
				<div class="ui-list-info">
					<h4 class="ui-nowrap"><i class="iconfont icon-yonghu-" style="font-size:14px;"></i>&nbsp;{{myName}}</h4>
					 <h4 class="ui-nowrap"><i class="iconfont icon-dianhua" style="font-size:15px;"></i>&nbsp;{{Mobile}}</h4>
				</div>
			</li>
		</ul>
		<ul class="nav">
			<li style="border-right:1px solid #eee">
				<a href="#/myCoupon">
					<i class="iconfont icon-phonedateicon20" style="font-size:20px;color:#F43D30;"></i> 优惠券
				</a>
			</li>
			<li style="border-right:1px solid #eee">
				<a href="#/order">
					<i class="iconfont icon-wodezhanghu" style="font-size:20px;color:#13B193;"></i> 订单列表
				</a>
			</li>
			<li >
				<a href="#/myAccount">
					<i class="iconfont icon-wodezhanghu" style="font-size:20px;color:#13B193;"></i> 账户
				</a>
			</li>
		</ul>
		<p>&nbsp;</p>
		<div class="ui-btn-wrap" ng-click="goCoupon()">
			<button class="ui-btn-lg" style="margin-top:10px;">领券中心</button>
		</div>
		
		<div class="ui-btn-wrap" ng-click="exit()">
			<button class="ui-btn-lg" style="margin-top:10px;">退出</button>
		</div>
	</section>
</div>