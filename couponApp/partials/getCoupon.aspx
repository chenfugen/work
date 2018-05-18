<div id="getCoupon">
	<header class="ui-header ui-header-positive ui-border-b">
		<i class="ui-icon-return" style="font-size:15px;" onclick="location='#/user'">返回</i>
		<h1>领券中心</h1>
	</header>
	<section class="ui-container" ng-if="state">
		<ul class="couponlist ui-whitespace" ng-hide="couponed">
			<li ng-repeat="coupon in coupons">
				<img src="img/3.png" />
				<div class="couponMsg ui-whitespace">
					<p style="font-size:1.3rem;margin-top:1rem;color:#050505;">{{coupon.Name}}</p>
					<p>{{coupon.StoreId | storyType}}</p>
					<p style="margin-top:2rem;">截止时间 {{coupon.UseEndTime | date:'yyyy-MM-dd' }}</p>
					<div id="triangle-topright"></div>
					<div class="text">抢</div>
				</div>
				<div class="moneyMsg">
					<p>￥<span style="font-size:3rem;">{{coupon.Money}}</span></span>
					</p>
					<p>满{{coupon.OrderAmountLower}}元可使用</p>
				</div>
			</li>
		</ul>
		<ul class="couponlist ui-whitespace" ng-show="couponed">
			<li ng-repeat="coupon in coupons" ng-show="coupon.ResultState==0 || coupon.ResultState==1 || coupon.ResultState==10">
				<img src="img/5.png" ng-show="coupon.ResultState==0 || coupon.ResultState==1" />
				<img src="img/3.png" ng-show="coupon.ResultState==10" />
				<div class="couponMsg ui-whitespace">
					<p style="font-size:1.3rem;margin-top:1rem;color:#050505;">{{coupon.Model.Name}}</p>
					<p>{{coupon.Model.StoreId | storyType}}</p>
					<p style="margin-top:2rem;">截止时间 {{coupon.Model.UseEndTime | date:'yyyy-MM-dd' }}</p>
					<div id="triangle-topright" ng-if="coupon.ResultState==10"></div>
					<div class="text" ng-if="coupon.ResultState==10">已领</div>
					<i class="iconfont icon-lingqushibai" ng-if="coupon.ResultState==0" style="position: absolute; top:2px;right:0px;font-size:4rem;"></i>
					<i class="iconfont icon-lingquchenggong" ng-if="coupon.ResultState==1" style="position: absolute; top:2px;right:0px;font-size:4rem;"></i>
				</div>
				<div class="moneyMsg">
					<p>￥<span style="font-size:3rem;">{{coupon.Model.Money}}</span></span></p>
					<p>满{{coupon.Model.OrderAmountLower}}元可使用</p>
				</div>
			</li>
		</ul>	
		<ul class="tip ui-whitespace" ng-show="couponed">
		<li  ng-repeat="coupon in coupons" ng-show="coupon.ResultState!=0 && coupon.ResultState!=1 && coupon.ResultState!=10">
		<p>{{coupon.Model.Name}}&nbsp;{{coupon.ResultValue}}</p>
		</li>
		</ul>
	</section>
	<p>&nbsp;</p>
	<p>&nbsp;</p>
	<footer class="ui-footer ui-footer-stable ui-border-t" ng-click="getCoupon()">
		<ul class="ui-tiled">
			<li>
				<div class="acquire">一键领取</div>
			</li>
		</ul>
	</footer>
	<div class="ui-dialog">
		<div class="ui-dialog-cnt cordbox">
			<header class="ui-dialog-hd ui-border-b">
				<h3>输入电话</h3>
				<i class="ui-dialog-close close" data-role="button"></i>
			</header>
			<div class="ui-dialog-bd">
				<input type="text" style="line-height:3rem;border:1px solid #eee;padding-left:10px;border-radius:5px 5px;" ng-model="phone" value="" placeholder="输入已登记号码">
			</div>
			<div class="ui-dialog-ft">
				<button type="button" class="close" data-role="button">取消</button>
				<button type="button" ng-click="confirm()" data-role="button">确定</button>
			</div>
		</div>
	</div>

</div>