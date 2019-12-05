<template>
	<div class="commercialsetTime">
		<div class="setCell">
			<div @click="selectTime('switchTimer')">
				<p class="setTitle" v-if="deviceMsg.turnOnHour">{{deviceMsg.turnOnHour.value | transferTime}}-{{deviceMsg.turnOffHour.value | transferTime}}</p>
				<p class="setTitle" v-else>未设置</p>
				<p class="setDescribe">定时开关机</p>
				 <van-icon name="arrow"  class="link" />
			</div>
			<van-switch class="setSwitch" v-model="deviceMsg.switchTimer" active-color="#4CD964" inactive-color="#BBBBBB" @change="onSwitchTimer" />
		</div>
		<div class="setCell">
			<div @click="selectTime('heatTimer')">
				<p class="setTitle" v-if="deviceMsg.heatOnHour">{{deviceMsg.heatOnHour.value | transferTime}}-{{deviceMsg.heatOffHour.value | transferTime}}</p>
				<p class="setTitle" v-else>未设置</p>
				<p class="setDescribe">定时加热</p>				
                <van-icon name="arrow"  class="link" />
			</div>
			<van-switch class="setSwitch" v-model="deviceMsg.heatTimer" active-color="#4CD964" inactive-color="#BBBBBB" @change="onHeatTimer" />
		</div>
		<!--<div class="setCell">
			<div @click="selectTime('refrigerTimer')">
				<p class="setTitle" v-if="deviceMsg.refrigerOnHour">{{deviceMsg.refrigerOnHour.value | transferTime}}-{{deviceMsg.refrigerOffHour.value | transferTime}}</p>
				<p class="setTitle" v-else>未设置</p>
				<p class="setDescribe">定时制冷</p>
			</div>
			<van-switch class="setSwitch" v-model="deviceMsg.refrigerTimer" active-color="#4CD964" inactive-color="#BBBBBB" @change="onRefrigerTimer" />
		</div>-->
		<div class="setCell">
			<div @click="selectTime('sterilizHour')">
				<p class="setTitle" v-if="deviceMsg.sterilizHour">{{deviceMsg.sterilizHour.value | transferTime}}</p>
				<p class="setTitle" v-else>未设置</p>
				<p class="setDescribe">杀菌时间</p>
				 <van-icon name="arrow"  class="link" />
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				onOff: "",
				deviceMsg: this.$store.state.device_commercialMsg,
				device: "",
			}
		},
		mounted() {
			let that = this;
			that.init();
			this.$store.state.client.on('message', function(topic, message, packet) {
				if(that.$route.query.deviceId) {
					that.init();
				}
			})
		},
		methods: {
			selectTime(value) {
				let startTime, endTime;
				switch(value) {
					case "switchTimer":
						startTime = this.deviceMsg.turnOnHour.value;
						endTime = this.deviceMsg.turnOffHour.value;
						break
					case "heatTimer":
						startTime = this.deviceMsg.heatOnHour.value;
						endTime = this.deviceMsg.heatOffHour.value;
						break
					case "refrigerTimer":
						startTime = this.deviceMsg.refrigerOnHour.value;
						endTime = this.deviceMsg.refrigerOffHour.value;
						break
					case "sterilizHour":
						startTime = this.deviceMsg.sterilizHour.value;
						endTime = this.deviceMsg.sterilizHour.value;
						break
					case "sterilizTime":
						startTime = this.deviceMsg.sterilizTime.value;
						endTime = this.deviceMsg.sterilizTime.value;
						break
					default:
				}
				startTime = startTime == undefined ? "00:00" : this.transferTimne(startTime);
				endTime = endTime == undefined ? "00:00" : this.transferTimne(endTime);
				this.$router.push({
					path: "/timing/" + value + "?startTime=" + startTime + "&endTime=" + endTime + "&deviceId=" + this.$route.query.deviceId
				})
			},
			transferTimne(res) {
				if(res >= 10) {
					return res + ":00";
				} else {
					return "0" + res + ":00";
				}
			},
			init() {
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.query.deviceId).then((res) => {
					if(res.data.success) {
						this.device = res.data.data.device;
						this.deviceMsg = res.data.data.property;					
						if(res.data.data.device.status == "offline") {
							this.isnormal = 0;
						}
						this.deviceMsg.switchTimer = this.deviceMsg.switchTimer.value == 0 ? false : true;
						this.deviceMsg.heatTimer = this.deviceMsg.heatTimer.value == 0 ? false : true;
						this.deviceMsg.refrigerTimer = this.deviceMsg.refrigerTimer.value == 0 ? false : true;
						this.deviceMsg.sterilization = this.deviceMsg.sterilization.value == 0 ? false : true;
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
							message: '设置中...'
						});
					} else {
						this.$toast(res.data.message);						
						switch(name) {
							case "switchTimer":
								this.deviceMsg.switchTimer=!this.deviceMsg.switchTimer;
								break;
							case "heatTimer":
								this.deviceMsg.heatTimer = !this.deviceMsg.heatTimer;
								break;
							case "refrigerTimer":
								this.deviceMsg.refrigerTimer = !this.deviceMsg.refrigerTimer;
								break;
							case "sterilizHour":
								this.deviceMsg.sterilization = !this.deviceMsg.sterilization;
								break;
							default:	
								break;
						}
						this.$forceUpdate();
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			onSwitchTimer(checked) {
				let that = this;
				const deviceMsg = {
					"switchTimer": checked ? 1 : 0
				}
				const para = { //that.$store.state.
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "switchTimer");
			},
			onHeatTimer(checked) {
				let that = this;
				const deviceMsg = {
					"heatTimer": checked ? 1 : 0
				}
				const para = { //that.$store.state.
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "heatTimer");
			},
			onRefrigerTimer(checked) {
				let that = this;
				const deviceMsg = {
					"refrigerTimer": checked ? 1 : 0
				}
				const para = { //that.$store.state.
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "refrigerTimer");
			},
			onSterilizHour(checked) {
				let that = this;
				const deviceMsg = {
					"sterilization": checked ? 1 : 0
				}
				const para = { //that.$store.state.
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "sterilizHour");
			}
		}
	}
</script>

<style lang="scss">
	.commercialsetTime {
		.setCell {
			margin-top: 0.1rem;
			height: auto;
			background: white;
			padding: 0 0.15rem;
			position: relative;
			.setTitle {
				width: 75%;
				font-size: 0.18rem;
				color: #333333;
				letter-spacing: 0;
				line-height: 0.4rem;
			}
			.setDescribe {
				width: 75%;
				font-size: 0.14rem;
				color: #666666;
				letter-spacing: 0;
				line-height: 0.3rem;
			}
			.setSwitch {
				position: absolute;
				top: 0.2rem;
				right: 0.3rem;
			}
			.link{
				position: absolute;
				top: 0.3rem;
				right: 0.1rem;
				font-size: 0.15rem;
				color: #ccc;			
			}
		}
	}
</style>