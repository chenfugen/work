<template>
	<div class="more">
		<van-cell title="设备信息" is-link @click="set(1)" />
		<van-cell v-if="showProductType==3" title="定时管理" is-link @click="set(7)" />
		<van-cell v-if="showProductType==3" title="其他设置" is-link @click="set(8)" />
	<!--	<van-cell v-if="showProductType==4" title="定时管理" is-link @click="set(9)" />-->
		<van-cell v-if="showProductType==4" title="其他设置" is-link @click="set(10)" />
		<van-cell v-if="showProductType==6" title="滤芯复位" is-link @click="set(11)" />
		<van-cell v-if="showProductType==7" title="滤芯复位" is-link @click="set(12)" />
		<van-cell v-if="showProductType==8" title="滤芯复位" is-link @click="set(14)" />
		<van-cell v-if="showProductType==1 || showProductType==2" title="参数设置" is-link @click="set(2)" />
		<van-cell v-if="showProductType==5" title="参数设置" is-link @click="set(13)" />
		<van-cell v-if="bindType!=2" title="分享管理" is-link @click="set(3)" />
		<van-cell title="设备解绑" is-link @click="set(4)" />
		<van-cell title="产品说明" is-link @click="set(5)" />
	<!--	<van-cell v-if="isnormal==2"  title="自主报修" is-link @click="set(6)" />-->
	</div>
</template>

<script>
	import * as func from '../../../static/js/func'
	export default {
		data() {
			return {
				device: "",
				showProductType: 1,
				bindType:this.$route.query.bindType,
				isnormal:this.$route.query.isnormal,
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$Axios.get("wechat/device/deviceDetail?deviceId=" + this.$route.query.deviceId).then((res) => {
					if(res.data.success) {
						this.device = res.data.data.device;
						let productKey = res.data.data.device.productKey;
						this.showProductType=func.getProductNumber(productKey)
					} else {
						this.$toast("数据加载失败");
					}
				}).catch((res) => {
					console.log(res);
				})
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
						urlName = "/deviceInfo?deviceId=" + this.$route.query.deviceId+"&bindType=" + this.$route.query.bindType;
						break;
					case 2:
						urlName = "/newDeviceSet?deviceId=" + this.$route.query.deviceId;
						break;
					case 3:
						urlName = "/share??deviceId=" + this.$route.query.deviceId + "&bindType=" + this.$route.query.bindType;
						break;
					case 4:
						this.$dialog.confirm({
							message: '您确定要解绑该设备吗？',
							confirmButtonText: "解绑"
						}).then(() => {
							const deviceMsg = {
								productKey: this.device.productKey,
								deviceName: this.device.deviceName,
								bindStatus: this.$route.query.bindType,
							}
							this.unbind(deviceMsg);
						}).catch(() => {
							//on cancel
						});
						break;
					case 5:
						urlName = "/productState?productKey="+this.device.productKey;
						break;
					case 6:
						location.href = "https://wx.canature.com/crm2test/api/weixinsso/authorize?homeurl=/serveHome/intelligence/" + this.$cookies.get("openId") + "/" + this.device.sncode;
						break;
					case 7:
						urlName = "/commercialsetTime?deviceId=" + this.$route.query.deviceId;
						break;
					case 8:
						urlName = "/commercialSet?deviceId=" + this.$route.query.deviceId;
						break;
					case 9:
						urlName = "/timingManage?deviceId=" + this.$route.query.deviceId;
						break;
					case 10:
						urlName = "/separateWaterSet?deviceId=" + this.$route.query.deviceId;
						break;
					case 11:
						urlName = "/ROReset?deviceId=" + this.$route.query.deviceId;
						break;
					case 12:
						urlName = "/CUFset?deviceId=" + this.$route.query.deviceId;
						break;
					case 13:
						urlName = "/allInOneSet?deviceId=" + this.$route.query.deviceId;
						break;
					case 14:
						urlName = "/P7set?deviceId=" + this.$route.query.deviceId;
						break;
					default:
						break;
				}
				if(e != 4 && e != 6) {
					this.$router.push(urlName);
				}
			}
		}
	}
</script>

<style>
	.more {
		margin-top: 0.1rem;
	}
</style>