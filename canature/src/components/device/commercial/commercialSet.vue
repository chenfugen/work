<template>
	<div class="commercialSet">
		<div class="paraContent">
			<van-cell-group>
				<van-switch-cell v-model="para.childLock" title="童锁模式" active-color="#4CD964" inactive-color="#BBBBBB" @input="childlock" />
				<p class="formInput"></p>
				<van-switch-cell v-model="para.powerBtn" title="电源开关" active-color="#4CD964" inactive-color="#BBBBBB" @input="powerBtn" />
				<p class="formInput"></p>
				<van-switch-cell v-model="para.heatBtn" title="加热开关" active-color="#4CD964" inactive-color="#BBBBBB" @input="heating" />
				<p class="formInput"></p>
				<van-field v-model="para.drain" clear label="放水模式" is-link input-align="right" @click="showBleeder" placeholder="请选择" readonly/>
				<van-field v-model="para.heatProtection" clear label="加热保护" is-link input-align="right" @click="showHeattime" placeholder="请选择" readonly/>
			<!--	<van-field v-model="para.refrigerProtection" clear label="制冷保护" is-link input-align="right" @click="showRefrigeratetime" placeholder="请选择" readonly/>-->
				<van-field v-model="para.heatTemp" clear label="加热温度" is-link input-align="right" @click="showHeatTempe" placeholder="请选择" readonly/>
				<van-field v-model="para.sterilizTime" clear label="杀菌时长" is-link input-align="right" @click="showSterilizeTime" placeholder="请选择" readonly/>
			<!--	<van-field v-model="para.conversPercent" clear label="节水比例" is-link input-align="right" @click="showWaterSave" placeholder="请选择" readonly/>-->
				<van-field v-model="para.ledPercent" clear label="LED亮度" is-link input-align="right" @click="showLED" placeholder="请选择" readonly/>
			</van-cell-group>
		</div>
		<van-popup v-model="selectHeatTemp" position="bottom">
			<van-picker show-toolbar :columns="temps" @cancel="onCancel" @confirm="getHeatTemp" />
		</van-popup>
		<van-popup v-model="selectHeatTime" position="bottom">
			<van-picker show-toolbar :columns="hours" @cancel="onCancel" @confirm="getHeatTime" />
		</van-popup>
		<van-popup v-model="selectBleeder" position="bottom">
			<van-picker show-toolbar :columns="bleeder" @cancel="onCancel" @confirm="getBleeder" />
		</van-popup>	
		<van-popup v-model="selectColdTime" position="bottom">
			<van-picker show-toolbar :columns="hours" @cancel="onCancel" @confirm="getColdTime" />
		</van-popup>
		<van-popup v-model="selectSterilizTime" position="bottom">
			<van-picker show-toolbar :columns="times" @cancel="onCancel" @confirm="getSterilizTime" />
		</van-popup>
		<van-popup v-model="selectLedPercent" position="bottom">
			<van-picker show-toolbar :columns="percents" @cancel="onCancel" @confirm="getLedPercent" />
		</van-popup>
		<van-popup v-model="selectConversPercent" position="bottom">
			<van-picker show-toolbar :columns="conversPercent" @cancel="onCancel" @confirm="getConversPercent" />
		</van-popup>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				para: {
					heatBtn:false,
					powerBtn:false,
					childLock: false,
					drain:"",
					heatProtection: "",
					refrigerProtection: "",
					heatTemp: "",
					sterilizTime: "",
					conversPercent: "",
					ledPercent: "",
				},
				deviceMsg: "",
				hours: ['0 小时', '2 小时', '4 小时', "6 小时", "8 小时"],
				bleeder:["双按","单按"],
				temps: ["45℃", "46℃", "47℃", "48℃", "49℃", "50℃","51℃", "52℃","53℃","54℃","55℃","56℃","57℃", "58℃", "59℃", "60℃","61℃", "62℃","63℃","64℃","65℃","66℃","67℃", "68℃", "69℃","70℃","71℃", "72℃","73℃","74℃","75℃","76℃","77℃", "78℃", "79℃","80℃","81℃", "82℃","83℃","84℃","85℃","86℃","87℃", "88℃", "89℃","90℃","91℃", "92℃","93℃","94℃","95℃","96℃","97℃", "98℃", "99℃"],
				times: ["10分钟", "20分钟","30分钟","40分钟","50分钟","60分钟","70分钟","80分钟","90分钟"],
				conversPercent: ["35%","40%","45%","50%","55%","60%","65%","70%","75%","80%"],
				percents: ["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
				heatTime: false,
				refrigerationTime: false,
				selectHeatTime: false,
				selectColdTime: false,
				selectHeatTemp: false,
				selectSterilizTime: false,
				selectConversPercent: false,
				selectLedPercent: false,
				selectBleeder:false,
				device: "",
			}
		},
		mounted() {
			let that=this;
			that.init();
			this.$store.state.client.on('message', function(topic, message, packet) {	
				if(that.$route.query.deviceId){
						that.init();		
				}		 	 	
			})
		},
		methods: {
			init(){
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.query.deviceId).then((res) => {
					if(res.data.success) {
						this.device = res.data.data.device;
						this.deviceMsg = res.data.data.property;
						this.para.childLock = this.deviceMsg.childLock.value == 0 ? false : true;
						this.para.powerBtn = this.deviceMsg.powerBtn.value == 0 ? false : true;
						this.para.heatBtn = this.deviceMsg.heatBtn.value == 0 ? false : true;
						this.para.drain = this.deviceMsg.drain.value == 0?"单按":"双按";
						this.para.heatProtection = this.deviceMsg.heatProtection.value + " 小时";
						this.para.refrigerProtection = this.deviceMsg.refrigerProtection.value + " 小时";
						this.para.heatTemp = this.deviceMsg.heatTemp.value + " ℃";
						this.para.sterilizTime = this.deviceMsg.sterilizTime.value + " 分钟";
						this.para.conversPercent = this.deviceMsg.conversPercent.value + " %";
						this.para.ledPercent = this.deviceMsg.ledPercent.value + " %";	
						this.$forceUpdate();
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			setDeviceProperty(e, name) {
				this.$Axios.post('common/setDeviceProperty', e).then((res) => {
					if(res.data.success) {
						this.$toast.loading({
							mask: true,
							message: '设置中...',
						});
					} else {
						this.$toast(res.data.message);
						switch(name) {
							case "childLock":
								this.para.childLock = !this.para.childLock
								break;
							case "heating":
								this.para.heatBtn = !this.para.heatBtn
								break;
							case "powerBtn":
								this.para.powerBtn = !this.para.powerBtn
								break;
							case "drain":
								this.para.drain =this.deviceMsg.drain.value == 0?"单按":"双按";
								break;
							case "heatProtection":
								this.para.heatProtection = this.deviceMsg.heatProtection.value + " 小时";
								break;
							case "refrigerProtection":
								this.para.refrigerProtection = this.deviceMsg.refrigerProtection.value + " 小时";
								break;
							case "heatTemp":
								this.para.heatTemp = this.deviceMsg.heatTemp.value + " ℃";
								break;
							case "sterilizTime":
								this.para.sterilizTime = this.deviceMsg.sterilizTime.value + " 分钟";
								break;
							case "conversPercent":
								this.para.conversPercent = this.deviceMsg.conversPercent.value + " %";
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
			childlock(checked) {
				let that = this;
				const deviceMsg = {
					"childLock": checked ? 1 : 0
				}
				const para = { //that.$store.state.
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "childLock");
			},
			heating(checked) {
				let that = this;
				const deviceMsg = {
					"heatBtn": checked ? 1 : 0
				}
				const para = { 
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "heating");
			},
			powerBtn(checked) {
				let that = this;
				const deviceMsg = {
					"powerBtn": checked ? 1 : 0
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "powerBtn");
			},
			getBleeder(checked) {
				let that = this;
				const deviceMsg = {
					"drain": checked=="双按"?1:0
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "drain");
				this.selectBleeder = !this.selectBleeder;
			},
			onCancel() {
				this.selectHeatTemp = false;
				this.selectColdTime = false;
				this.selectHeatTime = false;
				this.selectSterilizTime = false;
				this.selectConversPercent = false;
				this.selectLedPercent = false;
				this.selectBleeder = false;
			},
			showHeattime() {
				this.selectHeatTime = !this.selectHeatTime;
			},
			showRefrigeratetime() {
				this.selectColdTime = !this.selectColdTime;
			},
			showHeatTempe() {
				this.selectHeatTemp = !this.selectHeatTemp;
			},
			showSterilizeTime() {
				this.selectSterilizTime = !this.selectSterilizTime;
			},
			showBleeder(){
				this.selectBleeder = !this.selectBleeder;
			},	 	
			showWaterSave() {
				this.selectConversPercent = !this.selectConversPercent;
			},
			showLED() {
				this.selectLedPercent = !this.selectLedPercent;
			},
			getColdTime(value) {
				let that = this;
				that.para.refrigerProtection = value;
				const deviceMsg = {
					"refrigerProtection": Number(value.split("小时")[0])
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "refrigerProtection");
				that.selectColdTime = !this.selectColdTime;
			},
			getHeatTime(value) {
				let that = this;
				that.para.heatProtection = value;
				const deviceMsg = {
					"heatProtection": Number(value.split("小时")[0])
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "heatProtection");
				that.selectHeatTime = !this.selectHeatTime;
			},			
			getHeatTemp(value) {
				let that = this;
				that.para.heatTemp = value;
				const deviceMsg = {
					"heatTemp": Number(value.split("℃")[0])
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "heatTemp");
				that.selectHeatTemp = !this.selectHeatTemp;
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
				that.setDeviceProperty(para, "sterilizTime");
				that.selectSterilizTime = !this.selectSterilizTime;
			},
			getConversPercent(value) {
				let that = this;
				that.para.conversPercent = value; 
				const deviceMsg = {
					"conversPercent": Number(value.split("%")[0])
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "conversPercent");
				that.selectConversPercent = !this.selectConversPercent;
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
				that.setDeviceProperty(para, "ledPercent");
				that.selectLedPercent = !this.selectLedPercent;
			},
			inputImport() {
				this.disabled = true;
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