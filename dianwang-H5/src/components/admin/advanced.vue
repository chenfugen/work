<template>
	<div class="advanced">
		<Header title="高级" to="/admin"></Header>
		<van-cell-group class="top">
			<van-field v-model="assetClass" placeholder="请选择" readonly label="资产分类" is-link @click="selectClass()" />
			<van-field v-model="assteVariety" placeholder="请选择" readonly label="资产名录" is-link @click="selectVariety()" />
			<van-field v-model="assetNum" placeholder="请输入"  label="资产编码" />
			<van-field v-model="assteStatus" placeholder="请选择" readonly label="资产状态" is-link @click="selectStatus()" />
			<van-field v-model="payTime" placeholder="请选择" readonly label="购置日期" is-link @click="selectPayTime()" />
			<van-field v-model="operatorName" placeholder="请输入" label="建档人员" />
		</van-cell-group>
		<van-cell-group class="top">
			<van-field v-model="company" placeholder="请选择" readonly label="公司" is-link @click="selectUnit()" />
			<van-field v-model="department" placeholder="请选择" readonly label="部门" is-link  @click="selectDepartment()" />
		<!-- 	<van-field v-model="operator" placeholder="请输入" label="申领人" /> -->
			<van-field v-model="user" placeholder="请输入" label="使用人" />
			<!-- <van-field v-model="useTime" placeholder="请选择" readonly label="使用时间" is-link @click="selecUseTime()" /> -->
		</van-cell-group>
		<div class="buttonBox">
			<van-button size="large" color="#229794" @click="confirm" class="confirm">确认</van-button>
			<van-button size="large" @click="reset" class="reset">重置</van-button>
		</div>
		<van-popup v-model="setPayTime" position="bottom">
			<van-tabs v-model="activeName" color="#229794" title-active-color="#229794">
				<van-tab title="开始时间" name="0">
					<van-datetime-picker type="datetime" :min-date="minDate"  @confirm="getstartTime" @cancel="dateCancel" />
				</van-tab>
				<van-tab title="结束时间" name="1">
					<van-datetime-picker type="datetime" :min-date="minDate"  @confirm="getendTime" @cancel="dateCancel" />
				</van-tab>
			</van-tabs>
		</van-popup>
		<van-popup v-model="setStatus" position="bottom">
			<van-cell-group>
				<van-cell v-for="(item,index) in statusList" :key="index" :title="item.name" is-link @click="getStatus(item)" />
			</van-cell-group>
		</van-popup>
		<van-popup v-model="setUseTime" position="bottom">
			<van-datetime-picker type="date" @confirm="getuseTime" @cancel="dateCancel" />
		</van-popup>
	</div>
</template>

<script>
	import Header from "../header/header.vue"
	export default {
		data() {
			return {
				"assetNum": "",
				"assetClass": "",
				"assteVariety": "",
				"assteStatus": "",
				"payTime": "",
				"status": "",
				"operatorName": "",
				"company": "",
				"department": "",
				"organizationId": "",
				"departmentId": "",
				"operator": "",
				"user": "",
				"useTime": "",
				"startTime": "",
				"endTime": "",
				 minDate: new Date(2020, 0, 1),
				"currentDate": new Date(),
				"setPayTime": false,
				"setUseTime": false,
				"setStatus": false,
				"activeName": "0",
				"statusList": [{
						"name": "全部",
						"status": -1,
					}, {
						"name": "在库",
						"status": 0,
					},
					{
						"name": "在用",
						"status": 1,
					}
				],
				"newAsset": "",
				"applyAsset": "",
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
				this.factory = this.newAsset.factory;
			}
			if (this.$cookies.get("applyAsset") != null) {
				this.applyAsset = this.$cookies.get("applyAsset");
				this.company = this.applyAsset.organization;
				this.department = this.applyAsset.department;
				this.organizationId = this.applyAsset.organizationId;
				this.departmentId = this.applyAsset.departmentId;
			}else{
				const applyAsset={};			
				this.$cookies.set("applyAsset",JSON.stringify(applyAsset));
			}
		},
		methods: {
			selectClass() {
				this.$router.push("/assetClass/?type=2");
			},
			selectVariety() {
				if (this.assetClass=="") {
					this.$toast("请先选择资产分类");
					return false;
				}
				this.$router.push("/assetList/" + this.newAsset.parentId + "/" + this.newAsset.assetName + "?type=2");
			},
			selectType() {
				this.$router.push("/assetClass");
			},
			selectStatus() {
				this.setStatus = !this.setStatus;
			},
			getStatus(item) {
				this.assteStatus = item.name;
				this.status = item.status;
				this.setStatus = false;
			},
			confirm() {
				const advanced = {
					parentId: this.newAsset.parentId,
					directoryId: this.newAsset.directoryId,
					startTime: (this.startTime).toString(),
					endTime: (this.endTime).toString(),
					operatorName:this.operatorName,
					organizationId:this.organizationId,
					departmentId:this.departmentId,
					status:this.status,
					assetNum: this.assetNum,
					user: this.user,
					pageSize: 100,
					pageNum:1,
				}
				this.$cookies.set("advanced", JSON.stringify(advanced));
				this.$router.push("/deviceList/"+this.newAsset.model);
			},
			reset() {
				this.assetNum = "";
				this.assetClass = "";
				this.assteVariety = "";
				this.assteStatus = "";
				this.payTime = "";
				this.status = "";
				this.bookRunner = "";
				this.company = "";
				this.department = "";
				this.operator = "";
				this.user = "";
				this.useTime = "";
				this.$cookies.remove("newAsset");
				this.$cookies.remove("applyAsset")
			},
			selectPayTime() {
				this.setPayTime = !this.setPayTime;
			},
			formatDate(value) {
				let date = new Date(value);
				let y = date.getFullYear();
				let MM = date.getMonth() + 1;
				MM = MM < 10 ? ('0' + MM) : MM;
				let d = date.getDate();
				d = d < 10 ? ('0' + d) : d;
				let h = date.getHours();
				h = h < 10 ? ('0' + h) : h;
				let m = date.getMinutes();
				m = m < 10 ? ('0' + m) : m;
				let s = date.getSeconds();
				s = s < 10 ? ('0' + s) : s;
				return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
			},
			selecUseTime() {
				this.setUseTime = !this.setUseTime;
			},
			getstartTime(value) {
				this.startTime = this.formatDate(value);
				this.activeName = "1";
			},
			getendTime(value) {
				this.endTime = this.formatDate(value);
				this.payTime = this.startTime + "~" + this.endTime
				this.setPayTime = false;
			},
			selectUnit() {
				this.$router.push("/units/1?type=1");
			},
			selectDepartment() {
				if(this.company==""){
					this.$toast("请选择所属公司!")
					return false;
				}
				this.$router.push("/department/" + this.applyAsset.organizationId + "/" + this.company+"?type=1");
			},
			selecDepart() {},
			getuseTime(value) {


			},
			dateCancel(value) {
				this.setPayTime = false;
				this.setUseTime = false;
			}
		}
	}
</script>

<style lang="scss">
	.advanced {
		.top {
			margin-top: 0.1rem
		}

		.buttonBox {
			margin: 0 0.12rem;
			position: relative;

			.confirm {
				color: white;
				border-radius: 0.05rem;
				position: absolute;
				top: 0.1rem;
			}

			.reset {
				position: absolute;
				top: 0.6rem;
				color: white;
				border-radius: 0.05rem;
				font-size: 0.13rem;
				color: #007069;
				background: rgba(34, 151, 148, 0.10);
			}
		}
	}
</style>
