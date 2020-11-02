<template>
	<div class="createAsset">
		<Header title="新建资产分类" to="null"></Header>
		<p class="hint">分类名称不能超过10个字</p>
		<div class="code">
			<van-field v-model="value" placeholder="请输入分类名称" label="分类名称" @input="input" />
		</div>
		<div class="confirm_button">
			<van-button size="large" @click="save" :disabled="isConfirm" class="confirmButton">保存</van-button>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				value: "",
				isConfirm: true
			};
		},
		components: {
			Header
		},
		methods: {
			save() {
				if (this.value.length > 10) {
					this.$toast("分类名称不能超过10个字");
					return false;
				}
				this.$Axios.post('/wechat/asset/add/category',{
					name:this.value,
					parentId:this.$route.params.id
				}).then((res) => {
					if (res.success) {
						this.$toast("新增成功");
						this.value="";
						this.$router.back(-1);
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});			
			},
			input() {
				this.isConfirm = this.value.length > 0 ? false : true;
			},
		}
	}
</script>

<style lang="scss">
	.createAsset {
		.code {
			margin: 0rem 0.12rem;
		}

		.hint {
			margin: 0rem 0.12rem;
			font-size: 0.12rem;
			color: #666666;
			line-height: 0.4rem;
		}

		.van-field__right-icon .van-icon {
			font-size: 0.2rem;
		}

		.confirm_button {
			margin: 0.15rem 0.12rem;
			position: relative;

			.confirmButton {
				background: #229794;
				color: white;
				border-radius: 0.05rem;
				position: absolute;
				top: 0px;
			}
		}
	}
</style>
