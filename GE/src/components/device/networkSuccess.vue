<template>
	<div id="networkSuccess">
          <div  class="nullDevice">
				<img src="../../../static/image/bg_success.png" />
				<p class="title">设备配网成功</p>
				<van-button  class="addDevice" @click="goDevice">开始使用</van-button>
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
			goDevice(){
				this.$router.push("/device");
			}
		}

	}
</script>

<style lang="scss">
	#networkSuccess {
	   .nullDevice {
		text-align: center;
		margin-top: 40%;
		img{
			width: 0.75rem;
			vertical-align: bottom;
		}
		.title{
			font-size: 0.14rem;
			color: #666666;
			text-align: center;
			line-height:0.5rem;
			vertical-align: top;
		}
		.addDevice {
			color: #333;
			font-size: 0.14rem;
			width: 1.1rem;
			margin-top: 0.2rem;
			vertical-align: top;
			background: none;
			border: 1px solid #aaa;
		}
	}	
	}
</style>