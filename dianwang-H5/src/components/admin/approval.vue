<template>
	<div class="approval">
		<Header title="审批记录" to="/admin"></Header>
		<div class="search" @click="search">
			<div class="searchBox">
				<van-icon name="search" />
				<span>检索使用者姓名，空格为在库资产</span>
			</div>
		</div>
		<van-tabs v-model="activeName" color="#229794" title-active-color="#229794" @click="tab">
			<van-tab title="全部" name="0"></van-tab>
			<van-tab title="待审批" name="1"></van-tab>
			<van-tab title="已审批" name="2"></van-tab>
			<van-tab title="已完成" name="3"></van-tab>
		</van-tabs>
		<ul class="order">
			<li v-for="(item,index) in orders" :key="index">
				<div @click="detail(item.id)">
					<div class="orderDetail"><span class="deviceName">{{item.categoryName+"-"+item.model}}</span><span class="deviceNum">×
							1</span><span class="status" v-if="item.status==0">待审批</span></div>
					<div class="orderDetail"><span class="applyTime">申请时间：{{item.applyTime | showDate}}</span><span class="proposer">申请人：{{item.applicantName}}</span></div>
				</div>
				<div class="orderDetail" v-if="item.status==3 && item.applyStatus==0 && item.refuse==0">
					<van-button class="consent" size="small" color="#229794" @click="receive(item.id)"> 领用 </van-button>
				</div>
				<div class="orderDetail" v-if="item.verifyStatus+1==verifyStatus && item.refuse==0">
					<van-button class="consent" size="small" color="#229794" @click="consent(item.id)"> 同意 </van-button>
					<van-button class="refuse" size="small" @click="refuse(item.id)"> 拒绝 </van-button>
				</div>
				<div class="orderStatus pass" v-if="item.status==2 && item.verifyStatus==verifyStatus && item.refuse==0">通过并再审</div>
				<div class="orderStatus error" v-if="item.status==2 && item.verifyStatus==verifyStatus && item.refuse==1">拒绝并再审</div>
				<div class="orderStatus pass" v-if="item.status==3 && item.refuse==0">已完成</div>
				<div class="orderStatus error" v-if="item.status==3 && item.refuse==1">已拒绝</div>
				<div class="orderDetail" v-if="item.status>1 && item.refuse==1">
					<p class="reason">{{item.refuseReason}}</p>
				</div>
			</li>
		</ul>
		<div class="empty" v-show="orders.length==0">
			<img src="../../../static/images/device_empty_pic.png" />
			<p>暂无记录</p>
		</div>
		<van-dialog closeOnClickOverlay v-model="show" title="拒绝" @confirm="confirm">
			<van-field v-model="refuseReason" rows="3" autosize type="textarea" maxlength="100" placeholder="请输入拒绝理由"
			 show-word-limit />
		</van-dialog>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				activeName: "0",
				refuseReason: "",
				show: false,
				orders: [],
				refuseId: "",
				applyId: "",
				verifyStatus: this.$cookies.get("verifyStatus")
			};
		},
		components: {
			Header
		},
		mounted() {
			window.scanResult = this.scanResult;
			this.init(0);
		},
		methods: {
			scanResult(id) {
				this.$Axios.post('/wechat/asset/bind/asset', {
					assetId: id,
					applyId: this.applyId
				}).then((res) => {
					if (res.success) {
						this.$dialog.alert({
							message: '领用成功'
						}).then(() => {
							this.$router.push("/admin")
						});
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			init(num) {
				if (num != 0) {
					this.$Axios.get('/wechat/asset/applyRecord/list', {
						params: {
							"status": num,
							"pageNum": 1,
							"pageSize": 100,
						}
					}).then((res) => {
						if (res.success) {
							this.orders = res.data;
						} else {
							this.$toast(res.message);
						}
					}).catch((res) => {
						this.$toast(res.message);
					});
				} else {
					this.$Axios.get('/wechat/asset/all/applyRecord/list', {
						params: {
							"pageNum": 1,
							"pageSize": 100,
						}
					}).then((res) => {
						if (res.success) {
							this.orders = res.data;
						} else {
							this.$toast(res.message);
						}
					}).catch((res) => {
						this.$toast(res.message);
					});
				}
			},
			receive(id) {
				this.applyId = id;
				window.android.skipToScan(1);
			},
			search() {
				this.$router.push("/search")
			},
			consent(id) {
				this.$Axios.post('/wechat/asset/agree', {
					"id": id,
				}).then((res) => {
					if (res.success) {
						this.tab(2)
					} else {
						this.$toast("请求失败");
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			refuse(id) {
				this.show = true;
				this.refuseId = id;
			},
			tab(name) {
				this.init(name);
			},
			confirm() {
				if (this.refuseReason.length == 0) {
					this.$toast("请输入拒绝理由");
					return false;
				}
				this.$Axios.post('/wechat/asset/refuse', {
					"id": this.refuseId,
					"refuseReason": this.refuseReason
				}).then((res) => {
					if (res.success) {
						this.tab(2)
					} else {
						this.$toast("请求失败");
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			detail(id) {
				this.$router.push("/approvalDetail/" + id)
			}
		}
	}
</script>

<style lang="scss">
	.approval {
		.header {
					position: relative;
		
					.name {
						position: absolute;
						top: 0px;
						left: 0px;
						width: 60%;
						font-size: 0.2rem;
						color: #007069;
						font-weight: bold;
						line-height: 0.6rem;
						margin: 0 0.15rem;
					}
		
					.head {
						width: 0.4rem;
						height: 0.4rem;
						border-radius: 0.45rem 0.45rem;
						overflow: hidden;
						position: absolute;
						right: 0.15rem;
						top: 0.1rem;
					}
				}
		.search {
			margin: 0.1rem 0.12rem 0.1rem 0.15rem;
			height: 0.3rem;
			background: white;
			overflow: hidden;
			text-align: center;
			border-radius: 0.05rem;
			font-size: 0.1rem;
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

		.order {
			background: white;

			li {
				padding: 0.1rem 0;
				border-bottom: 0.01rem solid #eee;
				position: relative;

				.orderDetail {
					margin: 0 0.11rem;
					height: 0.25rem;

					.deviceName {
						float: left;
						font-size: 0.13rem;
						font-weight: bold;
						color: #333333;
					}

					.deviceNum {
						float: left;
						margin-left: 0.1rem;
						font-size: 0.12rem;
						color: #999999;
						line-height: 0.2rem;
					}

					.status {
						float: right;
						font-size: 0.12rem;
						color: #999999;
						line-height: 0.25rem;
					}

					.proposer,
					.applyTime {
						float: left;
						margin-right: 0.1rem;
						line-height: 0.25rem;
						font-size: 0.11rem;
						color: #999999;
					}

					.consent {
						float: right;
					}

					.refuse {
						float: right;
						color: #EC3131;
						border: none;
						margin-right: 0.1rem;
						background: rgba(236, 49, 49, 0.1);
					}

				}

				.orderStatus {
					position: absolute;
					top: 0.3rem;
					right: 0.11rem;
					font-size: 0.12rem;
				}

				.pass {
					color: #007069;
				}

				.error {
					color: #EC3131;
					top: 0.3rem;
				}

				.reason {
					width: 80%;
					font-size: 0.12rem;
					color: #EC3131;
					line-height: 0.25rem;
				}
			}
		}
	}
</style>
