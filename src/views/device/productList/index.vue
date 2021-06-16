<template>
  <div class="productList-box">
    <div class="form-wrapper">
      <el-row :gutter="20">
        <el-form label-width="90px" label-position="left" size="small">
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
              <el-input
                v-model="searchParams.productKey"
                placeholder="请输入产品KEY"
              ></el-input>
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
        >新增</el-button
      >
      <el-button
        size="mini"
        plain
        type="danger"
        icon="el-icon-delete"
        v-hasPermi="['device:productList:delete']"
        :disabled="selectData.length > 0 ? false : true"
        >批量删除</el-button
      >
    </div>

    <div class="table-wrapper">
      <el-table
        :data="tableData"
        :loading="tableLoading"
        @selection-change="selectHandler"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          label="产品名称"
          prop="data1"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="产品key"
          prop="data2"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="上报格式"
          prop="data3"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建人"
          prop="data4"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="data5"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column label="操作" show-overflow-tooltip align="center">
          <template #default="record">
            <el-button type="text">查看</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text">修改</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="deleteHandler(record.row)">删除</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text">管理设备</el-button>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchParams: {},
      selectData: [],
      tableData: [
        {
          data1: 1,
          data2: 1,
          data3: 1,
          data4: 1,
          data5: 1
        }
      ],
      tableLoading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
        total: 1
      }
    };
  },
  methods: {
    searchHandler() {},
    refreshHandler() {},
    handleSizeChange() {},
    handleCurrentChange() {},
    selectHandler(val) {
      this.selectData = val;
    },
    deleteHandler(record) {
      this.$confirm(`此操作将永久删除${record.data1}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
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
</style>
