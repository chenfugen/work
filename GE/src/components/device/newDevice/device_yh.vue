<template>
	<div>
		<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
			<div class="deviceDetail">
				<div class="searchIcon">
					<!--<div class="saveWater" @click="set(1)">
						<img src="../../../../static/image/icon_bottle.png" class="bottle" />
						<p class="bottleTitle">已节约(个)</p>
						<p class="bottleNumber">{{deviceMsg.saveBottleNumber.value}}
							<van-icon name="arrow" />
						</p>
					</div>-->
					<img v-if="bindType!=2" src="../../../../static/image/icon_qrcode.png" class="qrcodeIcon" @click="set(2)" />
				</div>
				<div class="flow">
					<p class="waterNum">{{deviceMsg.regenRemain.value*10}}<span>L</span></p>
					<p class="water_title">可使用水量</p>
					<img src="../../../../static/image/bg@3x.png" onclick="return false" />
					<van-circle v-model="currentRate" :rate="percent" size="100" :stroke-width="50" color="#00B5E2 " layer-color="none" :speed="50" class="main" />
				</div>
				<div class="tab">
					<van-tabs type="card" color="#005EB8" @change="showChart">
						<van-tab title="水质数据"></van-tab>
						<van-tab title="用水统计"></van-tab>
					</van-tabs>
				</div>
				<Myecharts v-show="!isShowDate" :device="device" idName="mychart" ref="init"></Myecharts>
				<ul class="waterMsg" v-show="isShowDate">
					<li>
						<p class="waterSet">当前流速(m³/h)</p>
						<p class="waterValue">{{deviceMsg.waterVelocity.value/100}}</p>
						<div class="line"></div>
					</li>
					<li>
						<p class="waterSet">最大流量(m³/h)</p>
						<p class="waterValue">{{deviceMsg.maxVelocityPeriodic.value/100}}</p>
					</li>
					<li>
						<p class="waterSet">周期已用水量(L)</p>
						<p class="waterValue">{{deviceMsg.waterVolPeriodic.value*10}}</p>
						<div class="line"></div>
					</li>
					<li v-if="device.productKey=='a1TQBPNk4cT' || device.productKey=='a1ZTu3R5BKD' || device.productKey=='a1VmZ7nWwyQ'">
						<p class="waterSet">再生启动</p>
						<p class="waterValue" v-if="deviceMsg.regenStartTime.value.minute>=10">{{deviceMsg.regenStartTime.value.hour+":"+deviceMsg.regenStartTime.value.minute}}</p>
						<p class="waterValue" v-if="deviceMsg.regenStartTime.value.minute<10">{{deviceMsg.regenStartTime.value.hour+":0"+deviceMsg.regenStartTime.value.minute}}</p>
					</li>
					<li v-else>
						<p class="waterSet">冲洗启动</p>
						<p class="waterValue" v-if="deviceMsg.rinseStartTime.value.minute>=10">{{deviceMsg.rinseStartTime.value.hour+":"+deviceMsg.regenStartTime.value.minute}}</p>
						<p class="waterValue" v-if="deviceMsg.rinseStartTime.value.minute<10">{{deviceMsg.rinseStartTime.value.hour+":0"+deviceMsg.regenStartTime.value.minute}}</p>
					</li>
					<li v-if="device.productKey=='a1TQBPNk4cT' || device.productKey=='a1ZTu3R5BKD' || device.productKey=='a1VmZ7nWwyQ'">
						<p class="waterSet">再生间隔(天)</p>
						<p class="waterValue">{{deviceMsg.regenStartInterval.value}}</p>
						<div class="line"></div>
					</li>
					<li v-else>
						<p class="waterSet">冲洗间隔(天)</p>
						<p class="waterValue">{{deviceMsg.rinseStartInterval.value}}</p>
						<div class="line"></div>
					</li>
					<!--<li v-if="deviceMsg.material2.value.remain<=deviceMsg.material1.value.remain" @click="searchFilter(device.productKey)">
						<p class="waterSet">耗材2寿命(%)</p>
						<p class="waterValue" :class="{isDanger:deviceMsg.material2.value.remain<11}" >{{deviceMsg.material2.value.remain}}
							<van-icon class="link" name="arrow" />
						</p>
					</li>
					<li v-else @click="searchFilter(device.productKey)">
						<p class="waterSet">耗材1寿命(%)</p>
						<p class="waterValue" :class="{isDanger:deviceMsg.material1.value.remain<11}">{{deviceMsg.material1.value.remain}}
							<van-icon class="link" name="arrow" />
						</p>
					</li>-->
				</ul>
				<div style="width:100%;height:1rem;"></div>
				<div class="device_hint" v-show="isnormal==2" @click='checkFault'>
					<van-notice-bar :scrollable="false" background="#fff" mode="link">
						检测到设备出现故障，请排查故障或联系客服
					</van-notice-bar>
				</div>
				<ul class="tabbar">
					<li class="tabbar_li" @click="fraceWash">
						<p class="tabbar_img"><img :src="washImg" /></p>
						<p class="tabbar_text">{{washText}}</p>
					</li>
					<li class="tabbar_li" @click="makeWash">
						<p class="tabbar_img"><img :src="makeWashImg" /></p>
						<p class="tabbar_text">{{makeWashText}}</p>
					</li>
					<li class="tabbar_li" @click="goMore">
						<p class="tabbar_img"><img src="../../../../static/image/icon_more@2x.png" /></p>
						<p class="tabbar_text">更多</p>
					</li>
				</ul>
			</div>
		</v-touch>
		<van-dialog v-model="phoneShow" show-cancel-button :before-close="beforeClose" confirm-button-text="拨打">
			<p class="content">客户热线 <span style="color:#1E9FFF;">400-8201199</span></p>
		</van-dialog>
	</div>
</template>

<script>
	import * as func from '../../../../static/js/func'
	import Myecharts from '../../../components/echarts'
	export default {
		data() {
			return {
				msg: 'Welcome to Your Vue.js App',
				currentRate: 0,
				percent: 0,
				more: false,
				isShowDate: true,
				isnormal: 1,
				phoneShow: false,
				isActive: true,
				bindType:this.$route.params.bindType,
				deviceMsg: this.$store.state.newDeviceMsg,
				productKey: "",
				DeviceName: "",
				DeviceSecret: "",
				timestamp: new Date().getTime(),
				client: "",
				device:{},
				washImg: "../../../../static/image/icon_coerce_nor@2x.png",
				makeWashImg: "../../../../static/image/icon_appointment_nor@2x.png",
				washText: "强制冲洗",
				makeWashText: "预约冲洗",
				charts: '',
				waterLog: "", //取水
				deviceList: this.$store.state.deviceList,
				isInterval: true,
			}
		},
		components: {
			Myecharts
		},
		mounted() {
			let that = this;
			that.init();
			that.$store.state.client.on('message', function(topic, message, packet) {
				if(that.$route.params.id) {
					that.init();
				}
			})
		},
		methods: {
			getDay(day) {
				var today = new Date();
				var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
				today.setTime(targetday_milliseconds); //注意，这行是关键代码
				var tMonth = today.getMonth();
				var tDate = today.getDate();
				tMonth = this.doHandleMonth(tMonth + 1);
				tDate = this.doHandleMonth(tDate);
				return tMonth + "-" + tDate;
			},
			doHandleMonth(month) {
				var m = month;
				if(month.toString().length == 1) {
					m = "0" + month;
				}
				return m;
			},
			showChart(value) {
				this.isShowDate = !this.isShowDate;
				if(value == 1) {
					 this.$refs.init.getWaterLog(1);
				}
			},		
			swiperleft() {
				let pageNum = Number(this.$route.params.num) + Number(1);
				if(pageNum >= this.deviceList.length) {
					this.$toast("已是最后一个设备");
				} else {
					let productKey = this.deviceList[pageNum].productKey;
					let deviceId = this.deviceList[pageNum].deviceId;
					let bindType = this.deviceList[pageNum].bindType;
					let pageName = this.$route.path.split("/")[1].split("/")[0];
					this.$router.push({
						path: func.getPath(pageName, productKey, deviceId, bindType, pageNum)
					})
				}
			},
			swiperright() {
				let pageNum = this.$route.params.num - 1;
				if(pageNum < 0) {
					this.$router.push({
						path: "/device"
					})
				} else {
					let productKey = this.deviceList[pageNum].productKey;
					let deviceId = this.deviceList[pageNum].deviceId;
					let bindType = this.deviceList[pageNum].bindType;
					let pageName = this.$route.path.split("/")[1].split("/")[0];
					this.$router.push({
						path: func.getPath(pageName, productKey, deviceId, bindType, pageNum)
					})
				}
			},
			init() {
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.params.id).then((res) => {
					if(res.data.success) {
						this.device = res.data.data.device;
						document.title = this.device.deviceNickName== this.device.deviceName? this.device.productName:this.device.deviceNickName
						this.deviceMsg = res.data.data.property;
						let regenRemain = this.deviceMsg.regenRemain.value;
						let waterVolPeriodic = this.deviceMsg.waterVolPeriodic.value;
						this.percent = Number(regenRemain / (regenRemain + waterVolPeriodic) * 100);
						this.$cookies.set('firmwareVersion', this.device.firmwareVersion);
						this.$store.commit("changeNewDevice", this.deviceMsg);
						this.isnormal = this.device.status == "offline" ? 0 : 1;					
						if(this.device.deviceFault) {
							this.isnormal = 2;
						}
						if(this.isnormal == 1 && this.isInterval) {
							this.intervalBtn();
						}
						if(this.deviceMsg.reservedRegen.value == 1 || this.deviceMsg.reservedRinse.value == 1) {
							this.makeWashImg = "../../../../static/image/icon_appointment_sel@2x.png";
						}
						if(this.deviceMsg.forceRegen.value == 1 || this.deviceMsg.forceRinse.value == 1) {
							this.washImg = "../../../../static/image/icon_coerce_sel@2x.png";
						}
						if(this.device.productKey == "a1TQBPNk4cT" ||  this.device.productKey == "a1ZTu3R5BKD" ||  this.device.productKey == "a1VmZ7nWwyQ"){
							this.washText="强制再生";
							this.makeWashText="预约再生"
						}else{
							this.washText="强制冲洗";
							this.makeWashText="预约冲洗"
						}
						this.$forceUpdate();
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			fraceWash() {
				let that = this;
				let deviceMsg = {};
				if(this.device.productKey == "a1TQBPNk4cT" ||  this.device.productKey == "a1ZTu3R5BKD" ||  this.device.productKey == "a1VmZ7nWwyQ"){
					if(that.deviceMsg.forceRegen.value == 1) {
						that.$toast("设备正再生中，请稍后");
						return false;
					}
					deviceMsg = {
						"forceRegen": 1
					}
				} else {
					if(that.deviceMsg.forceRinse.value == 1) {
						that.$toast("设备正冲洗中，请稍后");
						return false;
					}
					deviceMsg = {
						"forceRinse": 1
					}
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "force");
			},
			makeWash() {
				let that = this;
				let deviceMsg = {};
				if(this.device.productKey == "a1TQBPNk4cT" ||  this.device.productKey == "a1ZTu3R5BKD" ||  this.device.productKey == "a1VmZ7nWwyQ"){
					if(that.deviceMsg.regenStartTime.value.hour == 0 && that.deviceMsg.regenStartTime.value.minute == 0) {
						that.$dialog.confirm({
							title: '警告提示',
							message: '请先设置预约再生的启动时间',
							confirmButtonText: "前往"
						}).then(() => {
							that.$router.push("/newDeviceSet?deviceId=" + that.$route.params.id);
						}).catch(() => {});
						return false;
					} else {
						deviceMsg = {
							"reservedRegen": that.deviceMsg.reservedRegen.value == 0 ? 1 : 0
						}
					}
				} else {
					if(that.deviceMsg.rinseStartTime.value.hour == 0 && that.deviceMsg.rinseStartTime.value.minute == 0) {
						that.$dialog.confirm({
							title: '警告提示',
							message: '请先设置预约冲洗的启动时间',
							confirmButtonText: "前往"
						}).then(() => {
							that.$router.push("/newDeviceSet?deviceId=" + that.$route.params.id);
						}).catch(() => {});
						return false;
					} else {
						deviceMsg = {
							"reservedRinse": that.deviceMsg.reservedRinse.value == 0 ? 1 : 0
						}
					}
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "reserved");
			},
			intervalBtn() {
				let that = this;
				const deviceMsg = {
					"interval": {
						"second": 10,
						"limit": 5
					}
				}
				const para = {
					productKey: that.device.productKey,
					deviceName: that.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.isInterval = false;
				that.setDeviceProperty(para, "intervalBtn");
			},
			setDeviceProperty(e, name) {
				this.$Axios.post('common/setDeviceProperty', e).then((res) => {
					if(res.data.success) {
						if(name != "intervalBtn") {
							this.$toast.loading({
								mask: true,
								message: '设置中...'
							});
						}
						if(name == "force") {
							this.washImg = "../../../../static/image/icon_coerce_sel@2x.png";
						}
						if(name == "reserved") {
							if(this.deviceMsg.reservedRinse.value == 0 && this.deviceMsg.reservedRegen.value == 0) {
								this.makeWashImg = "../../../../static/image/icon_appointment_sel@2x.png";
							} else {
								this.makeWashImg = "../../../../static/image/icon_appointment_nor@2x.png";
							}
						}
					} else {
						this.$toast(res.data.message);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			checkFault() {
				this.$router.push("/faultList?productKey=" + this.device.productKey + "&deviceName=" + this.device.deviceName);
			},
			showFilter() {
				this.filter = !this.filter;
			},
			onClickLeft() {
				this.client.end(true);
				this.$router.go(-1);
			},
			goMore() {
				let urlName = "/more?deviceId=" + this.$route.params.id + "&bindType=" + this.$route.params.bindType+ "&isnormal=" + this.isnormal;
				this.$router.push(urlName);
			},
			set(e) {
				let urlName;
				switch(e) {
					case 1:
						urlName = "/waterServe?deviceId=" + this.$route.params.id;
						break;
					case 2:
						if(this.$route.params.bindType == 2) {
							this.$toast("您是该设备分享用户，无法分享")
							return false;
						}
						urlName = "/qrcode?deviceId=" + this.$route.params.id;
						break;
					default:
						break;
				}
				this.$router.push(urlName);
			},
			searchFilter(productKey) {
				this.$router.push("/filter?productKey=" + productKey);
			},
			beforeClose(action, done) {
				if(action === 'confirm') {
					window.location.href = "tel:4008201199";
					done();
				} else {
					done();
				}
			}
		}
	}
</script>
<style lang="scss">
	.deviceDetail {
		color: white;
		overflow: hidden;
		.van-hairline--bottom::after {
			border-bottom-width: 0px;
		}
		.van-nav-bar__title {
			color: white;
			font-size: 0.15rem;
		}
		.van-nav-bar .van-icon {
			color: white;
		}
		.searchIcon {
			width: 100%;
			height: 0.36rem;
			margin-top: 0.05rem;
			padding: 0.05rem 0rem;
			background: white;
			.saveWater {
				width: 0.6rem;
				float: left;
				height: 0.36rem;
				margin-left: 0.1rem;
				position: relative;
				.bottle {
					position: absolute;
					width: 0.25rem;
					top: 0.05rem;
					left: 0px;
				}
				.bottleTitle {
					position: absolute;
					width: 1rem;
					height: 0.15rem;
					font-size: 0.1rem;
					color: #999999;
					top: 0.0rem;
					left: 0.3rem;
				}
				.bottleNumber {
					position: absolute;
					width: 1rem;
					height: 0.15rem;
					font-size: 0.12rem;
					color: #005EB8;
					top: 0.2rem;
					left: 0.3rem;
				}
			}
			.qrcodeIcon {
				float: right;
				width: 0.2rem;
				margin: 0.1rem 0.1rem;
			}
		}
		.flow {
			width: 100%;
			background: white;
			height: 2.5rem;
			position: relative;
			overflow: hidden;
			img {
				position: absolute;
				left: 50%;
				top: 0px;
				width: 2.5rem;
				margin-left: -1.25rem;
			}
			.main {
				width: 100%;
				height: 1.85rem;
				margin-top: 0.28rem;
			}
			.waterNum {
				position: absolute;
				top: 35%;
				left: 50%;
				margin-left: -0.9rem;
				width: 1.8rem;
				z-index: 999;
				font-size: 0.5rem;
				color: #333;
				font-weight: lighter;
				text-align: center;
				line-height: 0.55rem;
				span {
					font-size: 0.14rem;
					color: #666666;
				}
			}
			.water_title {
				position: absolute;
				top: 60%;
				left: 50%;
				margin-left: -0.5rem;
				width: 1rem;
				z-index: 999;
				opacity: 0.7;
				font-size: 0.12rem;
				color: #999;
				letter-spacing: 0;
				text-align: center;
				line-height: 0.28rem;
			}
		}
		.tab {
			background: white;
			padding: 0.1rem 0rem;
		}
		.waterMsg {
			height: 2.5rem;
			background: white;
			li {
				float: left;
				width: 50%;
				height: 0.8rem;
				text-align: center;
				border-top: 1px solid #EAEFF3;
				position: relative;
				.waterValue {
					font-size: 0.22rem;
					color: #005EB8;
					letter-spacing: 0;
					line-height: 0.3rem;
					overflow: hidden;
				}
				.waterSet {
					opacity: 0.5;
					font-size: 0.12rem;
					color: #999;
					letter-spacing: 0;
					line-height: 0.3rem;
					margin-top: 0.1rem;
				}
				.isDanger{
					color:#ff6a00;
				}
				.line {
					position: absolute;
					height: 100%;
					width: 1px;
					top: 1px;
					right: 0px;
					background: #EAEFF3;
				}
				.link {
					font-size: 0.2rem;
					color: #005EB8;
					opacity: 0.7;
				}
			}
			.filter {
				text-shadow: 0 0 5px #eee;
			}
		}
		.van-tabs__nav--card {
			border-radius: 0.03rem;
		}		
		.device_hint {
			position: fixed;
			left: 0px;
			bottom: 0.82rem;
			width: 100%;
			background: white;
			z-index:999;
			border-bottom: 1px solid #eee;
		}
		.tabbar {
			position: fixed;
			left: 0px;
			bottom: 0rem;
			height: 0.82rem;
			width: 100%;
			background: white;
			z-index: 999;
			.tabbar_li {
				float: left;
				width: 33%;
				height: 100%;
				text-align: center;
				.tabbar_img {
					width: 0.44rem;
					height: 0.44rem;
					margin: 0.1rem auto;
					img {
						vertical-align: top;
						width: 100%;
						height: 100%;
					}
				}
				.tabbar_text {
					font-size: 0.13rem;
					color: #333333;
					letter-spacing: 0;
					margin-top: -0.05rem;
				}
			}
		}
		.oprateList {
			width: 100%;
			height: 1.9rem;
			background: white;
			.oprateWay {
				float: left;
				width: 33%;
				height: 0.9rem;
				text-align: center;
				.oprateImg {
					width: 0.44rem;
					height: 0.44rem;
					margin: 0.14rem auto;
					img {
						vertical-align: top;
						width: 100%;
						height: 100%;
					}
				}
				.oprateName {
					font-size: 0.12rem;
					color: #333333;
					letter-spacing: 0;
					margin-top: -0.05rem;
				}
			}
		}
	}
	
	.content {
		padding: 40px 0px;
		text-align: center;
		color: #bbb;
	}
</style>