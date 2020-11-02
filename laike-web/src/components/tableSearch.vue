<template>
<div id="com-tableSearch">
	<!-- <el-button v-for="item in tableSearch.btn" :key="item.name" plain style="float:left;margin-bottom:12px" type="danger" size="mini" @click="item.clickInfo">{{item.name}}</el-button> -->
	<span v-for="item in tableSearch.btn" :key="item.name" :class="tableSearch.selectArry.length==0 && (item.name.indexOf('批量')!= -1)?'tabSear-disabled':'tabSear-isExport'" style="margin-right:8px" @click="item.clickInfo?item.clickInfo():$message.warning('无此操作权限！')">{{item.name}}</span>
	<span v-if="tableSearch.isExport" class="tabSear-isExport" @click="exportToExcel">批量导出</span>
	<!-- <el-button v-if="tableSearch.isExport" plain style="float:left;margin-bottom:12px" type="danger" size="mini" @click="exportToExcel">批量导出</el-button> -->
	<div style="float:right;">
		<p v-if="!tableSearch.noSearch" @click="tableSearch.cleanClick">清除</p>

		<!-- <el-button v-if="!tableSearch.noSearch" class="tabSear-btn" type="danger" size="mini" @click="tableSearch.funClick">
                <i class="iconsearch"></i>
            </el-button> -->
		<span v-if="!tableSearch.noSearch" class="tabSear-search" @click="tableSearch.funClick">
			<i class="iconsearch"></i>
		</span>
		<div class="tabSear-month-box" v-if="tableSearch.month">
			<el-date-picker size="small" v-model.trim="tableSearch.month.value" type="month" placeholder="选择年月">
			</el-date-picker>
		</div>

		<el-input v-for="(i,index) in tableSearch.input" :key="index" class="tabSear-input" :style="'width: '+i.width+'px;'" v-model.trim="i.value" :placeholder="i.pla">
		</el-input>

		<el-select v-for="i in tableSearch.select" :key="i.pla" @change="tableSearch.seChang" class="tabSear-select" :style="'width: '+i.width+'px;'" v-model.trim="i.value" :clearable="tableSearch.clearable=='0'?false:true" :placeholder="i.pla">
			<el-option v-for="item in i.options" :disabled="tableSearch.exportName=='菜谱'&&item.value=='CF5'" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>

		<div class="tabSear-picker-box" v-if="tableSearch.picker">
			<el-date-picker class="tabSear-picker" style="width:355px" v-model.trim="tableSearch.picker.value" :picker-options="pickerOptions" type="datetimerange" align="right" :start-placeholder="tableSearch.picker.startPlaceholder?tableSearch.picker.startPlaceholder:'开始日期'"
			    :end-placeholder="tableSearch.picker.endPlaceholder?tableSearch.picker.endPlaceholder:'结束日期'">
			</el-date-picker>
		</div>
	</div>
</div>
</template>

<script>
import XLSX from 'xlsx'
export default {
	props: ['tableData', 'tableSearch', 'exportHead'],
	data() {
		return {
			pickerOptions: { //只允许选择今天之前的日期(包括今天)
				disabledDate(time) {
					return time.getTime() > Date.now();
				}
			},
			// tableData:[],//数据集合
			// tableSearch:{
			//     iseExport:true,
			//     exportName:'绑定用户',//导出exl文件名称
			//     funClick:this.tabSearBtnClick,//搜索方法
			//     cleanClick:this.cleanClick,//清空搜索项
			//     input:[
			//         { pla:'MAC地址/SN号',width:'128',value:''},
			//     ],
			//     select:[
			//         { pla:'在离线',width:'108',value:'',
			//         options:[{
			//             value: '在线',
			//             label: '在线'
			//         }, {
			//             value: '离线',
			//             label: '离线'
			//         }]},
			//         { pla:'产品型号',width:'108',value:'',options:[{
			//             value: '设备1',
			//             label: '设备1'
			//         }, {
			//             value: '设备2',
			//             label: '设备2'
			//         }]},
			//     ],
			//     picker:{
			//     value:'',
			//     name:'',
			// },
			//     selectArry:[]//表格选中数据集合
			// },
		}
	},
	methods: {
		exportToExcel() {
			//excel数据导出
			if (this.tableSearch.exportName == '设备列表') {
				this.$http.deviceBatchExport().then(res => {})
			} else if (this.tableSearch.exportName == '厂测列表') {
				this.$http.factoryTestBatchExport().then(res => {})
			} else if (this.tableSearch.exportName == '故障记录') {
				this.$http.faultBatchExport().then(res => {})
			}
			require.ensure([], () => {
				const {
					export_json_to_excel
				} = require('../assets/js/Export2Excel');
				var tHeader = [],
					filterVal = [];
				if (this.exportHead) {
					this.exportHead.forEach(i => {
						tHeader.push(i.label);
						filterVal.push(i.prop)
					});
					// const tHeader = ['序号','snh', 'MAV地址', '产品型号', '在离线','MCU版本号', '登记日期', '激活日期'];
					// const filterVal = ['xh','snh', 'mac', 'sbxh', 'zlx','mcu', 'djrq', 'jhrq'];
					if (this.tableSearch.exportName == "厂测列表") {
						var addData = [
							// { label:'电子秤回检', prop:'scaleStatus'},
							{
								label: '显示屏测试',
								prop: 'screenStatus'
							},
							{
								label: 'RTC时间测试',
								prop: 'rtcStatus'
							},
							{
								label: '触摸测试',
								prop: 'touchStatus'
							},
							{
								label: '微动开关测试',
								prop: 'switchStatus'
							},
							{
								label: '电机及编解码测试',
								prop: 'machineStatus'
							},
							{
								label: '加热及NTC测试',
								prop: 'heatingStatus'
							},
							{
								label: '通讯测试',
								prop: 'communicationStatus'
							},
							{
								label: '声音测试',
								prop: 'soundStatus'
							},
							{
								label: '信号强度',
								prop: 'wifiSSRStatus'
							},
							{
								label: '亮度测试',
								prop: 'brightnessStatus'
							},
							{
								label: '内置菜谱',
								prop: 'buildInMenuStatus'
							},
							{
								label: '整机信息',
								prop: 'wholeMachineStatus'
							},
						];
						addData.forEach(i => {
							tHeader.push(i.label);
							filterVal.push(i.prop)
						});
					}
					const list = this.tableSearch.selectArry.length > 0 ? JSON.parse(JSON.stringify(this.tableSearch.selectArry)) : JSON.parse(JSON.stringify(this.tableData));
					list.forEach((item, index) => {
						for (var x in item) {
							if (x.indexOf('Time') != -1) {
								item[x] = this.$filters.dateFilter(item[x], '');
							}
							if (x == 'online') {
								item[x] = item[x] ? '在线' : '离线'
							} else if (x == 'init') {
								item[x] = item[x] ? '已激活' : '未激活'
							}
							if (x == 'totalStatus' || x == 'scaleStatus' || x == 'screenStatus' || x == 'rtcStatus' || x == 'touchStatus' || x == 'switchStatus' ||
								x == 'machineStatus' || x == 'heatingStatus' || x == 'communicationStatus' || x == 'soundStatus' || x == 'wholeMachineStatus' ||
								x == 'wifiSSRStatus' || x == 'brightnessStatus' || x == 'buildInMenuStatus') {
								item[x] = item[x] ? '合格' : '不合格'
							}
							if (x == 'ifRead') {
								item[x] = item[x] ? '已读' : '未读'
							}
						}
					})
					const data = this.formatJson(filterVal, list);
					export_json_to_excel(tHeader, data, this.tableSearch.exportName);
				}
			})
		},
		formatJson(filterVal, jsonData) {
			return jsonData.map(v => filterVal.map(j => v[j]))
		}
	}
}
</script>

<style lang="less">
.tabSear-search {
    margin-left: 12px;
    float: right;
    background: rgba(240,43,84,1);
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
        background: rgba(240,43,84,0.8);
    }
    i {
        color: #fff;
    }
}
.tabSear-isExport {
    float: left;
    margin-bottom: 12px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #F02B54;
    box-sizing: border-box;
    padding: 0 12px;
    text-align: center;
    border: 1px solid #F02B54;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.4s;
    &:hover {
        background: #F02B54;
        color: #fff;
    }
}
.tabSear-disabled {
    float: left;
    margin-bottom: 12px;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #999999;
    box-sizing: border-box;
    padding: 0 12px;
    text-align: center;
    border: 1px solid #999999;
    border-radius: 4px;
    cursor: pointer;
}
#com-tableSearch {
    width: 100%;
    padding: 0 12px;
    max-height: 32px;
    margin-bottom: 10px;
    box-sizing: border-box;
    p {
        font-size: 12px;
        color: #999999;
        line-height: 32px;
        margin-left: 12px;
        float: right;
        cursor: pointer;
        transition: 0.3s all;
        &:hover {
            color: #409EFF;
        }
    }
    .el-cascader {
        height: 32px;
        line-height: 32px;
    }
    .block {
        height: 32px;
        width: 240px;
        float: right;
        .el-input__inner {
            height: 32px;
            line-height: 32px;
        }
        i {
            line-height: 32px;
        }
    }
    .tabSear-btn {
        margin-left: 12px;
        float: right;
    }
    .tabSear-input,
    .tabSear-picker,
    .tabSear-select {
        margin: 0 0 12px 12px;
        float: right;
        &.el-input__inner,
        .el-input__inner {
            height: 32px;
            line-height: 32px;
        }
        i {
            line-height: 32px;
        }
    }
    .tabSear-select {
        span:focus-within {
            border: none;
            outline: none;
            vertical-align: baseline;
        }
    }
    .tabSear-input {
        width: 160px;
    }
    .tabSear-picker-box {
        margin-left: 12px;
        height: 32px;
        line-height: 32px;
        float: right;
    }
    .tabSear-month-box {
        margin-left: 12px;
        float: right;
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
            width: 120px;
            height: 32px;
            line-height: 32px;
        }
    }
    .tabSear-picker {
        width: 360px;
        margin-left: 0;
        i {
            line-height: 24px;
        }
    }
    .el-date-editor .el-range-separator {
        line-height: 23px;
    }
}
</style>
