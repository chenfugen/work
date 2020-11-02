<template>
	<div class="applyLog">
		<Header title="申请记录" to="null"></Header>
		<div class="search" @click="search">
			<div class="searchBox">
				<van-icon name="search" />
				<span>检索使用者姓名，空格为在库资产</span>
			</div>
		</div>
		<van-tabs v-model="activeName" color="#229794" title-active-color="#229794" @click="tab">
			<van-tab title="全部" name="1"></van-tab>
			<van-tab title="待审批" name="2"></van-tab>
			<van-tab v-if="verifyStatus!=2" title="审批中" name="3"></van-tab>
			<van-tab title="已完成" name="4"></van-tab>
		</van-tabs>
		<van-cell-group class="applyList">
			<van-cell :class="[item.refuse==1?'error':'list']" v-for="(item,index) in applyLog" :key="index" :title="item.categoryName+'('+item.model+') ×1'"
			 :value="item.status+','+item.refuse | applyType" :url="'#/applydeviceDetail/'+item.id" :label='"申请时间: " +item.applyTime.split(" ")[0] +" 使用者:" +item.user' />
		</van-cell-group>
		<div class="empty" v-show="applyLog.length==0">
			<img src="../../../static/images/device_empty_pic.png" />
			<p>暂无记录</p>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				activeName: "0",
				empty: false,
				applyLog: [],
				verifyStatus: this.$cookies.get("verifyStatus")
			};
		},
		components: {
			Header
		},
		mounted() {
			this.getApplyLog(0);
		},
		methods: {
			getApplyLog(num) {
				this.$Axios.get('/wechat/asset/personal/applyRecord/list', {
					params: {
						status: num,
						pageNum: 1,
						pageSize: 100
					}
				}).then((res) => {
					if (res.success) {
						this.applyLog = res.data;
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
				this.getApplyLog(name - 1);
			}
		}
	}
</script>

<style lang="scss">
	.applyLog {
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

		.applyList {
			margin-top: 0rem;

			.custom-title {
				font-size: 0.14rem;
				color: #333333;
				font-weight: bold;
			}

			.van-cell {
				color: #333;
				padding: 15px 16px;
			}

			.van-cell__label {
				width: 150%;
			}

			.list {
				.van-cell__value {
					color: #286CFF;
				}
			}

			.error {
				.van-cell__value {
					color: #F76260;
				}
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
