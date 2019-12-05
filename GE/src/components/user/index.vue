<template>
	<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
		<div class="myUser">
			<div class="user" @click="routerTo('user')">
				<img class="user-poster" src="../../../static/image/me_bg.png">
				<img :src="headerImg" class="headImg" />
				<p class="nickName">{{userInfo.nickName}}</p>
				<p class="userPhone">{{userInfo.phone}}</p>
				<van-icon name="arrow" class="link" />
				</img>
			</div>
			<div class="user-group van-cell-group van-hairline--top-bottom">
				<div class="van-cell van-cell--clickable van-cell--large" @click="routerTo('message')">
					<i class="iconfont iconicon_message themeColor"></i>&nbsp;
					<div class="van-cell__title"><span> 消息</span></div><i class="van-icon van-icon-arrow van-cell__right-icon"></i></div>
				<div class="van-cell van-cell--clickable van-cell--large" @click="routerTo('customer')">
					<i class="iconfont iconicon_Customerservice themeColor"></i>&nbsp;
					<div class="van-cell__title"><span> 客服</span></div><i class="van-icon van-icon-arrow van-cell__right-icon"></i></div>
				<div class="van-cell van-cell--clickable van-cell--large" @click="routerTo('about')">
					<i class="iconfont iconicon_about themeColor"></i>&nbsp;
					<div class="van-cell__title"><span> 关于</span></div><i class="van-icon van-icon-arrow van-cell__right-icon"></i></div>
			</div>
			<div class="user-group van-cell-group van-hairline--top-bottom" style="margin-top: 10px;">
				<div class="van-cell van-cell--clickable van-cell--large" @click="routerTo('set')">
					<i class="iconfont iconicon_setting themeColor"></i>&nbsp;
					<div class="van-cell__title"><span> 设置</span></div><i class="van-icon van-icon-arrow van-cell__right-icon"></i></div>
			</div>
			<!--<div class="user-group van-cell-group van-hairline--top-bottom">
				<div class="van-cell van-cell--clickable van-cell--large" @click="routerTo('serve')">
					<i class="iconfont iconicon_repair themeColor"></i>&nbsp;
					<div class="van-cell__title"><span> 自主服务</span></div><i class="van-icon van-icon-arrow van-cell__right-icon"></i></div>
			</div>-->
			<van-dialog v-model="show" show-cancel-button :before-close="beforeClose" confirm-button-text="拨打">
				<p class="content">客户热线 <span style="color:#1E9FFF;">400-788-7171</span></p>
			</van-dialog>
			<tabbar :selected="selected"></tabbar>
		</div>
	</v-touch>
</template>
<script>
	import { Dialog } from 'vant';
	import tabbar from '../../components/tabbar'
	export default {
		data() {
			return {
				selected: 3,
				show: false,
				headerImg: "../../../static/image/icon_Default_avatar@2x.png",
				userInfo: "",
				MessageTotal: ""
			}
		},
		components: {
			tabbar,
			Dialog
		},
		mounted() {
			this.getUserInfo();
			this.init();
		},
		methods: {
			getUserInfo() {
				this.$Axios.get('wechat/user/detail').then((res) => {
					if(res.data.success) {
						this.userInfo = res.data.data;
						this.$store.dispatch('updateUserInfo', this.userInfo);
						this.headerImg = res.data.data.avatar + "?commonKey=" + this.$store.state.commonKey;
						this.area = this.userInfo.province + this.userInfo.city + this.userInfo.region;
					} else {
						this.$toast(res.data.message);
					}
				}).catch((err) => {
					console.log(err);
				})
			},
			init() {
				let that = this;
				that.$Axios.get("wechat/device/deviceFault/list").then((res) => {
					if(res.data.success) {
						that.MessageTotal = res.data.data.length.toString();
					}
				})
			},
			swiperleft() {
				console.log(1)
			},
			swiperright() {
				this.$router.push({
					'path': '/map'
				});
			},
			routerTo(e) {
				let routerName;
				switch(e) {
					case "user":
						routerName = "/userInfo";
						break;
					case "message":
						routerName = "/message";
						break;
					case "customer":
						this.show = true;
						break;
					case "about":
						routerName = "/about";
						break;
					case "set":
						routerName = "/set";
						break;
					case "serve":
						location.href = "https://wx.canature.com/crm2test/api/weixinsso/authorize?homeurl=/serveHome/intelligence/" + this.$cookies.get("openId");
						break;
					default:
						break;
				}
				if(e != "customer" && e != "serve") {
					this.$router.push(routerName);
				}
			},
			checkFault() {
				this.show = true;
			},
			beforeClose(action, done) {
				if(action === 'confirm') {
					window.location.href = "tel:4007887171";
					done();
				} else {
					done();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.myUser {
		.user_header {
			position: fixed;
			top: 0px;
			width: 100%;
			line-height: 0.4rem;
			background: none;
			font-size: 0.15rem;
			border: none;
			color: white;
			text-align: center;
			z-index: 9999;
		}
		.van-nav-bar .van-icon {
			color: white;
			vertical-align: middle;
		}
		.van-nav-bar__title {
			color: white;
			font-size: 0.14rem;
		}
		.user {
			width: 100%;
			display: block;
			overflow: hidden;
			height: 1.3rem;
			background: white;
			position: relative;
			margin-bottom: 0.1rem;
		}
		.user .user-poster {
			width: 100%;
			height: 1.3rem;
		}
		.headImg {
			position: absolute;
			width: 0.74rem;
			height: 0.74rem;
			background: white;
			border-radius: 50%;
			left: 5%;
			top: 50%;
			margin-top: -0.37rem;
			overflow: hidden;
		}
		.nickName {
			position: absolute;
			width: 20%;
			left: 30%;
			top: 25%;
			line-height: 0.4rem;
			font-size: 0.16rem;
			color: white;
		}
		.userPhone {
			position: absolute;
			width: 20%;
			left: 30%;
			top: 50%;
			line-height: 0.3rem;
			font-size: 0.14rem;
			color: white;
		}
		.link {
			position: absolute;
			right: 3%;
			top: 50%;
			width: 0.2rem;
			font-size: 0.14rem;
			color: #fff;
		}
		.themeColor {
			color: #005EB8;
		}
		.van-cell {
			position: relative;
		}
		.tag {
			position: absolute;
			right: 40px;
			top: 60px;
			z-index: 999;
		}
		.user .user-links {
			padding: 15px 0;
			font-size: 12px;
			text-align: center;
			background-color: #fff;
			.van-icon {
				display: block;
				font-size: 24px;
			}
		}
		.content {
			color: #bbb;
			font-size: 0.16rem;
			padding: 40px 0px;
			text-align: center;
		}
	}
</style>