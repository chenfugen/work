<template>
	<div>
		<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
			<div class="deviceDetail" :class="{'normal':isnormal==1,'fault':isnormal==2,'offline':isnormal==0}">
				<div class="searchIcon">
					<img src="../../../../static/image/icon_wifi@2x.png" class="wifiIcon" onclick="return false" />
					<img src="../../../../static/image/icon_qrcode@2x.png" class="qrcodeIcon" @click="set(7)" />
				</div>
				<p class="waterNum">{{deviceMsg.regenRemain.value*10}}</p>
				<p class="water_title">可使用水量(L)</p>
				<ul class="waterMsg" :class="{'normalBg':isnormal==1,'faultBg':isnormal==2,'offlineBg':isnormal==0}">
					<li>
						<p class="waterValue">{{deviceMsg.waterVelocity.value/100}}</p>
						<p class="waterSet">当前流速(m³/h)</p>
					</li>
					<li>
						<p class="waterValue">{{deviceMsg.maxVelocityPeriodic.value/100}}</p>
						<p class="waterSet">最大流量(m³/h)</p>
					</li>
					<li>
						<p class="waterValue">{{deviceMsg.waterVolPeriodic.value*10}}</p>
						<p class="waterSet">周期已用水量(L)</p>
					</li>
					<li v-if="device.productKey=='a1EnF8F09Au'">
						<p class="waterValue" v-if="deviceMsg.regenStartTime.value.minute>=10">{{deviceMsg.regenStartTime.value.hour+":"+deviceMsg.regenStartTime.value.minute}}</p>
						<p class="waterValue" v-if="deviceMsg.regenStartTime.value.minute<10">{{deviceMsg.regenStartTime.value.hour+":0"+deviceMsg.regenStartTime.value.minute}}</p>
						<p class="waterSet">再生启动时间</p>
					</li>
					<li v-else>
						<p class="waterValue" v-if="deviceMsg.rinseStartTime.value.minute>=10">{{deviceMsg.rinseStartTime.value.hour+":"+deviceMsg.regenStartTime.value.minute}}</p>
						<p class="waterValue" v-if="deviceMsg.rinseStartTime.value.minute<10">{{deviceMsg.rinseStartTime.value.hour+":0"+deviceMsg.regenStartTime.value.minute}}</p>
						<p class="waterSet">冲洗启动时间</p>
					</li>
					<li v-if="device.productKey=='a1EnF8F09Au'">
						<p class="waterValue">{{deviceMsg.regenStartInterval.value}}</p>
						<p class="waterSet">再生间隔(天)</p>
					</li>
					<li v-else>
						<p class="waterValue">{{deviceMsg.rinseStartInterval.value}}</p>
						<p class="waterSet">冲洗间隔(天)</p>
					</li>
					<!--<li v-if="device.productKey!='a1EnF8F09Au' && deviceMsg.material2.value.remain<=deviceMsg.material1.value.remain" @click="searchFilter(device.productKey)">
						<p class="waterValue">{{deviceMsg.material2.value.remain}}
							<van-icon class="link" name="arrow" />
						</p>
						<p class="waterSet">耗材2寿命(%)</p>
					</li>
					<li v-if="device.productKey!='a1EnF8F09Au' && deviceMsg.material2.value.remain>deviceMsg.material1.value.remain" @click="searchFilter(device.productKey)">
						<p class="waterValue">{{deviceMsg.material1.value.remain}}
							<van-icon class="link" name="arrow" />
						</p>
						<p class="waterSet">耗材1寿命(%)</p>
					</li>-->
				</ul>
				<Myecharts :device="device" idName="chart" ref="init"></Myecharts>
				<div style="width:100%;height:1rem;"></div>
				<div class="device_hint" v-show="isnormal==2" @click='checkFault'>
					<van-notice-bar :scrollable="false" background="#fff" mode="link">
						检测到设备出现故障，请及时排查或联系客服
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
				<van-popup v-model="more" position="bottom">
					<ul class="oprateList">
						<li class="oprateWay" @click="set(1)">
							<p class="oprateImg"><img src="../../../../static/image/icon_device info@3x.png" /></p>
							<p class="oprateName">设备信息</p>
						</li>
						<li class="oprateWay" @click="set(2)">
							<p class="oprateImg"><img src="../../../../static/image/icon_setting@3x.png" /></p>
							<p class="oprateName">参数设置</p>
						</li>
						<li class="oprateWay" @click="set(3)">
							<p class="oprateImg"><img src="../../../../static/image/icon_share manage@3x.png" /></p>
							<p class="oprateName">分享管理</p>
						</li>
						<li class="oprateWay" @click="set(4)">
							<p class="oprateImg"><img src="../../../../static/image/icon_device unbundling@3x.png" /></p>
							<p class="oprateName">设备解绑</p>
						</li>
						<li class="oprateWay" @click="set(5)">
							<p class="oprateImg"><img src="../../../../static/image/icon_product description@3x.png" /></p>
							<p class="oprateName">产品说明</p>
						</li>
						<li class="oprateWay" @click="set(6)">
							<p class="oprateImg"><img src="../../../../static/image/icon_f&q@3x.png" /></p>
							<p class="oprateName">自主报修</p>
						</li>
					</ul>
					<p @click="clear" class="clear">取消</p>
				</van-popup>
			</div>
		</v-touch>
		<van-dialog v-model="phoneShow" show-cancel-button :before-close="beforeClose" confirm-button-text="拨打">
			<p class="conter">客户热线 <span style="color:#1E9FFF;">400-8201199</span></p>
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
				isnormal: 1,
				phoneShow: false,
				isActive: true,
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
				showChart: true,
				isHint: true,
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
						document.title = this.device.deviceNickName== this.device.deviceName? this.device.productName:this.device.deviceNickName;
						this.deviceMsg = res.data.data.property;
						if(this.isHint) {
							this.$nextTick(
								function() {
									this.$refs.init.getWaterLog(1);
								}
							)
							this.isHint = false;
						}
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
						this.washText = this.device.productKey == "a1EnF8F09Au" ? "强制再生" : "强制冲洗";
						this.makeWashText = this.device.productKey == "a1EnF8F09Au" ? "预约再生" : "预约冲洗";
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
				if(that.device.productKey == "a1EnF8F09Au") {
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
				if(that.device.productKey == "a1EnF8F09Au") {
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
						urlName = "/newDeviceSet?deviceId=" + this.$route.params.id;
						break;
					case 3:
						if(this.$route.params.bindType == 2) {
							this.$toast("您是该设备分享用户，无法分享")
							return false;
						}
						urlName = "/share??deviceId=" + this.$route.params.id + "&bindType=" + this.$route.params.bindType;
						break;
					case 4:
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
					case 5:
						urlName = "/productState?productKey=" + this.device.productKey;
						break;
					case 6:
						location.href = "https://wx.canature.com/crm2prod/api/weixinsso/authorize?homeurl=/serveHome/intelligence/" + this.$cookies.get("openId") + "/" + this.device.sncode;
						break;
					case 7:
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
				if(e != 4 || e != 6) {
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
				width: 33%;
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
				}
				.waterSet {
					opacity: 0.5;
					font-size: 0.12rem;
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
		.device_hint {
			position: fixed;
			left: 0px;
			bottom: 0.82rem;
			width: 100%;
			background: white;
			z-index: 999;
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
	}
	
	.conter {
		padding: 40px 0px;
		text-align: center;
		color: #bbb;
	}
</style>