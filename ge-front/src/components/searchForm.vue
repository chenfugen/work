<template>
<div class="searchForm">
	<Form :model="filterForm" ref="filterForm" inline v-if='showForm'>
		<FormItem :prop="item.valName" v-for='(item,index) in configList' :key='index'>
			<!-- 输入框 -->
			<Input @on-enter='handleSearch' style="width:150px;" v-if='item.type=="input"' type="text" v-model="filterForm[item.valName]" :placeholder="item.plh" clearable class="filterInput">
			<!-- eslint-disable-next-line -->
			</Input>
			<!-- 选择器 -->
			<Select v-if='item.type=="select"' :style="{'width':item.width?item.width+'px':'150px'}" type="text" v-model="filterForm[item.valName]" :placeholder="item.plh" clearable class="filterInput">
				<Option v-for="selItem in item.selectList" :value="selItem[item.valueName]" :key="selItem[item.keyName]">{{selItem[item.labelName] }}</Option>
			</Select>
			<!-- 日期段选择器 字段名都为startTime endTime -->
			<DatePicker v-if='item.type=="dateRange"' :placeholder="item.plh" v-model="dateRange" type="datetimerange" class="DatePicker"></DatePicker>
			<!-- 地区级联选择器 -->
			<Cascader v-if='item.type=="region"' style="width:170px" v-model='filterForm[item.valName]' :data="region" :placeholder="item.plh" change-on-select clearable class="filterInput"></Cascader>
		</FormItem>
		<Button class="searchBtn" @click='handleSearch' type='primary'>
			<Icon type="ios-search" />
		</Button>
	</Form>
</div>
</template>

<script>
export default {
	name: 'searchForm',
	data() {
		return {
			showForm: true,
			filterForm: {},
			dateRange: [],
		}
	},
	computed: {
		region() {
			return this.$store.state.common.region
		}
	},
	props: {
		configList: Array,
	},
	created() {
		this.initForm()
	},
	methods: {
		// 组件构建前创建对应表单
		initForm() {
			for (let i in this.configList) {
				if (this.configList[i].type == 'dateRange') {
					this.filterForm.startTime = ''
					this.filterForm.endTime = ''
				} else if (this.configList[i].type == 'region') {
					this.filterForm[this.configList[i].valName] = []
				} else {
					this.filterForm[this.configList[i].valName] = ''
				}
			}
		},
		// 返还筛选数据至父组件
		handleSubmit() {
			if (this.dateRange.length > 1 && this.dateRange[0] !== '') {
				this.filterForm.startTime = this.dealTime(this.dateRange[0])
				this.filterForm.endTime = this.dealTime(this.dateRange[1])
			} else if (this.dateRange[0] == '' && this.dateRange[1] == '') {
				this.filterForm.startTime = ''
				this.filterForm.endTime = ''
			}
			for (let i in this.filterForm) {
				if (i == 'region') {
					this.filterForm.provinceId = this.filterForm.region[0]
					this.filterForm.cityId = this.filterForm.region[1]
					this.filterForm.regionId = this.filterForm.region[2]
				}
			}
			return this.filterForm
		},
		handleResetFields() {
			this.initForm()
		},
		// 处理时间显示形式
		dealTime(date) {
			return this.$Utils.dealTime(date)
		},
		// 调用搜索
		handleSearch() {
			this.$emit('handleSearch')
		},
	}
}
</script>
<style>
.filterInput {
	width: 200px;
}

.DatePicker {
	width: 300px;
}

.searchBtn {
	padding: 1px 6px;
	font-size: 18px;
}
</style>
