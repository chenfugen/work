<template>
  <div class="menuList">
    <search :searchList="searchList" :searchParams="searchParams" formName="searchParams" isAdd buttonName="新增" @add="handleAdd"
      @resetForm="resetForm" @submitForm="submitForm"></search>
    <div class="table">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <!-- 列表展开 -->
        <el-table-column type="expand" fixed="left">
          <template slot-scope="props">
            <el-table :data="props.row.child" class="success-row" style="width: 50%">
              <el-table-column label="口味" prop="name"></el-table-column>
              <el-table-column label="烹饪次数" prop="cookTimes"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-link class="tableBtn tableBtn" :underline="false" size="mini" type="primary"
                    @click.native.prevent="
											handleInfo('childDetail', scope.row)
										">查看</el-link>
                  <el-link class="tableBtn tableBtn" :underline="false" size="mini" type="primary"
                    @click.native.prevent="
											handleInfo('childEdit', scope.row)
										">编辑</el-link>
                  <el-link class="tableBtn tableBtn" :underline="false" size="mini" type="primary"
                    @click.native.prevent="
											handleInfo('childExport', scope.row)
										">导出</el-link>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="序号" prop="key" fixed="left"></el-table-column>
        <el-table-column label="菜谱ID" prop="menuId" fixed="left"></el-table-column>
        <el-table-column label="菜谱名称" prop="name"></el-table-column>
        <el-table-column label="美食家" prop="cuisine"></el-table-column>
        <el-table-column label="食材分类" prop="category"></el-table-column>
        <el-table-column label="菜系" prop="style"></el-table-column>
        <el-table-column label="内置菜" prop="inner"></el-table-column>
        <el-table-column label="收藏次数" prop="collectTimes"></el-table-column>
        <el-table-column label="图">
          <template slot-scope="scope">{{ scope.row.imageName ? "有" : "无" }}</template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949" @change="handleSwitch"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">{{ scope.row.createTime | filtedate }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="180">
          <template slot-scope="scope">{{ scope.row.updateTime | filtedate }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-link class="tableBtn" :underline="false" size="mini" type="primary" @click.native.prevent="
								handleInfo('detail', scope.row)
							">查看</el-link>
            <el-link class="tableBtn" :underline="false" size="mini" type="primary" @click.native.prevent="
								handleInfo('edit', scope.row)
							">编辑</el-link>
            <el-dropdown>
              <span class="el-dropdown-link">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native.prevent="
										handleInfo('delete', scope.row)
									">删除</el-dropdown-item>
                <el-dropdown-item @click.native.prevent="
										handleInfo('add', scope.row)
									">新增子菜单</el-dropdown-item>
                <el-dropdown-item @click.native.prevent="
										handleInfo('import', scope.row)
									">导入子菜单</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total > 0" :total="total" :page.sync="tableFilter.page" :limit.sync="tableFilter.pageSize"
        @pagination="getList" />
    </div>

    <!-- 弹窗 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
      <!-- 表单 -->
      <el-form v-model="form" label-width="150px" :rules="rules">
        <el-form-item label="产品类型" prop="productTypeId"></el-form-item>
        <el-form-item label="产品型号" prop="productTypeId"></el-form-item>
        <el-form-item label="菜谱分类模板" prop="productTypeId"></el-form-item>
        <el-form-item label="内置菜" prop="productTypeId"></el-form-item>
        <el-form-item label="菜谱类型" prop="name">
          <el-input class="formInput" v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddNext">下一步</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import tablePage from "../../components/table.vue";
  import search from "../../components/searchList.vue";
  import pagination from "../../components/pagination.vue";
  import utils from "../../utils.js";
  export default {
    name: "menuList",
    data() {
      return {
        searchList: [{
            label: "菜谱名关键字",
            prop: "nameKeyWord",
            type: "input",
          },
          {
            label: "",
            prop: "sendTime",
            type: "daterange",
          },
        ],
        searchParams: {
          nameKeyWord: null,
          sendTime: null,
        },
        total: 1,
        dialogVisible: false,
        form: {},
        tableFilter: {
          page: 1,
          pageSize: 10,
        },
        rules: {},
        tableData: [{
          appImageName: "488a1e9c-50a7-44ed-b858-e336457cb8dc.jpg",
          appointment: false,
          buildIn: false,
          others: ["猪肉"],
          collectTimes: 98,
          content: "无",
          cookTimes: 175,
          createTime: "2020-09-22T13:14:15.000+0000",
          category: ["红烧"],
          deviceModel: "CF7",
          deviceType: "智能烹饪机",
          existChildMenu: true,
          fastFood: false,
          firstRow: null,
          foodValue: "无",
          id: "5f44d1e1021de5bc4402f6ab",
          imageName: "a7d523bd-b234-4479-830b-faeda04df5ff.jpg",
          keyWord: "无",
          language: 0,
          menuId: "0001",
          name: "红烧肉",
          recommend: false,
          secondRow: null,
          status: true,
          style: ["招牌菜"],
          key: "01",
          updateTime: "2020-10-20T08:15:34.748+0000",
          updateTimestamp: 1603181734,
          child: [{
            name: "偏甜",
            cookTimes: 11,
            id: 1,
          }, ],
        }, ],
      };
    },
    filters: {
      filtedate: function(date) {
        return utils.formatDate(date);
      },
    },
    components: {
      tablePage,
      pagination,
      search,
    },
    mounted() {},
    methods: {
      handleSwitch(e) {
        let status = e ? "启用" : "停用";
        this.$confirm("确认要" + status + "所选菜谱吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(() => {})
          .catch(() => {});
      },
      submitForm(formName) {
        if (formName == "searchParams") {
          this.page = 1;
          this.limit = 10;
          this.firmwarePage();
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if (this.activeName == "新增DTU固件") {
                this.$http
                  .versionClassAdd(this.editForm)
                  .then((res) => {
                    if (res.data.success) {
                      this.$message({
                        message: "创建成功",
                        type: "success",
                      });
                      this.firmwarePage();
                    } else {
                      this.$message({
                        message: res.data.msg,
                        type: "warning",
                      });
                    }
                  });
              } else {
                this.$http
                  .versionClassEdit(this.editForm)
                  .then((res) => {
                    if (res.data.success) {
                      this.$message({
                        message: "编辑成功",
                        type: "success",
                      });
                      this.firmwarePage();
                    } else {
                      this.$message({
                        message: res.data.msg,
                        type: "warning",
                      });
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
            versionTypeId: null,
          };
          this.firmwarePage();
        } else {
          this.$refs[formName].resetFields();
          this.dialogVisible = false;
        }
      },
      getList() {},
      handleInfo(key, row) {
        switch (key) {
          case "detail":
            this.dialogVisible = true;
            break;
          case "edit":
            this.dialogVisible = true;
            break;
          case "delete":
            this.$confirm("确认要删除此菜谱吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
              .then(() => {})
              .catch(() => {});
            break;
          case "add":
            break;
          case "import":
            break;
          case "childDetail":
            break;
          case "childEdit":
            break;
          case "childExport":
            break;
          default:
            break;
        }
      },
      handleAdd() {
        this.dialogVisible = true;
      },
      handleClose: function() {
        this.dialogVisible = false;
      },
      handleAddNext: function() {
        this.$router.push({
          path: "/menuStandard/addParent",
        });
      },
    },
  };
</script>

<style>
  .menuList {
    background: white;
    border-radius: 5px;
  }

  .menuList .table {
    padding: 0px 15px 10px 15px;
  }

  .menuList .formTips {
    font-size: 12px;
    color: #ccc;
    display: block;
  }

  .select {
    width: 80%;
  }

  .menuList .tableBtn {
    margin-right: 10px;
  }

  .menuList .el-dropdown-link {
    color: #409eff;
    font-weight: 500;
    font-size: 14px;
  }
</style>
