<template>
  <div class="aliProduct-box">
    <div class="form-wrapper">
      <el-row :gutter="20">
        <el-form label-position="left" label-width="90px">
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input
                v-model="searchParams.productName"
                placeholder="请输入产品名称查询"
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

    <div class="table-wrapper">
      <el-table :data="tableData" v-loading="loading">
        <el-table-column
          show-overflow-tooltip
          prop="productName"
          label="产品名称"
        ></el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="productKey"
          label="ProductKey"
        ></el-table-column>

        <el-table-column show-overflow-tooltip prop="type" label="节点类型">
          <template #default="record">
            {{ record.row.type == 0 ? "网关" : "设备" }}
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="创建时间"
        ></el-table-column>

        <el-table-column label="操作" show-overflow-tooltip>
          <template #default="record">
            <el-button type="text">查看</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="deviceManager(record.row.productKey)"
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      searchParams: {},
      tableData: [
        {
          id: 0,
          productName: "pulaoc_gateway",
          productKey: "g60wW1111",
          type: 0,
          createTime: "2021/06/11 15:46:31"
        },
        {
          id: 1,
          productName: "pulaoc_gateway",
          productKey: "g60wW1111",
          type: 1,
          createTime: "2021/06/11 15:46:31"
        },
        {
          id: 1,
          productName: "pulaoc_gateway",
          productKey: "g60wW1111",
          type: 0,
          createTime: "2021/06/11 15:46:31"
        }
      ],
      pageParams: {
        total: 3,
        pageNum: 1,
        pageSize: 10
      }
    };
  },
  methods: {
    // 节点类型转换
    typeFormate() {},
    // 重置
    refreshHandler() {
      this.searchParams = {};
      this.pageParams.pageNum = 1;
      this.getList();
    },
    // 搜索
    searchHandler() {
      this.pageParams.pageNum = 1;
      this.getList();
    },
    // 获取数据
    getList() {
      let params = Object.assign({}, this.pageParams, this.searchParams);
    },
    // 页数改变
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getList();
    },
    // 分页
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.getList();
    },
    // 管理设备
    deviceManager(key) {
      this.$router.push({
        path: "/device/AliDevice",
        params: {
          productKey: key
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.aliProduct-box {
  padding: 20px;
}

.table-wrapper {
  margin-top: 10px;
}

.pagination-wrapper {
  text-align: right;
  margin-top: 15px;
}
</style>
