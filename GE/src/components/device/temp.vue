<template>
	<div id="temperature">
		<div class="tempMsg">
			<img :src="tempImg" />
			<p class="waterNum">{{deviceMsg.waterInTemp.value}}<span class="unit">℃</span></p>
			<p class="water_title">净水TDS</p>
		</div>
		<p class="tempTitle">适宜的水温，可以帮助您快速吸收饮用的水分，过冷或过热，都会对身体造成损害。</p>
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
						let num = 0;
						if(waterInTemp.length==1) {
							if(waterInTemp > 0) {
								num = 10;
							}
						} else if(waterInTemp.length==3) {
							num = 100;
						}else{
							if(waterInTemp.substring(1,2)>5) {
								num = Number(waterInTemp.substring(0,1)) + 1 + "0";
							} else {
								num = waterInTemp.substring(0,1) + "0";
							}
						}
						this.tempImg = "../../../../static/image/temp"+num+".png"
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
	#temperature {
		background: white;
		.tempMsg {
			width: 1.8rem;
			height: 1.8rem;
			margin: 0.5rem auto 0rem auto;
			position: relative;
			overflow: hidden;
			img {
				position: absolute;
				top: 0px;
				left: 0px;
				width: 100%;
				height: 100%;
			}
			.waterNum {
				margin-top: 0.5rem;
				font-size: 0.45rem;
				color: #333;
				font-weight: lighter;
				text-align: center;
				line-height: 0.4rem;
				.unit {
					font-size: 0.1rem;
				}
			}
			.water_title {
				opacity: 0.7;
				font-size: 0.12rem;
				color: #999;
				letter-spacing: 0;
				text-align: center;
			}
		}
		.tempTitle {
			margin: 0.1rem 0.15rem;
			font-size: 0.12rem;
			color: #333333;
			letter-spacing: 0;
			line-height: 0.22rem;
		}
	}
</style>