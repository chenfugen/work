<template>
	<div class="qrcode">
		<div class="qrcodeBox">
			<canvas id="canvas" style="display:none;margin: 0 auto;"></canvas>
			<img :src="qrCodeImg" class="codeImg" />
			<p class="codeHint">微信扫码添加</p>
			<p class="codeItem">只支持在同一WiFi网络下添加设备</p>
			<p class="hint">（提示：可长按二维码发送给朋友或保存本地）</p>
			<ul class="oprateSelect">
				<li class="oprateMathod" @click="share">
					<p class="oprateImg">
						<img src="../../../static/image/weixin.png" /> 微信分享
					</p>
				</li>
				<!--<li class="oprateMathod" @click="save">
				<p class="oprateImg"><img src="../../../static/image/icon_Save local@2x.png" /></p>
				<p>保存本地</p>
			</li>-->
			</ul>
		</div>
		<div class="showShara" v-show="showShara" @click="hideShara">
			<img src="../../../static/image/shadeArrow.png" />
		</div>
	</div>
</template>

<script>
	import QRCode from 'qrcode'
	export default {
		data() {
			return {
				device: "",
				codes: '',
				url: "",
				qrCodeImg: "",
				showShara: false,
			}
		},
		components: {
			QRCode: QRCode
		},
		mounted() {
			this.init();		
		},
		methods: {
			init() {
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.query.deviceId).then((res) => {
					if(res.data.success) {
						this.device = res.data.data.device;
						this.useqrcode();
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
			},
			useqrcode() {
				let canvas = document.getElementById('canvas')
				this.url = this.$store.state.url+ "login.html?productKey=" + this.device.productKey + "&DeviceName=" + this.device.deviceName + "&SN=" + this.device.sncode;
				QRCode.toCanvas(canvas, this.url, {
					width: 300,
					height: 300
				}, function(error) {})
				this.createImg();
			},
			onClickLeft() {　
				window.history.back();
			},
			hideShara() {
				this.showShara = false;
			},
			share() {
				let that = this;
				that.showShara = true;
				that.url = that.$store.state.url+"login.html?productKey=" + that.device.productKey + "&DeviceName=" + that.device.deviceName + "&SN=" + that.device.sncode;
				that.$Axios.get("wechat/user/getWxSignature?url="+that.$store.state.url).then((res) => {
					if(res.data.success) {
						const data = res.data.data;
						wx.config({
							beta: true,
							debug: false,
							appId: data.appId,
							timestamp: Number(data.timestamp),
							nonceStr: data.nonceStr,
							signature: data.signature,
							jsApiList: ['onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareTimeline', 'onMenuShareQZone'],
						});
						wx.error(function(res) {
							alert(res);
						});
						var shareData = {
							title: '开能智能设备分享', // 分享标题
							desc: '点击可直接进入绑定智能设备', // 分享描述
							link: that.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl:that.$store.state.IP+"common/getFile/5c9981dff75051bbbf729657?commonKey=" + that.$store.state.commonKey, // 分享图标
							success: function(res) {
								that.showShara = false;
								that.$toast('已分享');
							},
							cancel: function(res) {
								that.showShara = false;
								that.$toast('已取消');
							},
							fail: function(res) {
								that.showShara = false;
								that.$toast(JSON.stringify(res));
							}
						};
						wx.ready(function() {
							wx.onMenuShareAppMessage(shareData);
							wx.onMenuShareQQ(shareData);
							wx.onMenuShareTimeline(shareData);
							wx.onMenuShareQZone(shareData);
						});
					}
				}).catch((res) => {})
			},
			createImg() {
				let canvas = document.getElementById('canvas')
				this.qrCodeImg = canvas.toDataURL('image/jpeg');
			},
			save() {
				let canvas = document.getElementById('canvas')
				let imgUrl = canvas.toDataURL('image/jpeg');
				this.onPlusReady(function() {
					plus.gallery.save(imgUrl, function() {
						alert("保存图片到相册成功");
					});
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.van-hairline--bottom::after {
		border-bottom-width: 0px;
	}
	
	.showShara {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0px;
		left: 0px;
		z-index: 9999;
		background: rgba(0, 0, 0, 0.7);
		img {
			width: 100%;
		}
	}
	
	.qrcode {
		overflow: hidden;
		.qrcode_header {
			background: none;
			border: none;
			color: white;
		}
		.van-nav-bar .van-icon {
			color: white;
			vertical-align: middle;
		}
		.van-nav-bar__title {
			color: white;
			font-size: 0.14rem;
		}
		.qrcodeBox {
			margin: 0.3rem 0.15rem 0.2rem 0.15rem;
			height: 4.3rem;
			background: #FFFFFF;
			box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.30);
			border-radius: 0.08rem;
			text-align: center;
			.codeImg {
				margin: 0.1rem 0px 0px 0px;
				vertical-align: top;
			}
			.codeHint {
				font-size: 0.16rem;
				color: #666666;
				letter-spacing: 0;
				text-align: center;
				line-height: 0.35rem;
			}
			.codeItem {
				width: 100%;
				font-size: 0.14rem;
				color: #999999;
				letter-spacing: 0;
				text-align: center;
				line-height: 0.28rem;
			}
			.hint {
				width: 100%;
				font-size: 0.12rem;
				color: #999999;
				letter-spacing: 0;
				text-align: center;
				line-height: 0.28rem;
			}
		}
		.oprateSelect {
			width: 80%;
			margin: 0.1rem 10%;
			.oprateMathod {
				float: left;
				width: 100%;
				height: 100%;
				text-align: center;
				.oprateImg {
					width: 1.5rem;
					height: 0.3rem;
					background:#30B3FC;
					margin: 0 auto;
					color:white;
					border-radius:0.3rem 0.3rem;
					line-height: 0.3rem;
					img {
						width: 0.2rem;
						height: 0.2rem;
						vertical-align: middle;
					}
				}
				p {
					font-size: 0.12rem;
					color: #FFFFFF;
					letter-spacing: 0;
					text-align: center;
					line-height: 0.24rem;
				}
			}
		}
	}
</style>