<template>
	<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
		<div class="separateDevice" :class="{'normal':isnormal==1,'fault':isnormal==2,'offline':isnormal==0}">
			<div class="searchIcon">
				<img src="../../../../static/image/icon_wifi@2x.png" class="wifiIcon" onclick="return false" />
				<img src="../../../../static/image/icon_share.png" class="qrcodeIcon" @click="set(8)" />
			</div>
			<div>
				<ul class="tdsContent" @click="viewPage('serve')">
					<img :src="tdsInImg" class="tdsInImg" />
					<img :src="tdsOutImg" class="tdsOutImg" />
					<li class="purifierWater">
						<p class="waterNum"><span>&nbsp;{{deviceMsg.tdsOut.value}}</span><span v-if="deviceMsg.tdsOut.value>10 && deviceMsg.tdsOut.value<120" class="status"> 优</span>
							<span v-else  class="status"> 良</span></p>
						<p class="water_title">净水TDS</p>
					</li>
					<li class="sourceWater">
						<p class="waterNum"><span>&nbsp;{{deviceMsg.tdsIn.value}}</span><span v-if="deviceMsg.tdsIn.value>10 && deviceMsg.tdsIn.value<120" class="status"> 优</span>
						<span v-else class="status"> 良</span></p>
						<p class="water_title">源水TDS</p>
					</li>
				</ul>
			</div>
			<div class="waterMsg" :class="{'normalBg':isnormal==1,'faultBg':isnormal==2,'offlineBg':isnormal==0}">
				<ul class="waterSets">
					<li @click="viewPage('serve')">
						<div class="deviceMsg">
							<img src="../../../../static/image/icon_bottle.png" />
							<div class="deviceSet">
								<p class="waterValue">{{deviceMsg.saveBottleNumber.value}}<span class="unit">
									个
								</span></p>
								<p class="waterSet">节约塑料瓶</p>
								<p class="waterSet">（直饮水）</p>
							</div>
						</div>
						<div class="action"></div>
					</li>
					<li @click="viewPage('temp')">
						<div class="deviceMsg">
							<img src="../../../../static/image/icon_water temperature.png" />
							<div class="deviceSet">
								<p class="waterValue">{{deviceMsg.waterInTemp.value}}<span class="unit">
								°
								</span></p>
								<p class="waterSet">水温</p>
							</div>
						</div>
						<div class="cutOff"></div>
						<div class="action"></div>
					</li>
					<li @click="viewPage('filter')">
						<div class="deviceMsg">
							<img src="../../../../static/image/icon_filter element.png" />
							<div class="deviceSet">
								<p class="waterValue">{{filterLifetime}}<span class="unit">
								%
								</span></p>
								<p class="waterSet">{{filterName}}</p>
							</div>
						</div>
						<div class="cutOff"></div>
						<div class="action"></div>
					</li>
				</ul>
				<Myecharts :device="device" idName="newSeparaterOneChart" :isBg="false" ref="init"></Myecharts>
			</div>
			<div style="width:100%;height:2rem;"></div>
			<Mores v-if="isnormal==2" className="moreTools" @click.native="goMore"></Mores>
			<Mores v-else className="moreTool" @click.native="goMore"></Mores>
			<div class="bottomTab">
				<div class="device_hint" v-show="isnormal==2" @click='checkFault'>
					<van-notice-bar :scrollable="false" background="#fff" mode="link">
						检测到设备出现故障，请及时排查或联系客服
					</van-notice-bar>
				</div>
			</div>
			<van-popup v-model="more" position="bottom">
				<ul class="oprateList">
					<li class="oprateWay" @click="set(1)">
						<p class="oprateImg"><img src="../../../../static/image/icon_device info@3x.png" /></p>
						<p class="oprateName">设备信息</p>
					</li>
					<li class="oprateWay" @click="set(2)">
						<p class="oprateImg"><img src="../../../../static/image/icon_share manage@3x.png" /></p>
						<p class="oprateName">分享管理</p>
					</li>
					<!--<li class="oprateWay" @click="set(3)">
						<p class="oprateImg"><img src="../../../../static/image/icon_Timemanagement.png" /></p>
						<p class="oprateName">定时管理</p>
					</li>-->
					<li class="oprateWay" @click="set(4)">
						<p class="oprateImg"><img src="../../../../static/image/icon_setting@3x.png" /></p>
						<p class="oprateName">其他设置</p>
					</li>
					<li class="oprateWay" @click="set(5)">
						<p class="oprateImg"><img src="../../../../static/image/icon_device unbundling@3x.png" /></p>
						<p class="oprateName">设备解绑</p>
					</li>
					<li class="oprateWay" @click="set(6)">
						<p class="oprateImg"><img src="../../../../static/image/icon_product description@3x.png" /></p>
						<p class="oprateName">产品说明</p>
					</li>
					<li class="oprateWay" @click="set(7)">
						<p class="oprateImg"><img src="../../../../static/image/icon_f&q@3x.png" /></p>
						<p class="oprateName">自主报修</p>
					</li>
				</ul>
				<p @click="clear" class="clear">取消</p>
			</van-popup>
			<van-dialog v-model="phoneShow" show-cancel-button :before-close="beforeClose" confirm-button-text="拨打">
				<p class="content">客户热线 <span style="color:#1E9FFF;">400-8201199</span></p>
			</van-dialog>
		</div>
	</v-touch>
</template>

<script>
	import * as func from '../../../../static/js/func'
	import Myecharts from '../../../components/echarts'
	import Mores from '../../../components/more'
	export default {
		data() {
			return {
				msg: 'Welcome to Your Vue.js App',
				more: false,
				isnormal: "", //0:离线，1：正常，2：故障
				phoneShow: false,
				isActive: true,
				deviceMsg: this.$store.state.device_commercialMsg,
				powerSwitch: "",
				productKey: "",
				DeviceName: "",
				DeviceSecret: "",
				client: "",
				device: {},
				deviceList: this.$store.state.deviceList,
				waterLog: "",
				showChart: true,
				isHint: true,
				filterName: "滤芯寿命",
				filterLifetime: "0",
				tdsOutImg: "../../../../static/image/out0.png",
				tdsInImg: "../../../../static/image/in0.png",
				isInterval: true,
			}
		},
		components: {
			Myecharts,
			Mores
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
						if(this.isHint) {
							this.$nextTick(
								function() {
									this.$refs.init.getWaterLog(1);
								}
							)
							this.isHint = false;
						}
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
						if(this.device.filterType == "RO") {
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
						this.$forceUpdate();
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
				this.more = !this.more;
			},
			clear() {
				this.more = !this.more;
			},
			unbind(e) {
				this.$Axios.post('wechat/device/unbindDevice', e).then((res) => {
					if(res.data.success) {
						this.$toast("解绑成功!")
						this.$router.push("/device");
					} else {
						this.$toast(res.data.message);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			set(e) {
				let urlName;
				switch(e) {
					case 1:
						urlName = "/deviceInfo?deviceId=" + this.$route.params.id + "&bindType=" + this.$route.params.bindType;
						break;
					case 2:
						if(this.$route.params.bindType == 2) {
							this.$toast("您是该设备分享用户，无法分享")
							return false;
						}
						urlName = "/share??deviceId=" + this.$route.params.id + "&bindType=" + this.$route.params.bindType;
						break;
					case 3:
						urlName = "/timingManage?deviceId=" + this.$route.params.id;
						break;
					case 4:
						urlName = "/separateWaterSet?deviceId=" + this.$route.params.id;
						break;
					case 5:
						this.$dialog.confirm({
							message: '您确定要解绑该设备吗？',
							confirmButtonText: "解绑"
						}).then(() => {
							const deviceMsg = {
								productKey: this.device.productKey,
								deviceName: this.device.deviceName,
								bindStatus: this.$route.params.bindType,
							}
							this.unbind(deviceMsg);
						}).catch(() => {
							//on cancel
						});
						break;
					case 6:
						urlName = "/productState?productKey=" + this.device.productKey;
						break;
					case 7:
						location.href = "https://wx.canature.com/crm2prod/api/weixinsso/authorize?homeurl=/serveHome/intelligence/" + this.$cookies.get("openId") + "/" + this.device.sncode;
						break;
					case 8:
						if(this.$route.params.bindType == 2) {
							this.$toast("您是该设备分享用户，无法分享")
							return false;
						}
						urlName = "/qrcode?deviceId=" + this.$route.params.id;
						this.$router.push(urlName);
						break;
					default:
						break;
				}
				if(e != 5 || e != 7) {
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
	.normal {
		background: -webkit-linear-gradient(top, #267CFB, #30B3FC);
		/* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(bottom, #267CFB, #30B3FC);
		/* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(bottom, #267CFB, #30B3FC);
		/* Firefox 3.6 - 15 */
		background: linear-gradient(to bottom, #267CFB, #30B3FC);
	}

	.fault {
		background: -webkit-linear-gradient(top, #F83122, #FF8626);
		/* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(bottom, #F83122, #FF8626);
		/* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(bottom, #F83122, #FF8626);
		/* Firefox 3.6 - 15 */
		background: linear-gradient(to bottom, #F83122, #FFAD29);
	}

	.offline {
		background: -webkit-linear-gradient(top, #7B8697, #CCD6DB);
		/* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(bottom, #7B8697, #CCD6DB);
		/* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(bottom, #7B8697, #CCD6DB);
		/* Firefox 3.6 - 15 */
		background: linear-gradient(to bottom, #7B8697, #CCD6DB);
	}

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
			margin-top: 0.1rem;
			.wifiIcon {
				width: 0.36rem;
				float: left;
				margin-left: 0.1rem;
			}
			.qrcodeIcon {
				float: right;
				width: 0.36rem;
				margin-right: 0.1rem;
			}
		}
		.tdsContent {
			position: relative;
			margin: 0 auto;
			width: 1.9rem;
			height: 1.9rem;
			overflow: hidden;
			.tdsOutImg {
				position: absolute;
				top: 10%;
				left: 10%;
				width: 80%;
				height: 80%;
			}
			.tdsInImg {
				position: absolute;
				top: 0px;
				left: 0px;
				width: 100%;
				height: 100%;
			}
			.purifierWater {
				width: 60%;
				margin: 0.25rem auto 0.1rem auto;
				border-bottom: 1px solid #ccc;
				.waterNum {
					font-size: 0.4rem;
					color: #FFFFFF;
					font-weight: lighter;
					text-align: center;
					.status {
						display: inline;
						font-size: 0.12rem;
						color: #FFFFFF;
					}
					.bad {
						color: #FF4444;
					}
				}
				.water_title {
					opacity: 0.7;
					font-size: 0.12rem;
					color: #FFFFFF;
					letter-spacing: 0;
					text-align: center;
					line-height: 0.24rem;
				}
			}
			.sourceWater {
				.waterNum {
					font-size: 0.22rem;
					color: #FFFFFF;
					font-weight: lighter;
					text-align: center;
					.status {
						display: inline;
						font-size: 0.1rem;
						color: #FFFFFF;
					}
					.bad {
						color: #F56723;
					}
				}
				.water_title {
					opacity: 0.7;
					font-size: 0.12rem;
					color: #FFFFFF;
					letter-spacing: 0;
					text-align: center;
					line-height: 0.24rem;
				}
			}
		}
		.normalBg {
			background: url(../../../../static/image/bg_bule@2x.png) no-repeat;
			background-size: 100% 100%;
		}
		.faultBg {
			background: url(../../../../static/image/bg_orange@2x.png) no-repeat;
			background-size: 100% 100%;
		}
		.offlineBg {
			background: url(../../../../static/image/bg_gray.png) no-repeat;
			background-size: 100% 100%;
		}
		.waterMsg {
			height: 1.8rem;
			padding-top: 0.15rem;
			.waterSets {
				margin: 0.2rem 0.1rem 0.1rem 0.1rem;
				padding: 0.1rem 0rem;
				height: 0.4rem;
				border-radius: 0.08rem;
				background: white;
				li {
					float: left;
					width: 33%;
					height: 0.55rem;
					text-align: center;
					overflow: hidden;
					position:relative;
					.deviceMsg {
						vertical-align: top;
						display: inline-block;
						height: 100%;
						img {
							float: left;
							width: 0.26rem;
							height: 0.26rem;
							margin-top: 0.05rem;
						}
						.deviceSet {
							float: left;
							.waterValue {
								text-align: left;
								font-size: 0.16rem;
								color: #267CFB;
								letter-spacing: 0;
								.unit {
									font-size: 0.1rem;
								}
							}
							.waterSet {
								opacity: 0.5;
								font-size: 0.1rem;
								color: #999;
								letter-spacing: 0;
								line-height: 0.12rem;
								text-align: left;
							}
						}
					}
					.cutOff {
						position:absolute;
						left: 0px;
						top: 0.1rem;
						width: 1px;
						background: #ddd;
						height: 0.2rem;
					}
					.action{
						position:absolute;
						right: 0px;
						bottom:10px;
						width: 0;
					    height: 0;
					    border-bottom: 0.05rem solid #ddd;
					    border-left: 0.05rem solid transparent;
					}
				}
			}
		}
		.oprateList {
			width: 100%;
			height: 1.9rem;
			background: white;
			overflow: hidden;
			.oprateWay {
				float: left;
				width: 25%;
				height: 0.85rem;
				text-align: center;
				overflow: hidden;
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
		.clear {
			border-top: 1px solid #eee;
			text-align: center;
			font-size: 0.16rem;
			color: #333333;
			font-weight: 600;
			letter-spacing: 0;
			line-height: 0.32rem;
		}
		.content {
			padding: 40px 0px;
			text-align: center;
			color: #bbb;
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
	}
</style>
