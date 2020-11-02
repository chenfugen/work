<template>
	<div class="assetClass">
		<Header title="资产分类" :to="url"></Header>
		<van-cell-group class="top">
			<van-cell v-for="(item,index) in assetClass" :key="index" :title="item.name" is-link @click="select(item.id,item.name)" />		
		</van-cell-group>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
          assetClass:[],
					url:this.$route.query.type==1?"/register":this.$route.query.type==2?"/advanced":"/newDevice"
			};
		},
		components: {
			Header
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				this.$Axios.get('/wechat/asset/parent/list').then((res) => {
					if (res.success) {
						this.assetClass = res.data;
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			select(id,name){
				const newAsset={
					"parentId":id,
					"assetName":name
				}
				this.$cookies.set("newAsset",JSON.stringify(newAsset));
        this.$router.push(this.url);
			}
		}
	}
</script>

<style lang="scss">
	.assetClass {
		.top{
			margin-top: 0.1rem;
		}
	}
</style>
