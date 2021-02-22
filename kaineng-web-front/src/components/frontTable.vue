/*
*
*   created By Xu Peng
*
*/
<template>
  <div>
    <Table :columns="columns" :data="computedTableData" :loading="loading"></Table>
    <div class="clearfloat">
      <Page
        class="marginTop right"
        @on-change="handleFilp"
        :current="pageNum"
        :page-size-opts="pageSizeOpts"
        @on-page-size-change="handleChangePageSize"
        :total="total"
        show-elevator
        show-sizer
        show-total
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    columns: Array,
    tableData: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false, 
    },
    
  },
  data() {
    return {
      pageNum: 1,
      pageSizeOpts: [10, 20, 30, 40, 50],
      pageSize: 10,
    };
  },
  computed: {
    total() {
      return this.tableData.length
    },
    computedTableData() {
      return this.tableData.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize)
    },
  },
  methods: {
    handleFilp(pageNum) {
			this.pageNum = pageNum
		},
		handleChangePageSize(pageSize) {
      this.pageNum = 1
			this.pageSize = pageSize
		}
  }
};
</script>
<style lang='less'>
</style>