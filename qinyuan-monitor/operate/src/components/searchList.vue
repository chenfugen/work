<template>
	<div class="search">
		<el-form :inline="true" :model="searchParams" class="demo-form-inline">
			<el-form-item v-for="(item,index) in searchList" :key="index">
				<el-input v-if="item.type=='input'" v-model.trim="searchParams[item.prop]"  :min="item.min" :max="item.max" :type="item.typeMethod"
				 :placeholder="item.label" clearable></el-input>
				<el-select v-if="item.type=='select'" v-model="searchParams[item.prop]" :placeholder="item.label" :filterable="item.filterable"
				 clearable>
					<el-option v-for="(option,key) in item.options" :key="key" :label="option.label" :value="option.value"></el-option>
				</el-select>
				<el-cascader v-if="item.type=='cascader'" v-model="searchParams[item.prop]" :placeholder="item.label" :options="item.options"
				 clearable :Props="item.Props"></el-cascader>
				<el-date-picker v-if="item.type=='dateTime'" value-format="yyyy-MM-dd HH:mm:ss" v-model="searchParams[item.prop]"
				 :placeholder="item.label" type="datetime">
				</el-date-picker>
				<el-date-picker v-if="item.type=='date'" type="date" value-format="yyyy-MM-dd" v-model="searchParams[item.prop]"
				 :placeholder="item.label">
				</el-date-picker>
				<el-date-picker v-if="item.type=='daterange'" type="daterange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至"
				 start-placeholder="开始时间" end-placeholder="结束时间" v-model="searchParams[item.prop]" :default-time="['00:00:00', '23:59:59']">
				</el-date-picker>
				<el-autocomplete v-if="item.type=='autocomplete'" class="inline-input" v-model="searchParams[item.prop]"
				 :fetch-suggestions="querySearch" :placeholder="item.label"></el-autocomplete>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" @click="submitForm(formName)"></el-button>
				<el-button plain @click="resetForm(formName)">重置</el-button>
			</el-form-item>
			<el-form-item class="rBtn" v-if="isAdd">
				<el-button type="primary" @click="add('new')">{{buttonName}}</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		props: {
			searchList: {
				type: Array,
				default: () => {
					return []
				}
			},
			formName: {
				type: String,
				default: ""
			},
			searchParams: {
				type: Object,
				default: () => {
					return {}
				}
			},
			querySearch: {
				type: Function,
				default: () => {

				}
			},
			isAdd: {
				type: Boolean,
				default: false
			},
			buttonName: {
				type: String,
				default: ""
			},
		},
		data() {
			return {
				searchDate: [],
			}
		},
		created() {

		},
		methods: {
			submitForm(formName) {
				this.$emit('submitForm', formName);
			},
			resetForm(formName) {
				this.$emit('resetForm', formName);
			},
			add() {
				this.$emit('add');
			},
		}
	}
</script>

<style lang="scss">
	.search {
		.rBtn.el-form-item {
			float: right;
			margin: 0px 0px 20px 0px;
		}
	}
</style>
