<template>
	<div class="commercialSet">
		<div class="paraContent">
			<van-cell-group>
				<van-field v-model="para.ledPercent" clear label="LED亮度" is-link input-align="right" @click="showLED" placeholder="请选择" readonly/>
				<!--<van-field v-model="para.sterilizTime" clear label="杀菌时长" is-link input-align="right" @click="showSterilizeTime" placeholder="请选择" readonly/>-->
			</van-cell-group>
		</div>
		<van-popup v-model="selectSterilizTime" position="bottom">
			<van-picker show-toolbar :columns="times" @cancel="onCancel" @confirm="getSterilizTime" />
		</van-popup>
		<van-popup v-model="selectLedPercent" position="bottom">
			<van-picker show-toolbar :columns="percents" @cancel="onCancel" @confirm="getLedPercent" />
		</van-popup>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				para: {					
					sterilizTime: "",
					ledPercent: "",
				},
				deviceMsg:this.$store.state.device_commercialMsg,			
				times: ["10分钟", "20分钟","30分钟","40分钟","50分钟","60分钟","70分钟","80分钟","90分钟"],
				percents: ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],		
				selectSterilizTime: false,
				selectLedPercent: false,
				device: ""
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
						this.deviceMsg = res.data.data.property;					
						this.para.sterilizTime = this.deviceMsg.sterilizTime.value+ " 分钟";				
						this.para.ledPercent = this.deviceMsg.ledPercent.value + " %";
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			fraceWash(e, name) {
				this.$Axios.post('common/setDeviceProperty', e).then((res) => {
					if(res.data.success) {
						this.$toast.loading({
							mask: true,
							message: '设置中...',
						});
					} else {
						this.$toast(res.data.message);
						switch(name) {							
							case "sterilizTime":
								this.para.sterilizTime = this.deviceMsg.sterilizTime.value + " 分钟";
								break;					
							case "ledPercent":
								this.para.ledPercent = this.deviceMsg.ledPercent.value + " %";
								break;
							default:
						}
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			onClickLeft() {
				this.$router.go(-1);
			},		
			onCancel() {				
				this.selectSterilizTime = false;
				this.selectLedPercent = false;
			},
			showSterilizeTime() {
				this.selectSterilizTime = !this.selectSterilizTime;
			},
			showLED() {
				this.selectLedPercent = !this.selectLedPercent;
			},		
			getSterilizTime(value) {
				let that = this;
				that.para.sterilizTime = value;
				const deviceMsg = {
					"sterilizTime": Number(value.split("分钟")[0])
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "sterilizTime");
				that.selectSterilizTime = !this.selectSterilizTime;
			},
			getLedPercent(value) {
				let that = this;
				that.para.ledPercent = value;
				const deviceMsg = {
					"ledPercent": Number(value.split("%")[0])
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "ledPercent");
				that.selectLedPercent = !this.selectLedPercent;
			}		
		}
	}
</script>

<style lang="scss">
	.commercialSet {
		.setCell {
			margin-top: 0.1rem;
			height: auto;
			background: white;
			padding: 0 0.15rem;
			position: relative;
			.setTitle {
				width: 50%;
				font-size: 0.18rem;
				color: #333333;
				letter-spacing: 0;
				line-height: 0.4rem;
			}
			.setDescribe {
				font-size: 0.14rem;
				color: #666666;
				letter-spacing: 0;
				line-height: 0.3rem;
			}
			.setSwitch {
				position: absolute;
				top: 0.2rem;
				right: 0.1rem;
			}
		}
		.formInput {
			margin-left: 4%;
			width: 96%;
			height: 1px;
			background: #e9f3ff;
		}
	}
</style>