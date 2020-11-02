<template>
	<div class="person">
		<div class="header">
			<p class="name">智慧后勤管理系统</p>
			<img class="head" src="../../../static/images/head_default.png" @click="my()">
		</div>
		<div class="search" @click="search">
			<div class="searchBox">
				<van-icon name="search" />
				<span>搜索资产分类</span>
			</div>
		</div>
		<ul class="main">
			<li @click="scan()">
				<img src="../../../static/images/scan_nor.png" alt="扫码">
				<span>扫码</span>
			</li>
			<li @click="apply()">
				<img src="../../../static/images/apply_nor.png" alt="登记">
				<span>登记</span>
			</li>
			<li @click="senior()">
				<img src="../../../static/images/senior_nor.png" alt="高级">
				<span>高级</span>
			</li>
			<li @click="approval()">
				<img src="../../../static/images/approval_nor.png" alt="审批">
				<span>审批</span>
			</li>
		</ul>
		<ul class="assetsList">
			<li v-for="(item,index) in assets" :key="index" @click="assetDetail(item.parentId,item.parentName)" :class="{ floatLeft: (index%2!=0) }">
				<div class="assetsTop">
					<img class="head" round :src="imgUrl[index]">
					<span class="assetsName">{{item.parentName}}</span>
				</div>
				<div class="assetsDetails">
					<div class="catalogue">
						<p class="assetsNumber">{{item.directoryNums}}</p>
						<p class="assetsTitle">名录(个)</p>
					</div>
					<div class="assetsNum">
						<p class="assetsNumber">{{item.assetNums}}</p>
						<p class="assetsTitle">资产(件)</p>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				searchContent: "",
				assets: [],
				show: false,
				url: this.$store.state.url,
				imgUrl: [
					"../../../static/images/electrical_equipment_80.png",
					"../../../static/images/furniture_80.png",
					"../../../static/images/articles_80.png",
					"../../../static/images/real_estate_80.png",
					"../../../static/images/car_80.png",
					"../../../static/images/renovation_80.png"
				]
			};
		},
		mounted() {
			this.init();
			window.scanResult = this.scanResult;
			this.$cookies.remove("newAsset");
			this.$cookies.remove("applyAsset")
		},
		methods: {
			init() {
				this.$Axios.get('/wechat/asset/index').then((res) => {
					if (res.success) {
						this.assets = res.data;
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			scanResult(id) {
				this.$router.push("/deviceDetail/" + id);
			},
			search() {
				this.$router.push("/search")
			},
			my() {
				this.$router.push("/my")
			},
			assetDetail(id, name) {
				this.$router.push("/asset/" + id + "/" + name);
			},
			scan() {
				this.$dialog.confirm({
					message: '请选择操作方式',
					confirmButtonText: '扫码',
					cancelButtonText: '手动输入',
					closeOnClickOverlay: true,
				}).then(() => {
					window.android.skipToScan(1);
				}).catch(() => {
					this.$router.push("/deviceCode")
				});
			},
			apply() {
				this.$router.push("/register")
			},
			senior() {
				this.$router.push("/advanced")
			},
			approval() {
				this.$router.push("/approval")
			}
		}
	}
</script>

<style lang="scss">
	.person {
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
			margin: 0.6rem 0.15rem 0.1rem 0.15rem;
			height: 0.3rem;
			background: white;
			overflow: hidden;
			text-align: center;
			border-radius: 0.05rem;
			font-size: 0.1rem;
			color: #999999;

			.searchBox {
				display: inline-block;
				width: 1rem;
				line-height: 0.3rem;
			}

			.van-icon {
				float: left;
				font-size: 0.12rem;
				margin-top: 0.1rem;
			}
		}

		.main {
			margin: 0 0.15rem;
			border-radius: 0.1rem;
			overflow: hidden;
			background: url(../../../static/images/cyan_squre_bg_686.png) no-repeat;
			background-size: 100% 100%;
			height: 0.9rem;

			li {
				float: left;
				width: 25%;
				height: 1rem;
				font-size: 0.12rem;
				text-align: center;

				img {
					width: 0.35rem;
					margin: 0.15rem auto 0.05rem auto;

				}

				span {
					display: block;
					line-height: 0.23rem;
					text-align: center;
					color: white;
				}
			}
		}

		.assetsList {
			margin: 0 0.15rem;

			li {
				float: left;
				width: 48.5%;
				height: 1rem;
				background: white;
				font-size: 0.12rem;
				border-radius: 0.08rem;
				margin-top: 0.1rem;

				.assetsTop {
					margin: 0.1rem 0.13rem;
					height: 0.35rem;

					.head {
						float: left;
						width: 0.35rem;
						height: 0.35rem;
						border-radius: 0.4rem 0.4rem;
						overflow: hidden;
					}

					.assetsName {
						float: left;
						font-size: 0.1rem;
						color: #333;
						padding-left: 0.1rem;
						font-weight: bold;
						line-height: 0.4rem;
					}
				}

				.assetsDetails {
					margin: 0.1rem 0.13rem;
					height: 0.6rem;

					.catalogue {
						float: left;
						width: 50%;
						text-align: left;

						.assetsNumber {
							line-height: 0.2rem;
							font-weight: bold;
							color: #007069;
						}

						.assetsTitle {
							color: #999999;
							font-size: 0.1rem;
						}
					}

					.assetsNum {
						float: left;
						width: 50%;
						text-align: center;
						height: 0.6rem;

						.assetsNumber {
							line-height: 0.2rem;
							color: #007069;
							font-weight: bold;
						}

						.assetsTitle {
							color: #999999;
							font-size: 0.1rem;
						}
					}
				}
			}

			.floatLeft {
				margin-left: 3%;
			}
		}
	}
</style>
