<template>
	<div class="admin">
		<div class="header">
			<p class="name">智慧后勤管理系统</p>
			<van-image class="head" round src="../../../static/images/head_default.png" @click="my()" />
		</div>
		<div class="search" @click="search">
			<div class="searchBox">
				<van-icon name="search" />
				<span>搜索资产分类</span>
			</div>
		</div>
		<div class="assetsClassify">
			<van-cell value="查看更多" is-link url="#/assets">
				<template slot="title">
					<span class="custom-title">资产分类</span>
				</template>
			</van-cell>
			<ul class="assetsList">
				<li v-for="(item,index) in assets" :key="index" @click="skip(item.parentId,item.parentName)" :class="{floatLeft:index%2==1}"
				 :style='{background:"url("+ bgUrl[index] + ") no-repeat"}'>
					<img :src="imgUrl[index]" :alt="item.parentName">
					<span class="assetsName">{{item.parentName}}</span>
				</li>
			</ul>
		</div>
		<div class="applyLog">
			<van-cell value="查看更多" url="#/applyLog" is-link>
				<template slot="title">
					<span class="custom-title">申请记录</span>
				</template>
			</van-cell>
			<van-cell-group>
				<van-cell :class="[item.refuse==1?'error':'list']" v-for="(item,index) in applyLog" :key="index" :title="item.categoryName+'('+item.model+') ×1'"
				 :value="item.status+','+item.refuse | applyType" :url="'#/applydeviceDetail/'+item.id" :label='"申请时间: " +item.applyTime.split(" ")[0] +" 使用者:" +item.user' />
			</van-cell-group>
		</div>
		<div class="empty" v-show="applyLog.length==0">
			<img src="../../../static/images/device_empty_pic.png" />
			<p>暂无记录</p>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				assets: [],
				applyLog: [],
				bgUrl: [
					"../../../static/images/blue_squre_bg_nor.png",
					"../../../static/images/red_squre_bg_nor.png",
					"../../../static/images/yellow_squre_bg_nor.png",
					"../../../static/images/cyan_squre_bg_nor.png",
				],
				imgUrl: [
					"../../../static/images/electrical_equipment_icon.png",
					"../../../static/images/furniture_icon.png",
					"../../../static/images/articles_icon.png",
					"../../../static/images/real_estate_icon.png"
				]
			};
		},
		mounted() {
			this.init();
			this.getApplyLog();
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
			getApplyLog() {
				this.$Axios.get('/wechat/asset/personal/applyRecord/list', {
					params: {
						status: 0,
						pageNum: 1,
						pageSize: 5
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
			my() {
				this.$router.push("/my")
			},
			search() {
				this.$router.push("/search")
			},
			skip(id, name) {
				this.$router.push("/appliance/" + id + "/" + name)
			}
		}
	}
</script>

<style lang="scss">
	.admin {
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
			margin: 0.6rem 0.12rem 0.1rem 0.15rem;
			height: 0.3rem;
			background: white;
			overflow: hidden;
			text-align: center;
			border-radius: 0.05rem;
			font-size: 0.12rem;
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

		.assetsClassify {
			background: #fff;
			height: 2.3rem;

			.custom-title {
				font-size: 0.14rem;
				color: #333333;
				font-weight: bold;
			}

			.assetsList {
				margin: 0 0.15rem;
				overflow: hidden;

				.floatLeft {
					margin-left: 3%;
				}

				li {
					float: left;
					width: 48.5%;
					background-size: 100% 100%;
					height: 0.8rem;
					font-size: 0.14rem;
					margin-top: 0.1rem;
					text-align: center;
					border-radius: 0.05rem;

					img {
						width: 0.4rem;
						margin-top: 0.1rem;
					}

					span {
						display: block;
						text-align: center;
						color: white;
						font-size: 0.12rem;
						line-height: 0.25rem;
					}
				}
			}
		}

		.applyLog {
			margin-top: 0.1rem;

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
