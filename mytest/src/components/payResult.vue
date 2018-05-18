<template>
	<div>
		<mt-header title="购买成功" style="background: white;color:#3d4145" fixed></mt-header>
		<!--<mt-button @click="finish()" slot="right">完成</mt-button>-->
		<div class="card demo-card-header-pic" style="margin-top:45px;">
			<div valign="bottom" class="card-header color-white no-border no-padding">
				<img class='card-cover' src="../../static/img/code.jpg" alt="">
			</div>
			<div class="card-content">
				<div class="card-content-inner" style="text-align: center;">
					<p>扫一扫,关注环平保险公众号</p>
				</div>
				<div class="content-block">
					<div class="row">
						<div class="col-100">
							<a href="#/" class="button button-big button-fill" style="background:#0894ec;">返回首页</a>
						</div>
					</div>
				</div>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
				<p>&nbsp;</p>
			</div>
		</div>
	</div>
</template>
<!--http://baoxian.idukou.com/index.html#/payResult?amt=0.01&merchant_code=10001&notify_time=2018-05-16%2012%3A28%3A27&order_time=2018-05-16%2012%3A26%3A04&out_trade_no=611400946534&pay_channel=wxpay&pay_channel_user_no=o_MtruGNnQmWLr9Q28MO5Efynydk&pay_result=S&pay_time=2018-05-16%2012%3A26%3A56&pay_trade_no=4200000153201805161102192815&sign=1403f423c8069c0492b830786bb7d696&sign_type=MD5&subject=%E4%BC%97%E5%AE%89%E6%89%8B%E6%9C%AF%E6%84%8F%E5%A4%96%E9%99%A9&trade_no=92180516122604701972521205580003&za_order_no=92180516122604701972521205580003-->
<script>
	var address = "http://baoxian.idukou.com/";
	export default {
		data() {
			return {
				//id: this.$route.params.orderId
			}
		},
		http: {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		},
		mounted: function() {
			var str = location.href; //取得整个地址栏
			var urlDate=str.split('?')[1];
			this.$http.get(address + 'api/ZhonganPay/Back?'+urlDate).then(function(res) {
				console.log(res);
			})
		},
		methods: {
			finish: function() {
				this.$router.push("/");
			}
		}
	}
</script>
<style>

</style>