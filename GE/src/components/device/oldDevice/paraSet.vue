<template>
	<div class="paraSet">
		<div class="paraContent">
			<van-cell-group>
				<van-switch-cell v-model="para.vacationMode" title="假期模式" active-color="#4CD964" inactive-color="#BBBBBB" @input="vacationModel" />
				<p class="formInput"></p>
				<van-switch-cell v-model="para.sterilization" title="灭菌" active-color="#4CD964" inactive-color="#BBBBBB" @input="chlorine" />
				<p class="formInput"></p>
				<div v-show="device.productKey=='a12KzXXwRii'">
					<van-switch-cell v-model="para.saltAlarmSwitch" title="缺盐提示" active-color="#4CD964" inactive-color="#BBBBBB" @input="saltAlarmSwitch" />
					<p class="formInput"></p>
					<van-field v-model="para.highEffLbs" clear label="再生盐耗" is-link input-align="right" @click="showPara" placeholder="请选择" readonly/>
					<van-field v-model="para.hardness" clear label="硬度设置" is-link input-align="right" @click="showHadness" placeholder="请选择" readonly/>
					<van-field v-model="para.dailyReverse" clear label="日预流水量" is-link input-align="right" @click="showDatewhtar" placeholder="请选择" readonly/>
				</div>
				<van-field v-model="para.waterPeople" clear label="用水人数" is-link input-align="right" @click="showNum" placeholder="请选择人数" readonly/>
				<van-field v-model="para.waterValume" clear label="周期用水量" is-link input-align="right" @click="showValume" placeholder="请选择用水量" readonly/>
				<van-field v-model="para.washStartTime" clear label="冲洗启动时间" is-link input-align="right" @click="showWashTime" placeholder="请选择时间" readonly/>
				<!--<van-field v-model="para.washOutTime" clear label="冲洗间隔时间" is-link input-align="right" @click="showOutTime" placeholder="请选择时间" readonly/>-->
			</van-cell-group>
		</div>
		<van-popup v-model="waterPeople" position="bottom">
			<van-picker show-toolbar :columns="people" @cancel="onCancel" @confirm="getwaterPeople" />
		</van-popup>
		<van-popup v-model="waterValume" position="bottom" :close-on-click-overlay="false">
			<van-cell-group>
				<!--<van-field  type="number"  @focus="inputImport" placeholder="0~9999(m³)" />-->
				<div class="van-cell-group van-hairline--top-bottom">
					<div class="van-cell van-field">
						<div class="van-cell__value van-cell__value--alone">
							<div class="van-field__body"><input type="number" v-fixedInput v-model="Valume" @focus="inputImport" placeholder="0~9999(m³)" class="van-field__control"></div>
						</div>
					</div>
				</div>
			</van-cell-group>
			<van-button @click="onCancel" type="default" class="vanButton">取消</van-button>
			<van-button v-show="!disabled" disabled type="primary" class="vanButton">确定</van-button>
			<van-button v-show="disabled" type="primary" class="vanButton" @click="getwaterValume">确定</van-button>
		</van-popup>
		<van-popup v-model="hadnessInput" position="bottom" :close-on-click-overlay="false">
			<van-cell-group>
				<!--<van-field  type="number"  @focus="inputImport" placeholder="0~9999(m³)" />-->
				<div class="van-cell-group van-hairline--top-bottom">
					<div class="van-cell van-field">
						<div class="van-cell__value van-cell__value--alone">
							<div class="van-field__body"><input type="number" v-fixedInput v-model="hardnessValue" @focus="inputImport" placeholder="0~3420" class="van-field__control"></div>
						</div>
					</div>
				</div>
			</van-cell-group>
			<van-button @click="onCancel" type="default" class="vanButton">取消</van-button>
			<van-button v-show="!disabled" disabled type="primary" class="vanButton">确定</van-button>
			<van-button v-show="disabled" type="primary" class="vanButton" @click="getHardness">确定</van-button>
		</van-popup>
		<van-popup v-model="dateWaters" position="bottom" :close-on-click-overlay="false">
			<van-cell-group>
				<!--<van-field  type="number"  @focus="inputImport" placeholder="0~9999(m³)" />-->
				<div class="van-cell-group van-hairline--top-bottom">
					<div class="van-cell van-field">
						<div class="van-cell__value van-cell__value--alone">
							<div class="van-field__body"><input type="number" v-fixedInput v-model="dailyReverse" @focus="inputImport" placeholder="0~9999(m³)" class="van-field__control"></div>
						</div>
					</div>
				</div>
			</van-cell-group>
			<van-button @click="onCancel" type="default" class="vanButton">取消</van-button>
			<van-button v-show="!disabled" disabled type="primary" class="vanButton">确定</van-button>
			<van-button v-show="disabled" type="primary" class="vanButton" @click="getDailyReverse">确定</van-button>
		</van-popup>
		<van-popup v-model="washStartTime" position="bottom">
			<van-datetime-picker type="time" @cancel="onCancel" @confirm="getwashStartTime" />
		</van-popup>
		<van-popup v-model="washOutTime" position="bottom">
			<van-picker show-toolbar :columns="datas" @cancel="onCancel" @confirm="getwashOutTime" />
		</van-popup>
		<van-popup v-model="showWaterPara" position="bottom">
			<van-picker show-toolbar :columns="waterPara" :default-index="1" @cancel="onCancel" @confirm="getHighEffLbs" />
		</van-popup>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				para: {
					vacationMode: false,
					sterilization: false,
					saltAlarmSwitch: false,
					highEffLbs: "",
					hardness: "",
					dailyReverse: "",
					waterPeople: "",
					waterValume: "",
					washStartTime: "",
					washOutTime: "",
				},
				deviceMsg: "",
				waterPara: ["高效", "标准", "高规"],
				people: ['1 人', '2 人', '3 人', '4 人', "5 人"],
				datas: ['1 天', '2 天', '3 天', '4 天', "5 天", "6 天", "7 天"],
				waterPeople: false,
				waterValume: false,
				washStartTime: false,
				washOutTime: false,
				hadnessInput: false,
				dateWaters: false,
				showWaterPara: false,
				hardnessValue: "",
				dailyReverse: "",
				Valume: "",
				disabled: false,
				regenMinute: "",
				regenSec: "",
				device: ""
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
			init() {	
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.query.deviceId).then((res) => {
					if(res.data.success) {				
						this.device = res.data.data.device;
						this.deviceMsg = res.data.data.property;
						this.para.vacationMode = this.deviceMsg.vacationMode.value == 0 ? false : true;
						this.para.sterilization = this.deviceMsg.chlorineSwitches.value == 0 ? false : true;
						this.para.saltAlarmSwitch = this.deviceMsg.saltAlarmSwitch.value == 0 ? false : true;
						this.para.hardness = this.deviceMsg.hardness.value;
						this.para.highEffLbs = this.deviceMsg.highEffLbs.value == 0 ? "高效" : this.deviceMsg.highEffLbs.value == 1 ? "标准" : "高规";
						this.para.dailyReverse = this.deviceMsg.dailyReverse.value + " 立方米";
						this.para.waterPeople = this.deviceMsg.numberOfPeople.value + " 人";
						this.para.waterValume = this.deviceMsg.regenCycMeas.value + " 立方米";
						if(this.deviceMsg.regenTimeHourMin.value[0] < 10) {
							this.regenMinute = "0" + this.deviceMsg.regenTimeHourMin.value[0];
						} else {
							this.regenMinute = this.deviceMsg.regenTimeHourMin.value[0];
						}
						if(this.deviceMsg.regenTimeHourMin.value[1] < 10) {
							this.regenSec = "0" + this.deviceMsg.regenTimeHourMin.value[1];
						} else {
							this.regenSec = this.deviceMsg.regenTimeHourMin.value[1];
						}
						this.para.washStartTime = this.regenMinute + ":" + this.regenSec;
						this.para.washOutTime = this.deviceMsg.regenCyc.value + " 天";
						this.$forceUpdate();
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
							case "vacationMode":
								this.para.vacationMode = !this.para.vacationMode
								break;
							case "sterilization":
								this.para.sterilization = !this.para.sterilization
								break;
							case "saltAlarmSwitch":
								this.para.saltAlarmSwitch = !this.para.saltAlarmSwitch
								break;
							case "waterPeople":
								this.para.waterPeople = this.deviceMsg.numberOfPeople.value + " 人";
								break;
							case "waterValume":
								this.para.waterValume = this.deviceMsg.regenCycMeas.value + " 立方米";
								break;
							case "highEffLbs":
								this.para.highEffLbs = this.deviceMsg.highEffLbs.value == 0 ? "高效" : this.deviceMsg.highEffLbs.value == 1 ? "标准" : "高规";
								break;
							case "dailyReverse":
								this.para.dailyReverse = this.deviceMsg.dailyReverse.value + " 立方米";
								break;
							case "hardness":
								this.para.hardness = this.deviceMsg.hardness.value;
								break;
							case "washStartTime":
								if(this.deviceMsg.regenTimeHourMin.value[0] < 10) {
									this.regenMinute = "0" + this.deviceMsg.regenTimeHourMin.value[0];
								} else {
									this.regenMinute = this.deviceMsg.regenTimeHourMin.value[0];
								}
								if(this.deviceMsg.regenTimeHourMin.value[1] < 10) {
									this.regenSec = "0" + this.deviceMsg.regenTimeHourMin.value[1];
								} else {
									this.regenSec = this.deviceMsg.regenTimeHourMin.value[1];
								}
								this.para.washStartTime = this.regenMinute + ":" + this.regenSec;
								break;
							case "washOutTime":
								this.para.washOutTime = this.deviceMsg.regenCyc.value + " 天";
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
			vacationModel(checked) {
				let that = this;
				const deviceMsg = {
					"vacationMode": checked ? 1 : 0
				}
				const para = { //that.$store.state.
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "vacationMode");
			},
			chlorine(checked) {
				let that = this;
				const deviceMsg = {
					"chlorineSwitches": checked ? 1 : 0
				}
				const para = { //that.$store.state.
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "sterilization");
			},
			saltAlarmSwitch(checked) {
				let that = this;
				const deviceMsg = {
					"saltAlarmSwitch": checked ? 1 : 0
				}
				const para = { //that.$store.state.
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "saltAlarmSwitch");
			},
			onCancel() {
				this.waterPeople = false;
				this.waterValume = false;
				this.washStartTime = false;
				this.washOutTime = false;
				this.disabled = false;
				this.showWaterPara = false;
				this.hadnessInput = false;
				this.dateWaters = false;
			},
			showNum() {
				this.waterPeople = !this.waterPeople;
			},
			showPara() {
				this.showWaterPara = !this.showWaterPara;
			},
			showHadness() {
				this.hadnessInput = !this.hadnessInput;
			},
			showValume() {
				this.waterValume = !this.waterValume;
			},
			showDatewhtar() {
				this.dateWaters = !this.dateWaters;
			},
			showWashTime() {
				this.washStartTime = !this.washStartTime;
			},
			showOutTime() {
				this.washOutTime = !this.washOutTime;
			},
			getwaterPeople(value) {
				let that = this;
				that.para.waterPeople = value;
				const deviceMsg = {
					"numberOfPeople": Number(value.split("人")[0])
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "waterPeople");
				that.waterPeople = !this.waterPeople;
			},
			getHighEffLbs(value) {
				let that = this;
				value = value == '高效' ? 0 : value == '标准' ? 1 : 2;
				const deviceMsg = {
					"highEffLbs": Number(value)
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "highEffLbs");
				this.showWaterPara = !this.showWaterPara;
			},
			getHardness() {
				let that = this;
				if(that.hardnessValue > 3420) {
					this.$toast("用水量不得大于3420");
					return false;
				}
				that.para.hardness = Number(that.hardnessValue); //Number(that.Valume)
				const deviceMsg = {
					"hardness": Number((Number(that.hardnessValue)).toFixed(2))
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "hardness");
				that.hadnessInput = !that.hadnessInput;
			},
			getDailyReverse() {
				let that = this;
				if(that.dailyReverse > 9999) {
					this.$toast("用水量不得大于9999");
					return false;
				}
				that.para.dailyReverse = Number(that.dailyReverse) + " 立方米"; //Number(that.Valume)
				const deviceMsg = {
					"dailyReverse": Number((Number(that.dailyReverse)).toFixed(2))
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "dailyReverse");
				that.dateWaters = !that.dateWaters;
			},
			getwaterValume() {
				let that = this;
				if(that.Valume > 9999) {
					this.$toast("用水量不得大于9999");
					return false;
				}
				that.para.waterValume = Number(that.Valume) + " 立方米"; //Number(that.Valume)
				const deviceMsg = {
					"regenCycMeas": Number((Number(that.Valume)).toFixed(2))
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "waterValume");
				this.dateWaters = false;
				that.waterValume = !that.waterValume;
			},
			getwashStartTime(value) {
				var that = this;
				that.para.washStartTime = value;
				const deviceMsg = {
					"regenTimeHourMin": [Number(value.split(":")[0]), Number(value.split(":")[1])],
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "washStartTime");
				that.washStartTime = !this.washStartTime;
			},
			getwashOutTime(value) {
				var that = this;
				that.para.washOutTime = value;
				const deviceMsg = {
					"regenCyc": Number(value.split("天")[0]),
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "washOutTime");
				that.washOutTime = !this.washOutTime;
			},
			inputImport() {
				this.disabled = true;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.paraSet {
		min-height: 100%;
		height: auto;
		.van-nav-bar .van-icon {
			color: #000;
			vertical-align: middle;
		}
		.formInput {
			margin-left: 4%;
			width: 96%;
			height: 1px;
			background: #e9f3ff;
		}
		.vanButton {
			float: left;
			width: 50%;
		}
	}
</style>