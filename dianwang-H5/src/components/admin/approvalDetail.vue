<template>
	<div class="approvalDetail">
		<Header title="详情" to="/approval"></Header>
		<ul>
			<li>
				<span class="title">使 用 人：</span>
				<span class="name">{{order.user | nullDeal }}</span>
			</li>
			<li>
				<span class="title">使用组织：</span>
				<span class="name">{{order.organizationName | nullDeal }}{{order.departmentName | nullDeal }}</span>
			</li>
			<li>
				<span class="title">申 领 人：</span>
				<span class="name">{{order.applicantName | nullDeal }}</span>
			</li>
			<li>
				<span class="title">申领人号码：</span>
				<span class="name">{{order.applicant | nullDeal }}</span>
			</li>
			<li>
				<span class="title">审批状态：</span>
				<span class="name pass" v-if="order.status==1">审批中</span>
				<span class="name pass" v-if="order.status==2 && order.refuse==0">通过并再审</span>
				<span class="name error" v-if="order.status==2 && order.refuse==1">拒绝并再审</span>
				<span class="name pass" v-if="order.status==3 && order.refuse==0">已完成</span>
				<span class="name error" v-if="order.status==3 && order.refuse==1">已拒绝</span>
			</li>
			<li>
				<span class="title" v-if="order.status>1 && order.refuse==1">拒绝理由：</span>
				<span class="name error" v-if="order.status>1 && order.refuse==1">{{order.refuseReason | nullDeal }}</span>
			</li>
		</ul>
		<ul>
			<li>
				<span class="title">资产大类：</span>
				<span class="name">{{order.parentName | nullDeal }}</span>
			</li>
			<li>
				<span class="title">资产品类：</span>
				<span class="name">{{order.categoryName | nullDeal }}</span>
			</li>
			<li>
				<span class="title">规格/型号：</span>
				<span class="name">{{order.model | nullDeal }}</span>
			</li>
			<li>
				<span class="title">品牌/厂家：</span>
				<span class="name">{{order.factory | nullDeal }}</span>
			</li>
			<!-- <li>
				<span class="title">屏幕尺寸：</span>
				<span class="name">{{order.user | nullDeal }}</span>
			</li>
			<li>
				<span class="title">配 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 置：</span>
				<span class="name">{{order.user | nullDeal }}</span>
			</li> -->			
		</ul>
		<van-dialog closeOnClickOverlay v-model="show" title="拒绝" @confirm="confirm">
			<van-field v-model="refuseReason" rows="3" autosize type="textarea" maxlength="100" placeholder="请输入拒绝理由"
			 show-word-limit />
		</van-dialog>		
		<div class="buttonBox" v-if="order.verifyStatus+1==verifyStatus && order.refuse==0">
			<van-button class="consent" size="large" color="#229794" @click="consent(order.id)"> 同意 </van-button>
			<van-button class="refuse" size="large" @click="refuse(order.id)"> 拒绝 </van-button>
		</div>
		<div class="buttonBox" v-if="order.status==3 && order.applyStatus==0 && order.refuse==0">
			<van-button  class="consent" size="large" color="#229794" @click="receive(order.id)"> 领用 </van-button>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				order: "",
				refuseReason: "",
				show: false,
				refuseId: "",
				applyId:"",
				verifyStatus:this.$cookies.get("verifyStatus")
			};
		},
		components: {
			Header
		},
		mounted() {
			window.scanResult=this.scanResult;
			this.init(this.$route.params.id);
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
							this.$router.push("/approval")
						});
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			receive(id){
				this.applyId=id;
				window.android.skipToScan(1);
			},
			init(id) {
				this.$Axios.get('/wechat/asset/applyRecord/detail?id=' + id).then((res) => {
					if (res.success) {
						this.order = res.data;
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			consent(id) {
				this.$Axios.post('/wechat/asset/agree', {
					"id": id,
				}).then((res) => {
					if (res.success) {
						this.$toast("请求成功");
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
			}
		}
	}
</script>

<style lang="scss">
	.approvalDetail {
		ul {
			margin: 0.1rem 0 0.1rem 0;
			background: #ffffff;

			li {
				margin: 0 0.12rem;
				font-size: 0.13rem;
				line-height: 0.35rem;

				.title {
					color: #999999;

				}

				.name {
					color: #333333;
				}

				.pass {
					color: #007069;
				}

				.error {
					color: #EC3131;
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
			margin: 0rem 0.12rem;
			position: relative;

			.consent {
				top: 0.1rem;
				position: absolute;
			}

			.refuse {
				top: 0.7rem;
				position: absolute;
				color: #EC3131;
				border: none;
				margin-right: 0.1rem;
				background: rgba(236, 49, 49, 0.1);
			}
		}


	}
</style>
