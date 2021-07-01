<template>
  <div class="productList-box">
    <div class="form-wrapper">
      <el-row :gutter="20">
        <el-form
          label-width="90px"
          label-position="left"
          size="small"
          v-if="showSearch"
        >
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input
                v-model="searchParams.productName"
                placeholder="请输入产品名称"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="产品key">
              <el-select
                v-model="searchParams.productKey"
                placeholder="请选择产品"
              >
                <el-option :value="null" label="全部产品"></el-option>
                <el-option
                  v-for="(item, index) in aliProductList"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="searchHandler"
              >搜索</el-button
            >
            <el-button
              size="small"
              type="default"
              icon="el-icon-refresh"
              @click="refreshHandler"
              >重置</el-button
            >
          </el-col>
        </el-form>
      </el-row>
    </div>

    <div class="btns-wrapper">
      <el-button
        size="mini"
        plain
        type="primary"
        icon="el-icon-plus"
        v-hasPermi="['device:productList:add']"
        @click="addHandler"
        >新增</el-button
      >
      <el-button
        size="mini"
        plain
        type="danger"
        icon="el-icon-delete"
        v-hasPermi="['device:productList:delete']"
        :disabled="selectData.length > 0 ? false : true"
        @click="batchDelete"
        >批量删除</el-button
      >

      <right-toolbar
        :columns="columns"
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </div>

    <div class="table-wrapper">
      <el-table
        :data="tableData"
        v-loading="tableLoading"
        @selection-change="selectHandler"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          label="产品名称"
          prop="productName"
          show-overflow-tooltip
          align="center"
          v-if="columns[0].visible"
        ></el-table-column>
        <el-table-column
          label="产品key"
          prop="productKey"
          show-overflow-tooltip
          align="center"
          v-if="columns[1].visible"
        ></el-table-column>
        <el-table-column
          label="上报格式"
          prop="dataFormat"
          show-overflow-tooltip
          align="center"
          v-if="columns[2].visible"
        ></el-table-column>
        <el-table-column
          label="创建人"
          prop="createBy"
          show-overflow-tooltip
          align="center"
          v-if="columns[3].visible"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          show-overflow-tooltip
          align="center"
          v-if="columns[4].visible"
        ></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip align="center" fixed="right" width="280">
          <template #default="record">
            <el-button type="text" @click="doView(record.row.productId)"
              >查看</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="doUpdate(record.row)"
              >修改</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="doDelete(record.row)"
              >删除</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="doManager(record.row.productId)"
              >管理设备</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-wrapper" v-show="pageParams.total > 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.pageNum"
        :page-size="pageParams.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
      >
      </el-pagination>
    </div>

    <operator-dialog
      :visible.sync="operatorShow"
      @closeHandler="searchHandler"
      :updateInfo="updateInfo"
      :operatorType="operatorType"
    />

    <detail-dialog :visible.sync="detailShow" :productId="productId" />
  </div>
</template>

<script>
import {
  getProductList,
  deleteProduct,
  batchDeleteProduct
} from "@/api/monitor/product";
import operatorDialog from "./components/operatorDialog.vue";
import detailDialog from "./components/detailDialog.vue";
import { getAliProduct } from "@/api/monitor/aliProduct";
export default {
  data() {
    return {
      searchParams: {},
      selectData: [],
      tableData: [],
      tableLoading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
        total: 1
      },
      operatorShow: false,
      aliProductList: [],
      detailShow: false,
      productId: null,
      updateInfo: {},
      operatorType: null,
      showSearch: true,
      columns: [
        { key: 0, label: `产品名称`, visible: true },
        { key: 1, label: `产品key`, visible: true },
        { key: 2, label: `上报格式`, visible: true },
        { key: 3, label: `创建人`, visible: true },
        { key: 4, label: `创建时间`, visible: true }
      ]
    };
  },
  components: {
    operatorDialog,
    detailDialog
  },
  methods: {
    searchHandler() {
      this.pageParams.pageNum = 1;
      this.getList();
    },
    refreshHandler() {
      this.searchParams = {};
      this.pageParams.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.getList();
    },
    selectHandler(val) {
      this.selectData = val;
    },
    getList() {
      this.tableLoading = true;
      let params = Object.assign({}, this.searchParams, this.pageParams);
      getProductList(params).then(res => {
        if (res.code == 200) {
          this.tableData = res.rows;
          this.pageParams.total = res.total;
        }
        this.tableLoading = false;
      });
    },
    // 获取阿里云产品列表
    getAliProductHandler() {
      getAliProduct().then(res => {
        if (res.code == 200) {
          this.aliProductList = res.rows.map(item => {
            return {
              value: item.productKey,
              label: item.productName
            };
          });
        }
      });
    },
    // 删除产品
    doDelete(val) {
      this.$confirm(`此操作将永久删除${val.productName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await deleteProduct(val.productId);
          if (code == 200) {
            if (
              (this.pageParams.total - 1) % this.pageParams.pageSize == 0 &&
              this.pageParams.total > this.pageParams.pageSize
            ) {
              this.pageParams.pageNum -= 1;
            }
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 批量删除
    batchDelete() {
      let productName = this.selectData.map(item => item.productName).join(",");
      let productIds = this.selectData.map(item => item.productId);
      this.$confirm(`此操作将永久批量删除${productName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await batchDeleteProduct(productIds);
          if (code == 200) {
            if (
              (this.pageParams.total - this.selectData.length) %
                this.pageParams.pageSize ==
                0 &&
              this.pageParams.total > this.pageParams.pageSize
            ) {
              this.pageParams.pageNum -= 1;
            }
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 查看详情
    doView(productId) {
      this.productId = productId;
      this.detailShow = true;
    },
    // 管理设备
    doManager(productId) {
      this.$router.push({
        name: "DeviceList",
        params: {
          productId
        }
      });
    },
    addHandler() {
      this.operatorType = 0;
      this.updateInfo = {};
      this.operatorShow = true;
    },
    // 修改
    doUpdate(val) {
      this.operatorType = 1;
      this.updateInfo = val;
      this.operatorShow = true;
    }
  },
  created() {
    this.getAliProductHandler();
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.productList-box {
  padding: 20px;
}

.table-wrapper {
  margin-top: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  text-align: right;
}

.el-select {
  width: 100%;
}
</style>
