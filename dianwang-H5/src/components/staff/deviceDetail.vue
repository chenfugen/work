<template>
	<div class="applyDeviceDetail">
		<Header title="XR79" to="null"></Header>
		<ul>
			<li>
				<span class="title">资产品类：</span>
				<span class="name">{{order.parentName| nullDeal }}</span>
			</li>
			<li>
				<span class="title">资产名录：</span>
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
				<span class="title">使 用 者：</span>
				<span class="name">{{order.user | nullDeal }}</span>
			</li>
			<van-divider />
			<li>
				<span class="title">申请状态：</span>
				<span class="name" :class="[order.refuse==1?'danger':'primary']">{{order.status+','+order.refuse | applyType}}</span>
			</li>
			<li>
				<span class="title">申 请 人：</span>
				<span class="name">{{order.applicantName| nullDeal }}</span>
			</li>
			<li>
				<span class="title">申请人号码：</span>
				<span class="name">{{order.applicant| nullDeal }}</span>
			</li>
			<li>
				<span class="title">所属组织：</span>
				<span class="name">{{order.organizationName+order.departmentName | nullDeal }}</span>
			</li>
			<li>
				<span class="title">申请日期：</span>
				<span class="name">{{order.applyTime| nullDeal }}</span>
			</li>

			<!-- 			<li>
				<span class="title">使用年限：</span>
				<span class="name">{{order.parentName| nullDeal }}</span>
			</li> -->
			<van-divider />
			<li>
				<span class="title">购置日期：</span>
				<span class="name">{{order.assetCreateTime| nullDeal }}</span>
			</li>
			<li>
				<span class="title">建档人员：</span>
				<span class="name">{{order.assetOperator| nullDeal }}</span>
			</li>
		</ul>
		<div class="buttonBox">
			<van-button v-if="order.status==0" class="apply" size="large" color="#229794" @click="apply(order.id,order.categoryName,order.model)">申请</van-button>
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
			this.init(this.$route.params.id);
		},
		methods: {
			init(id) {
				this.$Axios.get('/manage/asset/applyRecord/detail?id=' + id).then((res) => {
					if (res.success) {
						this.order = res.data.applyRecord;
						this.order.attribute = res.data.attribute == undefined || res.data.attribute == null ? [] : JSON.parse(res.data.attribute);
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			apply(id, name, model) {
				this.$cookies.remove("applyAsset");
				this.$router.push("/apply/" + id + '/' + name + "/" + model);
			},
		}
	}
</script>

<style lang="scss">
	.applyDeviceDetail {
		ul {
			margin: 0.1rem 0 0.4rem 0;
			background: #ffffff;

			li {
				margin: 0 0.12rem;
				font-size: 0.13rem;
				line-height: 0.35rem;

				.deviceStatus {
					margin-left: 0.05rem;
					background: rgba(34, 151, 148, 0.15);
					padding: 0.02rem 0.08rem;
					border-radius: 0.1rem;
					font-size: 0.12rem;
					color: #007069;
					line-height: 0.2rem;
				}

				.deviceError {
					margin-left: 0.05rem;
					background: rgba(255, 64, 104, 0.15);
					padding: 0.02rem 0.08rem;
					border-radius: 0.1rem;
					font-size: 0.12rem;
					color: #EC3131;
					line-height: 0.2rem;
				}

				.title {
					color: #999999;

				}

				.name {
					color: #333333;
				}

				.primary {
					color: #286CFF;
				}

				.danger {
					color: #F76260;
				}
			}
			}

			.van-divider {
				margin: 0.1rem;
			}

			.buttonBox {
				margin: 0 0.12rem;

				.apply {
					display: block;
				}
			}
		}
</style>
