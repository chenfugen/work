<template>
	<div class="device">
		<Header :title="deviceName" to="null"></Header>
		<div class="search" @click="search">
			<div class="searchBox">
				<van-icon name="search" />
				<span>检索使用者姓名，空格为在库资产</span>
			</div>
		</div>
		<van-tabs v-model="activeName" color="#229794" title-active-color="#229794" @click="tab">
			<van-tab title="全部" name="0"></van-tab>
			<van-tab title="在库" name="1"></van-tab>
			<van-tab title="在用" name="2"></van-tab>
		</van-tabs>
		<div class="confirm_button">
			<van-button size="large" color="#229794" class="createAsset" @click="createAsset()">录入新资产</van-button>
		</div>
		<ul class="searchList">
			<li v-for="(item,index) in directory">
				<div class="detailBox" @click="detail(item.id)">
					<div class="deviceDetail"><span class="deviceName">{{item.model}}</span><span v-if="item.status==0" class="deviceStatus">在库</span><span
						 v-if="item.status==1" class="deviceError">在用</span><span class="deviceError" v-if="item.repairStatus==1">维修</span></div>
					<div class="deviceDetail"><span class="user">使用者：{{item.user | nullDeal }}</span><span class="userTime">使用日期：{{item.createTime | showDate}}</span></div>
				</div>
				<van-button v-if="item.status==1" class="recycle" size="small" color="#229794" @click="recycle(item.id)"> 回收 </van-button>
			</li>
		</ul>

		<div class="empty" v-show="directory.length==0">
			<img src="../../../static/images/device_empty_pic.png" />
			<p>暂无设备</p>
		</div>
		<p style="height:0.4rem;"></p>
		
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				deviceName: this.$route.params.model,
				activeName: "0",
				directory: [],
				catalogueName: this.$route.params.name,
				assetName: this.$route.params.assetName
			};
		},
		components: {
			Header
		},
		mounted() {
			this.init(this.$route.params.id, -1);
		},
		methods: {
			init(id, num) {
				this.$Axios.get('/wechat/asset/list', {
					params: {
						"directoryId": id,
						"status": num,
						"pageNum": 1,
						"pageSize": 100
					}
				}).then((res) => {
					if (res.success) {
						this.directory = res.data;
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			search() {
				this.$router.push("/search")
			},
			createAsset() {
				this.$router.push("/newDevice/" + this.$route.params.id + "/" + this.catalogueName + "/" + this.assetName)
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
							this.init(this.$route.params.id, -1);
						} else {
							this.$toast(res.message);
						}
					}).catch((res) => {
						this.$toast(res.message);
					});
				}).catch(() => {
					// on cancel
				});
			},
			tab(name) {
				this.init(this.$route.params.id, name - 1);
			},
			detail(id) {
				this.$router.push("/deviceDetail/" + id)
			}
		}
	}
</script>

<style lang="scss">
	.device {
		height: 100%;

		.search {
			margin: 0.1rem 0.12rem 0.1rem 0.15rem;
			height: 0.3rem;
			background: white;
			overflow: hidden;
			text-align: center;
			border-radius: 0.05rem;
			font-size: 0.11rem;
			color: #999999;

			.searchBox {
				display: inline-block;
				width: 2rem;
				line-height: 0.3rem;
			}

			.van-icon {
				float: left;
				font-size: 0.12rem;
				margin-top: 0.1rem;
			}
		}

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
					width: 90%;

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

		.confirm_button {
			position: fixed;
			bottom: 0px;
			width: 100%;
			z-index: 999;
			left: 0px;
			-webkit-transform: translateZ(1);
			 transform: translate(1);
			  .createAsset {
				border-radius: 0.05rem;
				display: block;
			}
		}
	}
</style>
