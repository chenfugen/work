<template>
	<div calss="peopleMsg">
		<van-cell-group>
			<van-field v-model="device.deviceNickName" is-link clear input-align="right" label="设备昵称" @click='changeDeviceName' readonly />
			<van-field v-model="device.deviceName" clear input-align="right" label="MAC/IMEI" readonly/>
			<van-field v-model="device.sncode" clear input-align="right" label="SN码" readonly/>
			<van-field v-model="address" clear label="设备地址" type="textarea" rows="1" autosize input-align="right" readonly/>
			<van-field v-model="mcuHVersion" clear label="MCU版本号" type="textarea" rows="1" autosize input-align="right" readonly/>
			<van-cell v-show="isUpdate" title="固件版本" is-link :value="updateVersion" class="isRed" @click="updateFirmware" readonly/>
			<van-cell v-show="!isUpdate" title="固件版本" :value="version" readonly/>
		</van-cell-group>
		<van-dialog v-model="show" show-cancel-button :before-close="beforeClose" confirmButtonText="修改">
			<van-field v-model="deviceNickName" label="设备昵称" placeholder="请输入新的设备昵称" />
		</van-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				device: "",
				deviceMsg: this.$store.state.deviceMsg,
				version: "（已是最新版本）",
				updateVersion: "（检查有新版本）",
				isUpdate: false,
				address: "",
				deviceNickName: "",
				show: false,
				mcuHVersion: "",
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
						this.mcuHVersion = res.data.data.property.mcuHVersion.value + "-" + res.data.data.property.mcuSVersion.value;
						this.address = this.device.province + this.device.city;
						if(this.device.firmwareVersion){
							this.updateFirmware();
						}	
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			replacePos(strObj, pos, next, replacetext) {
				if(strObj.indexOf(".") > 0) {
					return strObj;
				} else {
					var str = strObj.substr(0, pos - 1) + replacetext + strObj.substring(pos, strObj.length);
					str = str.substr(0, next - 1) + replacetext + str.substring(next, str.length);
					let versionOne, versionTwo, versionThree;
					if(str.split(".")[0].substr(0, 1) == '0') {
						versionOne = str.split(".")[0].substr(1, 1);
					} else {
						versionOne = str.split(".")[0];
					}
					if(str.split(".")[1].split('.')[0].substr(0, 1) == '0') {
						versionTwo = str.split(".")[1].split('.')[0].substr(1, 1);
					} else {
						versionTwo = str.split(".")[0];
					}
					if(str.substr(6, 1) == "0") {
						versionThree = str.substr(7, 1);
					} else {
						versionThree = str.substr(6, 8);
					}
					return "versionOne" + "." + versionTwo + "." + versionThree;
				}
			},
			updateFirmware() {
				let that = this;
				that.$Axios.get("wechat/device/check/ota", {
					params: {
						"version": that.device.firmwareVersion,
						"productKey": that.device.productKey,
						"moduleType":that.device.moduleType,
					}
				}).then((res) => {
					if(res.data.success) {
						if(res.data.data.ota) {
							that.isUpdate = true;
							that.updateVersion = "（检查有新版本）";
							if(that.device.status == 'online' && that.$cookies.get('updataStatus') == null) {
								that.$dialog.confirm({
									title: '固件升级',
									message: '升级大概耗时3分钟左右，确定要对该设备进行固件升级吗',
									confirmButtonText: "升级"
								}).then(() => {
									that.$cookies.set('updataStatus', true)
									var data = {
										"cmd": "ota",
										"productKey": that.device.productKey,
										"deviceName": that.device.deviceName,
										"data": {"data1":res.data.data.data}
									}
									that.$store.state.client.publish('/' + that.$store.state.userClient.productKey + '/' + that.$store.state.userClient.deviceName + '/user/message/update', JSON.stringify(data), {
										qos: 1
									});
									that.$toast.loading({
										mask: true,
										duration: 0, // 持续展示 toast
										forbidClick: true, // 禁用背景点击
										message: '固件升级中...',
									});
									const timer = setInterval(() => {
										that.init();
										if(that.device.firmwareVersion != that.$cookies.get('firmwareVersion')) {
											that.$cookies.remove('updataStatus');
											that.init();
											clearInterval(timer);
											that.$toast.clear();
											that.$toast("固件升级成功");
											that.$cookies.remove('firmwareVersion');
										}
									}, 10000);
								}).catch(() => {
									console.log(1)
								});
							}
						} else {
							that.version = "（已是最新版本v" + that.replacePos(that.device.firmwareVersion, 3, 6, ".")+")";
							that.isUpdate = false;
							that.$forceUpdate();
						}
					} else {
						that.$toast("数据加载失败");
					}
				})
			},
			changeDeviceName() {
				if(this.$route.query.bindType == 2) {
					this.$toast("您是该设备分享用户，无法修改");
					return false;
				}
				this.show = true;
			},
			beforeClose(action, done) {
				if(action === 'confirm') {
					this.$Axios.post("wechat/device/update/deviceNickName", {
						"accessKey": this.$store.state.accessKey,
						"id": this.$route.query.deviceId,
						"deviceNickName": this.deviceNickName,
					}).then((res) => {
						if(res.data.success) {
							this.init();
							done();
						} else {
							this.$toast("数据加载失败");
						}
					})
				} else {
					done();
				}
			},
			onClickLeft() {
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="scss">
	.buddna {
		float: right;
		width: 50px;
		height: 50px;
		border: 1px solid #eee;
		border-radius: 50%;
	}
	
	.save {
		vertical-align: top;
		padding: 0.2rem 0.15rem;
		text-align: center;
	}
	
	.save button {
		background: #267CFB;
		color: white;
		vertical-align: top;
		width: 100%;
	}
	
	.isRed {
		.van-cell__value {
			color: red;
		}
	}
</style>