<template>
	<div>
		<van-cell title="定时杀菌" is-link :value="para.sterilizHour" @click="showHour('sterilize')" />
		<van-cell title="定时TOC检测" is-link :value="para.tocCheckHour" @click="showHour('detection')" />
		<van-popup v-model="hours" position="bottom">
			<van-picker :columns="columns" @cancel="onCancel" show-toolbar @confirm="getHours" />
		</van-popup>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				columns: ['1H', '2H', '3H', '4H', "5H", "6H", "7H", "8H", "9H", "10H", "11H", "12H", "13H", "14H", "15H", "16H", "17H", "18H", "19H", "20H", "21H", "22H", "23H", "24H"],
				hours: false,
				way: "",
				para: {
					tocCheckHour: "0H",
					sterilizHour: "0H",
				},
				deviceMsg: this.$store.state.device_commercialMsg,
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
						this.para.sterilizHour = this.deviceMsg.sterilizHour.value + "H";
						this.para.tocCheckHour = this.deviceMsg.tocCheckHour.value + "H";
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			showHour(e) {
				this.hours = !this.hours;
				this.way = e;
			},
			getHours(value) {
				let that = this;
				let deviceMsg;
				that.hours = !that.hours;
				if(that.way == "sterilize") {
					that.para.sterilizHour = value;
					deviceMsg = {
						"sterilizHour": Number(value.split("H")[0])
					}
				} else {
					that.para.tocCheckHour = value;
					deviceMsg = {
						"tocCheckHour": Number(value.split("H")[0])
					}
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, that.$route.params.set);
			},
			onCancel() {
				this.hours = false;
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
						switch(this.$route.params.set) {
							case "tocCheckHour":
								if(that.showStart) {
									this.startTime = "00:00"
								} else {
									this.endTime = "00:00"
								}
								break;
							case "sterilizHour":
								if(that.showStart) {
									this.startTime = "00:00"
								} else {
									this.endTime = "00:00"
								}
								break;
							default:
						}
					}
				}).catch((err) => {
					console.log(err);
				})
			},
		}
	}
</script>

<style>

</style>