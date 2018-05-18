<div id="myCoupon">
	<header class="ui-header ui-header-positive ui-border-b">
		<i class="ui-icon-return" style="font-size:15px;" onclick="history.back()">返回</i>
		<h1>优惠券</h1>
	</header>
	<section class="ui-container">
		<ul class="nav">
			<li ng-click="couponState(1)" ng-class="{focus:1==focus}">未使用 <div class="line"></div></li>
			<li ng-click="couponState(2)" ng-class="{focus:2==focus}">已使用<div class="line"></div></li>
			<li ng-click="couponState(3)" ng-class="{focus:3==focus}">已过期<div class="line"></div></li>
		</ul>
		<ul class="couponlist ui-whitespace">
			<li ng-repeat="coupon in CouponList | filter:customFilter">
				<img src="img/1.png" ng-if="coupon.orderamountlower>0 && coupon.bg==1" />
				<img src="img/4.png" ng-if="coupon.orderamountlower==0 && coupon.bg==1" />
				<img src="img/5.png" ng-if="coupon.bg!=1"/>
				<div class="couponMsg ui-whitespace">
					<p><i class="iconfont icon-shangjia" ng-if="coupon.storeid!=1" style="color:#fa4141;">&nbsp;</i><i class="iconfont icon-platform" ng-if="coupon.storeid==1" style="color:#fa4141;">&nbsp;</i>{{coupon.storename}}
						<span ng-if="coupon.orderamountlower>0 && coupon.bg==1" style="background:#F29B34;color:white;">&nbsp;{{coupon.name}}&nbsp;</span>
						<span ng-if="coupon.orderamountlower==0 && coupon.bg==1" style="background:#3E78DB;color:white;">&nbsp;{{coupon.name}}&nbsp;</span>
						<span ng-if="coupon.bg!=1" style="background:#ABB0AF;color:white;">&nbsp;{{coupon.name}}&nbsp;</span>
					</p>
					<p>券号:{{coupon.couponsn}}</p>
					<p>有效期:{{coupon.sendstarttime |date:'yyyy.MM.dd'}}-{{coupon.useendtime |date:'yyyy.MM.dd'}}</p>
					<div class="line"></div>
					<input ng-if="coupon.orderamountlower>0 && coupon.bg==1" style="color:#f19a37" type="button" class="ui-btn-s" value=" 使用 " />
					<input ng-if="coupon.orderamountlower==0 && coupon.bg==1" style="color:#51ba4a" type="button" class="ui-btn-s" value=" 使用 " />
					<input ng-if="coupon.orderamountlower>0 && coupon.bg==1" ng-click="cord(coupon)" style="color:#f19a37" type="button" class="ui-btn-s" value="条形码" />
					<input ng-if="coupon.orderamountlower==0 && coupon.bg==1" ng-click="cord(coupon)" style="color:#51ba4a" type="button" class="ui-btn-s" value="条形码" />
					<span ng-if="coupon.bg==2" style="font-size:1rem;line-height:3.2rem;">使用时间:{{coupon.usetime | date:'yyyy.MM.dd'}}</span>
					<span ng-if="coupon.bg==3" style="font-size:1rem;line-height:3.2rem;">该卷已过期</span>
					<a href="javascript:;" ng-click="" class="detail">详情</a>
				</div>
				<div class="moneyMsg">
					<p>￥<span style="font-size:3rem;">{{coupon.money}}</span></span>
					</p>
					<p>满{{coupon.orderamountlower}}元可用</p>
				</div>
			</li>
		</ul>
	</section>
	<div class="ui-dialog cord">
		<div class="ui-dialog-cnt cordbox">
			<header class="ui-dialog-hd ui-border-b">
				 <h3>条形码</h3>
				<i class="ui-dialog-close" data-role="button"></i>
			</header>
			<div class="ui-dialog-bd" style="position:relative;height:13rem;">
				<div style="position: absolute;left:0px;top:1rem;"><img id="imgcode" /></div>
			</div>
			<h6 style="color:#1ABC9C;margin-top:-2rem;height:2.2rem;">扫一扫上面条形码,进行使用</h6>
		</div>
	</div>
</div>