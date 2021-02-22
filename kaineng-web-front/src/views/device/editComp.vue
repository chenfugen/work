<template lang="html">
<div class="editComp">
    <Form v-model='form' :label-width="80">
        <FormItem label='当前值：'>
            <span>{{dealData(form.valueNow)}}</span>
        </FormItem>
        <FormItem label='设置值：'>
            <!-- int float double -->
            <InputNumber v-if='itemData.dataType=="int"||itemData.dataType=="float"||itemData.dataType=="double"' :step='itemData.dataRange.step' :max="itemData.dataRange.max" :min="itemData.dataRange.min" v-model="form.value"></InputNumber>
            <!-- text -->
            <Input v-if='itemData.dataType=="text"'  v-model="form.value" @on-change='handleLimit' :placeholder='"字符长度不大于"+itemData.dataRange.length'/>
            <!-- enum -->
            <Select v-if='itemData.dataType=="enum"' v-model="form.value">
                <Option v-for='(item,index) in itemData.dataRange' :value='index'>{{item}}</Option>
            </Select>
            <!-- bool -->
            <Select v-if='itemData.dataType=="bool"' v-model="form.value">
                <Option v-for='(item,index) in itemData.dataRange' :value='index'>{{item}}</Option>
            </Select>
            <!-- array -->
            <div v-if='itemData.dataType=="array"' class="">
                <Button icon='md-add' type='primary' @click='handleAddArray()'></Button>
                <div class="" v-for='(item,index) in arrList'>
                    <Input class="input" v-model.number="item.value"/>
                    <Button style="margin-left:5px;" icon='md-remove' type='primary' @click='handleSubArray(index)'></Button>
                </div>
            </div>
            <!-- struct -->
            <div v-if='itemData.dataType=="struct"' class="">
                <div class="" v-for='items in itemData.dataRange'>
                    <FormItem :label='items.identifier+"："'>
                        <InputNumber v-if='items.dataType=="int"||items.dataType=="float"||items.dataType=="double"' :step='items.dataRange.step' :max="items.dataRange.max" :min="items.dataRange.min" v-model="structForm[items.identifier]"></InputNumber>
                        <Input class="input" v-if='items.dataType=="text"'  v-model="structForm[items.identifier]" @on-change='handleLimit' :placeholder='"字符长度不大于"+items.dataRange.length'/>
                        <Select v-if='items.dataType=="bool"' v-model="structForm[items.identifier]">
                            <Option v-for='(itemChild,indexChild) in items.dataRange' :value='indexChild'>{{itemChild}}</Option>
                        </Select>
                        <div class="" v-if='items.dataType=="array"'>
                            <Button icon='md-add' type='primary' @click='handleAddArray(items)'></Button>
                            <div class="" v-for='(itemChild,indexChild) in structForm[items.identifier]' :key='indexChild'>
                                <Input class="input" v-model="itemChild.value"/>
                                <Button style="margin-left:5px;" icon='md-remove' type='primary' @click='handleSubArray(indexChild,items)'></Button>
                            </div>
                        </div>
                    </FormItem>
                </div>
            </div>
        </FormItem>
    </Form>
</div>
</template>

<script>
export default {
	name: 'editComp',
	data() {
		return {
			structForm: {},
			propInfo: {},
			arrList: [],
			form: {
				value: '',
				valueNow: '',
			},
			itemData: {
				dataType: ''
			},
		}
	},
	methods: {
		dealData(data) {
			if (data == null || data == undefined) {
				return '--'
			} else {
				return data
			}
		},
		setItemData(data) {
			this.propInfo = data
			if (data.dataType == 'int' || data.dataType == 'float' || data.dataType == 'double') {
				this.form.value = 0
				data.dataRange.max = Number(data.dataRange.max)
				data.dataRange.min = Number(data.dataRange.min)
				data.dataRange.step = Number(data.dataRange.step)
			} else if (data.dataType == 'struct') {
				for (let item in data.dataRange) {
					if (data.dataRange[item].dataType == 'int' || data.dataRange[item].dataType == 'double' || data.dataRange[item].dataType == 'float') {
						data.dataRange[item].dataRange.max = Number(data.dataRange[item].dataRange.max)
						data.dataRange[item].dataRange.min = Number(data.dataRange[item].dataRange.min)
						data.dataRange[item].dataRange.step = Number(data.dataRange[item].dataRange.step)
						this.structForm[data.dataRange[item].identifier] = 0
					} else if (data.dataRange[item].dataType == 'array') {
						this.structForm[data.dataRange[item].identifier] = []
					} else {
						this.structForm[data.dataRange[item].identifier] = ''
					}
				}
			} else {
				this.form.value = ''
			}
			this.form.arrList = []
			this.itemData = data
			this.form.valueNow = data.value
		},
		handleLimit(event) {
			if (this.form.value.length > this.itemData.dataRange.length) {
				this.form.value = this.form.value.substring(0, 7)
			}
		},
		handleAddArray(flag) {
			if (flag) {
				this.structForm[flag.identifier].push({
					value: ''
				})
			} else {
				this.arrList.push({
					value: ''
				})
			}
		},
		handleSubArray(index, flag) {
			if (flag) {
				this.structForm[flag.identifier].splice(index, 1)
			} else {
				this.arrList.splice(index, 1)
			}
		},
		handleSubmit() {
			let list = []
			for (let i in this.arrList) {
				list.push(this.arrList[i].value)
			}
			if (this.itemData.dataType == 'array' && list.length > 0) {
				this.form.value = list
			} else if (this.itemData.dataType == 'struct') {
				this.form.value = this.structForm
			}
			return {
				value: this.form.value,
				propInfo: this.propInfo,
			}
		}
	}

}
</script>

<style scoped>
.input {
	width: 200px;
}
</style>
