<template>
	<div class="assets">
		<Header title="资产分类" to="/person"></Header>
		<ul class="assetsList">
			<li v-for="(item,index) in assets" :key="index" @click="assetDetail(item.parentId,item.parentName)" :class="{ floatLeft: (index%2!=0) }">
				<div class="assetsTop">
					<img class="head"  :src="imgUrl[index]">
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
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
                 assets: [],
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
		},
		components: {
			Header
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
			assetDetail(id,name) {
				this.$router.push("/appliance/"+id+"/"+name);
			}
		},
	}
</script>

<style lang="scss">
	.assets {	
		.assetsList {
			margin: 0 0.12rem;
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
						font-size: 0.12rem;
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
