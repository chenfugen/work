<template>
	<div class="filterList">
		<ul class="filters">
			<li>
				<p class="filterMsg">
					<span class="filterName">1号ACF滤芯寿命  {{deviceMsg.filterACF.value}}%</span>
					<van-button round class="pay" size="small" @click="reset('PP值')">复位</van-button>
				</p>
			</li>			
			<li>
				<p class="filterMsg">
					<span class="filterName">2号CTO滤芯寿命  {{deviceMsg.filterCTO.value}}%</span>
					<van-button round class="pay" size="small" @click="reset('C1值')">复位</van-button>
				</p>
			</li>
			<li v-if="device.filterType=='RO'">
				<p class="filterMsg">
					<span class="filterName">3号RO滤芯寿命  {{deviceMsg.filterRO.value}}%</span>
					<van-button round class="pay" size="small" @click="reset('RO值')">复位</van-button>
				</p>
			</li>
			<li v-else>
				<p class="filterMsg">
					<span class="filterName">3号NF滤芯寿命  {{deviceMsg.filterNF.value}}%</span>
					<van-button round class="pay" size="small"  @click="reset('UF值')">复位</van-button>
				</p>
			</li>			
		</ul>	
		<p class="filterTitle">滤芯寿命过低，将会影响过滤效果，良好的水质，有助于保持健康，建议您及时更换滤芯</p>
		<!--<div class="payFilter">
			<van-button size="large" round @click="payFilter">购买滤芯</van-button>
		</div>-->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				deviceMsg: this.$store.state.newDeviceMsg,
				device:""
			}
		},
		mounted() {
		this.init();
		},
		methods: {
			reset(value) {
				this.$dialog.confirm({
					message:'请确认您已经更换新的滤芯，否则可能影响您的用水水质',
					confirmButtonText: "复位"
				}).then(() => {
					let that = this;
					let fliterReset = [];
					switch(value) {
						case "PP值":
							fliterReset = [0]
							break;
						case "C1值":
							fliterReset = [3]
							break;
						case "RO值":
							fliterReset = [1]
							break;
						case "UF值":
							fliterReset = [2]
							break;				
					}
					const deviceMsg = {
						"fliterReset": fliterReset
					}
					const para = {
						productKey: that.device.productKey,
						deviceName: that.device.deviceName,
						commonKey: that.$store.state.commonKey,
						message: JSON.stringify(deviceMsg)
					}
					that.setDeviceProperty(para, value);
				}).catch(() => {
					// on cancel
				});
			},
			setDeviceProperty(e, name) {
				this.$Axios.post('common/setDeviceProperty', e).then((res) => {
					if(res.data.success) {
						if(name != "intervalBtn") {
							this.$toast.loading({
								mask: true,
								message: '复位中...'
							});					
						}					
					} else {
						this.$toast(res.data.message);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			payFilter() {
				this.$toast("暂无购买地址");
			},
			init() {
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.query.deviceId).then((res) => {
					if(res.data.success) {
						this.device = res.data.data.device;
						this.deviceMsg = res.data.data.property;
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},
		}
	}
</script>

<style lang="scss">
	.filterList {
		.filters {
			width: 100%;
			margin-top: 0.1rem;
			li {
				.filterMsg {
					width: 100%;
					height: 0.6rem;
					line-height: 0.6rem;
					background: white;
					margin-top: 0.01rem;
					.filterName {
						display: block;
						margin: 0rem 0.1rem;
						font-size: 0.14rem;
						float: left;
					}
					.pay {
						margin: 0.15rem 0.1rem;
						color: white;
						background: #267CFB;
						float: right;
						border: none;
					}
				}
				.filterTitle {
					font-size: 0.12rem;
					padding: 0.1rem 0.12rem;
				}
			}
		}
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