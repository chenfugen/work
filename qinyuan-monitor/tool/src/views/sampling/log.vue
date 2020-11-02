<template>
	<div class="log">
		<div class="header">
			<span class="back" @click="back">
				<img src="../../assets/image/nav_btn_back.png" alt="退出">
			</span>
			<div class="title">检查记录</div>
		</div>
		<ul style="margin-top:5rem">
			<li class="record" v-for="(item,index) in logList" :key="index" @click="showPopup(item)">
				<span class="id">{{item.erpName==null?"***":item.erpName}} ({{item.erpCode | codeDeal}})</span>
				<span class="time">{{item.checkTime | formatDate}}</span>
				<span class="userName">{{item.status ==200?'已生产':'待生产'}}  检测人:{{item.checkUserName}}</span>
			</li>
		</ul>
		<p></p>
		<van-popup v-model="show" round >
			<div class="filterDetail">
				<p class="title">
					<span>
						数码信息
					</span>
					<!-- <van-button v-if="item.status === 200" round class="recycle" type="info" @click="submit(item.id)">回收</van-button> -->
				</p>
				<ul>
					<li>
						<span class="label">工单号</span>
						<span class="content">{{log.orderCode | nullDeal}}</span>
					</li>
					<li>
						<span class="label">产品型号</span>
						<span class="content">{{log.erpName | nullDeal}}</span>
					</li>				
					<li>
						<span class="label">ERP数码</span>
						<span class="content">{{log.erpCode | codeDeal}}</span>
					</li>
					<li>
						<span class="label">检测人</span>
						<span class="content">{{log.checkUserName}}</span>
					</li>
					<li>
						<span class="label">状态</span>
						<span class="content">{{log.status === 200 ? '已生产' : '待生产'}}</span>
					</li>
					<li>
						<span class="label">生产时间</span>
						<span class="content">{{log.checkTime | formatDate}}</span>
					</li>
				</ul>
			</div>	
		</van-popup>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				logList: [],
				log: {},
				show: false
			}
		},
		mounted() {
			this.getLog();
		},
		filters:{
			codeDeal(str){			
				return str!=null?str.indexOf("HADLINKS_WKL_") != -1 ?str.split("HADLINKS_WKL_")[1]:str:"--"
			}
		},		
		methods: {
			showPopup(item) {
				this.log = item;
				this.show = true;
			},
			back() {
				this.$router.push("/sampling");
			},
			getLog() {
				let api = this.$Api.manage_getSpotCheckRecordPageList;
				this.$Axios.get(api, {
					params: {
						pageNum: 1,
						pageSize: 100,
					}
				}).then((res) => {
					if (res.success) {
						this.logList = res.data;
					} else {
						this.$toast.fail(res.message);
					}
				}).catch((res) => {});
			}
		}
	}
</script>

<style lang="scss">
	.log {
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
			position: fixed;
			top: 0px;
			height: 4.5rem;
			background: #F7F9FC;

			.back {
				position: absolute;
				left: 0px;
				z-index: 100;

				img {
					float: left;
					width: 3rem;
					margin: 1rem 0 1rem 1rem;
				}
			}

			.title {
				position: absolute;
				left: 0px;
				width: 100%;
				z-index: 0;
				line-height: 4.5rem;
				font-size: 1.5rem;
				text-align: center;
			}
		}

		.record {
			background: #FFFFFF;
			height: 80px;
			width: 90%;
			box-shadow: 0 12px 24px 0 rgba(57, 104, 176, 0.08);
			border-radius: 2rem;
			margin: 2rem auto;
			font-size: 1.5rem;
			color: #333333;

			.id {
				float: left;
				font-size: 1.3rem;
				display: inline-block;
				width: 33%;
				color: #333333;
				line-height: 80px;
				margin-left:1rem;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
			}

			.userName {
				float: left;
				width: 33%;
				display: inline-block;
				font-size: 1rem;
				color: #666666;
				line-height: 80px;
				margin-left:1rem;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				word-break: break-all;
			}

			.time {
				float: right;
				font-size: 1rem;
				color: #999999;
				line-height: 80px;
				margin-right:1rem;
			}
		}
		.filterDetail {
			width: 86%;
			margin: 1rem auto;
			background: #FFFFFF;
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
						display: inline-block;
						width:30%;
						float: left;
						text-align: left;
						margin-left: 20px;
						font-size: 1.5rem;
						color: #999999;
						line-height: 40px;
					}
		
					.content {
						float: left;
						font-size: 1.5rem;
						color: #333333;
						line-height: 40px;
						display: inline-block;
						width:65%;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						word-break: break-all;
					}
				}
			}
		}
		
		
	}
</style>
