<template>
	<div class="deviceList">
		<Header :title="model" to="null"></Header>
		<ul class="searchList">
			<li v-for="(item,index) in order" >
				<div class="detailBox" @click="detail(item.id)">
					<div class="deviceDetail"><span class="deviceName">{{item.model}}</span><span v-if="item.status==0" class="deviceStatus">在库</span><span
						 v-if="item.status==1" class="deviceError">在用</span><span  v-if="item.repairStatus==1" class="deviceError">维修</span></div>
					<div class="deviceDetail"><span class="user">使用者：{{item.user | nullDeal }}</span><span class="userTime">使用日期：{{item.createTime | showDate}}</span></div>
				</div>
				<van-button  v-if="item.status==1"  class="recycle" size="small" color="#229794" @click="recycle(item.id)"> 回收 </van-button>
			</li>
		</ul>
		<div class="empty" v-show="order.length==0">
			<img src="../../../static/images/device_empty_pic.png" />
			<p>暂无设备</p>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				order: [],
				model: "查询结果"
			};
		},
		components: {
			Header
		},
		mounted() {
			this.init(this.$cookies.get("advanced"));
		},
		methods: {
			init(item) {
				this.$Axios.get('/wechat/asset/query', {
					params: item
				}).then((res) => {
					if (res.success) {
						this.order = res.data;
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			detail(id){
				this.$router.push("/deviceDetail/"+id);
			},
			recycle(id) {
				this.$dialog.confirm({
					message: '确认回收吗'
				}).then(() => {
					this.$Axios.post('/wechat/asset/recycle', {
						"assetId": id
					}).then((res) => {
						if (res.success) {
							this.$toast("回收成功");
						} else {
							this.$toast(res.message);
						}
					}).catch((res) => {
						this.$toast(res.message);
					});
				}).catch(() => {
					// on cancel
				});
			}
		}
	}
</script>

<style lang="scss">
	.deviceList {
		.empty {
			background: #ffffff;
			text-align: center;
			overflow: hidden;

			img {
				width: 0.8rem;
			}

			p {
				font-size: 0.12rem;
				color: #CCCCCC;
				line-height: 0.3rem;
				text-align: center;
				margin: -0.2rem 0 0.3rem 0;
			}
		}

		.searchList {
			background: white;

			li {
				padding: 0.1rem 0;
				border-top: 0.01rem solid #eee;
				position: relative;

				.detailBox {
					width: 80%;

					.deviceDetail {
						margin: 0 0.12rem;
						height: 0.25rem;

						.deviceName {
							float: left;
							font-size: 0.13rem;
							font-weight: bold;
							color: #333333;
						}

						.deviceStatus {
							float: left;
							margin-left: 0.1rem;
							background: rgba(34, 151, 148, 0.15);
							padding: 0.02rem 0.08rem;
							border-radius: 0.1rem;
							font-size: 0.1rem;
							color: #007069;
						}

						.deviceError {
							float: left;
							margin-left: 0.1rem;
							background: rgba(255, 64, 104, 0.15);
							padding: 0.02rem 0.08rem;
							border-radius: 0.1rem;
							font-size: 0.1rem;
							color: #EC3131;
						}

						.user,
						.userTime {
							float: left;
							margin-right: 0.1rem;
							line-height: 0.25rem;
							font-size: 0.1rem;
							color: #999999;
						}
					}
				}

				.recycle {
					position: absolute;
					top: 0.2rem;
					right: 0.12rem;
					z-index: 99;
				}
			}
		}
	}
</style>
