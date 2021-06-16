<template>
  <div class="deviceList-box">
    <div class="form-wrapper">
      <el-row :gutter="20">
        <el-form label-position="left" label-width="90px" size="small">
          <el-col :span="6">
            <el-form-item label="设备编码">
              <el-input
                v-model="searchParams.deviceSN"
                placeholder="请输入设备编码"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input
                v-model="searchParams.deviceName"
                placeholder="请输入设备名称"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="设备类型">
              <el-select
                v-model="searchParams.deviceType"
                placeholder="请选择设备类型"
              >
                <el-option
                  v-for="(item, index) in deviceType"
                  :key="index"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="设备状态">
              <el-select
                v-model="searchParams.deviceStatus"
                placeholder="请选择设备状态"
              >
                <el-option
                  v-for="(item, index) in deviceStatus"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
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
        v-hasPermi="['device:deviceList:add']"
        >新增</el-button
      >
      <el-button
        size="mini"
        plain
        type="danger"
        icon="el-icon-delete"
        v-hasPermi="['device:deviceList:delete']"
        :disabled="selectData.length > 0 ? false : true"
        >批量删除</el-button
      >
      <el-button
        size="mini"
        plain
        type="info"
        icon="el-icon-upload2"
        v-hasPermi="['device:deviceList:import']"
        >批量导入</el-button
      >
      <el-button
        size="mini"
        plain
        type="warning"
        icon="el-icon-download"
        v-hasPermi="['device:deviceList:export']"
        >导出</el-button
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
          prop="data1"
          label="设备编码"
          show-overflow-tooltip
          align="center"
        ></el-table-column>

        <el-table-column
          prop="data2"
          label="设备sn码"
          show-overflow-tooltip
          align="center"
        ></el-table-column>

        <el-table-column
          prop="data3"
          label="设备名称"
          show-overflow-tooltip
          align="center"
        ></el-table-column>

        <el-table-column
          prop="data4"
          label="设备类型"
          show-overflow-tooltip
          align="center"
        ></el-table-column>

        <el-table-column
          prop="data5"
          label="设备状态"
          show-overflow-tooltip
          align="center"
        ></el-table-column>

        <el-table-column
          prop="data6"
          label="最后在线时间"
          show-overflow-tooltip
          align="center"
        ></el-table-column>

        <el-table-column
          prop="data7"
          label="创建时间"
          show-overflow-tooltip
          align="center"
        ></el-table-column>

        <el-table-column label="操作" align="center" show-overflow-tooltip>
          <template #default="record">
            <el-button type="text">查看</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text">修改</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text">删除</el-button>
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
      deviceType: [],
      deviceStatus: [],
      tableData: [
        {
          data1: 1,
          data2: 1,
          data3: 1,
          data4: 1,
          data5: 1,
          data6: 1,
          data7: 1
        }
      ],
      tableLoading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
        total: 1
      },
      selectData: []
    };
  },
  methods: {
    searchHandler() {},
    refreshHandler() {},
    handleSizeChange() {},
    handleCurrentChange() {},
    selectHandler(val) {
      this.selectData = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.deviceList-box {
  padding: 20px;
}
.el-select {
  width: 100%;
}
.btns-wrapper {
  margin-top: 20px;
}
.table-wrapper {
  margin-top: 20px;
}
.pagination-wrapper {
  margin-top: 20px;
  text-align: right;
}
</style>
