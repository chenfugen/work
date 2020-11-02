<template>
	<div class="deviceSelect">
		<Header :title="catalogueName" to="null"></Header>
		<van-cell-group class="top">
			<van-cell v-for="(item,index) in catalogue" :key="index" :title="item.model" is-link @click="skip(item.directoryId,item.model,item.unit,item.factory,item.attribute)" />		
		</van-cell-group>
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
				url:this.$route.query.type==1?"/register":this.$route.query.type==2?"/advanced":"/newDevice",
				catalogueName: this.$route.params.name,
				catalogue: [],
				catalogueId:this.$route.params.id
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
				this.$Axios.get('/wechat/asset/directory/list?categoryId=' + id).then((res) => {
					if (res.success) {
						this.catalogue = res.data;
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			skip(id,model,unit,factory,attribute) {
				const newAsset=this.$cookies.get("newAsset");
				newAsset["directoryId"]=id;
				newAsset["model"]=model;
				newAsset["unit"]=unit;
				newAsset["factory"]=factory;
				newAsset["attribute"]=attribute;			
				newAsset["catalogueName"]=this.catalogueName;
				this.$cookies.set("newAsset",JSON.stringify(newAsset))
				this.$router.push(this.url);
			},
			search() {
				this.$router.push("/search");
			}
		}
	}
</script>

<style lang="scss">
	.deviceSelect {
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

		.createCatalogue {
			position: fixed;
			bottom: 0px;
			color: white;
			background: #229794;
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
