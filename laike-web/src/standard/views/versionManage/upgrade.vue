<template>
  <div class="upgrade">
    <search :searchList="searchList" :searchParams="searchParams" formName="searchParams" isAdd buttonName="新增" @add="handleAdd"
      @resetForm="resetForm" @submitForm="submitForm"></search>
    <table-page class="table" :page="tableFilter.page" :limit="tableFilter.pageSize" :tableDable="tableData" :columns="columns"
      @changeTableSort="changeTableSort"></table-page>
    <pagination v-show="total > 0" :total="total" :page.sync="tableFilter.page" :limit.sync="tableFilter.pageSize"
      @pagination="upgrateTaskPage" />
    <!-- 表单弹窗 -->
    <el-dialog :title="activeName" width="30%" class="edit" :visible.sync="dialogVisible">
      <el-form :model="editForm" status-icon :rules="editRules" ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model.trim="editForm.name" placeholder="任务名称" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品类型" prop="productTypeId">
          <el-select class="select" v-model="editForm.productTypeId" placeholder="请选择" @change="selectProduct">
            <el-option v-for="item in products" :key="item.id" :label="item.productType" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品型号" prop="productId">
          <el-select class="select" v-model="editForm.productId" placeholder="请选择"  @change="selectProductModel">
            <!-- @change="selectProductModel" -->
            <el-option v-for="item in productModels" :key="item.id" :label="item.productModel" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="OTA类别" prop="propertyId ">
          <el-select class="select" v-model="editForm.propertyId " placeholder="请选择" @change="selectVersionType">
            <el-option v-for="item in otaTypes" :key="item.id" :label="item.propertyName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="起始版本" prop="startVersion">
          <el-select class="select" v-model="editForm.startVersion" placeholder="请选择" mode="multiple">
            <el-option v-for="item in product" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="目标版本" prop="targetFirmwareId">
          <el-select class="select" v-model="editForm.targetFirmwareId" placeholder="请选择">
            <el-option v-for="item in versions" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="升级模式" prop="upgradeMode">
          <el-radio-group v-model="editForm.upgradeMode" size="medium">
            <el-radio label="1" >非强制/主动升级</el-radio>
            <el-radio label="2" >强制升级/被动升级</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="任务范围" prop="taskRange">
          <el-radio-group v-model="editForm.taskRange" size="medium" @change="taskChange">
            <el-radio label="所有设备"></el-radio>
            <el-radio label="自定义设备"></el-radio>
            <el-radio label="批次升级"></el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item style="margin-top: 10px">
          <el-button type="primary" @click="submitForm('editForm')">确认</el-button>
          <el-button @click="resetForm('editForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="activeName" width="30%" class="edit" :visible.sync="dialogLookVisible">
      <el-form status-icon ref="editForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="任务名称">
          <span class="value">{{ detail.name }}</span>
        </el-form-item>
        <el-form-item label="产品类型">
          <span class="value">{{ detail.productType}}</span>
        </el-form-item>
        <el-form-item label="产品型号">
          <span class="value">{{ detail.productModel }}</span>
        </el-form-item>
        <el-form-item label="OTA类别">
          <span class="value">{{ detail.versionTypeId}}</span>
        </el-form-item>
        <!-- <el-form-item label="起始版本">
          <span class="value">{{editForm.initialFirmware}}</span>
        </el-form-item> -->
        <el-form-item label="目标版本">
          <span class="value">{{ detail.targetFirmware }}</span>
        </el-form-item>
        <el-form-item label="升级模式">
          <span class="value">{{ detail.upgradeMode==1?"强制升级":"非强制" }}</span>
        </el-form-item>
        <el-form-item label="任务范围">
          <span class="value">{{detail.upgradeRange==1?"所有设备":detail.upgradeRange==2?"自定义设备":"批次升级"}}</span>
          <!-- <ul class="deviceList">
            <li v-for="(item,index) in data" :key="index">
              <span>{{item.label}}</span>
            </li>
          </ul> -->
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="activeName" class="transfes" :visible.sync="dialogUpgradeVisible">
      <p class="productModel">产品型号：CF7</p>
      <div style="text-align: center">
        <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入查询内容" v-model="value" :data="data">
        </el-transfer>
      </div>
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
      const generateData = (_) => {
        const data = [];
        const cities = [
          "U3D42012454501",
          "U3D42012454502",
          "U3D42012454503",
          "U3D42012454504",
          "U3D42012454505",
        ];
        cities.forEach((city, index) => {
          data.push({
            label: city,
            key: index,
          });
        });
        return data;
      };
      return {
        data: generateData(),
        value: [],
        dialogUpgradeVisible: false,
        dialogVisible: false,
        dialogLookVisible: false,
        products: [],
        productModels: [],
        otaTypes: [],
        versions: [],
        detail:{},
        isAdd: true,
        activeName: "创建升级任务",
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
          {
            label: "OTA类别",
            prop: "versionTypeName",
            type: "select",
            options: [],
          },
          {
            label: "升级模式",
            prop: "upgradeMode",
            type: "select",
            options: [{
                label: "非强制/主动升级",
                value: 2,
              },
              {
                label: "强制升级/被动升级",
                value: 1,
              },
            ],
          },
          {
            label: "任务范围",
            prop: "upgradeRange",
            type: "select",
            options: [{
                label: "所有设备",
                value: 1,
              },
              {
                label: "自定义设备",
                value: 2,
              },
              {
                label: "批次升级",
                value: 3,
              },
            ],
          },
        ],
        searchParams: {
          productTypeId: null,
          productId: null,
          propertyId : null,
          upgradeRange: null,
          upgradeMode:null,
          sort: null,
        },
        columns: [{
            prop: "name",
            label: "任务名称",
            align: "left",
          },
          {
            prop: "productType",
            label: "产品类型",
            align: "left",
          },
          {
            prop: "productModel",
            label: "产品型号",
            align: "left",
          },
          {
            prop: "versionType",
            label: "OTA类别",
            align: "left",
          },
          {
            prop: "initialFirmware",
            label: "起始版本",
            align: "left",
          },
          {
            prop: "targetFirmware",
            label: "目标版本",
            align: "left",
          },
          {
            prop: "upgradeMode",
            label: "升级模式",
            align: "left",
            render: (h, params) => {
              return h(
                "span",params.row.upgradeMode==1?"强制升级":"非强制"
              );
            },
          },
          {
            prop: "upgradeRange",
            label: "任务范围",
            align: "left",
            render: (h, params) => {
              return h(
                "span",params.row.upgradeRange==1?"所有设备":params.row.upgradeRange==2?"自定义设备":"批次升级"
              );
            },
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
            label: "操作",
            width: 200,
            align: "left",
            fixed: "right",
            operates: [{
                label: "查看",
                type: "primary",
                disabled: false,
                method: (index, row) => {
                  this.handleLook(row);
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
          propertyId : null,
          targetFirmwareId: null,
          upgradeMode: null,
          upgradeRange: null,
        },
        editRules: {
          name: [{
            required: true,
            message: "请输入任务名称",
            trigger: "blur",
          }],
          productTypeId: [{
            required: true,
            message: "请选择产品类型",
            trigger: "change",
          }],
          productId: [{
            required: true,
            message: "请选择产品型号",
            trigger: "change",
          }],
          propertyId : [{
            required: true,
            message: "请选择OTA类别",
            trigger: "change",
          }],
          initialFirmwareId: [{
            required: true,
            message: "请选择起始版本",
            trigger: "change",
          }],
          targetFirmwareId: [{
            required: true,
            message: "请选择目标版本",
            trigger: "change",
          }],
          upgradeMode: [{
            required: true,
            message: "请选择升级模式",
            trigger: "change",
          }],
          upgradeRange: [{
            required: true,
            message: "请选择升级模式",
            trigger: "change",
          }],
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
      this.upgrateTaskPage();
    },
    methods: {
      //排序
      changeTableSort(val) {
        this.searchParams.sort =
          val == null ? null : val == "ascending" ? false : true;
        this.upgrateTaskPage();
      },
      submitForm(formName) {
        if (formName == "searchParams") {
          this.page = 1;
          this.limit = 10;
          this.upgrateTaskPage();
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.activeName == "创建升级任务") {
                this.$http
                  .upgrateTaskAdd(this.editForm)
                  .then((res) => {
                    if (res.data.success) {
                      this.$message({
                        message: "创建成功",
                        type: "success",
                      });
                      this.dialogVisible = false;
                      this.upgrateTaskPage();
                    }
                  });
              }
            }
          });
        }
      },
      resetForm(formName) {
        if (formName == "searchParams") {
          this.searchParams = {
            productTypeId: null,
            productId: null,
            propertyId : null,
            upgradeRange: null,
            upgradeMode: null,
          };
          this.upgrateTaskPage();
        } else {
          this.$refs[formName].resetFields();
          this.dialogVisible = false;
        }
      },
      taskChange(e) {
        this.dialogUpgradeVisible = true;
      },
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      // 获取列表
      upgrateTaskPage() {
        let params = { ...this.tableFilter,
          ...this.searchParams
        };
        this.$http.upgrateTaskPage(params).then((res) => {
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
      // OTA类别
      getVersionProperty(id) {
        this.$http
          .versionProperty({
            productId: id,
          })
          .then((res) => {
            if (res.data.success) {
              this.otaTypes = res.data.data;
              let list = [];
              for (let i in res.data.data.list) {
                list[i] = {
                  label: res.data.data.list[i].propertyName,
                  value: res.data.data.list[i].id,
                };
              }
              this.searchList[2].options = list;
            }
          });
      },
      // 获取固件版本列表
      firmwareList(a,b,c) {
        this.$http.firmwareProperty({
          productTypeId:a,
          productId:b,
          propertyRef:c,
        }).then((res) => {
          if (res.data.success) {
            this.versions=res.data.data;
          }
        });
      },
      selectProduct() {
         this.getProductModel(this.editForm.productTypeId);
      },
      selectProductModel() {
          this.getVersionProperty(this.editForm.productId);
      },
      selectVersionType() {
        console.log(1)
        this.firmwareList(this.editForm.productTypeId,this.editForm.productId,this.editForm.propertyId );
      },
      //创建
      handleAdd(raw) {
        this.activeName = "创建升级任务";
        this.dialogVisible = true;
        this.editForm = {
          name: null,
          productTypeId: null,
          productId: null,
          propertyId : null,
          targetFirmwareId: null,
          upgradeMode: null,
          upgradeRange:1,
        };
      },
      // 查看
      handleLook(raw) {
        this.dialogLookVisible = true;
        this.activeName = "升级任务";
        this.detail = {
          name: raw.name,
          productType: raw.productType,
          productModel: raw.productModel,
          versionTypeId : raw.versionTypeId ,
          targetFirmware: raw.targetFirmware,
          upgradeMode: raw.upgradeMode,
          upgradeRange:1,
        };
      },
      // 删除
      handleDelete(row) {
        this.$confirm("确认删除该升级任务？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {
            this.$http.upgrateTaskDelete(row.id).then((res) => {
              this.upgrateTaskPage();
            });
          })
          .catch(() => {});
      },
    },
  };
</script>
<style scoped>
  .upgrade {
    background: #ffffff;
  }

  .productModel {
    line-height: 50px;
    font-weight: bold;
  }

  .select {
    width: 80%;
  }

  .edit .el-dialog {
    min-width: 500px;
    max-height: 550px;
    overflow-x: auto;
  }

  .transfes .el-dialog {
    min-width: 650px;
    overflow-x: auto;
  }

  .el-checkbox {
    text-align: left;
  }

  .el-dialog::-webkit-scrollbar {
    display: none;
  }

  .el-transfer-panel__header>.el-checkbox {
    margin-left: 15px;
  }

  .hint {
    display: block;
  }

  .edit>.value {
    margin-left: 10px;
  }

  .deviceList {
    width: 200px;
    height: 150px;
    border: 1px solid #eee;
    overflow-y: auto;
    margin: 0px;
    padding: 0px;
  }

  .deviceList li {
    list-style: none;
    padding-left: 10px;
  }
</style>
