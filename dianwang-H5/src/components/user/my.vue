<template>
	<div class="my">
		<p class="back">
			<van-icon name="arrow-left" @click="back" />
		</p>
		<van-image class="head" round width="0.6rem" height="0.6rem" src="../../../static/images/head_default.png" />
		<p class="userName">{{user.realName}}</p>
		<p class="userNum">（联系方式：<a :href="'tel:'+user.userName"></a>{{user.userName}}）</p>
		<p class="unit">
			<van-icon name="location-o" />
			<span>{{user.roleName}}</span>
		</p>
		<div class="catelog">
			<van-cell-group>
				<van-cell title="个人资料" to="/userinfo" icon="user-o" is-link />
				<van-cell title="修改密码" to="/changePass" icon="setting-o" is-link />
			</van-cell-group>
		</div>
		<div class="quit">
			<van-button block size="large" @click="quit">退出登录</van-button>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
               user:"",
			};
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$Axios.get('/manage/account/detail').then((res) => {
					if (res.success) {
						this.user=res.data;
					}
				}).catch((res) => {
					this.$toast(res.message);
				});

			},
			quit() {
				this.$dialog.confirm({
					message: '确认退出吗？'
				}).then(() => {
					this.$cookies.remove("token");
					this.$router.push("/");
				}).catch(() => {
					// on cancel
				});
			},
			back() {
				if(this.$cookies.get('type')==1){
					this.$router.push("/admin");
				}else{
		      this.$router.push("/person");
				}
			}
		}
	}
</script>

<style lang="scss">
	.my {
		.back {
			margin: 0 0.12rem;
			line-height: 0.4rem;
			font-size: 0.14rem;
		}

		.head {
			display: block;
			margin: 0.2rem auto 0 auto;
		}

		.userName {
			font-size: 0.15rem;
			text-align: center;
			color: #000000;
			font-weight: bold;
			line-height: 0.35rem;
		}

		.userNum {
			font-size: 0.12rem;
			text-align: center;
			color: #333;
		}

		.catelog {
			margin: 0.2rem 0.12rem 0.1rem 0.12rem;
			border-radius: 0.08rem 0.08rem;
			overflow: hidden;

			.van-cell__left-icon {
				color: #007069;
			}
		}

		.unit {
			font-size: 0.12rem;
			text-align: center;
			color: #999;
			line-height: 0.35rem;
		}

		.quit {
			margin: 0 0.12rem;
			color: #333;
			background: #fff;
			border-radius: 0.08rem 0.08rem;
			overflow: hidden;
		}
	}
</style>
