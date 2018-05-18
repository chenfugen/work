<div id="order">
	<header class="ui-header ui-header-positive ui-border-b">
		<i class="ui-icon-return" style="font-size:15px;" onclick="location='#/user'">返回</i>
		<h1>订单列表</h1>
	</header>
	<section class="ui-container">
		<ul class="orderList" ng-repeat="order in orders">
			<li class="orderHeader ui-whitespace">
				<span>订单号:{{order.osn}}</span>
				<span style="float: right;color: #FA4141;">{{order.orderstate|orderState}}</span>
			</li>
			<li class="orderContent" ng-click="goMsg(order.oid)">
				<span class="imgbox" style="background:url({{order.OrderProduct.ShowImg | imageSrc}});background-size:100% 100%;"></span>
				<div class="msgbox">
					<h5>{{order.OrderProduct.Name}}</h5>
					<p>{{order.addtime | date:"yyyy-MM-dd hh:mm:ss"}}</p>
					<p><span class="DiscountPrice">￥{{order.OrderProduct.DiscountPrice}}</span>&nbsp;<span class="MarketPrice"> ￥{{order.OrderProduct.MarketPrice}}</span> </p>
				</div>
			</li>
			<li class="orderCheck ui-whitespace">
				<p>共 {{order.OrderProduct.BuyCount}} 件商品 &nbsp; 实付:<span style="color:#FA4141;">￥{{order.surplusmoney}}</span></p>
				<!--<div class="ui-btn-wrap register">
					<button class="ui-btn-s " style="color:#7f7f7f;">登记</button>
				</div>-->
			</li>
		</ul>
		<div class="ui-center" ng-if="orders==null">
			暂无数据
		</div>
	</section>
</div>