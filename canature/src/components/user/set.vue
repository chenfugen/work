<template>
	<div>
		<van-cell title="更换手机号码" is-link to="/changePhone" class="phone">已绑定{{phone | phoneFilter}}</van-cell>
		<!--<div class="exit">
			<van-button round type="danger" @click="exit">注销账号</van-button>		
		</div>
		<p class="cancelHint">提示：注销账号，系统将永久删除您的账户，账户下绑定的设备也会相应解除，您分享给他人的设备也将不被使用</p>-->
	</div>
</template>

<script>
	export default {
		data() {
			return {
				phone: ""
			}
		},
		mounted() {
			this.phone = this.$store.state.userInfo.phone;
		},
		methods: {
			onClickLeft() {
				this.$router.push("/user");
			},
			exit(){
				this.$dialog.confirm({
					title: '注销账号',
					message: '您确定要注销该账号'
				}).then(() => {
					this.$Axios.get("wechat/user/logout").then((res) => {
						if(res.data.success) {
							this.$cookies.remove('Authorization');
							this.$store.state.client.end();
							WeixinJSBridge.call('closeWindow');
						}
					}).catch((res) => {
						console.log(res);
					})
				}).catch(() =>{
					// on cancel
				});
			}
		}
	}
</script>

<style>
	.phone {
		margin-top: 0.1rem;
	}
	
	.exit {
		padding: 10px 15px;
		text-align: center;
		height:0.7rem;
	}
	.cancelHint{
		margin:0 0.2rem;
		text-align: left;
		font-size:0.12rem;
		color: #FF4444;
	}
	.exit button {
		vertical-align: top;
		margin-top:30px;
		width: 100%;
	}
</style>