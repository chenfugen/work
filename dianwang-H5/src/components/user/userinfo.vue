<template>
	<div class="userDetail">
		<Header title="个人资料" to="/my"></Header>
		<van-cell-group class="message">
			<van-cell title="姓名" :value="user.realName" />
			<van-cell title="手机号码" :value="user.userName" />			
			<van-cell title="角色名称" :value="user.roleName" />
			<van-cell title="属性" :value='user.type==1?"管理员":"操作员"' />
			<van-cell title="所属公司" :value="user.organizationName" />
			<van-cell title="所属部门" :value="user.departmentName" />
			<van-cell title="创建时间" :value="user.createTime" />
		</van-cell-group>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
                 user:""
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
				this.$Axios.get('/manage/account/detail').then((res) => {
					if (res.success) {
						this.user = res.data;
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			tell(phone){
				window.location.href = "tel:"+phone;
			}
		}
	}
</script>

<style lang="scss">
	.userDetail {
		.message {
			margin-top: 0.1rem;
		}
	}
</style>
