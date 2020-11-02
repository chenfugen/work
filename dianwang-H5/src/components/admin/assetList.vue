<template>
	<div class="assetsList">
		<Header :title="assteName" to="/admin"></Header>
		<van-cell-group class="top">
			<van-cell v-for="(item,index) in asstes" :key="index" :title="item.categoryName" is-link @click="skip(item.categoryId,item.categoryName)" />		
		</van-cell-group>
		<div class="empty" v-show="asstes.length==0">
			<img src="../../../static/images/record_empty_pic.png" />
			<p>暂无资产</p>
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
				parentId:this.$route.params.id
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
					if(res.success) {						
						this.asstes = res.data;
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},			
			skip(id, name) {	
				const newAsset=this.$cookies.get("newAsset");
				newAsset["catalogueName"]=name;
				newAsset["categoryId"]=id;			
				this.$cookies.set("newAsset",JSON.stringify(newAsset))
				this.$router.push("/deviceSelect/" + id + "/" + name+"?type="+this.$route.query.type);
			},
			search() {
				this.$router.push("/search");
			},
			createAsset(id) {
				this.$router.push("/createAsset/"+id);
			}
		}
	}
</script>

<style lang="scss">
	.assetsList {
		.createAsset {
			position: fixed;
			bottom: 0px;
			background: #229794;
			color: white;
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
