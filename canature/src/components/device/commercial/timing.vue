<template>
	<div>
		<van-field v-model="startTime" clear label="开启时间" is-link input-align="right" @click="showStartTime" placeholder="请选择" readonly/>
		<van-datetime-picker v-show="showStart" v-model="startTime" type="time" :max-minute="0" :show-toolbar="false" />
		<van-field v-show="showendTime" v-model="endTime" clear label="关闭时间" is-link input-align="right" @click="showEndTime" placeholder="请选择" readonly/>
		<van-datetime-picker v-show="showEnd" v-model="endTime" type="time" :max-minute="0" :show-toolbar="false" />
		<van-button size="large" v-show="showAccess" @click="Cancel" style="position: fixed;bottom: 0px;background:#267CFB;color: white;">完成</van-button>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				startTime: this.$route.query.startTime,
				endTime: this.$route.query.endTime,
				selectTime: "",
				showStart: false,
				showEnd: false,
				showAccess: false,
				showendTime: true,
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
			if(that.$route.params.set == "sterilizHour") {
				that.showendTime = false;
			}
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
			showStartTime() {
				this.showStart =!this.showStart;
				this.showEnd = false;
				this.showAccess = true
			},
			showEndTime() {
				this.showEnd =!this.showEnd;
				this.showStart = false;
				this.showAccess = true
			},
			onCancel() {
				this.showStart = false;
			},
			fraceWash(e, name) {
				this.$Axios.post('common/setDeviceProperty', e).then((res) => {
					if(res.data.success) {
						this.$toast.loading({
							mask: true,
							message: '设置中...'
						});
					} else {
						this.$toast(res.data.message)
						this.startTime =  this.$route.query.startTime
						this.endTime =  this.$route.query.endTime
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			transform(value) {
				let res = value.split(":")[0];
				if(Number(res) < 10) {
					return res = Number(res.split("0")[1]);
				} else {
					return Number(res);
				}
			},
			Cancel() {
				let that = this;
				let deviceMsg;
				if(that.transform(that.startTime) == that.transform(that.endTime)) {
					that.$toast("开启时间与结束时间重合");
					return false;
				}
				switch(this.$route.params.set) {
					case "switchTimer":
						deviceMsg = {
							"turnOnHour": that.transform(that.startTime),
							"turnOffHour": that.transform(that.endTime)
						}
						break;
					case "heatTimer":
						deviceMsg = {
							"heatOnHour": that.transform(that.startTime),
							"heatOffHour": that.transform(that.endTime)
						}
						break;
					case "refrigerTimer":
						deviceMsg = {
							"refrigerOnHour": that.transform(that.startTime),
							"refrigerOffHour": that.transform(that.endTime)
						}
						break;
					case "sterilizHour":
						deviceMsg = {
							"sterilizHour": that.transform(that.startTime),
						}
						break;
					default:
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, this.$route.params.set);
				this.showStart = false;
				this.showEnd = false;
				this.showAccess = false;
			},
		}
	}
</script>

<style>

</style>