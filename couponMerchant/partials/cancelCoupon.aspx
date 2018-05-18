<div id="cancelCoupon">
	<header class="ui-header ui-header-positive ui-border-b">
		<i class="ui-icon-return" style="font-size:15px;" onclick="location='#/user'">返回</i>
		<h1>核销中心</h1>
	</header>
	<section class="ui-container">
		<p class="text">1、输入优惠券号进行核销！</p>
		<input type="text" ng-model="coupons" class="coupons" placeholder="在此输入核销券号" />
		<button class="ui-btn-s cancel" ng-click="cancel()">
            <i class="iconfont icon-arrow-right"></i>
         </button>
		<p class="text">2、扫描优惠券条形码进行核销</p>
		<div class="ui-center" id="scanQRCode1">
			<i class="iconfont icon-saoma" style="font-size:10rem;border-radius:8rem 8rem;color:#00C795;"></i>
		</div>
	</section>
	<div class="ui-dialog">
    <div class="ui-dialog-cnt">
      <header class="ui-dialog-hd ui-border-b">
                  <h3>信息提示</h3>               
              </header>
        <div class="ui-dialog-bd" style="text-align: center;">
            <h4>{{coupon.Name+" "+coupon.Money}}元券</h4>
            <div>满{{coupon.OrderAmountLower}}可使用</div>
        </div>
        <div class="ui-dialog-ft">
            <button type="button" data-role="button" ng-click="close()">取消</button>
            <button type="button" data-role="button" ng-click="cancelCoupon()">确认核销</button>
        </div>
    </div>        
</div>
</div>