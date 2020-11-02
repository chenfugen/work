<template>
	<div class="deviceDetail">
		<Header title="详情" to="null"></Header>
		<ul>
			<li>
				<span class="title">资产大类：</span>
				<span class="name">{{order.parentName| nullDeal }}</span>
			</li>
			<li>
				<span class="title">资产品类：</span>
				<span class="name">{{order.categoryName| nullDeal }}</span>
			</li>
			<li>
				<span class="title">规格/型号：</span>
				<span class="name">{{order.model| nullDeal }}</span>
			</li>
			<li>
				<span class="title">品牌/厂家：</span>
				<span class="name">{{order.factory| nullDeal }}</span>
			</li>
			<li v-for="(item,index) in order.attribute" :key="index">
				<span class="title">{{item.title+":"}}</span>
				<span class="name">{{item.value | nullDeal }}</span>
			</li>
			<li>
				<span class="title">资产状态：</span>
				<span class="deviceStatus" v-if="order.status==0">在库</span><span class="deviceError" v-if="order.status==1">在用</span><span
				 class="deviceError" v-if="order.repairStatus==1">维修</span>
			</li>
			<li>
				<span class="title">资产编码：</span>
				<span class="name">{{order.assetNum | nullDeal }}</span>
			</li>
			<van-divider />
			<li>
				<span class="title">使 用 者：</span>
				<span class="name">{{order.user| nullDeal }}</span>
			</li>
			<li>
				<span class="title">所属组织：</span>
				<span class="name">{{order.organizationName| nullDeal }}{{order.departmentName | nullDeal }}</span>
			</li>
			<li>
				<span class="title">使用日期：</span>
				<span class="name">{{order.useTime| nullDeal }}</span>
			</li>
			<van-divider />
			<li>
				<span class="title">建档人员：</span>
				<span class="name">{{order.operatorName| nullDeal }}</span>
			</li>
			<li>
				<span class="title">购置日期：</span>
				<span class="name">{{order.createTime| nullDeal }}</span>
			</li>
		</ul>
		<div class="buttonBox">
      <van-button v-if="order.status==0" class="print" size="large" color="#229794" @click="bind(order)">绑定</van-button>
			<van-button class="print" size="large" color="#229794" @click="print(order.id)">打印二维码</van-button>
			<van-button v-if="order.status==1" class="recovery" size="large" color="#229794" @click="recovery(order.id)">回收</van-button>
			<van-button v-if="order.repairStatus==0" class="maintain" size="large" @click="maintain(order.id)">申请维修</van-button>
			<van-button v-if="order.repairStatus==1" class="repairSuccess" color="#229794" size="large" @click="repairSuccess(order.id)">
				维修成功 </van-button>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				order: ""
			};
		},
		components: {
			Header
		},
		mounted() {
			window.printResult = this.printResult;
			this.init(this.$route.params.id);
		},
		methods: {
			printResult(value) {
				if (value == "1") {
					this.$dialog.alert({
						message: '二维码打印成功,返回首页'
					}).then(() => {
						this.$router.push("/admin")
					});
				} else {
					this.$dialog.alert({
						message: '打印失败，重新打印'
					}).then(() => {
						this.isConfirm = false;
					});
				}
			},
			init(id) {
				this.$Axios.get('/wechat/asset/detail?id=' + id).then((res) => {
					if (res.success) {
						this.order = res.data.asset;
						this.order.attribute = res.data.asset.attribute == "" ? [] : JSON.parse(res.data.asset.attribute);
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			print(id) {
				window.android.printCode(JSON.stringify({
					ids: new Array(id),
					assetNums: new Array(this.order.assetNum)
				}));
			},
      bind(order) {
		    this.$router.push("/bind/" + order.id + '/' +order.categoryName + "/" + order.model);
			},
			maintain(id) {
				this.$dialog.confirm({
					message: '确认要维修'
				}).then(() => {
					this.$Axios.post('/wechat/asset/repair', {
						"assetId": id
					}).then((res) => {
						if (res.success) {
							this.$toast("发送成功");
							this.init(this.$route.params.id);
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
			repairSuccess(id) {
				this.$dialog.confirm({
					message: '确认该资产已维修成功'
				}).then(() => {
					this.$Axios.post('/wechat/asset/repair/success', {
						"assetId": id
					}).then((res) => {
						if (res.success) {
							this.$toast("发送成功");
							this.init(this.$route.params.id);
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
			recovery(id) {
				this.$dialog.confirm({
					message: '确认回收吗'
				}).then(() => {
					this.$Axios.post('/wechat/asset/recycle', {
						"assetId": id
					}).then((res) => {
						if (res.success) {
							this.$toast("回收成功");
							this.init(this.$route.params.id);
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
	.deviceDetail {
		ul {
			margin: 0.1rem 0 0.4rem 0;
			background: #ffffff;

			li {
				margin: 0 0.12rem;
				font-size: 0.12rem;
				line-height: 0.35rem;

				.title {
					color: #999999;
				}

				.name {
					color: #333333;
				}

				.deviceStatus {
					margin-left: 0.1rem;
					background: rgba(34, 151, 148, 0.15);
					padding: 0.02rem 0.08rem;
					border-radius: 0.1rem;
					font-size: 0.1rem;
					color: #007069;
					line-height: 0.2rem;
				}

				.deviceError {
					margin-left: 0.1rem;
					background: rgba(255, 64, 104, 0.15);
					padding: 0.02rem 0.08rem;
					border-radius: 0.1rem;
					font-size: 0.1rem;
					color: #EC3131;
					line-height: 0.2rem;
				}
			}
		}

		.van-divider {
			margin: 0.1rem;
		}

		.apply {
			position: fixed;
			bottom: 0px;
		}

		.buttonBox {
			margin: 0 0.12rem;

			.recovery,
			.print {
				display: block;
				margin-top: 0.1rem;
			}

			.maintain {
				color: #007069;
				border: none;
				margin-top: 0.1rem;
				display: block;
				background: rgba(34, 151, 148, 0.1);
			}

			.repairSuccess {
				margin-top: 0.1rem;
				display: block;
				border: none;
			}
		}
	}
</style>
