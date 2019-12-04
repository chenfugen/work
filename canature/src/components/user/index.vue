<template>
	<v-touch v-on:swipeleft="swiperleft" :swipe-options="{direction: 'horizontal'}" v-on:swiperight="swiperright" class="wrapper">
		<div class="myUser">
			<div class="user">
				<img class="user-poster" src="../../../static/image/userBg.png">
				<img :src="headerImg" class="headImg" />
				<p class="nickName">{{userInfo.nickName}}</p>
				</mg>
			</div>
			<div class="user-group van-cell-group van-hairline--top-bottom">
				<div class="van-cell van-cell--clickable van-cell--large" @click="routerTo('user')"><svg class="icon van-cell__left-icon" aria-hidden="true"><use xlink:href="#iconicon_personal"></use></svg>&nbsp;
					<div class="van-cell__title"><span> 个人资料</span></div><i class="van-icon van-icon-arrow van-cell__right-icon"></i></div>
				<div class="van-cell van-cell--clickable van-cell--large" @click="routerTo('message')"><svg class="icon van-cell__left-icon" aria-hidden="true"><use xlink:href="#iconicon_message"></use></svg>&nbsp;
					<div class="van-cell__title"><span> 消息</span></div><i class="van-icon van-icon-arrow van-cell__right-icon"></i></div>
			</div>
			<div class="user-group van-cell-group van-hairline--top-bottom" style="margin-top: 10px;">
				<div class="van-cell van-cell--clickable van-cell--large" @click="routerTo('customer')"><svg class="icon van-cell__left-icon" aria-hidden="true"><use xlink:href="#iconicon_Customerservice"></use></svg>&nbsp;
					<div class="van-cell__title"><span> 客服</span></div><i class="van-icon van-icon-arrow van-cell__right-icon"><!----></i></div>
				<div class="van-cell van-cell--clickable van-cell--large" @click="routerTo('about')"><svg class="icon van-cell__left-icon" aria-hidden="true"><use xlink:href="#iconicon_about"></use></svg>&nbsp;
					<div class="van-cell__title"><span> 关于</span></div><i class="van-icon van-icon-arrow van-cell__right-icon"><!----></i></div>
				<div class="van-cell van-cell--clickable van-cell--large" @click="routerTo('set')"><svg class="icon van-cell__left-icon" aria-hidden="true"><use xlink:href="#iconicon_setting"></use> </svg>&nbsp;
					<div class="van-cell__title"><span> 设置</span></div><i class="van-icon van-icon-arrow van-cell__right-icon"><!----></i></div>
			</div>
			<div class="user-group van-cell-group van-hairline--top-bottom" style="margin-top:10px">
					<div class="van-cell van-cell--clickable van-cell--large" @click="service"><svg class="icon van-cell__left-icon" aria-hidden="true"><use xlink:href="#iconicon_autonomousservice"></use> </svg>&nbsp;
					<div class="van-cell__title"><span> 自主服务</span></div><i class="van-icon van-icon-arrow van-cell__right-icon"><!----></i></div>
			</div>
			<p style="height:0.5rem;"></p>
			<van-dialog v-model="show" show-cancel-button :before-close="beforeClose" confirm-button-text="拨打">
				<p class="content">客户热线 <span style="color:#1E9FFF;">400-8201199</span></p>
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
					default:
						break;
				}
				if(e !="customer") {
					this.$router.push(routerName);
				}
			},
			checkFault() {
				this.show = true;
			},
			service(){
				location.href="https://wx.canature.com/crm2prod/api/weixinsso/authorize?homeurl=/serveHome/intelligence/"+this.$cookies.get("openId");
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
			height: 2rem;
			background: white;
			position: relative;
		}
		.user .user-poster {
			width: 100%;
			height: 2rem;
		}
		.headImg {
			position: absolute;
			width: 0.8rem;
			height: 0.8rem;
			background: white;
			border-radius: 50%;
			left: 50%;
			top: 40%;
			margin-left: -0.4rem;
			margin-top: -0.4rem;
			overflow: hidden;
		}
		.nickName {
			position: absolute;
			width: 100%;
			text-align: center;
			top: 60%;
			line-height: 0.4rem;
			font-size: 0.16rem;
			color: white;
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