<template>
	<div id="networkSuccess">
		<div class="nullDevice">
			<img src="../../../static/image/bg_failure.png" />
			<p class="title">设备配网失败</p>
			<van-button class="addDevice" @click="goDevice">重新配网</van-button>
		</div>
		<div class="hintBox">
			<h3>友情提示：</h3>
			 <hr style="height:1px;border:none;border-top:1px dashed #eee;" />
			<p class="hintTitle">1.请确认机器是否长按“联网键”8S以上，注意WiFi指示灯的状态（闪烁）。</p>
            <p class="hintTitle">2.请再次确认WiFi密码是否输入正确？注意大小写和特殊字符。</p>
            <p class="hintTitle">3.请确认手机是否连接的是2.4G的WiFi，注意混频和5G的WiFi不可用。</p>
            <p class="hintTitle">4.请确认手机链接的WiFi网络是否正常，注意打开网页正常。</p>
            <p class="hintTitle">5.请确认连接的路由器是否有特殊设置，屏蔽了模块访问的网络。</p>
            <hr style="height:1px;border:none;border-top:1px dashed #eee;" />
            <h3>若以上确认无问题，可重启机器（关机后等待1分钟），再次启动配网过程；也可以拨打全国客服热线：<a href="tel:4007887171">400-788-7171</a></h3>
		</div>
	</div>
</template>
<script>
	export default {
	data() {
		return {
			linkSuccess: false,
		}
	},
	mounted() {},
	methods: {
		goDevice() {
			this.$router.push("/netWorkFlow");
		}
	}
}
</script>

<style lang="scss">
	#networkSuccess {
	text-align: center;
	.nullDevice {
		text-align: center;
		margin-top: 18%;
		height: 2.7rem;
		img {
			width: 1.13rem;
			vertical-align: bottom;
		}
		.title {
			font-size: 0.14rem;
			color: #666666;
			text-align: center;
			line-height: 0.5rem;
			vertical-align: top;
		}
		.addDevice {
			color: #267CFB;
			font-size: 0.16rem;
			width: 1.4rem;
			margin-top: 0.2rem;
			vertical-align: top;
			background: none;
			border: 1px solid #267CFB;
		}
	}
	.hintBox {
		display: inline-block;
		vertical-align: top;
		h3{
			padding:0.05rem 0;
			font-size:0.12rem;
			text-align: left;
			margin: 0 0.15rem;
			color: #333;
		}
		.hintTitle {
			text-align: left;
			margin: 0 0.15rem;
			font-size: 0.1rem;
			color: #FF4444;
			line-height:0.2rem;
		}
		.cancelHint {
			margin: 0 0.2rem;
			text-align: left;
			font-size: 0.1rem;
			color: #FF4444;
		}
	}
}</style>