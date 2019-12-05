<template>
	<div class="filterMsg">
		<van-nav-bar title="滤芯消息" @click-left="onClickLeft" left-arrow />
		<div class="messageList" v-for="item in messageList">
			<p class="messageTime">{{item.creatime}}</p>
			<div class="message">{{item.content}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				messageList: [{
						creatime: "2019.01.11 08.31",
						content: "这是故障消息，这是故障消息，这是故障消息，这是故障消息，这是故障消息，这是故障消息"
					},
					{
						creatime: "2019.01.11 08.31",
						content: "这是故障消息，这是故障消息，这是故障消息，这是故障消息，这是故障消息，这是故障消息"
					}
				]
			}
		},
		methods: {
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
	.filterMsg {
		.van-nav-bar .van-icon{
			color:#323233;
		}
		.messageList {
			margin: 0px 0.15rem;
		}
		.messageTime {
			font-size: 0.12rem;
			line-height: 0.3rem;
			text-align: center;
		}
		.message {
			font-size: 0.14rem;
			padding: 0.1rem 0.1rem;
			background: white;
		}
	}
</style>