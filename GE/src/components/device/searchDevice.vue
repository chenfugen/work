<template>
	<div id="searchDevice">
		<div v-show="isProductMsg">
			<!--<van-search v-model="value" placeholder="请搜索型号" shape="round" @search="onSearch" />-->
			<p class="searchHint">请根据您购买的产品的产品说明书进行正确选择</p>
			<div v-show="searchResult" class="searchResult">
				<van-cell v-for="(item, index) in address" :key="index" :title="item.name" is-link @click="selectProduct" />
				<div v-show="address.length==0" style="text-align: center;line-height:0.3rem;padding:0.3rem 0px;font-size:0.13rem;color: #333;">搜不到你要的结果</div>
			</div>
		</div>
		<div v-show="!isProductMsg" class="addMsg">
			<p class="addDeviceTitle">请扫描机器上的二维码</p>
			<p class="hint">二维码位置不同型号稍有不同，图片仅为示例。</p>
			<div class="addImg"></div>
		</div>
		<div v-show="!isProductMsg" class="scanCode">
			<van-button class="addDevice" @click="scan" :disabled="isDisable">开始扫码</van-button>
		</div>
	</div>
</template>

<script>
	import * as func from '../../../static/js/func'
	export default {
		data() {
			return {
				searchResult: true,
				value: "",
				address: [{
						name: "净水器-新月"
					},
					{
						name: "净水器-雨荷"
					}
				],
				isProductMsg: false,
				isDisable: false,
			}
		},
		mounted() {
            this.$cookies.remove('productMsg');
		},
		methods: {
			getQueryString(name, url) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = url.substr(1).match(reg);
				if(r != null) return unescape(r[2]);
				return null;
			},
			scan() {
				let that = this;
				that.isDisable = true;
				that.$Axios.get("wechat/user/getWxSignature", {
					params: {
						"url": that.$store.state.url,
						"customerId": "GE"
					}
				}).then((res) => {
					if(res.data.success) {
						const data = res.data.data;
						wx.config({
							beta: true,
							debug: false,
							appId: data.appId,
							timestamp: Number(data.timestamp),
							nonceStr: data.nonceStr,
							signature: data.signature,
							jsApiList: ['configWXDeviceWiFi', 'scanQRCode']
						});
						wx.error(function(res) {
							alert(res);
						});
						wx.ready(function() {
							wx.checkJsApi({
								jsApiList: ['scanQRCode'],
								success: function(res) {
									wx.scanQRCode({
										needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
										scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
										success: function(res) {
											var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果	
											if(result.split("?")[0] != that.$store.state.url + "login.html") {
												that.$toast("二维码地址错误");
												return false;
											}
											if(that.getQueryString("productKey", "?" + (result.split("?")[1])) == null || that.getQueryString("DeviceName", "?" + (result.split("?")[1])) == null) {
												that.$toast("二维码信息缺失");
												return false;
											}
											if(that.getQueryString("productKey", "?" + (result.split("?")[1])) == "" || that.getQueryString("DeviceName", "?" + (result.split("?")[1])) == "") {
												that.$toast("二维码信息缺失");
												return false;
											}
											const productMsg = {
												productKey: that.getQueryString("productKey", "?" + (result.split("?")[1])),
												DeviceName: that.getQueryString("DeviceName", "?" + (result.split("?")[1])),
												sncode: that.getQueryString("SN", "?" + (result.split("?")[1])),
											}											
											that.$Ax.get("wechat/device/register/checkPK", {
												params: {
													"accessKey":that.$store.state.accessKey,
													"productKey":productMsg.productKey,
													"customerId":"GE"
												}
											}).then((res) => {
												if(res.data.success) {                               												
													let productNet = res.data.data;
													that.$Ax.get("wechat/device/register/getDeviceBindStatus?productKey=" + productMsg.productKey + "&deviceName=" + productMsg.DeviceName + "&accessKey=" + that.$store.state.accessKey).then((res) => {
														if(res.data.data.bindStatus) {
															let userId = res.data.data.userId;
															if(res.data.data.userId == that.$cookies.get('userId')) {
																that.goDetail(productMsg.DeviceName)
															} else {
																that.$Axios.get("wechat/device/getDeviceShareStatus?productKey=" + productMsg.productKey + "&deviceName=" + productMsg.DeviceName).then((res) => {
																	if(res.data.data.shareStatus) {
																		that.goDetail(productMsg.DeviceName)
																	} else {
																		that.$dialog.confirm({
																			title: '设备绑定',
																			message: '该设备已被绑定,是否请求分享添加',
																			confirmButtonText: "请求分享"
																		}).then(() => {
																			var data = {
																				"cmd": "share",
																				"data": {
																					"shareUserId": userId, //主用户
																					"userId": that.$cookies.get('userId'), //分享用户
																					"productKey": productMsg.productKey,
																					"deviceName": productMsg.DeviceName,
																					"headUrl":decodeURI(that.$cookies.get('headUrl'))
																				}
																			}																		
																			that.$store.state.client.publish('/' + that.$store.state.userClient.productKey + '/' + that.$store.state.userClient.deviceName + '/user/message/update', JSON.stringify(data), {
																				qos: 1
																			});
																		})
																	}
																})
															}
														} else {
															if(productNet == "wifi") {
																that.$dialog.confirm({
																	title: '提示',
																	message: '该设备为WIFI设备请先配网',
																	confirmButtonText: "前往"
																}).then(() => {
																	that.$cookies.set('productMsg', JSON.stringify(productMsg));
																	that.$router.push({
																		path: "/networkFlow"
																	});
																})
															} else {
																that.$dialog.confirm({
																	title: '提示',
																	message: '该设备为2G设备，是否直接绑定',
																	confirmButtonText: "绑定"
																}).then(() => {
																	that.$Axios.post("wechat/device/bindDevice", {
																		productKey: productMsg.productKey,
																		deviceName: productMsg.DeviceName,
																		sncode: productMsg.sncode,
																	}).then((res) => {
																		if(res.data.success) {
																			that.$toast("绑定成功，下拉刷新页面");
																			that.$router.push({
																				path: "/device"
																			});
																		} else {
																			that.$toast(res.data.message);
																		}
																	})
																})
															}
														}
													})
												} else {
													window.location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzAwMzMzNzUyOQ==&sharer_username=gh_1eaf9ab0fd9f&subscene=0&clicktime=1558688755#wechat_redirect";
												}
											})
										}
									});
								}
							});
						})
					}
				})
			},
			goDetail(DeviceName) {
				let that = this;
				that.$store.state.deviceList.forEach(function(msg, index) {
					if(msg.deviceName == DeviceName) {
						that.$router.push({
							path: func.getRouterPath(msg.productKey, msg.deviceId, index, msg.bindType)
						});
					}
				})
			},
			selectProduct() {
				this.$router.push({
					path: "/networkFlow"
				});
			},
			onClickLeft() {
				this.$router.push({
					path: "/device"
				});
			}
		}
	}
</script>

<style lang="scss">
	#searchDevice {
		background: white;
		.van-nav-bar .van-icon {
			color: #323233;
		}
		.searchHint {
			color: #999;
			padding-left: 0.15rem;
			line-height: 0.4rem;
			font-size: 0.12rem;
		}
		.searchResult {
			background: white;
		}
		.scanCode {
			position: fixed;
			width: 100%;
			bottom: 0px;
			background: white;
			.addDevice {
				width: 100%;
				color: white;
				background: #005EB8;
				display: block;
			}
		}
		.addImg {
			width:60%;
			height: 3.1rem;
			background: url(../../../static/image/netWork.jpg) no-repeat;
			background-size: 100% 90%;
			margin: 0.4rem auto;
		}
		.addMsg {
			background: white;
			.addDeviceTitle {
				font-size: 0.16rem;
				font-weight: bold;
				color: #333333;
				letter-spacing: 0;
				line-height: 0.5rem;
				text-align: center;
			}
			.hint {
				text-align: center;
				font-size: 0.14rem;
				color: #999;
			}
		}
	}
</style>