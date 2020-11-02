<template>
	<div class="thing">
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
		<ul class="searchList">
			<li v-for="(item,index) in directory">
				<div class="detailBox" @click="skip(item.id)">
					<div class="deviceDetail"><span class="deviceName">{{item.model}}</span><span v-if="item.status==0" class="deviceStatus">在库</span><span
						 v-if="item.status==1" class="deviceError">在用</span></div>
					<div class="deviceDetail"><span class="user">使用者：{{item.user | nullDeal }}</span><span class="userTime">使用日期：{{item.createTime | showDate}}</span></div>
				</div>
				<div class="right" v-if="item.status==0">
					<van-button class="apply" size="small" color="#229794" @click="apply(item.id,item.categoryName,item.model)"> 申请
					</van-button>
				</div>
			</li>
		</ul>
		<div class="empty" v-show="directory.length==0">
			<img src="../../../static/images/device_empty_pic.png" />
			<p>无设备</p>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				deviceName: this.$route.params.model,
				activeName: '0',
				directory: []
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
			tab(name) {
				this.init(this.$route.params.id, name - 1);
			},
			apply(id, name, model) {
				this.$cookies.remove("applyAsset");
				this.$router.push("/apply/" + id + '/' + name + "/" + model);
			},
			skip(id) {
				this.$router.push("/applydeviceDetail/" + id);
			}
		}
	}
</script>

<style lang="scss">
	.thing {
		.searchList {
			background: white;

			li {
				padding: 0.1rem 0;
				border-top: 0.01rem solid #eee;
				position: relative;

				.detailBox {
					width: 85%;
					.deviceDetail {
						margin: 0 0.12rem;
						height: 0.25rem;

						.deviceName {
							float: left;
							font-size: 0.15rem;
							font-weight: bold;
							color: #333333;
						}

						.deviceStatus {
							float: left;
							margin-left: 0.1rem;
							background: rgba(34, 151, 148, 0.15);
							padding: 0.02rem 0.08rem;
							border-radius: 0.1rem;
							font-size: 0.12rem;
							color: #007069;
						}

						.deviceError {
							float: left;
							margin-left: 0.1rem;
							background: rgba(255, 64, 104, 0.15);
							padding: 0.02rem 0.08rem;
							border-radius: 0.1rem;
							font-size: 0.12rem;
							color: #EC3131;
						}

						.user,
						.userTime {
							float: left;
							margin-right: 0.1rem;
							line-height: 0.25rem;
							font-size: 0.12rem;
							color: #999999;
						}
					}
				}

				.apply {
					position: absolute;
					top: 0.2rem;
					right: 0.12rem;
					z-index: 99;
				}
			}
		}

		.search {
			margin: 0.1rem 0.12rem 0.1rem 0.15rem;
			height: 0.3rem;
			background: white;
			overflow: hidden;
			text-align: center;
			border-radius: 0.05rem;
			font-size: 0.12rem;
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
	}
</style>
