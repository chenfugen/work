/*
*
*   created By Xu Peng
*
*/
<template>
<div class="struct-container">
	<template v-for="(item, index) in range">
		<div :key="index" class="struct-item">
			<span class="struct-item-title">{{ item.propertyName }}:</span>
			<component :range="item.dataRange" :standard="data[index].standard" :is="calctype(item.dataType) + 'Component'" @change="(val) => {
            itemChange(index, val)
          }" />
		</div>
	</template>
</div>
</template>

<script>
import {
	TYPE_MAP
} from '../staticVariable.js'
import numComponent from './numComponent.vue'
import textComponent from './textComponent.vue'
import enumComponent from './enumComponent.vue'
import boolComponent from './boolComponent.vue'
export default {
	props: {
		standard: [Array, null],
		range: [Array, Object]
	},
	components: {
		numComponent,
		textComponent,
		enumComponent,
		boolComponent,
	},
	data() {
		return {
			data: this.standard || createModel(this.range)
		};
	},
	watch: {
		standard(val) {
			this.data = val
		},
	},
	methods: {
		calctype(type) {
			return TYPE_MAP[type].type
		},
		itemChange(index, val) {
			this.data[index].standard = val
			this.$emit('change', this.data)
		}
	},
}

function createModel(range) {
	if (!Array.isArray(range)) return []
	return range.map((el) => {
		return {
			identifier: el.identifier,
			dataType: el.dataType,
			standard: null,
		}
	})
}
</script>
<style lang='less'>
.struct-container {
    .struct-item {
        display: flex;
        margin-bottom: 5px;
        .struct-item-title {
            display: block;
            min-width: 120px;
            text-align: right;
            padding-right: 15px;
        }
    }
}
</style>
