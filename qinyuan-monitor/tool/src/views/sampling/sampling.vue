<template>
	<div class="sampling">
		<div class="header">
			<span class="exit" @click="exit">
				<img src="../../assets/image/nav_btn_logout.png" alt="退出">
				<span>退出</span>
			</span>
			<span class="title">检测工具</span>
			<span class="log" @click="log">检查记录</span>
		</div>
		<div class="searchCode" @click="searchCode">
			<img class="leftIcon" src="../../assets/image/home_icon_scan.png" alt="icon">
			<span v-if="filterCode==undefined">扫码/手动输入</span>
			<span v-else>{{filterCode}}</span>
			<img class="rightIcon" src="../../assets/image/common_icon_arrow_right.png" alt="right">
		</div>
		<div v-if="showResult" class="filterDetail" v-for="(item,index) in tableDable" :key="index">
			<p class="title">
				<span>
					数码信息
				</span>
				<!-- <van-button v-if="item.status === 200" round class="recycle" type="info" @click="submit(item.id)">回收</van-button> -->
			</p>
			<ul>
				<li>
					<span class="label">工单号</span>
					<span class="content">{{item.orderCode | codeDeal}}</span>
				</li>
				<li>
					<span class="label">产品型号</span>
					<span class="content">{{item.erpName | nullDeal}}</span>
				</li>
				<li>
					<span class="label">生产时间</span>
					<span class="content">{{item.checkTime | formatDate}}</span>
				</li>
				<li>
					<span class="label">ERP数码</span>
					<span class="content">{{item.erpCode | codeDeal}}</span>
				</li>
				<li>
					<span class="label">状态</span>
					<span class="content">{{item.status === 200 ? '已生产' : '待生产'}}</span>
				</li>
			</ul>
		</div>
		<van-popup v-model="show" round >
			<div class="popup">
				<p class="title">请选择抽检方式</p>
				<ul>
					<li class="line" @click="search">输入</li>
					<li @click="scan">扫码</li>
				</ul>
			</div>
		</van-popup>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableDable: [],
				showResult: false,
				filterCode: this.$route.query.filterCode,
				show: false
			}
		},
		filters:{
			codeDeal(str){			
				return str!=null?str.indexOf("HADLINKS_WKL_") != -1 ?str.split("HADLINKS_WKL_")[1]:str:"--"
			}
		},		
		mounted() {
			window.scanResult = this.scanResult;
			if (this.$route.query.filterCode != undefined) {
				this.checkTask(this.$route.query.filterCode)
			}
		},
		methods: {
			getFilter(name, url) {
				return (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(
					/\+/g, '%20') || null
			},
			scanResult(id) {	
				this.filterCode=this.getFilter("filter", id);
				this.checkTask(this.filterCode);				
			},
			log() {
				this.$router.push("/log");
			},
			searchCode() {
				this.show = true;
			},
			search() {
				this.$router.push("/search");
			},
			scan() {
				window.android.skipToScan(1);
			},
			checkTask(filterCode) {
				this.show = false;		
				let api = this.$Api.manage_spotCheck;
				this.$Axios.post(api, {
					filterCode: filterCode,
				}).then((res) => {
					if (res.success) {
						this.tableDable = res.data.resultList;
						this.showResult = true;
					} else {
						this.showResult = false;
						this.$toast.fail(res.message);
					}
				}).catch((res) => {});
			},
			exit() {
				this.$dialog.confirm({
					title: '提示',
					width: "30rem",
					message: '确定要退出该系统吗',
				}).then(() => {
					this.$cookies.remove("token");
					this.$router.push("/");
				}).catch(() => {});
			},
			submit(id) {
				this.$dialog.confirm({
					title: '提示',
					width: "30rem",
					message: '确定要回收该滤芯吗',
				}).then(() => {

				}).catch(() => {});
			}
		}
	}
</script>

<style lang="scss">
	.sampling {
		width: 100%;
		height: 100%;
		padding: 0px;
		margin: 0px;
		background: #F7F9FC;
		overflow: hidden;
		overflow-y: scroll;

		.header {
			width: 100%;
			color: #333333;
			position: relative;

			.exit {
				position: absolute;
				left: 0px;
				z-index: 100;

				img {
					float: left;
					width: 3rem;
					margin: 1rem;
				}

				span {
					display: inline-block;
					line-height: 4rem;
					margin: 0.6rem 0 0 0;
					font-size: 1.2rem;
				}
			}

			.title {
				position: absolute;
				left: 0px;
				width: 100%;
				z-index: 0;
				line-height: 4.5rem;
				text-align: center;
				font-size: 1.5rem;
			}

			.log {
				position: absolute;
				right: 0px;
				width: 6rem;
				display: inline-block;
				height: 4.5rem;
				line-height: 3rem;
				margin: 1rem;
				font-size: 1.2rem;
			}
		}

		.searchCode {
			background: #FFFFFF;
			height: 7.4rem;
			width: 90%;
			box-shadow: 0 12px 24px 0 rgba(57, 104, 176, 0.08);
			border-radius: 2rem;
			margin: 6rem auto 0rem auto;
			font-size: 1.5rem;
			color: #333333;

			.leftIcon {
				width: 7.4rem;
				float: left;
			}

			.rightIcon {
				width: 4rem;
				float: right;
				margin: 1.6rem 0;
			}

			span {
				display: inline-block;
				float: left;
				line-height: 7.4rem;
			}
		}

		.filterDetail {
			width: 86%;
			margin: 1rem auto;
			background: #FFFFFF;
			box-shadow: 0 12px 24px 0 rgba(57, 104, 176, 0.08);
			border-radius: 24px;
			padding: 2%;

			.title {
				font-size: 1.5rem;
				color: #333333;
				line-height: 60px;
				margin: 0px 20px;

				.recycle {
					float: right;
					margin: 10px auto;
				}
			}

			ul {
				width: 100%;

				li {
					display: inline-block;
					width: 400px;
					overflow: hidden;

					.label {
						float: left;
						display: inline-block;
						width: 150px;
						text-align: left;
						margin-left: 20px;
						font-size: 1.5rem;
						color: #999999;
						line-height: 40px;
					}

					.content {
						float: left;
						display: inline-block;
						width: 230px;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
						font-size: 1.5rem;
						color: #333333;
						line-height: 40px;
					}
				}
			}
		}

		.popup {
			width: 25rem;
			.title {
				text-align: center;
				line-height: 5rem;
				color: #333;
			}

			ul {
				width: 100%;

				li {
					float: left;
					width: 49.5%;
					line-height: 4rem;
					text-align: center;
					color: #333;
					border-top: 0.01rem solid #eee;
				}

				li:active {
					background: #eee;
				}

				.line {
					border-right: 0.01rem solid #eee;
				}
			}
		}


	}
</style>
