<template>
	<div class="asset">
		<Header :title="assteName" to="/admin"></Header>
		<div class="search" @click="search">
			<div class="searchBox">
				<van-icon name="search" />
				<span>搜索资产分类</span>
			</div>
		</div>
		<ul class="searchList">
			<li v-for="(item,index) in asstes" :key="index" @click="skip(item.categoryId,item.categoryName)">
				<div class="left">
					<p class="name">{{item.categoryName}}</p>
					<p class="detail"><span>名录：{{item.directoryNums}} 个</span><span>&nbsp;&nbsp; 在用：{{item.usingNums}} {{item.unit | nullDeal}}</span></p>
				</div>
				<div class="right">
					<p class="number" :class="{ error:(item.assetNums-item.usingNums<=0) }">{{item.assetNums-item.usingNums}}</p>
					<p class="title">在库({{item.unit | nullDeal}})</p>
				</div>
			</li>
		</ul>
		<div class="empty" v-show="asstes.length==0">
			<img src="../../../static/images/record_empty_pic.png" />
			<p>暂无设备</p>
		</div>
		<div class="confirm_button">
			<van-button size="large" color="#229794" class="createAsset" @click="createAsset(parentId)">新建资产分类</van-button>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				asstes: [],
				assteName: this.$route.params.name,
				parentId: this.$route.params.id
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
				this.$Axios.get('/wechat/asset/category/status/list?parentId=' + id).then((res) => {
					if (res.success) {
						this.asstes = res.data;
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			onSearch() {
				if (this.content == "" || this.content == undefined) {
					this.$toast("请输入搜索条件");
					this.searchBox = false;
					return false;
				}
				console.log(this.content);
				// 				this.address=[];
				// 				for(let i in addr) {
				// 					for(let j in addr[i].item) {
				// 						if(this.searchContent == addr[i].item[j].city || this.searchContent == addr[i].item[j].firststr || this.inputText == addr[i].item[j].firststr.toLowerCase()) {
				// 							this.address.push(addr[i].item[j]);
				// 							this.searchBox = true;
				// 						}
				// 					}
				// 				}
				// 				console.log(this.address);
			},
			skip(id, name) {
				this.$router.push("/catalogue/" + id + "/" + name + "/" + this.assteName);
			},
			search() {
				this.$router.push("/search");
			},
			createAsset(id) {
				this.$router.push("/createAsset/" + id);
			}
		}
	}
</script>

<style lang="scss">
	.asset {
		.searchList {
			background: white;

			li {
				padding: 0.1rem 0;
				border-bottom: 1px solid #E0E0E0;
				height: 0.35rem;

				.left {
					float: left;
					width: 60%;
					margin: 0 0.1rem;

					.name {
						color: #333;
						font-size: 0.12rem;
						color: #333;
						font-weight: bold;
					}

					.detail {
						color: #969799;
						font-size: 0.1rem;
						line-height: 0.2rem;
					}
				}

				.right {
					float: right;
					width: 25%;
					margin: 0 0.1rem;

					.number {
						color: #229794;
						font-size: 0.12rem;
						text-align: right;
					}

					.error {
						color: #FF0000;
					}

					.title {
						color: #969799;
						font-size: 0.1rem;
						line-height: 0.2rem;
						text-align: right;
					}
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
			font-size: 0.11rem;
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

		.confirm_button {
			position: fixed;
			bottom: 0px;
			width: 100%;

			.createAsset {
				border-radius: 0.05rem;
				display: block;
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
