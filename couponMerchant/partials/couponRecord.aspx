<div id="couponRecord">
	<header class="ui-header ui-header-positive ui-border-b">
		<i class="ui-icon-return" style="font-size:15px;" onclick="location='#/user'">返回</i>
		<h1>核销记录</h1>
	</header>
	<section class="ui-container ui-whitespace">
		<ul class="couponList"  ng-repeat="coupon in couponList">		
			<li>
				<div class="number">
					券号：{{coupon.couponsn}}
				</div>
				<div class="money">
					<p><span style="font-size:10px;">￥</span><strong>{{coupon.money}}</strong></p>
					<p>满{{coupon.orderamountlower}}使用</p>
					<p>&nbsp;</p>
				</div>
				<div class="userMsg">
				<h5>{{coupon.storename}}-{{coupon.name}}</h5>
				<p>用户：{{coupon.username}}</p>
				<p>联系电话：{{coupon.mobile}}</p>
				<p>核销时间: {{coupon.usetime |date:"yyyy-MM-dd HH:mm "}}</p>
				</div>
			</li>
		</ul>
		<div ng-if="couponList==null" class="ui-center">暂时无记录</div>
	</section>
</div>