<template>
	<div>
		<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
			<div id="device">
				<div class="header" v-show="addDevice">
					<span class="device_count">总计 {{total}} 台</span>
					<img src="../../../static/image/icon_sort_down.png" @click="showFilter" class="device_filter" />
					<img :src="sortImg" @click="showWay" class="device_filter" />
				</div>
				<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
					<div v-show="!addDevice" class="nullDevice">
						<img src="../../../static/image/device_default page_bg.png" />
						<p class="title">您还没有设备</p>
						<van-button round class="gradual_line_blue addDevice" @click="addProduct">添加设备</van-button>
					</div>
					<div class="device_content" v-show="addDevice">
						<ul :class="{'deviceList':way==0,'deviceSudoku':way==1}">
							<li v-for="(item, index) in deviceList" :key="index" @click="goDetail(item.productKey,item.deviceId,index,item.bindType)">
								<div class="deviceImg">
									<img :src="item.productImg" />
								</div>
								<div class="deviceMsg">
									<p class="deviceName">{{item.deviceNickName==item.deviceName?item.productName:item.deviceNickName}}</p>
									<p class="deviceType">SN: {{item.sncode | nullDeal}}</p>
									<p class="deviceMac">{{item.productKey | deviceTitleFilter}}: {{item.deviceName}}</p>
									<p v-if="item.status!='online'" class="deviceStatus">{{item.productKey | deviceTypeFilter}}</p>
									<p v-if="item.status=='online'" class="deviceStatus online">{{item.productKey | deviceTypeFilter}}</p>
								</div>
								<div class="waterMsg" :class="{waterOnline:item.status=='online'}">
									<p class="waterNum" v-if="item.showProperty=='可用水量'">{{item.propertyValue==null?'--':item.propertyValue}}</p>
									<p class="waterNum" v-else>{{item.propertyValue==null?'--':item.propertyValue}}</p>
									<p class="waterStatus">{{item.showProperty==null?"可用水量":item.showProperty}}</p>
								</div>
							</li>
						</ul>
						<p style="height: 0.1rem;"></p>
					</div>
				</van-pull-refresh>
				<div v-show="addDevice" class="add_Device gradual_line_blue" @click="addProduct">
					<img src="../../../static/image/icon_add@2x.png" />
				</div>
				<tabbar :selected="selected"></tabbar>
			</div>
		</v-touch>
		<van-popup v-model="filter" position="top">
			<van-radio-group v-model="radio">
				<van-cell-group>
					<van-cell title="添加时间" clickable @click="timeSort">
						<van-radio name="1" @click="timeSort" />
					</van-cell>
					<van-cell title="产品类型" clickable @click="typeSort">
						<van-radio name="2" @click="typeSort" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
		</van-popup>
		<div v-show="show" class="dialog van-dialog" style="z-index:100002;">
			<div class="van-dialog__content">
				<img src="../../../static/image/GEqrcode.jpg" class="codeImg">
				<p class="hint">1、长按二维码选择识别图中二维码</p>
			</div>
			<div class="van-hairline--top van-dialog__footer"></div>
		</div>
		<div v-show="show" class="van-overlay" style="z-index:10001;"></div>
	</div>
</template>

<script>
	import tabbar from '../../components/tabbar'
	import * as func from '../../../static/js/func'
	export default {
		inject: ['reload'],
		components: {
			tabbar
		},
		data() {
			return {
				radio: "",
				selected: 0,
				addDevice: true,
				filter: false,
				deviceList: "",
				total: "",
				loading: false,
				active: false,
				isLoading: false,
				show: false,
				timeRank: true,
				way: 0,
				sortImg: "../../../static/image/icon_grid.png",
			}
		},
		mounted() {
			this.deviceInit(100);
			this.init();
			if(sessionStorage.getItem('citys') == null) {
				this.getCity();
			}
			if(this.$cookies.get('bind') != null) {
				this.$cookies.remove('bind');
				setTimeout(() => {
					this.deviceInit(100);
				}, 3000);
			};
			if(this.$cookies.get('isShare') != null) {
				this.$cookies.remove('isShare');
				location.reload();
			}
		},
		methods: {
			init() {
				this.$Ax.get('wechat/user/register/getWxUserInfo', {
					params: {
						"accessKey": this.$store.state.accessKey,
						"refreshToken": this.$cookies.get("refreshToken"),
						"customerId": "GE"
					}
				}).then((res) => {
					if(res.data.success) {
						this.$cookies.set('headUrl',res.data.data.headUrl);
						if(!res.data.data.subscribe) {
							this.show = true;
						}
					}
				})
			},
			getCity() {
				let self = this;
				let citys = [];
				self.$Axios.get("wechat/device/getTdsData", {
					params: {
						"level": 1,
					}
				}).then((res) => {
					res.data.data.forEach(function(msg) {
						self.$Axios.get("wechat/device/getTdsData", {
							params: {
								"level": 2,
								"provinceId": msg.provinceId
							}
						}).then((res) => {
							for(var i in res.data.data) {
								citys.push(res.data.data[i]);
								sessionStorage.setItem("citys", JSON.stringify(citys));
							}
						})
					})
				})
			},
			timeSort() {
				this.radio = '1';
				this.deviceList.sort((a, b) => {
					let aTimeString = a.createTime.replace(/-/g, "/");
					let bTimeString = b.createTime.replace(/-/g, "/");
					if(this.timeRank) {
						this.timeRank = false;
						return new Date(bTimeString).getTime() - new Date(aTimeString).getTime(); //降序
					} else {
						this.timeRank = true;
						return new Date(aTimeString).getTime() - new Date(bTimeString).getTime(); //升序
					}
				})
				this.filter = false;
			},
			typeSort() {
				this.radio = '2';
				const xyList = []; //新月
				const yuheList = []; //雨荷
				const businessList = []; //商用
				const separateList = []; //分质
				const allInOneList = []; //一体机
				const ROList = []; //三级RO
				const ultrafiltrationList = []; //三级超滤
				this.deviceList.forEach(function(msg) {
					switch(func.getProductNumber(msg.productKey)) {
						case 1:
							xyList.push(msg)
							break;
						case 2:
							yuheList.push(msg)
							break;
						case 3:
							businessList.push(msg)
							break;
						case 4:
							separateList.push(msg)
							break;
						case 5:
							allInOneList.push(msg)
							break;
						case 6:
							ROList.push(msg)
							break;
						case 7:
							ultrafiltrationList.push(msg)
						case 8:
							ROList.push(msg)
							break;
						default:
							break;
					}
				})
				this.deviceList = xyList.concat(yuheList).concat(businessList).concat(separateList).concat(allInOneList).concat(ROList).concat(ultrafiltrationList);
				this.filter = false;
			},
			onRefresh() {
				setTimeout(() => {
					this.deviceInit(100);
					this.$toast('刷新成功');
					this.timeRank = true;
					this.isLoading = false;
				}, 500);
			},
			swiperleft() {
				this.$router.push({
					'path': '/datas'
				});
			},
			swiperright() {
				console.log(this.transitionName)
			},
			handleScroll() {
				let visibleHeight = document.body.clientHeight
				let scrollHeight = document.body.scrollHeight
				let scrollTop = document.body.scrollTop
				let windowHeight = window.innerHeight;
				let header = document.getElementsByClassName('header')[0];
				if(header != undefined) {
					if(scrollTop > 0) {
						header.style.backgroundColor = "white";
					} else {
						header.style.background = "none";
					}
				}
			},
			deviceInit(e) {
				let that = this;
				that.$Axios.get("wechat/device/deviceList?pageNum=1&pageSize=" + e).then((res) => {
					if(res.data.success) {
						that.loading = false;
						res.data.data.data.forEach(function(msg) {
							if(msg.productFile == null) {
								msg.productImg = "../../../static/image/logo.png";
							} else {
								msg.productImg = that.$store.state.IP + "common/getFile/" + msg.productFile + "?commonKey=" + that.$store.state.commonKey;
							}
						})
						that.deviceList = res.data.data.data;
						that.$store.commit("changeDeviceList", this.deviceList);
						that.total = res.data.data.total;
						if(that.total == 0) {
							that.addDevice = false;
						}
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			showFilter() {
				this.filter = !this.filter;
			},
			goDetail(productKey, e, index, bindType) {
				this.$router.push({
					path: func.getRouterPath(productKey, e, index, bindType)
				});
			},
			addProduct() {
				if(this.$cookies.get("productMsg") != null) {
					this.$router.push({
						path: "/networkFlow"
					});
				} else {
					this.$router.push({
						path: "/searchDevice"
					})
				}
			},
			showWay() {
				if(this.way == 0) {
					this.sortImg = "../../../static/image/icon_ist.png"
					this.way = 1;
				} else {
					this.sortImg = "../../../static/image/icon_grid.png"
					this.way = 0;
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	.gradual_line_blue {
		background: -webkit-linear-gradient(left, #267CFB, #30B3FC);
		/* Safari 5.1 - 6.0 */
		background: -o-linear-gradient(right, #267CFB, #30B3FC);
		/* Opera 11.1 - 12.0 */
		background: -moz-linear-gradient(right, #267CFB, #30B3FC);
		/* Firefox 3.6 - 15 */
		background: linear-gradient(to right, #267CFB, #30B3FC);
	}

	.nullDevice {
		text-align: center;
		min-height: 4.5rem;
		img {
			margin-top: 50%;
			width: 0.8rem;
			vertical-align: bottom;
		}
		.title {
			font-size: 0.13rem;
			color: #666666;
			text-align: center;
			line-height: 28px;
			vertical-align: top;
		}
		.addDevice {
			color: white;
			font-size: 0.14rem;
			width: 1.1rem;
			border-radius: 0.04rem 0.04rem;
			background: #005EB8;
			margin: 0.2rem auto;
			display: block;
		}
	}

	.header {
		width: 100%;
		position: fixed;
		top: 0px;
		padding-top: 0.1rem;
		height: 0.3rem;
		z-index: 1000;
		background: white;
		.device_count {
			line-height: 0.3rem;
			margin-left: 12px;
			font-size: 0.12rem;
			float: left;
		}
		.device_filter {
			float: right;
			width: 0.24rem;
			margin-right: 12px;
		}
	}

	.device_content {
		margin: 0.5rem 0px;
		min-height: 4rem;
		.deviceSudoku {
			display: block;
			font-size: 0;
			/*margin: 0.35rem 0px;*/
			li {
				/*float: left;*/
				display: inline-block;
				background: white;
				width: 45%;
				margin: 0 0 0.1rem 3.3%;
				overflow: hidden;
				border-radius: 0.03rem 0.03rem;
				text-align: center;
				position: relative;
				.deviceImg {
					width: 0.5rem;
					height: 0.7rem;
					margin: 0.1rem auto;
					font-size: 0;
					line-height:0.7rem;
					overflow: hidden;
					img {
					    width: 100%;
						vertical-align: middle;
					}
				}
				.deviceMsg {
					width: 100%;
					.deviceName {
						font-size: 0.12rem;
						color: #000;
						line-height: 0.28rem;
						overflow: hidden;
						white-space: nowrap;
					}
					.deviceType {
						font-size: 0.1rem;
						color: #333;
						line-height: 0.24rem;
						overflow: hidden;
						white-space: nowrap;
					}
					.deviceMac {
						font-size: 0.1rem;
						color: #333;
						line-height: 0.24rem;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap
					}
					.deviceStatus {
						position: absolute;
						top: 0.1rem;
						right: 0.1rem;
						color: white;
						display: inline-block;
						text-align: center;
						border-radius: 0.02rem;
						font-size: 0.1rem;
						padding: 0.03rem 0.05rem;
						background: #ccc;
					}
					.online {
						background: #267CFB;
					}
					.offline {
						background: #ccc;
					}
				}
				.waterMsg {
					width: 0.66rem;
					height: 0.66rem;
					margin: 0.05rem auto;
					border: 0.02rem solid #ccc;
					border-radius: 50%;
					text-align: center;
					.waterNum {
						color: #ccc;
						font-size: 0.18rem;
						line-height: 0.24rem;
						margin-top: 0.1rem;
					}
					.waterStatus {
						font-size: 0.1rem;
						color: #999999;
						line-height: 0.24rem;
					}
				}
				.waterOnline {
					border: 0.02rem solid #267CFB;
					.waterNum {
						color: #267CFB;
						font-size: 0.18rem;
						line-height: 0.24rem;
						margin-top: 0.1rem;
					}
				}
			}
		}
		.deviceList {
			display: block;
			margin: 0.35rem 0.12rem;
			li {
				margin-bottom: 10px;
				background: white;
				width: 100%;
				height: 1.1rem;
				overflow: hidden;
				border-radius: 0.03rem 0.03rem;
				.deviceImg {
					float: left;
					width: 15%;
					height: 0.7rem;
					margin: 0.2rem 0.1rem 0.2rem 0.1rem;
					font-size: 0;
					line-height:0.7rem;
					overflow: hidden;
					img {
						width: 100%;
						vertical-align: middle;
					}
				}
				.deviceMsg {
					float: left;
					width: 53%;
					height: 1.1rem;
					.deviceName {
						font-size: 0.12rem;
						color: #000;
						line-height: 0.28rem;
						margin-top: 0.08rem;
						overflow: hidden;
						white-space: nowrap;
					}
					.deviceType {
						font-size: 0.1rem;
						color: #333;
						line-height: 0.24rem;
						overflow: hidden;
						white-space: nowrap;
					}
					.deviceMac {
						font-size: 0.1rem;
						color: #333;
						line-height: 0.24rem;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap
					}
					.deviceStatus {
						float: left;
						color: white;
						display: inline-block;
						width: 0.35rem;
						line-height: 0.19rem;
						text-align: center;
						border-radius: 17px;
						font-size: 0.1rem;
						background: #ccc;
					}
					.online {
						background: #267CFB;
					}
					.offline {
						background: #ccc;
					}
				}
				.waterMsg {
					float: right;
					width: 0.6rem;
					height: 0.6rem;
					margin: 0.23rem 0.1rem 0.23rem 0px;
					display: inline-block;
					border: 0.02rem solid #ccc;
					border-radius: 50%;
					text-align: center;
					.waterNum {
						color: #ccc;
						font-size: 0.18rem;
						line-height: 0.24rem;
						margin-top: 0.1rem;
					}
					.waterStatus {
						font-size: 0.1rem;
						color: #999999;
						line-height: 0.24rem;
					}
				}
				.waterOnline {
					border: 0.02rem solid #267CFB;
					.waterNum {
						color: #267CFB;
						font-size: 0.18rem;
						line-height: 0.24rem;
						margin-top: 0.1rem;
					}
				}
			}
		}
	}

	.add_Device {
		position: fixed;
		bottom: 0.6rem;
		right: 0.1rem;
		width: 0.6rem;
		height: 0.6rem;
		text-align: center;
		border-radius: 50%;
		img {
			vertical-align: top;
			margin-top: 0.2rem;
			width: 0.2rem;
		}
	}

	.dialog {
		text-align: center;
		padding: 0.3rem 0;
		.dialogTitle {
			line-height: 0.4rem;
			font-weight: bold;
		}
		.codeImg {
			vertical-align: top;
			 width: 100%;
		}
		.hint {
			width: 230px;
			margin: 0 auto;
			font-size: 0.12rem;
			color: #999999;
			letter-spacing: 0;
			text-align: left;
			line-height: 0.28rem;
		}
	}
</style>
