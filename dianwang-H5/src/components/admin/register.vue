<template>
	<div class="register">
		<Header title="登记" to="/admin"></Header>
		<van-cell-group>
			<van-field v-model="assetClass" placeholder="请选择资产分类" readonly label="资产分类" is-link @click="selectClass()" />
			<van-field v-model="assteVariety" placeholder="请选择资产品类" readonly label="资产品类" is-link @click="selectVariety()" />
			<van-field v-model="assteType" placeholder="请选择规格/型号" readonly label="规格/型号" />
			<van-field v-model="unit" placeholder="计量单位" label="计量单位" readonly />
			<van-field v-model="factory" placeholder="品牌/厂家" label="品牌/厂家" readonly />
			<van-field v-model="storeName" placeholder="请选择仓库" readonly label="入库仓库" is-link @click="selectStore" />
		</van-cell-group>
		<van-cell-group class="top" v-if="attribute.length>0">
			<van-field v-for="(item,index) in attribute" :key="index" placeholder="属性值" v-model="item.value" :label="item.title" />
		</van-cell-group>
		<van-cell-group class="top">
			<van-field v-model="assetNum" placeholder="请输入资产数量" type="digit" label="资产数量" @input="isDefault" />
		</van-cell-group>
		<van-popup v-model="show" position="bottom">
			<van-cell-group>
				<van-cell v-for="(item,index) in storeList" :key="index" :title="item.storeName" is-link @click="getStore(item)" />
			</van-cell-group>
		</van-popup>
		<div class="confirm_button">
			<van-button size="large" @click="confirm" :disabled="isConfirm" class="confirm">生成二维码并且打印</van-button>
		</div>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				"unit": "",
				"assetClass": "",
				"assteVariety": "",
				"assteType": "",
				"assetNum": "",
				"factory": "",
				"isConfirm": true,
				"newAsset": "",				
				attribute: [],
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
			if (this.$cookies.get("newAsset") != null) {
				this.newAsset = this.$cookies.get("newAsset");
				this.assetClass = this.newAsset.assetName;
				this.assteVariety = this.newAsset.catalogueName;
				this.assteType = this.newAsset.model;
				this.unit = this.newAsset.unit;
				this.attribute = this.newAsset.attribute == undefined || this.newAsset.attribute == "" ? [] : JSON.parse(this.newAsset
					.attribute);
				this.factory = this.newAsset.factory;
			}
			this.getStoreList(1, 100);
		},
		methods: {
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
			selectClass() {
				this.$router.push("/assetClass/?type=1");
			},
			selectVariety() {
				if (this.assetClass == "") {
					this.$toast("请先选择资产分类");
					return false;
				}
				this.$router.push("/assetList/" + this.newAsset.parentId + "/" + this.newAsset.assetName + "?type=1");
			},
			selectType() {
				this.$router.push("/assetClass");
			},
			selectStore() {
				this.show = true;
			},
			getStore(item) {
				this.storeName = item.storeName;
				this.storeId = item.id;
				this.show = false;
			},
			isDefault() {
				this.isConfirm = this.assetNum.length > 0 ? false : true;
			},
			confirm() {
				this.$Axios.post('/wechat/asset/add', {
					"categoryId": this.newAsset.categoryId,
					"assetDirectoryId": this.newAsset.directoryId,
					"nums": this.assetNum,
					"assetAttribute": this.attribute.length == 0 ? "" : JSON.stringify(this.attribute),
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
			margin: 0.15rem auto;
			position: relative;

			.confirm {
				color: white;
				border-radius: 0.05rem;
				position: absolute;
				top: 0px;
				background: #229794;
			}
		}
	}
</style>
