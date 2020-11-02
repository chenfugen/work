<template>
	<div class="createCatalogue">
		<Header title="新建资产名录" to="null"></Header>
		<van-cell-group>
			<van-field v-model="assetClass" placeholder="请选择资产分类" readonly label="资产分类" />
			<van-field v-model="assteVariety" placeholder="请选择资产品类" readonly label="资产品类" />
		</van-cell-group>
		<van-cell-group class="top">
			<van-field v-model="model" placeholder="请选择规格/型号" label="规格/型号" />
			<van-field v-model="unit" placeholder="计量单位" label="计量单位" />
			<van-field v-model="factory" placeholder="品牌/厂家" label="品牌/厂家" @input="input(factory)" />
		</van-cell-group>
		<van-cell-group class="top">
			<van-cell title="属性">
				<van-icon slot="right-icon" name="add-o" color="#229794" size="20" @click="add()" />
			</van-cell>
			<van-field v-for="(item,index) in attribute" :key="index" v-model="item.title" placeholder="请输入属性名称" :label="'属性' + (index+1)"
			 right-icon="close" @click-right-icon="del(index)" />
		</van-cell-group>
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
				assetClass: "",
				assteVariety: "",
				model: "",
				unit: "",
				factory: "",
				isConfirm: true,
				attribute: [],
				isAdd: true
			};
		},
		components: {
			Header
		},
		mounted() {
			this.assetClass = this.$route.params.assetName;
			this.assteVariety = this.$route.params.name;
		},
		methods: {
			save() {
				if (this.model.length == 0) {
					this.$toast("请输入规格/型号");
					return false;
				}
				if (this.unit.length == 0) {
					this.$toast("请输入单位");
					return false;
				}
				if (this.factory.length == 0) {
					this.$toast("请输入品牌/厂家");
					return false;
				}

				this.attribute.forEach((item) => {
					if (item.title == "") {
						this.$toast("属性值不能为空");
						this.isAdd = false;
						return false;
					}else{
						this.isAdd = true;
					}
				})
				if (this.isAdd) {
					this.$dialog.confirm({
						title: '保存完毕',
						message: '是否直接录入资产信息？',
						confirmButtonText: "录入"
					}).then(() => {
						this.$Axios.post('/wechat/asset/add/assetDirectory', {
							categoryId: this.$route.params.id,
							model: this.model,
							unit: this.unit,
							factory: this.factory,
							attribute: this.attribute.length > 0 ? JSON.stringify(this.attribute) : ""
						}).then((res) => {
							if (res.success) {
								this.$toast("新增成功");
								this.$router.back(-1);
							} else {
								this.$toast(res.message);
							}
						}).catch((res) => {
							this.$toast(res.message);
						});

					}).catch(() => {
						
					});
				}
			},
			add() {
				this.attribute.push({
					"title": "",
					"value": ""
				})
			},
			input(value) {
				this.isConfirm = value != "" > 0 ? false : true;
			},
			del(i) {
				this.attribute.splice(i, 1);
			}
		}
	}
</script>

<style lang="scss">
	.createCatalogue {
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

		.top {
			margin-top: 0.1rem;
		}
	}
</style>
