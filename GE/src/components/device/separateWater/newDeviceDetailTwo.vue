<template>
	<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
		<div class="separateDevice">
			<div class="searchIcon">
				<div class="saveWater" @click="viewPage('serve')">
					<img src="../../../../static/image/icon_bottle.png" class="bottle" />
					<p class="bottleTitle">已节约(个)</p>
					<p class="bottleNumber">{{deviceMsg.saveBottleNumber.value}}
						<van-icon name="arrow" />
					</p>
				</div>
				<img v-if="bindType!=2" src="../../../../static/image/icon_qrcode.png" class="qrcodeIcon" @click="set(2)" />
			</div>
			<div class="flow">
				<ul class="tdsContent" @click="viewPage('serve')">
					<li class="purifierWater">
						<p class="waterNum"><span>&nbsp;{{deviceMsg.tdsOut.value}}</span><span v-if="deviceMsg.tdsOut.value>10 && deviceMsg.tdsOut.value<120" class="status"> 优</span>
							<span v-else class="status"> 良</span></p>
						<p class="water_title">净水TDS</p>
					</li>
					<li class="sourceWater">
						<p class="waterNum"><span>&nbsp;{{deviceMsg.tdsIn.value}}</span><span v-if="deviceMsg.tdsIn.value>10 && deviceMsg.tdsIn.value<120" class="status"> 优</span>
							<span v-else class="status"> 良</span></p>
						<p class="water_title">源水TDS</p>
					</li>
				</ul>
				<img src="../../../../static/image/bg@3x.png" />
				<van-circle v-model="currentRate" :rate="deviceMsg.tdsOut.value/2" size="100" :stroke-width="50" color="#00B5E2 " layer-color="none" :speed="10" class="main" />
			</div>
			<div class="tab">
				<van-tabs type="card" color="#005EB8" @change="showChart">
					<van-tab title="水质数据"></van-tab>
					<van-tab title="用水统计"></van-tab>
				</van-tabs>
			</div>
			<Myecharts v-show="!isShowDate" :device="device" idName="newSeparateTwoChart" ref="init"></Myecharts>
			<ul class="waterMsg" v-show="isShowDate">
				<li @click="viewPage('temp')">
					<div class="deviceMsg">
						<img src="../../../../static/image/icon_water temperature.png" />
						<div class="deviceSet">
							<p class="waterSet">水温</p>
							<p class="waterValue">{{deviceMsg.waterInTemp.value}}<span class="unit">
								°
							</span></p>
						</div>
					</div>
					<div class="line"></div>
				</li>
				<li @click="viewPage('filter')">
					<div class="deviceMsg">
						<img src="../../../../static/image/icon_filter element.png" />
						<div class="deviceSet">
							<p class="waterSet">{{filterName}}</p>
							<p class="waterValue" :class="{isDanger:filterLifetime<11}">{{filterLifetime}}<span class="unit">
								%
								</span></p>
						</div>
					</div>
				</li>
			</ul>
			<div style="width:100%;height:0.5rem;"></div>
			<div class="device_hint" v-show="isnormal==2" @click='checkFault'>
				<van-notice-bar :scrollable="false" background="#fff" mode="link">
					检测到设备出现故障，请排查故障或联系客服
				</van-notice-bar>
			</div>
			<div :class="isnormal==2? 'moreOne' : 'moreTwo' " class="more">
				<img src="../../../../static/image/icon_blue_more.png" @click="goMore" />
			</div>
			<van-dialog v-model="phoneShow" show-cancel-button :before-close="beforeClose" confirm-button-text="拨打">
				<p class="content">客户热线 <span style="color:#1E9FFF;">400-788-7171</span></p>
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
				more: false,
				isnormal: "", //0:离线，1：正常，2：故障
				phoneShow: false,
				isActive: true,
				bindType: this.$route.params.bindType,
				deviceMsg: this.$store.state.device_commercialMsg,
				powerSwitch: "",
				productKey: "",
				DeviceName: "",
				DeviceSecret: "",
				client: "",
				device: {},
				deviceList: this.$store.state.deviceList,
				waterLog: "",
				isShowDate: true,
				isHint: true,
				filterName: "C2滤芯寿命",
				filterLifetime: "0",
				tdsImg: "../../../../static/image/tds20.png",
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
						this.deviceMsg = res.data.data.property;
						document.title = this.device.deviceNickName == this.device.deviceName ? this.device.productName : this.device.deviceNickName
						this.$store.commit("changeDevicecomercial", this.deviceMsg);
						this.isnormal = this.device.status == "offline" ? 0 : 1;
						if(this.device.deviceFault) {
							this.isnormal = 2;
						}
						if(this.isnormal == 1 && this.isInterval) {
							this.intervalBtn();
						}
						//滤芯寿命排序
						let result = [{
								filterName: "ACF滤芯寿命",
								filterLifetime: this.deviceMsg.filterACF.value,
							},
							{
								filterName: "CTO滤芯寿命",
								filterLifetime: this.deviceMsg.filterCTO.value,
							}
						]
						if(this.device.filterType=="RO") {
							result.push({
								filterName: "RO滤芯寿命",
								filterLifetime: this.deviceMsg.filterRO.value,
							})
						} else {
							result.push({
								filterName: "NF滤芯寿命",
								filterLifetime: this.deviceMsg.filterNF.value,
							})
						}
						result.sort((a, b) => a.filterLifetime - b.filterLifetime);
						this.filterName = result[0].filterName;
						this.filterLifetime = result[0].filterLifetime;
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
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
			goMore() {
				let urlName = "/more?deviceId=" + this.$route.params.id + "&bindType=" + this.$route.params.bindType + "&isnormal=" + this.isnormal;
				this.$router.push(urlName);
			},
			clear() {
				this.more = !this.more;
			},
			set(e) {
				let urlName;
				switch(e) {
					case 1:
						urlName = "/deviceInfo?deviceId=" + this.$route.params.id;
						break;
					case 2:
						if(this.$route.params.bindType == 2) {
							this.$toast("您是该设备分享用户，无法分享")
							return false;
						}
						urlName = urlName = "/qrcode?deviceId=" + this.$route.params.id;
						break;
					default:
						break;
				}
				if(e != 5) {
					this.$router.push(urlName);
				}
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
						this.$router.push("/separateWaterTemp?deviceId=" + this.$route.params.id);
						break;
					default:
						break;
				}
			},
			beforeClose(action, done) {
				if(action === 'confirm') {
					window.location.href = "tel:4007887171";
					done();
				} else {
					done();
				}
			}
		}
	}
</script>
<style lang="scss">
		.separateDevice {
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
				z-index: 9999;
				.purifierWater {
					width: 60%;
					margin: 0.25rem auto 0.1rem auto;
					border-bottom: 1px solid #ccc;
					.waterNum {
						font-size: 0.4rem;
						color: #333;
						font-weight: lighter;
						text-align: center;
						.status {
							display: inline;
							font-size: 0.12rem;
							color: #999;
						}
						.bad {
							color: #FF4444;
						}
					}
					.water_title {
						opacity: 0.7;
						font-size: 0.12rem;
						color: #999;
						letter-spacing: 0;
						text-align: center;
						line-height: 0.24rem;
					}
				}
				.sourceWater {
					.waterNum {
						font-size: 0.22rem;
						color: #333;
						font-weight: lighter;
						text-align: center;
						.status {
							display: inline;
							font-size: 0.1rem;
							color: #999;
						}
						.bad {
							color: #F56723;
						}
					}
					.water_title {
						opacity: 0.7;
						font-size: 0.12rem;
						color: #999;
						letter-spacing: 0;
						text-align: center;
						line-height: 0.24rem;
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
				height: 0.9rem;
				background: white;
				li {
					float: left;
					width: 50%;
					height: 0.8rem;
					text-align: center;
					border-top: 1px solid #EAEFF3;
					border-bottom: 1px solid #EAEFF3;
					position: relative;
					.deviceMsg {
						vertical-align: top;
						display: inline-block;
						height: 100%;
						margin-top: 0.25rem;
						img {
							float: left;
							width: 0.36rem;
							height: 0.36rem;
						}
						.deviceSet {
							float: left;
							margin-top: 0.03rem;
							.waterValue {
								text-align: left;
								font-size: 0.16rem;
								color: #333;
								letter-spacing: 0;
								.unit {
									font-size: 0.1rem;
								}
							}
							.isDanger {
								color: #ff6a00;
							}
							.waterSet {
								opacity: 0.5;
								font-size: 0.1rem;
								color: #999;
								letter-spacing: 0;
								line-height: 0.10rem;
							}
						}
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
			.device_hint {
				position: fixed;
				left: 0px;
				bottom: 0.02rem;
				width: 100%;
				background: white;
				z-index: 999;
				border-bottom: 1px solid #eee;
			}
			.moreOne {
				position: fixed;
				width: 100%;
				height: 0.5rem;
				bottom: 0.45rem;
				z-index: 999;
				img {
					float: right;
					width: 0.48rem;
					margin: 0.01rem 0.1rem;
				}
			}
			.moreTwo {
				position: fixed;
				width: 100%;
				height: 0.5rem;
				bottom: 0.05rem;
				z-index: 999;
				img {
					float: right;
					width: 0.48rem;
					margin: 0.01rem 0.1rem;
				}
			}
			.content {
				padding: 40px 0px;
				text-align: center;
				color: #bbb;
			}
		}
</style>
