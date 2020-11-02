<template>
	<div>
		<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
			<div class="cuf">
				<div class="searchIcon">
					<div class="saveWater" @click="set(1)">
						<img src="../../../../static/image/icon_bottle.png" class="bottle" />
						<p class="bottleTitle">已节约(个)</p>
						<p class="bottleNumber">{{(deviceMsg.waterVolTotal.value/500).toFixed(0)}}
							<van-icon name="arrow" />
						</p>
					</div>
					<img v-if="bindType!=2"  src="../../../../static/image/icon_qrcode.png" class="qrcodeIcon" @click="set(2)" />
				</div>
				<div class="flow">
					<div class="annulus ppValue">
						<p class="waterNum" :class="{isDanger:deviceMsg.filterPP.value<11}">{{deviceMsg.filterPP.value}}<span>%</span></p>
						<p class="water_title">PP值</p>
						<van-circle v-model="currentRate" :rate="deviceMsg.filterPP.value" size="100" :stroke-width="50" color="#00B5E2 " layer-color="none" :speed="10" class="mains" />
					</div>
					<div class="annulus UFValue">
						<p class="waterNum" :class="{isDanger:deviceMsg.filterC1.value<11}">{{deviceMsg.filterC1.value}}<span>%</span></p>
						<p class="water_title">C1值</p>
						<van-circle v-model="currentRate" :rate="deviceMsg.filterC1.value" size="100" :stroke-width="50" color="#00B5E2 " layer-color="none" :speed="10" class="mains" />
					</div>
					<div class="annulus C1Value">
						<p class="waterNum" :class="{isDanger:deviceMsg.filterUF.value<11}">{{deviceMsg.filterUF.value}}<span>%</span></p>
						<p class="water_title">UF值</p>
						<van-circle v-model="currentRate" :rate="deviceMsg.filterUF.value" size="100" :stroke-width="50" color="#00B5E2 " layer-color="none" :speed="10" class="mains" />
					</div>
				</div>
				 <Myecharts :device="device" idName="cufOneChart"  ref="init" :IsshowTab="false" :waterVolTotal="deviceMsg.waterVolTotal.value"></Myecharts>
				<div style="width:100%;height:1rem;"></div>
				<div class="device_hint" v-show="isnormal==2" @click='checkFault'>
					<van-notice-bar :scrollable="false" background="#fff" mode="link">
						检测到设备出现故障，请排查故障或联系客服
					</van-notice-bar>
				</div>
				<div :class="isnormal==2? 'moreOne' : 'moreTwo' " class="more">
				<img src="../../../../static/image/icon_blue_more.png" @click="goMore" />
			</div>
			</div>
		</v-touch>
		<van-dialog v-model="phoneShow" show-cancel-button :before-close="beforeClose" confirm-button-text="拨打">
			<p class="content">客户热线 <span style="color:#1E9FFF;">400-788-7171</span></p>
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
				more: false,
				currentRate:0,
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
				deviceList: this.$store.state.deviceList,
				isInterval: true,
				isHint: true,
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
						this.$cookies.set('firmwareVersion', this.device.firmwareVersion);
						this.$store.commit("changeNewDevice", this.deviceMsg);
						this.isnormal = this.device.status == "offline" ? 0 : 1;
						if(this.isHint) {
							this.$nextTick(
								function() {
									this.$refs.init.getWaterLog(1);
								}
							)
							this.isHint = false;
						}
						if(this.device.deviceFault) {
							this.isnormal = 2;
						}
						if(this.isnormal == 1 && this.isInterval) {
							this.intervalBtn();
						}					
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
	.cuf {
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
			height: 2.6rem;
			overflow: hidden;
			.annulus {
				width: 1.1rem;
				height: 1.1rem;
				position: relative;
				border-radius: 50%;
				background: #FFFFFF;
				box-shadow: 0 0.15rem 0.45rem 0 rgba(0, 181, 226, 0.10);
				overflow: hidden;
				.waterNum {
					position: absolute;
					top: 0.25rem;
					width:1.1rem;
					font-size: 0.34rem;
					color: #333;
					font-weight: lighter;
					letter-spacing: 0;
					text-align: center;					
					span {
						font-size: 0.14rem;
						color: #666666;
					}
				}
				.isDanger{
					color:#ff6a00;
				}
				.water_title {
					position: absolute;
					top: 0.7rem;
					width:1.1rem;
					opacity: 0.7;
					font-size: 0.12rem;
					color: #999;
					letter-spacing: 0;
					text-align: center;
				}
				.mains {
					position: absolute;
					top: 0px;
					left: 0px;
					width: 100%;
					height: 100%;
				}		
			}
			.ppValue {
				margin: 0.1rem auto;
			}
			.UFValue {
				margin-left: 0.25rem;
			}
			.C1Value {
				float: right;
				margin: -1.1rem 0.25rem 0 0;
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
		.moreOne{
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