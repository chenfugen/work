<template>
	<div id="networkFlow">
		<ul class="networkTitle">
			<li>
				<p class="h3">您选择的产品为：</p>
				<p class="hint">GE牌智能产品-{{productName}}</p>
				<p class="hint">联网方式：WIFI</p>
			</li>
		</ul>
		<img :src="imgUrl" class="addImg"></img>
		<p class="restart" @click="restart">重新扫码</p>
		<div class="netWork">
			<van-button class="addDevice" @click="addDevice">开始配网</van-button>
		</div>
	</div>
</template>
<script>
	import * as func from '../../../static/js/func'
	export default {
		data() {
			return {
				linkSuccess: false,
				productName: "",
				imgUrl:"../../../static/image/netWork1@3x.png",
			}
		},
		mounted() {
			this.productName = func.getTitle(this.$cookies.get('productMsg').productKey)
			this.init();
		},
		methods: {
			init() {
				let that = this;
				let addImg = document.getElementsByClassName("addImg")[0];
				that.$Axios.get("wechat/device/product/image", {
					params: {
						productKey: that.$cookies.get('productMsg').productKey,
					}
				}).then((res) => {
					if(res.data.success) {
					if(res.data.data.networkImg!=null){
							 that.imgUrl=that.$store.state.IP + "common/getFile/" + res.data.data.networkImg + "?commonKey=" + that.$store.state.commonKey
						}					
						that.$forceUpdate();
					}
				})
			},
			onClickLeft() {-
				this.$router.push({
					path: "/searchDevice"
				});
			},
			addDevice() {
				let that = this;
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
								jsApiList: ['configWXDeviceWiFi'],
								success: function(res) {									
									//在这里调用 API
									wx.invoke('configWXDeviceWiFi', {}, function(res) {
										if(res.err_msg == "configWXDeviceWiFi:ok") {
											that.$toast.loading({
												mask: true,
												message: '绑定设备中...',
												duration: 9000
											});
											setTimeout(() => {
												that.bindDevice();
											}, 10000);
										} else if(res.err_msg == "configWXDeviceWiFi:cancel") {
											that.$toast("取消配网")
										} else {
											that.$router.push("/netWorkError");
										}
									});
								}
							});
						})
					}
				}).catch((res) => {})
			},
			beforeClose(action, done) {
				if(action === 'confirm') {
					this.bindDevice();
					done();
				}
			},
			bindDevice() {
				let that = this;
				that.$Axios.post("wechat/device/bindDevice", {
					productKey: that.$cookies.get('productMsg').productKey,
					deviceName: that.$cookies.get('productMsg').DeviceName,
					sncode: that.$cookies.get('productMsg').sncode,
				}).then((res) => {
					that.$cookies.remove('productMsg');
					if(res.data.success) {
						that.$cookies.set('bind');
						that.$router.push("/netWorkSuccess");
					} else {
						that.$toast(res.data.message);
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			restart() {
				this.$cookies.remove('productMsg');
				this.$router.push("/searchDevice");
			}
		}
	}
</script>

<style lang="scss">
	#networkFlow {
		background: white;
		.van-nav-bar .van-icon {
			color: #323233;
		}
		.networkTitle {
			background: white;
			padding: 0.1rem 0.2rem;
			margin-top: 0.1rem;
			li {
				.h3 {
					color: #000;
					font-size: 0.16rem;
					line-height: 0.35rem;
					font-weight: bold;
				}
				.hint {
					font-size: 0.14rem;
					color: #666;
					line-height: 0.3rem;
				}
			}
		}
		.content {
			text-align: center;
			line-height: 0.4rem;
		}
		.addImg {
			width: 100%;
			height: 2.8rem;
			margin-top: 0.25rem;
		}
		.netWork {
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
		.restart {
			position: fixed;
			bottom: 0.5rem;
			width: 100%;
			text-align: center;
			color: #267CFB;
			font-size: 0.12rem;
			line-height: 0.4rem;
			text-decoration: underline;
		}
	}
</style>