<template>
	<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
		<div class="commercialDevice">
			<div class="searchIcon">
				<div class="saveWater" @click="set(1)">
					<img src="../../../../static/image/icon_bottle.png" class="bottle" />
					<p class="bottleTitle">已节约(个)</p>
					<p class="bottleNumber">{{deviceMsg.saveBottleNumber.value}}
						<van-icon name="arrow" />
					</p>
				</div>
				<img v-if="bindType!=2" src="../../../../static/image/icon_qrcode.png" class="qrcodeIcon" @click="set(2)" />
			</div>
			<div class="flow" v-if="device.productKey == 'a1i8kpwPW9w'">
				<p class="waterNum">{{deviceMsg.tdsOut.value}}<span>ppm</span></p>
				<p class="water_title">出水TDS</p>
				<img src="../../../../static/image/bg@3x.png" />
				<van-circle v-model="currentRate" :rate="deviceMsg.tdsOut.value/2" size="100" :stroke-width="50" color="#00B5E2 " layer-color="none" :speed="10" class="main" />
			</div>
			<div class="flow" v-else>
				<p class="waterNum">{{deviceMsg.tocOut.value}}<span>ppm</span></p>
				<p class="water_title">出水TOC</p>
				<img src="../../../../static/image/bg@3x.png" />
				<van-circle v-model="currentRate" :rate="deviceMsg.tocOut.value/2" size="100" :stroke-width="50" color="#00B5E2 " layer-color="none" :speed="10" class="main" />
			</div>
			<div class="deviceStatus">
				<ul>
					<li>
						<p class="waterValue" v-if="deviceMsg.heating.value==0"><img src="../../../../static/image/icon_heating_dis.png" onclick="return false" /></p>
						<p class="waterValue" v-else><img src="../../../../static/image/icon_heating.png" onclick="return false" /></p>
					</li>
					<li>
						<p class="waterValue" v-if="deviceMsg.refrigeration.value==0"><img src="../../../../static/image/icon_refrigeration_dis.png" onclick="return false" /></p>
						<p class="waterValue" v-else><img src="../../../../static/image/icon_refrigeration.png" onclick="return false" /></p>
					</li>
					<li>
						<p class="waterValue" v-if="deviceMsg.childLock.value==0"><img src="../../../../static/image/icon_child lock_dis.png" onclick="return false" /></p>
						<p class="waterValue" v-else><img src="../../../../static/image/icon_child lock.png" onclick="return false" /></p>
					</li>
					<li>
						<p class="waterValue" v-if="deviceMsg.sterilizBtn.value==0"><img src="../../../../static/image/icon_uv_dis.png" onclick="return false" /></p>
						<p class="waterValue" v-else><img src="../../../../static/image/icon_uv.png" onclick="return false" /></p>
					</li>
				</ul>
			</div>
			<div class="tab">
				<van-tabs type="card" color="#005EB8" @change="showChart">
					<van-tab title="水质数据"></van-tab>
					<van-tab title="用水统计"></van-tab>
				</van-tabs>
			</div>			
			<Myecharts v-show="!isShowDate" :device="device" idName="commercialOneChart" ref="init"></Myecharts>
			<ul class="waterMsg" v-show="isShowDate">
				<li>
					<p class="waterSet">热水(℃)</p>
					<p class="waterValue">{{deviceMsg.hotWaterTemp.value}}</p>
					<div class="line"></div>
				</li>
				<li>
					<p class="waterSet">冷水(℃)</p>
					<p class="waterValue">{{deviceMsg.waterInTemp.value}}</p>
				</li>
				<li v-if="device.productKey == 'a1i8kpwPW9w'">
					<p class="waterSet">源水TDS(ppm)</p>
					<p class="waterValue">{{deviceMsg.tdsIn.value}}</p>
					<div class="line"></div>
				</li>
				<li v-else>
					<p class="waterSet">源水TOC(ppm)</p>
					<p class="waterValue">{{deviceMsg.tocIn.value}}</p>
					<div class="line"></div>
				</li>
				<li @click="searchFilter(device.productKey)">
					<p class="waterSet">{{filterName}}(%)</p>
					<p class="waterValue" :class="{isDanger:filterLifetime<11}">{{filterLifetime}}
						<van-icon class="link" name="arrow" />
					</p>
				</li>
			</ul>
			<div style="width:100%;height:0.5rem;"></div>
			<div class="bottomTab">
				<div class="more" @click="goMore">
					<img src="../../../../static/image/icon_blue_more.png" />
				</div>
				<div class="device_hint" v-show="isnormal==2" @click='checkFault'>
					<van-notice-bar :scrollable="false" background="#fff" mode="link">
						检测到设备出现故障，请及时排查或联系客服
					</van-notice-bar>
				</div>
			</div>			
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
				isShowDate: true,
				isnormal: 1, //0:离线，1：正常，2：故障
				phoneShow: false,
				isActive: true,
				bindType: this.$route.params.bindType,
				deviceMsg: this.$store.state.device_commercialMsg,
				powerImg: "../../../../static/image/btn_power_nor.png",
				heatImg: "../../../../static/image/btn_heating_dis.png",
				refrigerImg: "../../../../static/image/btn_refrigeration_dis.png",
				sterilizImg: "../../../../static/image/btn_UV_dis.png",
				powerSwitch: "",
				productKey: "",
				DeviceName: "",
				DeviceSecret: "",
				timestamp: new Date().getTime(),
				client: "",
				device:{},
				charts: '',
				deviceList: this.$store.state.deviceList,
				filterName: "C2滤芯寿命",
				filterLifetime: "0",
				waterLog: "", //取水
				isInterval: true,
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
				if(value == 1) {
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
						document.title = this.device.deviceNickName== this.device.deviceName? this.device.productName:this.device.deviceNickName
						this.$cookies.set('firmwareVersion', this.device.firmwareVersion);
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
								filterName: "PP滤芯寿命",
								filterLifetime: this.deviceMsg.filterPP.value,
							},
							{
								filterName: "滤芯寿命",
								filterLifetime: this.deviceMsg.filterC1.value,
							},
							{
								filterName: "C2滤芯寿命",
								filterLifetime: this.deviceMsg.filterC2.value,
							}
						]
						if(this.device.productKey == "a1i8kpwPW9w") {
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
						result.sort(function(a, b) {
							return a.filterLifetime - b.filterLifetime
						});
						this.filterName = result[0].filterName;
						this.filterLifetime = result[0].filterLifetime
						if(this.deviceMsg.powerBtn.value == 1) {
							this.powerImg = "../../../../static/image/btn_power_sel.png";
						}
						if(this.deviceMsg.heating.value == 1) {
							this.heatImg = "../../../../static/image/btn_heating_sel.png";
						}
						if(this.deviceMsg.refrigeration.value == 1) {
							this.refrigerImg = "../../../../static/image/btn_refrigeration_sel.png";
						}
						if(this.deviceMsg.sterilizBtn.value == 1) {
							this.sterilizImg = "../../../../static/image/btn_UV_sel.png";
						}
						this.powerSwitch = this.deviceMsg.powerBtn.value;
						this.$forceUpdate();
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
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
			refrigerBtn() {
				let that = this;
				if(that.deviceMsg.refrigeration.value == 1) {
					this.$toast("设备正在制冷中。。。");
					return false;
				}
				const deviceMsg = {
					"refrigerBtn": 1
				}
				const para = {
					productKey: this.device.productKey,
					deviceName: this.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "refrigerBtn");
			},
			sterilizBtn() {
				let that = this;
				if(that.deviceMsg.sterilizBtn.value == 1) {
					this.$toast("设备正在杀菌中。。。");
					return false;
				}
				const deviceMsg = {
					"sterilizBtn": 1
				}
				const para = {
					productKey: this.device.productKey,
					deviceName: this.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "sterilizBtn");
			},
			heatBtn() {
				let that = this;
				//				if(that.deviceMsg.heating.value == 1) {
				//					this.$toast("设备正在加热中。。。");
				//					return false;
				//				}
				const deviceMsg = {
					"heatBtn": 1
				}
				const para = {
					productKey: this.device.productKey,
					deviceName: this.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				that.setDeviceProperty(para, "heatBtn");
			},
			setDeviceProperty(e, name) {
				let that = this;
				that.$Axios.post('common/setDeviceProperty', e).then((res) => {
					if(res.data.success) {
						if(name != "intervalBtn") {
							that.$toast.loading({
								mask: true,
								message: '设置中...'
							});
						}
						switch(name) {
							case "powerBtn":
								if(JSON.parse(e.message).powerBtn == 0) {
									that.powerImg = "../../../../static/image/btn_power_nor.png";
									that.powerSwitch = 0;
								} else {
									that.powerImg = "../../../../static/image/btn_power_sel.png";
									that.powerSwitch = 1;
								}
								break;
							case "heatBtn":
								that.heatImg = "../../../../static/image/btn_heating_sel.png";
								break;
							case "refrigerBtn":
								that.refrigerImg = "../../../../static/image/btn_refrigeration_sel.png";
								break;
							case "sterilizBtn":
								that.sterilizImg = "../../../../static/image/btn_UV_sel.png";
								break;
							default:
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
	.commercialDevice {
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
				width: 2rem;
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
		.deviceStatus {
			background: white;
			ul {
				width: 2.4rem;
				margin: 0 auto;
				height: 0.4rem;
				li {
					float: left;
					width: 0.6rem;
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
				}
			}
		}
		.tab {
			background: white;
			padding: 0.1rem 0rem;
		}
		.waterMsg {
			height: 1.8rem;
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
				.isDanger {
					color: #ff6a00;
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
		.tabbar {
			position: fixed;
			left: 0px;
			bottom: 0rem;
			height: 0.82rem;
			width: 100%;
			background: white;
			z-index: 10000;
			ul {
				margin: 0 2%;
				.tabbar_li {
					float: left;
					width: 20%;
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
		}
		.oprateList {
			width: 100%;
			height: 1.9rem;
			background: white;
			.oprateWay {
				float: left;
				width: 25%;
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
		.bottomTab {
			position: fixed;
			left: 0px;
			bottom: 0rem;
			width: 100%;
			z-index: 999;
			.device_hint {
				width: 100%;
				background: white;
				border-bottom: 1px solid #eee;
			}
			.more {
				width: 100%;
				height: 0.5rem;
				bottom: 0.4rem;
				img {
					float: right;
					width: 0.48rem;
					margin: 0.01rem 0.1rem;
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