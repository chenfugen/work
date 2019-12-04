<template>
	<div>
		<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
			<div class="deviceDetail" :class="{'normal':isnormal==1,'fault':isnormal==2,'offline':isnormal==0}">
				<div class="searchIcon">
					<img src="../../../../static/image/icon_wifi@2x.png" class="wifiIcon" />
					<img src="../../../../static/image/icon_qrcode@2x.png" class="qrcodeIcon" @click="set(7)" />
				</div>
				<p class="waterNum">{{(deviceMsg.flowTotal.value-deviceMsg.flowTotalPeriod.value).toFixed(2)}}</p>
				<p class="water_title">可使用水量(L)</p>
				<ul class="waterMsg" :class="{'normalBg':isnormal==1,'faultBg':isnormal==2,'offlineBg':isnormal==0}">
					<li>
						<p class="waterValue">{{deviceMsg.flowRate.value}}</p>
						<p class="waterSet">当前流速(L/H)</p>
					</li>
					<li>
						<p class="waterValue">{{deviceMsg.peakFlowCycle.value}}</p>
						<p class="waterSet">最大流量(L/M)</p>
					</li>
					<li>
						<p class="waterValue">{{deviceMsg.flowTotalPeriod.value}}</p>
						<p class="waterSet">周期已用水量(m³)</p>
					</li>
					<li>
						<p class="waterValue">{{deviceMsg.regenEn.value[0]==1?"on":"off"}}</p>
						<p class="waterSet">冲洗启动</p>
					</li>
					<li>
						<p class="waterValue">{{deviceMsg.regenCyc.value}}</p>
						<p class="waterSet">冲洗间隔(天)</p>
					</li>
					<li v-if="deviceMsg.materLife2.value<=deviceMsg.materLife1.value" @click="searchFilter(device.productKey)">
						<p class="waterValue">{{deviceMsg.materLife2.value}}
							<van-icon class="link" name="arrow" />
						</p>
						<p class="waterSet">耗材2寿命(%)</p>
					</li>
					<li v-else @click="searchFilter(device.productKey)">
						<p class="waterValue">{{deviceMsg.materLife1.value}}
							<van-icon class="link" name="arrow" />
						</p>
						<p class="waterSet">耗材1寿命(%)</p>
					</li>
				</ul>
				<div class="chart">
					<p class="chartName">用水统计(L)</p>
					<ul class="van_tab">
						<li @click="tabSelect('data')" :class="{tabActive:isActive}">今日</li>
						<li @click="tabSelect('week')" :class="{tabActive:!isActive}">近七日</li>
						<p class="line"></p>
					</ul>
					<div id="myChart" class="chartContent"></div>
				</div>
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
							<p class="oprateName">F&Q</p>
						</li>
					</ul>
					<p @click="clear" class="clear">取消</p>
				</van-popup>
			</div>
		</v-touch>
		<van-dialog v-model="phoneShow" show-cancel-button :before-close="beforeClose" confirm-button-text="拨打">
			<p class="content">客户热线 <span style="color:#1E9FFF;">400-8201199</span></p>
		</van-dialog>
	</div>
</template>

<script>
	import * as func from '../../../../static/js/func'
	export default {
		data() {
			return {
				msg: 'Welcome to Your Vue.js App',
				more: false,
				isnormal: 1,
				phoneShow: false,
				isActive: true,
				deviceMsg: this.$store.state.deviceMsg,
				productKey: "",
				DeviceName: "",
				DeviceSecret: "",
				timestamp: new Date().getTime(),
				client: "",
				device: "",
				washImg: "../../../../static/image/icon_coerce_nor@2x.png",
				makeWashImg: "../../../../static/image/icon_appointment_nor@2x.png",
				washText: "强制冲洗",
				makeWashText: "预约冲洗",
				charts: '',
				dataX: ['12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'],
				dataY: [10, 12, 16, 24, 26, 30, 22],
				deviceList: this.$store.state.deviceList
			}
		},
		mounted() {
			let that = this;
			that.dataX = [that.getHours(-6), that.getHours(-5), that.getHours(-4), that.getHours(-3), that.getHours(-2), that.getHours(-1), that.getHours(0)];
			that.drawLine(that.dataX, that.dataY);
			that.init();
			this.$store.state.client.on('message', function(topic, message, packet) {
				if(that.$route.params.id) {
					that.init();
				}
			})
		},
		methods: {
			tabSelect(e) {
				if(e == "data") {
					this.isActive = true;
					let line = document.getElementsByClassName("line")[0];
					line.style.left = "10%"
					this.dataX = [this.getHours(-6), this.getHours(-5), this.getHours(-4), this.getHours(-3), this.getHours(-2), this.getHours(-1), this.getHours(0)];
					this.dataY = [10, 12, 16, 24, 26, 30, 22];
				} else {
					this.isActive = false;
					let line = document.getElementsByClassName("line")[0];
					line.style.left = "60%";
					this.dataY = [30, 35, 38, 44, 36, 40, 32]
					this.dataX = [this.getDay(-6), this.getDay(-5), this.getDay(-4), this.getDay(-3), this.getDay(-2), this.getDay(-1), this.getDay(0)];
				}
				this.drawLine(this.dataX, this.dataY);
			},
			getHours(hours) {
				let now = new Date().getTime();
				let targetday_milliseconds = now + 1000 * 60 * 60 * hours;
				let nowHours = new Date(targetday_milliseconds).getHours()
				if(nowHours < 10) {
					nowHours = "0" + nowHours;
				}
				return nowHours + ":00";
			},
			getDay(day) {
				var today = new Date();
				var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
				today.setTime(targetday_milliseconds); //注意，这行是关键代码
				var tMonth = today.getMonth();
				var tDate = today.getDate();
				tMonth = this.doHandleMonth(tMonth + 1);
				tDate = this.doHandleMonth(tDate);
				return tMonth + "." + tDate;
			},
			doHandleMonth(month) {
				var m = month;
				if(month.toString().length == 1) {
					m = "0" + month;
				}
				return m;
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
						this.$cookies.set('firmwareVersion', this.device.firmwareVersion);
						this.$store.commit("changeDevice", this.deviceMsg);
						if(this.deviceMsg.materLife2.value < 10) {
							if(this.$cookies.get('showTime') == null || this.$cookies.get('showTime') == this.getDay(0)) {
								this.$dialog.alert({
									message: '该设备滤芯需要更换'
								}).then(() => {
									this.$cookies.set('showTime', this.getDay(1))
								});
							}
						}
						this.isnormal = this.device.status == "offline" ? 0 : 1;
						if(this.device.deviceFault) {
							this.isnormal = 2;
						}
						if(this.deviceMsg.regenEnSchedule) {
							this.makeWashImg = "../../../../static/image/icon_appointment_sel@2x.png";
						}
						if(this.deviceMsg.regenEn.value[0] == 1) {
							this.washImg = "../../../../static/image/icon_coerce_sel@2x.png";
							this.washText = "冲洗中.."
						}
						this.washText = this.device.productKey == "a12KzXXwRii" ? "强制再生" : "强制冲洗";
						this.makeWashText = this.device.productKey == "a12KzXXwRii" ? "预约再生" : "预约冲洗";
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
				const deviceMsg = {
					"regenEn": [1]
				}
				const para = {
					productKey: this.device.productKey,
					deviceName: this.device.deviceName,
					commonKey: that.$store.state.commonKey,
					message: JSON.stringify(deviceMsg)
				}
				if(this.deviceMsg.regenEn.value[0] == 1) {
					this.$toast("设备正在冲洗中，请稍后");
					return false;
				}
				that.setDeviceProperty(para, "wash");
			},
			makeWash() {
				let that = this;
				if(that.deviceMsg.regenEnSchedule) {
					that.$Ax.post('common/cancel/scheduleRegenEn?commonKey=' + that.$store.state.commonKey, {
						productKey: that.device.productKey,
						deviceName: that.device.deviceName,
					}).then((res) => {
						if(res.data.success) {
							that.$toast.loading({
								mask: true,
								message: '取消预约中...'
							});
							that.init();
							that.makeWashImg = "../../../../static/image/icon_appointment_nor@2x.png";
							that.makeWashText = "预约冲洗"
						} else {
							this.$toast(res.data.message);
						}
					})
				} else {
					if(that.deviceMsg.regenTimeHourMin.value[0] == "00" && that.deviceMsg.regenTimeHourMin.value[1] == "00") {
						that.$dialog.confirm({
							title: '警告提示',
							message: '请先设置冲洗的启动时间',
							confirmButtonText: "前往"
						}).then(() => {
							this.$router.push("/paraSet?deviceId=" + this.$route.params.id);
						}).catch(() => {});
						return false;
					}
					//					if(that.deviceMsg.regenCyc.value == 0){
					//						that.$dialog.confirm({
					//							title: '警告提示',
					//							message: '请先设置冲洗间隔时间',
					//							confirmButtonText: "前往"
					//						}).then(() => {
					//							this.$router.push("/paraSet?deviceId=" + this.$route.params.id);
					//						}).catch(() => {});
					//						return false;
					//					}
					that.deviceMsg.regenTimeHourMin.value[1] = that.deviceMsg.regenTimeHourMin.value[1] < 10 ? "0" + this.deviceMsg.regenTimeHourMin.value[1] : that.deviceMsg.regenTimeHourMin.value[1];
					that.deviceMsg.regenTimeHourMin.value[0] = that.deviceMsg.regenTimeHourMin.value[0] < 10 ? "0" + this.deviceMsg.regenTimeHourMin.value[0] : that.deviceMsg.regenTimeHourMin.value[0];
					that.$Axios.post('wechat/device/schedule/regenEn', {
						productKey: that.device.productKey,
						deviceName: that.device.deviceName,
						time: that.deviceMsg.regenTimeHourMin.value[0] + ":" + that.deviceMsg.regenTimeHourMin.value[1],
						days: that.deviceMsg.regenCyc.value,
					}).then((res) => {
						if(res.data.success) {
							this.$toast.loading({
								mask: true,
								message: '预约中...'
							});
							that.makeWashImg = "../../../../static/image/icon_appointment_sel@2x.png";
							that.makeWashText = "预约启动"
							that.init();
						} else {
							this.$toast(res.data.message);
						}
					}).catch((err) => {
						console.log(err);
					})
				}
			},
			setDeviceProperty(e, name) {
				this.$Axios.post('common/setDeviceProperty', e).then((res) => {
					if(res.data.success) {
						this.$toast.loading({
							mask: true,
							message: '设置中...'
						});
						this.deviceMsg.regenEn.value[0] = 1;
						if(name == "wash") {
							this.washImg = "../../../../static/image/icon_coerce_sel@2x.png";
							this.washText = "冲洗中.."
						}
					} else {
						this.$toast(res.data.message);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			checkFault() {
				this.phoneShow = true;
			},
			showFilter() {
				this.filter = !this.filter;
			},
			drawLine(x, y) {
				let hours = this.getHours(0);
				let nowDay = this.getDay(0);
				//基于准备好的dom，初始化echarts实例
				this.charts = this.$echarts.init(document.getElementById('myChart'))
				// 绘制图表
				this.charts.setOption({
					color: ['#fff'],
					tooltip: {
						trigger: 'item',
						formatter: function(params) {
							return params.value + " L";
						}
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: x,
						axisLabel: {
							show: true,
							textStyle: {
								color: '#fff'
							}
						},
						axisTick: { //y轴刻度线
							show: false
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#fff', //左边线的颜色
								width: '1' //坐标线的宽度
							}
						}
					},
					yAxis: {
						type: 'value',
						boundaryGap: false,
						splitLine: {
							show: false
						},
						axisTick: { //y轴刻度线
							show: false
						},
						axisLabel: {
							show: true,
							textStyle: {
								color: '#fff'
							},
							formatter: function(value) {
								var texts = [];
								if(value % 10 == 0) {
									texts.push(value);
								}
								return texts;
							}
						},
						axisLine: {
							lineStyle: {
								type: 'solid',
								color: '#fff', //左边线的颜色
								width: '0' //坐标线的宽度
							}
						}
					},
					series: [{
						data: y,
						type: 'line',
						smooth: true,
						symbol: 'circle', //设定为实心点
						symbolSize: 12, //设定实心点的大小
						itemStyle: {
							normal: {
								color: "#30B3FC",
								lineStyle: {
									color: "#fff"
								},
								label: {
									show: true,
									color: "#fff",
									formatter: function(param) {
										let currentValue = new String()
										if(param.name == hours) {
											currentValue = param.data;
										}
										if(param.name == nowDay) {
											currentValue = param.data;
										}
										return currentValue;
									}
								}
							},
						}
					}],
					grid: {
						x: 30,
						y: 30,
						x2: 15,
						y2: 25
					}
				});
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
						urlName = "/deviceInfo?deviceId=" + this.$route.params.id;
						break;
					case 2:
						urlName = "/paraSet?deviceId=" + this.$route.params.id;
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
						urlName =  "/productState?productKey="+this.device.productKey;
						break;
					case 6:
						urlName = "/FQ";
						break;
					case 7:
						if(this.$route.params.bindType == 2) {
							this.$toast("您是该设备分享用户，无法分享")
							return false;
						}
						urlName = "/qrcode?deviceId=" + this.$route.params.id;
						break;
					default:
						break;
				}
				if(e != 4) {
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
		.chart {
			margin: 0px 0.1rem;
			background: rgba(0, 0, 0, 0.2);
			border-radius: 0.08rem;
			height: 2.6rem;
			overflow: hidden;
			position: relative;
			.chartName {
				float: left;
				font-size: 0.14rem;
				color: #fff;
				letter-spacing: 0;
				line-height: 0.28rem;
				width: 1rem;
				height: 0.3rem;
				margin: 0.08rem 0.1rem;
			}
			.van_tab {
				position: absolute;
				top: 0.08rem;
				right: 0.05rem;
				width: 1.2rem;
				z-index: 999;
				li {
					float: left;
					width: 50%;
					text-align: center;
					font-size: 0.12rem;
					line-height: 0.3rem;
					color: #ccc;
				}
				.tabActive {
					color: white;
				}
				.line {
					position: absolute;
					bottom: 0px;
					left: 10%;
					width: 30%;
					height: 0.02rem;
					background: white;
					border-radius: 30% 30%;
				}
			}
			.chartContent {
				position: relative;
				height: 2rem;
				canvas {
					position: absolute;
					left: 0px;
					width: 100%;
					height: 1.5ren;
				}
			}
		}
		.device_hint {
			position: fixed;
			left: 0px;
			bottom: 0.82rem;
			width: 100%;
			background: white;
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
	}
</style>