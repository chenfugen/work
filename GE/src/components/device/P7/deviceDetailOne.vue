<template>
	<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
		<div class="p7device">
			<div class="searchIcon">
				<div class="saveWater" @click="set(1)">
					<img src="../../../../static/image/icon_bottle.png" class="bottle" />
					<p class="bottleTitle">已节约(个)</p>
					<p class="bottleNumber">{{deviceMsg.waterVolTotal.value*2}}
						<van-icon name="arrow" />
					</p>
				</div>
				<img v-if="bindType!=2" src="../../../../static/image/icon_qrcode.png" class="qrcodeIcon" @click="set(2)" />
			</div>
			<div class="flow">
				<ul class="tdsContent">
					<li class="purifierWater">
						<p class="waterNum">{{deviceMsg.tdsOut.value}}</p>
						<p class="water_title">净水TDS</p>
					</li>
					<li class="sourceWater">
						<p class="waterNum">{{deviceMsg.tdsIn.value}}</p>
						<p class="water_title">源水TDS</p>
					</li>
				</ul>
				<img src="../../../../static/image/bg@3x.png" />
				<van-circle v-model="currentRate" :rate="deviceMsg.tdsOut.value/2" size="100" :stroke-width="50" color="#00B5E2 " layer-color="none" :speed="10" class="main" />
			</div>
			<div class="deviceStatus">
				<ul>
					<li>
						<p class="waterValue" v-if="deviceMsg.waterMakingState.value==1"><img src="../../../../static/image/icon_produce water_nor.png" /></p>
						<p class="waterValue" v-else><img src="../../../../static/image/icon_produce water_dis.png" /></p>
						<p class="satus" :class="{danger:deviceMsg.waterMakingState.value==1}">制水</p>
					</li>
					<li>
						<p class="waterValue" v-if="deviceMsg.waterShortState.value==1"><img src="../../../../static/image/icon_hydropenia_nor.png" /></p>
						<p class="waterValue" v-else><img src="../../../../static/image/icon_hydropenia_dis.png" /></p>
						<p class="satus" :class="{danger:deviceMsg.waterShortState.value==1}">缺水</p>
					</li>
					<li>
						<p class="waterValue" v-if="deviceMsg.maintenanceState.value==1"><img src="../../../../static/image/icon_overhaul_nor.png" /></p>
						<p class="waterValue" v-else><img src="../../../../static/image/icon_overhaul_dis.png" /></p>
						<p class="satus" :class="{danger:deviceMsg.maintenanceState.value==1}">检修</p>
					</li>
				</ul>
			</div>
			<div class="tab">
				<van-tabs type="card" color="#005EB8" @change="showChart">
					<van-tab title="用水统计"></van-tab>
					<van-tab title="耗材剩余"></van-tab>
				</van-tabs>
			</div>
			<Myecharts v-show="!isShowDate"  :device="device"  idName="P7chartOne"  ref="init"></Myecharts>
			<ul class="waterMsg" v-show="isShowDate">
				<li>
					<p class="waterSet">CPF1值(%)</p>
					<p class="waterValue" :class="{isDanger:deviceMsg.filterPP.value<11}" >{{deviceMsg.filterPP.value}}</p>
					<div class="line"></div>
				</li>
				<li v-if="device.productKey=='a1xjge89hkA'">
					<p class="waterSet">RO3值(%)</p>
					<p class="waterValue" :class="{isDanger:deviceMsg.filterRO.value<11}">{{deviceMsg.filterRO.value}}</p>
				</li>
				<li v-if="device.productKey=='a1przX9NmYK'">
					<p class="waterSet">NF3值(%)</p>
					<p class="waterValue" :class="{isDanger:deviceMsg.filterNF.value<11}">{{deviceMsg.filterNF.value}}</p>
				</li>
				<li>
					<p class="waterSet">CTO4值(%)</p>
					<p class="waterValue" :class="{isDanger:deviceMsg.filterCTO.value<11}">{{deviceMsg.filterCTO.value}}</p>
					<div class="line"></div>
				</li>
				<li>
					<p class="waterSet">CPF2值(%)</p>
					<p class="waterValue" :class="{isDanger:deviceMsg.filterT33.value<11}">{{deviceMsg.filterT33.value}}</p>
				</li>
			</ul>
			<div style="width:100%;height:1rem;"></div>
			<div class="device_hint" v-show="isnormal==2" @click='checkFault'>
				<van-notice-bar :scrollable="false" background="#fff" mode="link">
					检测到设备出现故障，请排查故障或联系客服
				</van-notice-bar>
			</div>
			<ul class="tabbar">
				<li class="tabbar_li" @click="powerBtn">
					<p class="tabbar_img"><img :src="powerImg" /></p>
					<p class="tabbar_text">电源</p>
				</li>
				<li class="tabbar_li" @click="fraceWash">
					<p class="tabbar_img"><img :src="washImg" /></p>
					<p class="tabbar_text">冲洗</p>
				</li>
				<li class="tabbar_li" @click="goMore">
					<p class="tabbar_img"><img src="../../../../static/image/icon_more@2x.png" /></p>
					<p class="tabbar_text">更多</p>
				</li>
			</ul>
			<van-dialog v-model="phoneShow" show-cancel-button :before-close="beforeClose" confirm-button-text="拨打">
				<p class="content">客户热线 <span style="color:#1E9FFF;">400-8201199</span></p>
			</van-dialog>
		</div>
	</v-touch>
</template>

<script>
	import * as func from '../../../../static/js/func'
	import Myecharts from '../../../components/echarts'
	export default {
		data() {
			return {
				msg: 'Welcome to Your Vue.js App',
				currentRate: 0,
				isShowDate: false,
				isnormal: "", //0:离线，1：正常，2：故障
				phoneShow: false,
				isActive: true,
				bindType:this.$route.params.bindType,
				deviceMsg: this.$store.state.device_commercialMsg,
				powerImg: "../../../../static/image/btn_power_nor.png",
				washImg: "../../../../static/image/icon_coerce_nor@2x.png",
				powerSwitch: "",
				productKey: "",
				DeviceName: "",
				DeviceSecret: "",
				timestamp: new Date().getTime(),
				client: "",
				device:{},
				charts: '',
				isInterval: true,
				isHint: true,
				deviceList: this.$store.state.deviceList
			}
		},
		components: {
			Myecharts
		},
		mounted() {
			let that = this;
			that.init();
			this.$store.state.client.on('message', function(topic, message, packet) {
				if(that.$route.params.id) {
					that.init();
				}
			})
		},
		methods: {
			showChart(value) {
				this.isShowDate = !this.isShowDate;
				if(value == 0) {					
					 this.$refs.init.getWaterLog(1);
				}
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
						path: func.getPath("CUFDeviceOne", productKey, deviceId, bindType, pageNum)
					})
				}
			},
			init() {
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.params.id).then((res) => {
					if(res.data.success) {
						this.device = res.data.data.device;
						this.deviceMsg = res.data.data.property;
						document.title = this.device.deviceNickName== this.device.deviceName? this.device.productName:this.device.deviceNickName;
						this.powerSwitch = this.deviceMsg.powerBtn.value;
						this.$store.commit("changeDevicecomercial", this.deviceMsg);
						this.isnormal = this.device.status == "offline" ? 0 : 1;
						if(this.isHint){
						this.$nextTick(
							function() {
								this.$refs.init.getWaterLog(1);
							}
						)		   	
						  this.isHint=false;
						}			
						if(this.device.deviceFault) {
							this.isnormal = 2;
						}
						if(this.isnormal == 1 && this.isInterval) {
							this.intervalBtn();
						}
						if(this.deviceMsg.powerBtn.value == 1) {
							this.powerImg = "../../../../static/image/btn_power_sel.png";
						} else {
							this.powerImg = "../../../../static/image/btn_power_nor.png";
						}
						if(this.deviceMsg.forceRinse.value == 1) {
							this.washImg = "../../../../static/image/icon_coerce_sel.png";
						} else {
							this.washImg = "../../../../static/image/icon_coerce_nor@2x.png";
						}
						this.$forceUpdate();
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			checkFault() {
				this.$router.push("/faultList?productKey=" + this.device.productKey + "&deviceName=" + this.device.deviceName);
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
			powerBtn() {
				let that = this;
				let value = that.powerSwitch == 1 ? 0 : 1;
				const deviceMsg = {
					"powerBtn": value
				}
				const para = {
					productKey: this.device.productKey,
					deviceName: this.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "powerBtn");
			},
			fraceWash() {
				let that = this;
				let deviceMsg = {};
				if(that.deviceMsg.forceRinse.value == 1) {
					that.$toast("设备正冲洗中，请稍后");
					return false;
				}
				if(that.deviceMsg.powerBtn.value == 0) {
					that.$toast("设备处于断电状态，请先打开电源");
					return false;
				}
				deviceMsg = {
					"forceRinse": 1
				}
				const para = {
					productKey: this.device.productKey,
					deviceName: this.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "force");
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
					} else {
						this.$toast(res.data.message);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			viewPage(e) {
				switch(e) {
					case "serve":
						this.$router.push("/waterServe?deviceId=" + this.$route.params.id);
						break;
					case "filter":
						this.$router.push("/waterFilter?deviceId=" + this.$route.params.id);
						break;
					case "temp":
						this.$router.push("/waterTemp?deviceId=" + this.$route.params.id);
						break;
					default:
						break;
				}
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
	.p7device {
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
			.tdsContent {
				position: absolute;
				width: 2rem;
				height: 2rem;
				top: 0.3rem;
				left: 50%;
				margin-left: -1rem;
				z-index: 999;
				.purifierWater {
					width: 70%;
					margin: 0.2rem auto 0.1rem auto;
					border-bottom: 1px solid #eee;
					.waterNum {
						margin-top: 0.1rem;
						font-size: 0.4rem;
						color: #333;
						text-align: center;
						line-height: 0.5rem;
					}
					.water_title {
						opacity: 0.7;
						font-size: 0.12rem;
						color: #999;
						letter-spacing: 0;
						text-align: center;
						line-height: 0.28rem;
					}
				}
				.sourceWater {
					.waterNum {
						font-size: 0.22rem;
						color: #333;
						text-align: center;
						line-height: 0.24rem;
					}
					.water_title {
						opacity: 0.7;
						font-size: 0.12rem;
						color: #999;
						letter-spacing: 0;
						text-align: center;
						line-height: 0.28rem;
					}
				}
			}
		}
		.waterTemp {
			background: white;
			margin-top: -0.1rem;
			.temp {
				font-size: 0.22rem;
				color: #005EB8;
				text-align: center;
				line-height: 0.4rem;
			}
			.waterTitle {
				font-size: 0.12rem;
				color: #999999;
				letter-spacing: 0;
				text-align: center;
				line-height: 0.2rem;
			}
		}
		.waterMsg {
			height: 1.6rem;
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
				.isDanger{
					color:#ff6a00;
				}
				.waterSet {
					opacity: 0.5;
					font-size: 0.12rem;
					color: #999;
					letter-spacing: 0;
					line-height: 0.3rem;
					margin-top: 0.1rem;
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
		.tab {
			background: white;
			padding: 0.1rem 0rem;
		}
		.van-tabs__nav--card {
			border-radius: 0.03rem;
		}
		.deviceStatus {
			background: white;
			ul {
				width: 2.1rem;
				margin: 0 auto;
				height: 0.4rem;
				li {
					float: left;
					width: 0.7rem;
					text-align: center;
					.waterValue {
						font-size: 0.24rem;
						color: #FFFFFF;
						letter-spacing: 0;
						line-height: 0.24rem;
						overflow: hidden;
						font-weight: lighter;
						img {
							width: 0.21rem;
						}
					}
					.satus{
						text-align: center;
						height: 0.3rem;
						font-size: 0.12rem;			
						color: #6AB3D1;		
					}
					.danger{
						color:#005EB8;
					}
				}
			}
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
			z-index: 999;
			background: white;
			border-top: 1px solid #eee;
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
		.content {
			padding: 40px 0px;
			text-align: center;
			color: #bbb;
		}
	}
</style>