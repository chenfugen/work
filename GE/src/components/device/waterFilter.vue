<template>
	<div id="filter">
		<van-cell-group>
			<van-cell title="PP" :value="deviceMsg.filterPP.value+'%'" />
			<van-cell title="NF" :value="deviceMsg.filterNF.value+'%'" />
			<van-cell title="C1" :value="deviceMsg.filterC1.value+'%'" />
		</van-cell-group>
		<p class="filterTitle">滤芯寿命过低，将会影响过滤效果，良好的水质，有助于保持健康，建议您及时更换滤芯</p>
		<div class="payFilter">
			<van-button size="large" round @click="payFilter">购买滤芯</van-button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
               deviceMsg: this.$store.state.device_commercialMsg,
			   tempImg: 0
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			payFilter() {			
				this.$toast("暂无购买地址");
			},
			init() {
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.query.deviceId).then((res) => {
					if(res.data.success) {
						this.deviceMsg = res.data.data.property;
						let waterInTemp =(this.deviceMsg.waterInTemp.value).toString();					
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			}
		}
	}
</script>

<style lang="scss">
	#filter {
		background: white;
		.filterTitle {
			margin: 0.1rem 0.15rem;
			font-size: 0.12rem;
			color: #333333;
			letter-spacing: 0;
			line-height: 0.22rem;
		}
		.payFilter {
			position: fixed;
			width: 90%;
			margin: 0 5%;
			bottom: 0.1rem;
			button {
				background: #267CFB;
				border: none;
				color: white;
			}
		}
	}
</style>