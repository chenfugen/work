<template>
	<div class="faultMsg">
		<van-cell-group>
			<div class="van-cell-group van-hairline--top-bottom" v-for="item in faultList">
				<div class="van-cell">
					<img class="icon" src="../../../static/image/icon_fault_notice@2x.png" />
					<div class="van-cell__title">
						<span> {{item.deviceName}}</span>
						<div class="van-cell__label">{{item.faultName}}</div>
					</div>
					<div class="van-cell__value"><span>{{item.reportTime | formatTime}}</span></div>
				</div>
			</div>
		</van-cell-group>
		<div class="tellPhone" @click="goMore">
			<img src="../../../static/image/icon_fault_phone.png" />
		</div>
		<van-dialog v-model="show" show-cancel-button :before-close="beforeClose" confirm-button-text="拨打">
			<p class="content">客户热线 <span style="color:#1E9FFF;">400-8201199</span></p>
		</van-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				faultList: "",
				show: false
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$Axios.get("wechat/device/deviceCurrentFault", {
					params: {
						"productKey": this.$route.query.productKey,
						"deviceName": this.$route.query.deviceName,
					}
				}).then((res) => {
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
			goMore() {
				this.show = true;
			},
			onClickLeft() {
				this.$router.go(-1);
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
		.icon {
			width: 0.15rem;
			height: 0.15rem;
			/* margin: inherit; */
			margin: 0.03rem 0.02rem;
		}
		.tellPhone {
			position: fixed;
			width: 100%;
			height: 0.5rem;
			bottom: 0.05rem;
			img {
				float: right;
				width: 0.48rem;
				margin: 0.01rem 0.1rem;
			}
		}
	}
	
	.content {
		color: #bbb;
		font-size: 0.16rem;
		padding: 40px 0px;
		text-align: center;
	}
</style>