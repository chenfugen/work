<template>
	<div id="networkSuccess">
          <div  class="nullDevice">
				<img src="../../../static/image/netWork4@3x.png" />
				<p class="title">设备已配网成功</p>
				<van-button round class="addDevice" @click="goDevice">开始使用</van-button>
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
			width: 1.13rem;
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
			color: #267CFB;
			font-size: 0.16rem;
			width: 1.4rem;
			margin-top: 0.2rem;
			vertical-align: top;
			background: none;
			border: 1px solid #267CFB;
		}
	}	
	}
</style>