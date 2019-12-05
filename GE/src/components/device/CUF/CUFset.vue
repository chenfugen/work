<template>
	<div class="reset">
		<ul>
			<li>
				<span>
					PP值复位
				</span>
				<span class="set" @click="reset('PP值')">重置</span>
			</li>
			<li>
				<span>
					UF值复位
				</span>
				<span class="set" @click="reset('UF值')">重置</span>
			</li>
			<li>
				<span>
					C1值复位
				</span>
				<span class="set" @click="reset('C1值')">重置</span>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				shareList: "",
				device:"",
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.query.deviceId).then((res) => {
					if(res.data.success) {
						this.device = res.data.data.device;					
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},			
			reset(value) {
				this.$dialog.confirm({
					message:'请确认您已经更换新的滤芯，否则可能影响您的用水水质',
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
							case "UF值":
								fliterReset = [4]
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
			}
		}
	}
</script>
<style lang="scss" scoped>
	.reset {
		ul {
			margin-top: 0.1rem;
			background: white;
			li {
				height: 0.4rem;
				border-bottom: 1px solid #eee;
				overflow: hidden;
				span {
					float: left;
					margin-left: 0.1rem;
					line-height: 0.4rem;
					font-size: 0.14rem;
					color: #333333;
				}
				.set {
					float: right;
					height: 0.22rem;
					width: 0.46rem;
					margin: 0.08rem 0.1rem;
					line-height: 0.22rem;
					border: 2px solid #005EB8;
					border-radius: 4px;
					text-align: center;
					color: #005EB8;
				}
			}
		}
	}
</style>