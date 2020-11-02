<template>
  <div class="versionClassSet">
    <search :searchList="searchList" :searchParams="searchParams" formName="searchParams" isAdd buttonName="新增版本类别"
      @add="handleAdd" @resetForm="resetForm" @submitForm="submitForm"></search>
    <table-page class="table" :page="tableFilter.page" :limit="tableFilter.pageSize" :tableDable="tableData" :columns="columns"
      @changeTableSort="changeTableSort"></table-page>
    <pagination v-show="total > 0" :total="total" :page.sync="tableFilter.page" :limit.sync="tableFilter.pageSize"
      @pagination="getVersionList" />
    <!-- 表单弹窗 -->
    <el-dialog :title="activeName" width="30%" class="edit" :visible.sync="dialogVisible">
      <el-form :model="editForm" status-icon :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="版本名称" prop="name">
          <el-input v-model.trim="editForm.name" placeholder="版本名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="productTypeId">
          <el-select class="select" v-model="editForm.productTypeId" placeholder="请选择" @change="selectProduct">
            <el-option v-for="item in products" :key="item.id" :label="item.productType" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productId">
          <el-select class="select" v-model="editForm.productId" placeholder="请选择" @change="selectProductModel">
            <el-option v-for="item in productModels" :key="item.id" :label="item.productModel" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联属性" prop="propertyRef">
          <el-select class="select" v-model="editForm.propertyRef" placeholder="请选择">
            <el-option v-for="item in versionPropertys" :key="item.id" :label="item.propertyName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="属性ID">
          <span>0081</span>
        </el-form-item> -->
        <el-form-item label="版本描述" prop="descEnable">
          <el-select class="select" v-model="editForm.descEnable" placeholder="请选择">
            <el-option label="需要" :value="0"></el-option>
            <el-option label="不需要" :value="1"></el-option>
          </el-select>
          <span class="hint">指是否需要下发版本的升级描述到设备端显示</span>
        </el-form-item>
        <el-form-item label="OTA字段定义">
          <el-table :data="ataData" border style="width: 100%">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="type" label="参数类型">
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="描述" v-if="editForm.descEnable == 0">
          <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 6 }" v-model="editForm.description" placeholder="请输入需要进行操作的设备SN,以空格进行区分"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 10px">
          <el-button type="primary" @click="submitForm('editForm')">确认</el-button>
          <el-button @click="resetForm('editForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import tablePage from "../../components/table.vue";
  import search from "../../components/searchList.vue";
  import pagination from "../../components/pagination.vue";
  import Utils from "../../utils";
  export default {
    data() {
      return {
        dialogVisible: false,
        products: [],
        productModels: [],
        versionPropertys: [],
        activeName: "创建版本类别",
        ataData: [{
            name: "URL",
            type: "string",
          },
          {
            name: "MD5",
            type: "string",
          },
          {
            name: "文件长度",
            type: "string",
          },
        ],
        searchList: [{
            label: "产品类型",
            prop: "productTypeId",
            type: "select",
            options: [],
          },
          {
            label: "产品型号",
            prop: "productId",
            type: "select",
            options: [],
          },
        ],
        searchParams: {
          productTypeId: null,
          productId: null,
          sort: null,
        },
        columns: [{
            prop: "name",
            label: "版本类别",
            align: "left",
          },
          {
            prop: "propertyRef",
            label: "OTA类别",
            align: "left",
            width: 150,
            render: (h, params) => {
              return h(
                "span",
                params.row.propertyName +
                "/" +
                params.row.propertyRef
              );
            },
          },
          {
            prop: "productTypeName",
            label: "产品类型",
            align: "left",
          },
          {
            prop: "productName",
            label: "产品型号",
            align: "left",
          },
          {
            prop: "createTime",
            label: "创建时间",
            align: "left",
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h(
                "span",
                Utils.formatDate(params.row.createTime)
              );
            },
          },
          {
            prop: "updateTime",
            label: "更新时间",
            align: "left",
            width: 200,
            sortable: true,
            render: (h, params) => {
              return h(
                "span",
                Utils.formatDate(params.row.updateTime)
              );
            },
          },
          {
            label: "操作",
            width: 200,
            align: "left",
            fixed: "right",
            operates: [{
                label: "编辑",
                type: "primary",
                disabled: false,
                method: (index, row) => {
                  this.handleEdit(row);
                },
              },
              {
                label: "删除",
                type: "primary",
                disabled: false,
                method: (index, row) => {
                  this.handleDelete(row);
                },
              },
            ],
          },
        ],
        editForm: {
          name: null,
          productTypeId: null,
          productId: null,
          propertyRef: null,
          descEnable: null,
          // propertyId: null,
          description: null,
        },
        editRules: {
          name: [{
            required: true,
            message: "请输入版本名称",
            trigger: "blur",
          }, ],
          productTypeId: [{
            required: true,
            message: "请选择产品类型",
            trigger: "change",
          }, ],
          productId: [{
            required: true,
            message: "请选择产品型号",
            trigger: "change",
          }, ],
          propertyRef: [{
            required: true,
            message: "请选择关联属性",
            trigger: "change",
          }, ],
          descEnable: [{
            required: true,
            message: "请选择版本描述",
            trigger: "change",
          }, ],
        },
        tableData: [],
        tableFilter: {
          page: 1,
          pageSize: 10,
        },
        total: 0,
      };
    },
    components: {
      tablePage,
      pagination,
      search,
    },
    mounted() {
      this.getProductType();
      this.getProductModel();
      this.getVersionList();
    },
    methods: {
      //排序
      changeTableSort(val) {
        this.searchParams.sort =
          val == null ? null : val == "ascending" ? false : true;
        this.getVersionList();
      },
      submitForm(formName) {
        if (formName == "searchParams") {
          this.page = 1;
          this.limit = 10;
          this.getVersionList();
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.activeName == "创建版本类别") {
                this.$http
                  .versionClassAdd(this.editForm)
                  .then((res) => {
                    if (res.data.success) {
                      this.$message({
                        message: "创建成功",
                        type: "success",
                      });
                      this.getVersionList();
                    }
                  });
              } else {
                this.$http.versionClassEdit(this.editForm)
                  .then((res) => {
                    if (res.data.success) {
                      this.$message({
                        message: "编辑成功",
                        type: "success",
                      });
                      this.getVersionList();
                    }
                  });
              }
              this.dialogVisible = false;
            }
          });
        }
      },
      resetForm(formName) {
        if (formName == "searchParams") {
          this.searchParams = {
            productTypeId: null,
            productId: null,
          };
          this.getVersionList();
        } else {
          this.$refs[formName].resetFields();
          this.dialogVisible = false;
        }
      },
      // 获取列表
      getVersionList() {
        let params = { ...this.tableFilter,
          ...this.searchParams
        };
        this.$http.versionClassPage(params).then((res) => {
          if (res.data.success) {
            this.$set(this, "tableData", res.data.data.list);
            this.$set(this, "total", res.data.data.total);
          }
        });
      },
      //获取产品类型
      getProductType() {
        this.$http.productTypesAll().then((res) => {
          if (res.data.success) {
            this.products = res.data.data;
            let list = [];
            for (let i in res.data.data) {
              list[i] = {
                label: res.data.data[i].productType,
                value: res.data.data[i].id,
              };
            }
            this.searchList[0].options = list;
          }
        });
      },
      //获取产品型号
      getProductModel(e) {
        this.$http.productModuleAll({
          productTypeId: e
        }).then((res) => {
          if (res.data.success) {
            this.productModels = res.data.data;
            let list = [];
            for (let i in res.data.data) {
              list[i] = {
                label: res.data.data[i].productModel,
                value: res.data.data[i].id,
              };
            }
            this.searchList[1].options = list;
          }
        });
      },
      getVersionProperty(id) {
        this.$http
          .versionProperty({
            productId: id,
          })
          .then((res) => {
            if (res.data.success) {
              this.versionPropertys = res.data.data;
            }
          });
      },
      selectProductModel() {
        this.getVersionProperty(this.editForm.productId);
      },
      selectProduct(){
        this.getProductModel(this.editForm.productTypeId);
      },
      //创建
      handleAdd(raw) {
        this.dialogVisible = true;
        this.activeName = "创建版本类别";
        this.editForm = {
         name: null,
         productTypeId: null,
         productId: null,
         propertyRef: null,
         descEnable: null,
         // propertyId: null,
         description: null,
        };
      },
      // 编辑
      handleEdit(raw) {
        this.dialogVisible = true;
        this.activeName = "编辑版本类别";
        this.getVersionProperty(raw.productId);
         this.getProductModel(this.editForm.productTypeId);
        this.editForm = {
          id: raw.id,
          name: raw.name,
          productTypeId: raw.productTypeId,
          productId: raw.productId,
          propertyRef: raw.propertyRef,
          descEnable: raw.descEnable,
          description: raw.description,
        };
      },
      // 删除
      handleDelete(row) {
        this.$confirm("确认删除该版本类别？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            this.$http.versionClassDelete(row.id).then((res) => {
              this.getVersionList();
            });
          })
          .catch(() => {});
      },
    },
  };
</script>

<style>
  .versionClassSet {
    background: #ffffff;
  }

  .edit .el-dialog__body {
    /* max-height: 480px;
    overflow-y: auto; */
  }

  .select {
    width: 80%;
  }

  .hint {
    display: block;
  }
</style>
