<template>
	<div class="assetsList">
		<Header :title="catalogueName" to="null"></Header>
		<div class="search" @click="search">
			<div class="searchBox">
				<van-icon name="search" />
				<span>搜索资产名称</span>
			</div>
		</div>
		<ul class="searchList">
			<li v-for="(item,index) in catalogue"  :key="index">
				<div class="left">
					<p class="name">{{item.model}}</p>
					<p class="detail"><span>资产：{{item.assetNums}}{{item.unit | nullDeal}}</span> <span>在用: {{item.usingNums}}{{item.unit | nullDeal}}</span></p>
				</div>
				<div class="right">
					<van-button v-if="item.assetNums-item.usingNums>0" class="apply" size="small" color="#229794" @click="apply(item.directoryId,item.model)"> 申请 </van-button>
				   <span v-else>
					 <p class="number error">{{ item.assetNums-item.usingNums}}</p>
					 <p class="title">在库 ({{item.unit}})</p>
					 </span>
				</div>
			</li>
		</ul>
		<!-- <div class="confirm_button">
			<van-button size="large" @click="confirm" class="confirm">扫码申请</van-button>
		</div> -->
		<div class="empty" v-show="catalogue.length==0">
			<img src="../../../static/images/record_empty_pic.png" />
			<p>无设备</p>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
               catalogueName: this.$route.params.name,
              catalogueId:this.$route.params.id,
			  catalogue: [],
			};
		},
		components:{
			Header
		},
		mounted() {
			this.init(this.$route.params.id);
		},
		methods: {
			init(id) {
				this.$Axios.get('/wechat/asset/directory/status/list?categoryId=' + id).then((res) => {
					if (res.success) {
						this.catalogue = res.data;
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
			skip(id,model){
				this.$router.push("/thing/"+id + "/" + model);
			},
			apply(id,model) {
				this.$cookies.remove("applyAsset");
				this.$router.push("/apply/" + id + '/' + this.catalogueName + "/" + model);
			},
			confirm(){
				window.android.skipToScan(2);
			}
		}
	}
</script>

<style lang="scss">
	.assetsList {
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
						font-size: 0.13rem;
					}

					.detail {
						color: #969799;
						font-size: 0.12rem;
						line-height: 0.2rem;
					}
				}

				.right {
					float: right;
					width: 25%;
					margin: 0 0.1rem;
					position: relative;
          .apply {
          	position: absolute;
          	top: 0.07rem;
          	right: 0rem;
          	z-index: 99;
          }
					.number {
						color: #229794;
						font-size: 0.12rem;
						text-align: right;
					}
					.error{
						color:#FF6034
            }
					.title {
						color: #969799;
						font-size: 0.12rem;
						line-height: 0.2rem;
						text-align: right;
					}
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
			.confirm {
				color: white;
				border-radius: 0.05rem;
				display: block;
				background: #229794;
			}
		}
	}
</style>
