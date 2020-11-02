<template>
	<div class="units">
		<Header title="使用单位" to="null"></Header>
		<van-cell-group class="cell">
			<van-cell v-for="(item,index) in units" key="index" :title="item.name" @click="department(item.id,item.name)"
			 is-link />
		</van-cell-group>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				units: []
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
				this.$Axios.get('/wechat/organization/list').then((res) => {
					this.units = res.data;
				}).catch((err) => {
					console.log(err);
				})
			},
			department(id,name) {
				const applyAsset = this.$cookies.get("applyAsset");
				applyAsset["organizationId"]=id;
				applyAsset["organization"]=name;
				applyAsset["assetId"] = this.$route.params.id;
				this.$cookies.set("applyAsset", JSON.stringify(applyAsset));
				this.$router.push("/department/" + id + "/" + name+"?type="+this.$route.query.type);
			}
		}
	}
</script>

<style lang="scss">
	.units {
		.cell {
			margin-top: 0.1rem;
			background: white;
		}
	}
</style>
