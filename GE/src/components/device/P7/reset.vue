<template>
	<div class="reset">
		<ul v-if="device.productKey=='a1obsHkefOT'">
			<li>
				<span>
					PCF值复位
				</span>
				<span class="set" @click="reset('PCF值')">重置</span>
			</li>
			<li>
				<span>
					RO值复位
				</span>
				<span class="set" @click="reset('RO值')">重置</span>
			</li>
		</ul>
    <ul v-else>
    	<li>
    		<span>
    			CPF1值复位
    		</span>
    		<span class="set" @click="reset('PP1值')">重置</span>
    	</li>
    	<li>
    		<span>
    			CPF2值复位
    		</span>
    		<span class="set" @click="reset('PP2值')">重置</span>
    	</li>
    	<li v-if="device.productKey=='a1xjge89hkA'">
    		<span>
    			RO值复位
    		</span>
    		<span class="set" @click="reset('RO值')">重置</span>
    	</li>
    	<li v-else>
    		<span>
    			NF3值复位
    		</span>
    		<span class="set" @click="reset('NF值')">重置</span>
    	</li>
    	<li>
    		<span>
    			CTO4值复位
    		</span>
    		<span class="set" @click="reset('CTO值')">重置</span>
    	</li>
    </ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				deviceMsg: this.$store.state.device_commercialMsg,
				device: "",
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			reset(value) {
				let that = this;
				that.$dialog.confirm({
					message:'请确认您已经更换新的滤芯，否则可能影响您的用水水质',
				}).then(() => {
					let fliterReset;
					switch(value) {
						case "PP1值":
							fliterReset = [0]
							break;
						case "RO值":
							fliterReset = [1]
							break;
						case "NF值":
							fliterReset = [1]
							break;
						case "CTO值":
							fliterReset = [2]
							break;
						case "PP2值":
							fliterReset = [3]
							break;
            case "PCF值":
            	fliterReset = [0]
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
						if(name!= "intervalBtn") {
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
