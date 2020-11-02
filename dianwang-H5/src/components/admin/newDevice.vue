<template>
	<div class="register">
		<Header title="新建资产名录" to="/admin"></Header>
		<van-cell-group>
			<van-field v-model="order.parentName" placeholder="请选择资产分类" readonly label="资产分类" />
			<van-field v-model="order.categoryName" placeholder="请选择资产品类" readonly label="资产品类" />
			<van-field v-model="order.model" placeholder="请选择规格/型号" readonly label="规格/型号" />
			<van-field v-model="order.unit" placeholder="计量单位" readonly label="计量单位" />
			<van-field v-model="order.factory" placeholder="品牌/厂家" readonly label="品牌/厂家" />
		    <van-field v-model="storeName" placeholder="请选择仓库" readonly label="入库仓库" is-link @click="selectStore" />
		</van-cell-group>
		<van-cell-group class="top" v-if="order.attribute">
			<van-field v-for="(item,index) in order.attribute" :key="index" placeholder="属性值" v-model="item.value"
			 :label="item.title" />
		</van-cell-group>
		<van-cell-group class="top">
			<van-field v-model="assetNum" placeholder="请输入资产数量" type="digit" label="资产数量" @input="isDefault" />
		</van-cell-group>
		<div class="confirm_button">
			<van-button size="large" @click="confirm" :disabled="isConfirm" class="confirm">生成二维码并且打印</van-button>
		</div>
		<van-popup v-model="show" position="bottom">
			<van-cell-group>
				<van-cell v-for="(item,index) in storeList" :key="index" :title="item.storeName" is-link @click="getStore(item)" />
			</van-cell-group>
		</van-popup>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				order: {
					parentName:"",
					categoryName:"",
					model: "",
					unit: "",
					factory: "",
					attribute: "",					
				},
				assetNum: "",
				isConfirm: true,
				id: this.$route.params.id,
				categoryId: this.$route.params.categoryId,
				storeList: [],
				storeName: "",
				storeId: "",
				show:false,
			};
		},
		components: {
			Header
		},
		mounted() {
			this.init(this.$route.params.id);
			this.getStoreList(1, 100);
		},
		methods: {
			init(id) {
				this.$Axios.get('/wechat/asset/directory/detail?directoryId=' + id).then((res) => {
					if (res.success) {
						this.order=res.data;
						this.order.parentName =this.$route.params.assetName;
						this.order.categoryName =this.$route.params.name;
						this.order.attribute = res.data.attribute == "" ? [] : JSON.parse(res.data.attribute);
					} else {
						this.$toast(res.message);
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			},
			getStoreList(pageNum, pageSize) {
				this.$Axios.get('/manage/room/store/list', {
					params: {
						pageNum: pageNum,
						pageSize: pageSize
					}
				}).then((res) => {
					if (res.success) {
						this.storeList = res.data.data;
					}
				})
			},
			selectStore() {
				this.show = true;
			},
			getStore(item) {
				this.storeName = item.storeName;
				this.storeId = item.id;
				this.show = false;
			},
			selectClass() {
				this.$router.push("/assetClass/?type=3");
			},
			selectVariety() {
				if (this.assetClass == "") {
					this.$toast("请先选择资产分类");
					return false;
				}
				this.$router.push("/assetList/" + this.newAsset.parentId + "/" + this.newAsset.assetName + "?type=3");
			},
			isDefault() {
				this.isConfirm = this.assetNum.length > 0 ? false : true;
			},
			confirm() {
				this.$Axios.post('/wechat/asset/add', {
					"categoryId": this.order.categoryId,
					"assetDirectoryId": this.$route.params.id,
					"nums": this.assetNum,
					"assetAttribute":this.order.attribute==undefined?"":JSON.stringify(this.order.attribute),
					"roomId":this.storeId,
				}).then((res) => {
					if (res.success) {
						this.$router.push("/qrcode/" + JSON.stringify(res.data));					
					}
				}).catch((res) => {
					this.$toast(res.message);
				});
			}
		}
	}
</script>

<style lang="scss">
	.register {
		.top {
			margin-top: 0.1rem;
		}

		.confirm_button {
			margin: 0.12rem auto;	
			.confirm {
				color: white;
				border-radius: 0.05rem;
				display: block;
				background: #229794;
			}
		}
	}
</style>
