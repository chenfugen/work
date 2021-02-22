<template>
	<div class="deviceSetUp">
		<div style="position: relative" class="clearfloat">
			<!-- 设备信息 -->
			<Card class="clearfloat">
				<div
					class="left"
					style="
						font-size: 16px;
						font-family: PingFang-SC-Bold;
						color: #3f4656;
					"
				>
					{{ infoForm.deviceName }}
				</div>
				<div
					class="left DI-deviceStatusBox DI-nice marginLeft marginBottom"
				>
					正常
				</div>
				<div
					class="left DI-deviceStatusBox marginLeft marginBottom"
					:style="{
						background:
							infoForm.status == 'online' ? '#2D8CF0' : '#999',
					}"
				>
					{{ infoForm.status == "online" ? "在线" : "离线" }}
				</div>
			</Card>
			<div class="left marginTop" style="width: 49%" v-if="showCard">
				<!-- 设备相关 -->
				<Card>
					<p slot="title">设备相关</p>
					<Form inline :label-position="'right'" :label-width="170">
						<FormItem
							class="formItem"
							v-for="(item, index) in classAList"
							:key="index"
							:label="item.propertyName + '：'"
						>
							<span>{{ dealData(item) }}</span>
							<Button
								class="marginLeft"
								:type="item.disabled ? 'text' : 'success'"
								@click="handleEdit(item)"
							>
								<Icon
									v-if="item.disabled"
									type="ios-create-outline"
									style="color: #2d8cf0; fontsize: 22px"
								/>
								<span v-else>完成</span>
							</Button>
						</FormItem>
					</Form>
				</Card>
				<!-- 服务设置 -->
				<Card class="marginTop">
					<p slot="title">服务设置</p>
					<Form inline :label-position="'right'" :label-width="170">
						<FormItem
							class="formItem"
							v-for="(item, index) in classCList"
							:key="index"
							:label="item.propertyName + '：'"
						>
							<span>{{ dealData(item) }}</span>
							<Button
								class="marginLeft"
								:type="item.disabled ? 'text' : 'success'"
								@click="handleEdit(item)"
							>
								<Icon
									v-if="item.disabled"
									type="ios-create-outline"
									style="color: #2d8cf0; fontsize: 22px"
								/>
								<span v-else>完成</span>
							</Button>
						</FormItem>
					</Form>
				</Card>
			</div>
			<div class="marginTop right" style="width: 49%" v-if="showCard">
				<!-- 授权 -->
				<Card>
					<p slot="title">授权</p>
					<Form inline :label-position="'right'" :label-width="170">
						<FormItem
							class="formItem"
							v-for="(item, index) in classBList"
							:key="index"
							:label="item.propertyName + '：'"
						>
							<span>{{ dealData(item) }}</span>
							<Button
								class="marginLeft"
								:type="item.disabled ? 'text' : 'success'"
								@click="handleEdit(item)"
							>
								<Icon
									v-if="item.disabled"
									type="ios-create-outline"
									style="color: #2d8cf0; fontsize: 22px"
								/>
								<span v-else>完成</span>
							</Button>
						</FormItem>
					</Form>
				</Card>
			</div>
			<!-- <Spin v-if='pageLoading' fix></Spin> -->
		</div>
		<Modal v-model="dialog" :title="dialogTitle" @on-ok="handleSubmit">
			<editComp ref="editComp"></editComp>
		</Modal>
	</div>
</template>

<script>
import editComp from "./editComp";
export default {
	name: "deviceSetUp",
	data() {
		return {
			dialog: false,
			showCard: true,
			pageLoading: true,
			dialogTitle: "",
			dialogType: "",
			dialogValue: {},
			deviceInfo: {},
			infoForm: {},
			propertyList: [],
			propertyInfoForm: [],
			classAList: [],
			classBList: [],
			classCList: [],
			classDList: [],
		};
	},
	components: {
		editComp,
	},
	methods: {
		handleSetInfo(data) {
			this.deviceInfo = data;
			this.getProductPropety();
		},
		// 获取产品属性
		getProductPropety() {
			let para = {
				productKey: this.deviceInfo.productKey,
			};
			this.$Ax
				.get(this.$api.manage_product_property_list, {
					params: para,
				})
				.then((res) => {
					this.propertyList = res.data.data;
					this.hanldeClassification();
				})
				.catch((err) => {
					console.log(err);
				});
		},
		// 属性分类
		hanldeClassification() {
			let list = this.propertyList,
				listA = [],
				listB = [],
				listC = [],
				listD = [];
			for (let i = 0, len = list.length; i < len; i++) {
				list[i].disabled = true;
				switch (list[i].propertyType) {
					case 1:
						listA.push(list[i]);
						break;
					case 2:
						listB.push(list[i]);
						break;
					case 3:
						listC.push(list[i]);
						break;
					default:
				}
			}
			this.propertyList = list;
			// this.classAList = listA;
			// this.classBList = listB;
			// this.classCList = listC;
			// this.classDList = Object.assign(listA, listB, listC);
			this.getDeviceInfo();
			this.getAttData(listA, listB, listC);
		},
		// 获取设备详情
		getDeviceInfo() {
			let api = this.$api.manage_device_detail,
				para = {
					id: this.deviceInfo.id,
				};
			this.$Ax
				.get(api, {
					params: para,
				})
				.then((res) => {
					this.infoForm = res.data.device;
				})
				.catch((err) => {
					/* eslint-disable */
					console.log(err);
					/* eslint-enable */
				});
		},
		// 获取设备属性数据
		getAttData(lA, lB, lC) {
			let listA = Object.assign([], lA),
				listB = Object.assign([], lB),
				listC = Object.assign([], lC),
				api = this.$api.manage_device_getDeviceProperty,
				para = {
					productKey: this.deviceInfo.productKey,
					deviceName: this.deviceInfo.deviceName,
				};
			this.$Ax
				.get(api, {
					params: para,
				})
				.then((res) => {
					for (let i in listA) {
						if (res.data[listA[i].identifier]) {
							listA[i].value =
								res.data[listA[i].identifier].value;
						} else {
							listA[i].value = null;
						}
					}
					for (let i in listB) {
						if (res.data[listB[i].identifier]) {
							listB[i].value =
								res.data[listB[i].identifier].value;
						} else {
							listB[i].value = null;
						}
					}
					for (let i in listC) {
						if (res.data[listC[i].identifier]) {
							listC[i].value =
								res.data[listC[i].identifier].value;
						} else {
							listC[i].value = null;
						}
					}
					this.$set(this, "classAList", listA);
					this.$set(this, "classBList", listB);
					this.$set(this, "classCList", listC);
				})
				.catch((err) => {
					/* eslint-disable */
					console.log(err);
					/* eslint-enable */
				});
		},
		// 提交表单
		handleSubmit() {
			let data = this.$refs.editComp.handleSubmit();
			let api = this.$api.common_setDeviceProperty,
				para = {
					productKey: this.deviceInfo.productKey,
					deviceName: this.deviceInfo.deviceName,
					message: JSON.stringify({
						[data.propInfo.identifier]: data.value,
					}),
				};
			this.$Ax
				.post(api, para)
				.then((res) => {
					if (res.success) {
						this.$Message.success("设置成功！");
					}
					this.getProductPropety();
				})
				.catch((err) => {
					/* eslint-disable */
					console.log(err);
					/* eslint-enable */
				});
		},
		// 开启变量可编辑
		handleEdit(item) {
			this.dialog = true;
			this.dialogTitle = item.propertyName + "(" + item.dataType + ")";
			this.dialogValue = item;
			if (
				item.dataType == "int" ||
				item.dataType == "float" ||
				item.dataType == "double"
			) {
				this.dialogValue.value = Number(item.value);
			}
			this.$refs.editComp.setItemData(this.dialogValue);
		},
		// 处理数据
		dealData(obj) {
			if (obj.value == null) {
				return "--";
			} else if (obj.dataType == "bool") {
				return obj.dataRange[obj.value.toString()];
			} else {
				return obj.value;
			}
		},
	},
};
</script>

<style lang="css" scoped>
.formItem {
	width: 48%;
}
.formInput {
	width: 120px;
}
.DI-signal-icon {
	width: 65px;
	height: 65px;
	/* margin-bottom: 16px; */
	background-size: 100% 100%;
}
.DI-signal-png-1 {
	background-image: url(../../assets/signal_1.png);
}
.DI-signal-png-2 {
	background-image: url(../../assets/signal_2.png);
}
.DI-signal-png-3 {
	background-image: url(../../assets/signal_3.png);
}
.deviceInfo .demo-Circle-inner {
	display: none;
}
.DI-deviceStatusBox {
	width: 44px;
	height: 20px;
	border-radius: 20px;
	color: white;
	text-align: center;
	font-size: 10px;
	line-height: 20px;
}
.DI-nice {
	background: #5fd487 100%;
}
</style>
