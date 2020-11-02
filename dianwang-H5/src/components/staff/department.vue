<template>
	<div class="department">
		<Header title="使用部门" to="null"></Header>
		<van-cell-group class="cell">
			<van-cell v-for="(item,index) in departments" key="index" :title="item.departmentName" @click="department(item.departmentId,item.departmentName)" is-link />
		</van-cell-group>
		<div class="empty" v-show="departments.length==0">
			<img src="../../../static/images/record_empty_pic.png" />
			<p>暂无数据</p>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				type:this.$route.query.type,
				departments: [],
				name:this.$route.params.company,
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
				this.$Axios.get('/wechat/organization/department/list?organizationId='+id).then((res) => {
					this.departments = res.data;					
				}).catch((err) => {
					console.log(err);
				})
			},
			department(id,name){
				const applyAsset=this.$cookies.get("applyAsset");
				applyAsset["departmentId"]=id;
				applyAsset["department"]=name;
				this.$cookies.set("applyAsset",JSON.stringify(applyAsset));
				if(this.type==2){
					this.$router.push("/apply/"+applyAsset.assetId+"/"+applyAsset.name+"/"+applyAsset.model);
				}else{
					this.$router.push("/advanced");
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.department {
		.cell {
			margin-top: 0.1rem;
			background: white;
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
