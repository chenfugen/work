<template>
	<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
		<div class="commercialDevice" :class="{'normal':isnormal==1,'fault':isnormal==2,'offline':isnormal==0}">
			<div class="searchIcon">
				<img v-if="deviceMsg.imei" src="../../../../static/image/icon_2g@2x.png" onclick="return false" class="wifiIcon" />
				<img v-else src="../../../../static/image/icon_wifi@2x.png" onclick="return false" class="wifiIcon" />
				<img src="../../../../static/image/icon_qrcode@2x.png" class="qrcodeIcon" @click="set(8)" />
			</div>
			<div v-if='device.productKey == "a1C6AilwYUc" || device.productKey == "a1EUR5GZocU"'>
				<p class="waterNum">{{deviceMsg.tdsOut.value}}</p>
			    <p class="water_title">出水TDS(ppm)</p>
			</div>
			<div v-else>
				<p class="waterNum">{{deviceMsg.tocOut.value}}</p>
			   <p class="water_title">出水TOC(ppm)</p>
			</div>
			<ul class="waterMsg" :class="{'normalBg':isnormal==1,'faultBg':isnormal==2,'offlineBg':isnormal==0}">
				<li>
					<p class="waterValue">{{deviceMsg.hotWaterTemp.value}}</p>
					<p class="waterSet">热水(℃)</p>
				</li>
				<li>
					<p class="waterValue">{{deviceMsg.saveBottleNumber.value}}</p>
					<p class="waterSet">节约塑料瓶</p>
				</li>
				<li v-if='device.productKey == "a1C6AilwYUc" || device.productKey == "a1EUR5GZocU"'>
					<p class="waterValue">{{deviceMsg.tdsIn.value}}</p>
					<p class="waterSet">源水TDS(ppm)</p>
				</li>
				<li v-else>
					<p class="waterValue">{{deviceMsg.tocIn.value}}</p>
					<p class="waterSet">源水TOC(ppm)</p>
				</li>
				<li @click="searchFilter(device.productKey)">
					<p class="waterValue">{{filterLifetime}}
						<van-icon class="link" name="arrow" />
					</p>
					<p class="waterSet">{{filterName}}(%)</p>
				</li>
				<li>
					<p class="waterValue" v-if="deviceMsg.heating.value==0"><img src="../../../../static/image/icon_heating_dis.png" onclick="return false" /></p>
					<p class="waterValue" v-else><img src="../../../../static/image/icon_heating.png" onclick="return false" /></p>
					<p class="waterSet">加热</p>
				</li>
				<li>
					<p class="waterValue" v-if="deviceMsg.heating.value==1"><img src="../../../../static/image/icon_energysaving_dis.png" onclick="return false" /></p>
					<p class="waterValue" v-else><img src="../../../../static/image/btn_refrigeration_dis.png" onclick="return false" /></p>
					<p class="waterSet">节能</p>
				</li>
				<li>
					<p class="waterValue" v-if="deviceMsg.childLock.value==0"><img src="../../../../static/image/icon_child lock_dis.png" onclick="return false" /></p>
					<p class="waterValue" v-else><img src="../../../../static/image/icon_child lock.png" onclick="return false" /></p>
					<p class="waterSet">童锁</p>
				</li>
				<li>
					<p class="waterValue" v-if="deviceMsg.sterilizBtn.value==0"><img src="../../../../static/image/icon_uv_dis.png" onclick="return false" /></p>
					<p class="waterValue" v-else><img src="../../../../static/image/icon_uv.png" onclick="return false" /></p>
					<p class="waterSet">杀菌</p>
				</li>
			</ul>
            <Myecharts :device="device" idName="commercialOne" ref="init"></Myecharts>
			<div style="width:100%;height:0.8rem;"></div>
			<div class="bottomTab">
				<div class="more" @click="goMore">
					<img src="../../../../static/image/icon_more.png" />
				</div>
				<div class="device_hint" v-show="isnormal==2" @click='checkFault'>
					<van-notice-bar :scrollable="false" background="#fff" mode="link">
						检测到设备出现故障，请及时排查或联系客服
					</van-notice-bar>
				</div>
			</div>
			<!--<div class="tabbar">
				<ul>
					<li class="tabbar_li" @click="powerBtn">
						<p class="tabbar_img"><img :src="powerImg" /></p>
						<p class="tabbar_text">电源</p>
					</li>
					<li class="tabbar_li" @click="heatBtn">
						<p class="tabbar_img"><img :src="heatImg" /></p>
						<p class="tabbar_text">加热</p>
					</li>
					<li class="tabbar_li" @click="refrigerBtn">
						<p class="tabbar_img"><img :src="refrigerImg" /></p>
						<p class="tabbar_text">制冷</p>
					</li>
					<li class="tabbar_li" @click="sterilizBtn">
						<p class="tabbar_img"><img :src="sterilizImg" /></p>
						<p class="tabbar_text">杀菌</p>
					</li>
					<li class="tabbar_li" @click="goMore">
						<p class="tabbar_img"><img src="../../../../static/image/icon_more@2x.png" /></p>
						<p class="tabbar_text">更多</p>
					</li>
				</ul>
			</div>-->
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
					<li class="oprateWay" @click="set(3)">
						<p class="oprateImg"><img src="../../../../static/image/icon_Timemanagement.png" /></p>
						<p class="oprateName">定时管理</p>
					</li>
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
					<li class="oprateWay"  @click="set(7)">
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
	export default {
		data() {
			return {
				msg: 'Welcome to Your Vue.js App',
				more: false,
				isnormal: 1, //0:离线，1：正常，2：故障
				phoneShow: false,
				isActive: true,
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
				filterName: "滤芯寿命",
				filterLifetime: "0",
				waterLog: "",
				showChart: true,
				isHint: true,
				isInterval: true
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
						document.title = this.device.deviceNickName== this.device.deviceName? this.device.productName:this.device.deviceNickName;
						if(this.isHint) {
							this.$nextTick(
								function() {
									this.$refs.init.getWaterLog(1);
								}
							)
							this.isHint = false;
						}
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
								filterName: "C1滤芯寿命",
								filterLifetime: this.deviceMsg.filterC1.value,
							},
							{
								filterName: "滤芯寿命",
								filterLifetime: this.deviceMsg.filterC2.value,
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
						urlName = "/commercialsetTime?deviceId=" + this.$route.params.id;
						break;
					case 4:
						urlName = "/commercialSet?deviceId=" + this.$route.params.id;
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
						location.href="https://wx.canature.com/crm2prod/api/weixinsso/authorize?homeurl=/serveHome/intelligence/"+this.$cookies.get("openId")+"/"+this.device.sncode;
						break;
					case 8:
						if(this.$route.params.bindType == 2) {
							this.$toast("您是该设备分享用户，无法分享")
							return false;
						}
						urlName = "/qrcode?deviceId=" + this.$route.params.id;
						break;
					default:
						break;
				}
				if(e != 5 || e != 7) {
					this.$router.push(urlName);
				}
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
		.waterNum {
			margin-top: 0.1rem;
			font-size: 0.5rem;
			color: #FFFFFF;
			font-weight: lighter;
			text-align: center;
			line-height: 0.55rem;
		}
		.water_title {
			opacity: 0.7;
			font-size: 0.14rem;
			color: #FFFFFF;
			letter-spacing: 0;
			text-align: center;
			line-height: 0.28rem;
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
			li {
				float: left;
				width: 25%;
				height: 0.8rem;
				text-align: center;
				.waterValue {
					font-size: 0.24rem;
					color: #FFFFFF;
					letter-spacing: 0;
					line-height: 0.24rem;
					margin-top: 0.25rem;
					overflow: hidden;
					font-weight: lighter;
					img {
						width: 0.21rem;
					}
				}
				.waterSet {
					opacity: 0.5;
					font-size: 0.1rem;
					color: #FFFFFF;
					letter-spacing: 0;
					line-height: 0.24rem;
				}
				.link {
					font-size: 0.2rem;
					color: #fff;
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
			z-index:999;
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