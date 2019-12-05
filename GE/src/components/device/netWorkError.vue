<template>
	<div id="networkSuccess">
		<div class="nullDevice">
			<img src="../../../static/image/bg_failure.png" />
			<p class="title">设备配网失败</p>
			<van-button class="addDevice" @click="goDevice">重新配网</van-button>
		</div>
		<div class="hintBox">
			<h3 class="hintTitle">提示：你的wifi网络没开启、信号不稳定、信号较弱、以及配网时间过长都有可能影响到设备的配网</h3>
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
			margin-top: 40%;
			height: 2.7rem;
			img {
				width: 0.75rem;
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
				color: #aaa;
				font-size: 0.14rem;
				width: 1.1rem;
				margin-top: 0.2rem;
				vertical-align: top;
				background: none;
				border: 1px solid #aaa;
			}
		}
		.hintBox {
			display: inline-block;
			vertical-align: top;
			.hintTitle {
				text-align: center;
				width: 2rem;
				margin: 0 0.2rem;
				font-size: 0.12rem;
				color: #FF4444;
			}
			.cancelHint {
				margin: 0 0.2rem;
				text-align: left;
				font-size: 0.12rem;
				color: #FF4444;
			}
		}
	}
</style>