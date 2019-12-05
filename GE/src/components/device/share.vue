<template>
	<div class="share">
		<div v-show="shareList.length==0" class="nullShare">
			<img src="../../../static/image/share_default page_bg.png" />
			<p class="title">暂无分享</p>
			<van-button  class="addShare" @click="sharaDevice">分享设备</van-button>
		</div>
		<ul class="shareList">
			<li class="shareUser" v-for="(item, index) in shareList">
				<img src="../../../static/image/logo.png" class="shareImg" />
				<span class="shareName">{{item.nickName}}</span>
				<van-button round class="cancelShare" @click="cancel(item.userId,item.deviceId)">取消分享</van-button>
			</li>
		</ul>
	</div>
</template>

<script>
	import tabbar from '../../components/tabbar'
	export default {
		data() {
			return {
				shareList: "",
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init(){
				this.$Axios.get("wechat/device/shareDeviceList",{
					params:{
						pageNum:1,
						pageSize:100,
						deviceId:this.$route.query.deviceId
					}
				}).then((res) => {
					if(res.data.success) {
						this.shareList = res.data.data.data;
					}
				})
			},
			onClickLeft(){
				this.$router.go(-1);
			},
			cancel(val, deviceId) {
				this.$dialog.confirm({
					message: '您确定要取消该用户分享吗？',
				}).then(() => {
					this.$Axios.post("wechat/device/removeShareUser", {
						"userId": val,
						"deviceId": deviceId
					}).then((res) => {
						if(res.data.success) {
							this.$toast("取消成功");
							this.init();
						}
					})
				})
			},
			sharaDevice() {
				if(this.$route.query.bindType ==2) {
					this.$toast("您是该设备分享用户，无法分享")
					return false;
				}
				this.$router.push({
					path: "/qrcode?deviceId=" + this.$route.query.deviceId
				});
			}
		}
	}
</script>
<style lang="scss" scoped>
	.share {
		.van-nav-bar .van-icon {
			color: #000;
			vertical-align: middle;
		}
		.nullShare {
			margin-top: 30%;
			text-align: center;
			img {
				width: 0.8rem;
				vertical-align: bottom;
			}
			.title {
				font-size: 0.13rem;
				color: #666666;
				text-align: center;
				line-height: 0.4rem;
				vertical-align: top;
			}
			.addShare {
				border:1px solid #CCCCCC;
				color: #333;
				background: none;
				font-size: 0.14rem;
				width: 1.4rem;
				margin-top: 0.2rem;
				vertical-align: top;
			}
		}
		.shareList {
			background: white;
			width: 100%;
			.shareUser {
				margin: 0px 0px 0px 0.15em;
				border-bottom: 1px solid #eee;
				height: 0.72rem;
				.shareImg {
					width: 0.48rem;
					margin: 0.1rem 0px;
					float: left;
				}
				.shareName {
					float: left;
					margin-left: 0.1rem;
					font-size: 0.16rem;
					color: #333333;
					width: 45%;
					letter-spacing: 0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					line-height: 0.72rem;
				}
				.cancelShare {
					float: right;
					margin: 0.15rem 0.15rem;
					vertical-align: top;
					font-size: 0.12rem;
					color: #267CFB;
					letter-spacing: 0;
					border: 1px solid #267CFB;
				}
			}
		}
	}
</style>