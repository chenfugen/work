<template>
	<div class="paraSet">
		<div class="paraContent">
			<van-cell-group>
				<van-switch-cell v-model="para.vocation" title="假期模式" active-color="#4CD964" inactive-color="#BBBBBB" @input="vocationl" />
				<p class="formInput"></p>
				<van-switch-cell v-model="para.sterilization" title="灭菌" active-color="#4CD964" inactive-color="#BBBBBB" @input="chlorine" />
				<p class="formInput"></p>
				<van-switch-cell v-model="para.saltRemind" title="缺盐提示" active-color="#4CD964" inactive-color="#BBBBBB" @input="saltRemind" />
				<p class="formInput"></p>
				<van-field v-model="para.saltLevel" clear label="再生盐耗" is-link input-align="right" @click="showPara" placeholder="请选择" readonly/>
				<van-field v-model="para.ppm" clear label="硬度设置" is-link input-align="right" @click="showHadness" placeholder="请选择" readonly/>
				<van-field v-model="para.reservedVolDaily" clear label="人均预留水量" is-link input-align="right" @click="showDatewhtar" placeholder="请选择" readonly/>
				<van-field v-model="para.manTime" clear label="用水人数" is-link input-align="right" @click="showNum" placeholder="请选择人数" readonly/>
				<p class="formInput"></p>
				<!--<van-field v-model="para.customVolPeriodic" clear label="周期已用水量" is-link input-align="right" @click="showValume" placeholder="请选择用水量" readonly/>-->
				<van-field v-model="para.regenSTimeSet" clear label="再生启动时间" is-link input-align="right" @click="showWashTime" placeholder="请选择时间" readonly/>
				<van-field v-model="para.regenSIntervalSet" clear label="再生间隔时间" is-link input-align="right" @click="showOutTime" placeholder="请选择时间" readonly/>
			</van-cell-group>
		</div>
		<van-popup v-model="manTime" position="bottom">
			<van-picker show-toolbar :columns="people" @cancel="onCancel" @confirm="getmanTime" />
		</van-popup>
		<van-popup v-model="customVolPeriodic" position="bottom" :close-on-click-overlay="false">
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
			<van-button v-show="disabled" type="primary" class="vanButton" @click="getcustomVolPeriodic">确定</van-button>
		</van-popup>
		<van-popup v-model="hadnessInput" position="bottom" :close-on-click-overlay="false">
			<van-cell-group>
				<div class="van-cell-group van-hairline--top-bottom">
					<div class="van-cell van-field">
						<div class="van-cell__value van-cell__value--alone">
							<div class="van-field__body"><input type="number" v-fixedInput v-model="ppmValue" @focus="inputImport" placeholder="2~3420(mg/L)" class="van-field__control"></div>
						</div>
					</div>
				</div>
			</van-cell-group>
			<van-button @click="onCancel" type="default" class="vanButton">取消</van-button>
			<van-button v-show="!disabled" disabled type="primary" class="vanButton">确定</van-button>
			<van-button v-show="disabled" type="primary" class="vanButton" @click="getppm">确定</van-button>
		</van-popup>
		<van-popup v-model="dateWaters" position="bottom" :close-on-click-overlay="false">
			<van-cell-group>
				<div class="van-cell-group van-hairline--top-bottom">
					<div class="van-cell van-field">
						<div class="van-cell__value van-cell__value--alone">
							<div class="van-field__body"><input type="number" v-fixedInput v-model="reservedVolDaily" @focus="inputImport" placeholder="0~999(升/人)" class="van-field__control"></div>
						</div>
					</div>
				</div>
			</van-cell-group>
			<van-button @click="onCancel" type="default" class="vanButton">取消</van-button>
			<van-button v-show="!disabled" disabled type="primary" class="vanButton">确定</van-button>
			<van-button v-show="disabled" type="primary" class="vanButton" @click="getreservedVolDaily">确定</van-button>
		</van-popup>
		<van-popup v-model="rinseSTimeSet" position="bottom">
			<van-datetime-picker type="time" @cancel="onCancel" @confirm="getrinseSTimeSet" />
		</van-popup>
		<van-popup v-model="regenSIntervalSet" position="bottom">
			<van-picker show-toolbar :columns="datas" @cancel="onCancel" @confirm="getregenSIntervalSet" />
		</van-popup>
		<van-popup v-model="showWaterPara" position="bottom" :close-on-click-overlay="false">
			<van-cell-group>
				<div class="van-cell-group van-hairline--top-bottom">
					<div class="van-cell van-field">
						<div class="van-cell__value van-cell__value--alone">
							<div class="van-field__body"><input type="number" v-fixedInput v-model="saltLevel" @focus="inputImport" placeholder="0~999(g/L)" class="van-field__control"></div>
						</div>
					</div>
				</div>
			</van-cell-group>
			<van-button @click="onCancel" type="default" class="vanButton">取消</van-button>
			<van-button v-show="!disabled" disabled type="primary" class="vanButton">确定</van-button>
			<van-button v-show="disabled" type="primary" class="vanButton" @click="getsaltLevel">确定</van-button>
		</van-popup>
	</div>
</template>

<script>
	export default {
		data() {
			let self = this;
			return {
				para: {
					vocation: false,
					sterilization: false,
					saltRemind: false,
					saltLevel: "",
					ppm: "",
					reservedVolDaily: "",
					manTime: "",
					customVolPeriodic: "",
					rinseSTimeSet: "",
					regenStartInterval: "",
					regenSIntervalSet: "",
					regenSTimeSet: "",
					rinseStartInterval: "",
					rinseSIntervalSet: "",
				},
				deviceMsg: "",
				waterPara: [40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240],
				people: ['1 人', '2 人', '3 人', '4 人', "5 人", "6人", "7人", "8人", "9人"],
				datas: self.createDate(),
				manTime: false,
				customVolPeriodic: false,
				rinseSTimeSet: false,
				regenSIntervalSet: false,
				hadnessInput: false,
				dateWaters: false,
				showWaterPara: false,
				ppmValue: "",
				reservedVolDaily: "",
				Valume: "",
				saltLevel: "",
				disabled: false,
				regenMinute: "",
				regenSec: "",
				device: ""
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
			createDate() {
				let datas = [];
				for(let i = 0; i < 100; i++) {
					datas.push(i + "天")
				}
				return datas;
			},
			init() {
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.query.deviceId).then((res) => {
					if(res.data.success) {
						this.device = res.data.data.device;
						this.deviceMsg = res.data.data.property;
						this.para.vocation = this.deviceMsg.vocation.value == 0 ? false : true;
						this.para.sterilization = this.deviceMsg.sterilization.value == 0 ? false : true;
						this.para.saltRemind = this.deviceMsg.saltRemind.value == 0 ? false : true;
						this.para.ppm = this.deviceMsg.ppm.value+ " mg/L";
						this.para.saltLevel = (this.deviceMsg.saltLevel.value/10) + " g/L";
						this.para.reservedVolDaily = this.deviceMsg.reservedVolDaily.value + " 升/人";
						this.para.manTime = this.deviceMsg.manTime.value + " 人";
						this.para.customVolPeriodic = this.deviceMsg.customVolPeriodic.value + " 立方米";
							if(this.deviceMsg.regenStartTime.value.hour < 10) {
								this.regenMinute = "0" + this.deviceMsg.regenStartTime.value.hour;
							} else {
								this.regenMinute = this.deviceMsg.regenStartTime.value.hour;
							}
							if(this.deviceMsg.regenStartTime.value.minute < 10) {
								this.regenSec = "0" + this.deviceMsg.regenStartTime.value.minute;
							} else {
								this.regenSec = this.deviceMsg.regenStartTime.value.minute;
							}
							this.para.regenSTimeSet = this.regenMinute + ":" + this.regenSec;
						this.para.regenSIntervalSet = this.deviceMsg.regenSIntervalSet.value + " 天";
						this.para.rinseSIntervalSet = this.deviceMsg.regenSIntervalSet.value + " 天";
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
							case "vocation":
								this.para.vocation = !this.para.vocation
								break;
							case "sterilization":
								this.para.sterilization = !this.para.sterilization
								break;
							case "saltRemind":
								this.para.saltRemind = !this.para.saltRemind
								break;
							case "manTime":
								this.para.manTime = this.deviceMsg.manTime.value + " 人";
								break;
							case "customVolPeriodic":
								this.para.customVolPeriodic = this.deviceMsg.customVolPeriodic.value + " 立方米";
								break;
							case "saltLevel":
								this.para.saltLevel =(this.deviceMsg.saltLevel.value/10) + " g/L";
								break;
							case "reservedVolDaily":
								this.para.reservedVolDaily = this.deviceMsg.reservedVolDaily.value + " 升/人";
								break;
							case "ppm":
								this.para.ppm = this.deviceMsg.ppm.value+ " mg/L";
								break;
							case "regenSTimeSet":
								if(this.deviceMsg.regenSTimeSet.value.hour < 10) {
									this.regenMinute = "0" + this.deviceMsg.regenSTimeSet.value.hour;
								} else {
									this.regenMinute = this.deviceMsg.regenSTimeSet.value.hour;
								}
								if(this.deviceMsg.regenSTimeSet.value.minute < 10) {
									this.regenSec = "0" + this.deviceMsg.regenSTimeSet.value.minute;
								} else {
									this.regenSec = this.deviceMsg.regenSTimeSet.value.minute;
								}
								this.para.rinseSTimeSet = this.regenMinute + ":" + this.regenSec;
								break;
							case "rinseSTimeSet":
								if(this.deviceMsg.rinseSTimeSet.value.hour < 10) {
									this.regenMinute = "0" + this.deviceMsg.rinseSTimeSet.value.hour;
								} else {
									this.regenMinute = this.deviceMsg.rinseSTimeSet.value.hour;
								}
								if(this.deviceMsg.rinseSTimeSet.value.minute < 10) {
									this.regenSec = "0" + this.deviceMsg.rinseSTimeSet.value.minute;
								} else {
									this.regenSec = this.deviceMsg.rinseSTimeSet.value.minute;
								}
								this.para.rinseSTimeSet = this.regenMinute + ":" + this.regenSec;
								break;
							case "regenSIntervalSet":
								this.para.regenSIntervalSet = this.deviceMsg.regenSIntervalSet.value + " 天";
								break;
							case "rinseSIntervalSet":
								this.para.rinseSIntervalSet = this.deviceMsg.rinseSIntervalSet.value + " 天";
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
			vocationl(checked) {
				let that = this;
				const deviceMsg = {
					"vocation": checked ? 1 : 0
				}
				const para = { //that.$store.state.
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "vocation");
			},
			chlorine(checked) {
				let that = this;
				const deviceMsg = {
					"sterilization": checked ? 1 : 0
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "sterilization");
			},
			saltRemind(checked) {
				let that = this;
				const deviceMsg = {
					"saltRemind": checked ? 1 : 0
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "saltRemind");
			},
			onCancel() {
				this.manTime = false;
				this.customVolPeriodic = false;
				this.rinseSTimeSet = false;
				this.regenSIntervalSet = false;
				this.disabled = false;
				this.showWaterPara = false;
				this.hadnessInput = false;
				this.dateWaters = false;
			},
			showNum() {
				this.manTime = !this.manTime;
			},
			showPara() {
				this.showWaterPara = !this.showWaterPara;
			},
			showHadness() {
				this.hadnessInput = !this.hadnessInput;
			},
			showValume() {
				this.customVolPeriodic = !this.customVolPeriodic;
			},
			showDatewhtar() {
				this.dateWaters = !this.dateWaters;
			},
			showWashTime() {
				this.rinseSTimeSet = !this.rinseSTimeSet;
			},
			showOutTime() {
				this.regenSIntervalSet = !this.regenSIntervalSet;
			},
			getmanTime(value) {
				let that = this;
				that.para.manTime = value;
				const deviceMsg = {
					"manTime": Number(value.split("人")[0])
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "manTime");
				that.manTime = !this.manTime;
			},
			getsaltLevel(value) {
				let that = this;
				if(that.saltLevel < 0 || that.saltLevel > 999) {
					this.$toast("用水量不再0~999范围类");
					return false;
				}
				that.para.saltLevel = Number(that.saltLevel)+" g/L";
				const deviceMsg = {
					"saltLevel": Number((Number(that.saltLevel)*10).toFixed(0))
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "saltLevel");
				this.showWaterPara = !this.showWaterPara;
			},
			getppm() {
				let that = this;
				if(that.ppmValue < 2 || that.ppmValue > 3420) {
					this.$toast("用水量不再2~3420范围类");
					return false;
				}
				that.para.ppm = Number(that.ppmValue)+" mg/L"; //Number(that.Valume)
				const deviceMsg = {
					"ppm": Number((Number(that.ppmValue)).toFixed(2))
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "ppm");
				that.hadnessInput = !that.hadnessInput;
			},
			getreservedVolDaily() {
				let that = this;
				if(that.reservedVolDaily < 0 || that.reservedVolDaily > 999) {
					this.$toast("用水量不得大于999");
					return false;
				}
				that.para.reservedVolDaily = Number(that.reservedVolDaily) + " 立方米"; //Number(that.Valume)
				const deviceMsg = {
					"reservedVolDaily": Number((Number(that.reservedVolDaily)).toFixed(2))
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "reservedVolDaily");
				that.dateWaters = !that.dateWaters;
			},
			getcustomVolPeriodic() {
				let that = this;
				if(that.Valume > 9999) {
					this.$toast("用水量不得大于9999");
					return false;
				}
				that.para.customVolPeriodic = Number(that.Valume) + " 立方米"; //Number(that.Valume)
				const deviceMsg = {
					"customVolPeriodic": Number((Number(that.Valume)).toFixed(2))
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "customVolPeriodic");
				this.dateWaters = false;
				that.customVolPeriodic = !that.customVolPeriodic;
			},
			getrinseSTimeSet(value) {
				var that = this;			
				let deviceMsg = {};
					that.para.regenSTimeSet = value;				
					deviceMsg = {
						"regenSTimeSet": {
							"hour": Number(value.split(":")[0]),
							"minute": Number(value.split(":")[1])
						}
					}			
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "regenSTimeSet");
				that.rinseSTimeSet = !this.rinseSTimeSet;
			},
			getregenSIntervalSet(value){
				var that = this;
				let deviceMsg = {};
				that.para.regenSIntervalSet =value;
				deviceMsg = {
					"regenSIntervalSet": Number(value.split("天")[0]),
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.fraceWash(para, "regenSIntervalSet");
				that.regenSIntervalSet = !this.regenSIntervalSet;
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