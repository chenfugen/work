<template>
	<div class="faultMsg">
		<div class="messageList" v-for="item in faultList">
			<p class="messageTime">{{item.reportTime | formatTime}}</p>
			<div class="message">
				<div class="faultImage"><img src="../../../static/image/icon_fault_notice.png" /></div> 设备{{item.deviceName+" "+item.faultName}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				faultList: "",
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$Axios.get("wechat/device/deviceFault/list").then((res) => {
					if(res.data.success) {
						this.faultList = res.data.data;
					}
				})
			},
			onClose(clickPosition, instance) {
				switch(clickPosition) {
					case 'left':
					case 'cell':
					case 'outside':
						instance.close();
						break;
					case 'right':
						Dialog.confirm({
							message: '确定删除吗？'
						}).then(() => {
							instance.close();
						});
						break;
				}
			},
			onClickLeft() {
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="scss">
	.faultMsg {
		.van-nav-bar .van-icon {
			color: #323233;
		}
		.messageList {
			margin: 0.05rem 0.15rem;
		}
		.messageTime {
			font-size: 0.12rem;
			line-height: 0.3rem;
			text-align: center;
		}
		.message {
			.faultImage {
				display: inline-block;
				width: 0.15rem;
				img {
					width: 100%;
					vertical-align: middle;
				}
			}
			font-size: 0.14rem;
			padding: 0.1rem 0.1rem;
			background: white;
		}
	}
</style>