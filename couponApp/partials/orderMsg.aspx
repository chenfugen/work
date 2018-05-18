<div id="orderMsg">
	<header class="ui-header ui-header-positive ui-border-b">
		<i class="ui-icon-return" style="font-size:15px;" onclick="location='#/order'">返回</i>
		<h1>订单详情</h1>
	</header>
	<section class="ui-container ui-whitespace">
		<div class="title ui-whitespace">订单信息</div>
		<ul class="orderMsg ui-whitespace">			
			<li>订单号&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{OrderInfo.OSN}}</li>
			<li>下单时间&nbsp;&nbsp;&nbsp;{{OrderInfo.AddTime |date:"yyyy/MM/dd hh:mm"}}</li>
			<li>订单状态&nbsp;&nbsp;&nbsp;{{OrderInfo.OrderState |orderState}}</li>
		</ul>
		<div class="title ui-whitespace">商品清单</div>
		<div class="orderContent" ng-repeat="OrderProduct in OrderProductList" >
				<span class="imgbox" style="background:url({{OrderProduct.ShowImg | imageSrc}});background-size:100% 100%;"></span>
				<div class="msgbox">
					<h5>{{OrderProduct.Name}}</h5>
					<p><span style="color:#FA4141">￥{{OrderProduct.DiscountPrice}}</span>&nbsp;&nbsp;{{OrderProduct.RealCount}}件</p>
					<p>{{OrderInfo.StoreName}}</p>
				</div>
		</div>
		<div class="title ui-whitespace">价格清单</div>
		<ul class="costMsg ui-whitespace">
			<li>付款方式<span>{{OrderInfo.PayFriendName | orderState}}</span></li>
            <li>商品金额<span class="money">￥{{OrderInfo.ProductAmount.toFixed(2)}}</span></li>
            <li>返现<span class="money">￥{{OrderInfo.Discount.toFixed(2)}}</span></li>
             <li>运费<span class="money">￥{{OrderInfo.ShipFee.toFixed(2)}}</span></li>
             <li>金币<span class="money">￥{{OrderInfo.PayCreditMoney.toFixed(2)}}</span></li>
             <li>优惠金额<span class="money">￥{{OrderInfo.CouponMoney.toFixed(2)}}</span></li>    
              <div>实付金额<span class="money">&nbsp;￥{{OrderInfo.SurplusMoney.toFixed(2)}}</span></div>
		</ul>
		<div class="title ui-whitespace">配送信息</div>
		<ul class="shipping ui-whitespace">
			<li>收件人信息：<span>{{OrderInfo.Consignee}} {{OrderInfo.Mobile}}</span></li>
			<li>配送地址: <label>{{RegionInfo.ProvinceName}} {{RegionInfo.CityName}} {{RegionInfo.Name}}  {{OrderInfo.Address}}</label></li>
		    <li>配送方式：<span>{{OrderInfo.ShipCoName}}</span></li>
		    <li>配送时间：<span>{{OrderInfo.ShipTime |date:"yyyy/MM/dd hh:mm"}}</span></li>
		</ul>
	</section>
</div>