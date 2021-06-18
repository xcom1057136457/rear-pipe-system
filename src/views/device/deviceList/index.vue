<template>
  <div class="deviceList-box">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20">
        <div class="form-wrapper">
          <el-row :gutter="20">
            <el-form label-position="left" label-width="90px" size="small">
              <el-col :span="6">
                <el-form-item label="设备编码">
                  <el-input
                    v-model="searchParams.deviceCode"
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
                    v-model="searchParams.status"
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
            @click="operatorShow = true"
            :disabled="!searchParams.deptId"
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
            v-loading="tableLoading"
            @selection-change="selectHandler"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              prop="deviceCode"
              label="设备编码"
              show-overflow-tooltip
              align="center"
            ></el-table-column>

            <el-table-column
              prop="sn"
              label="设备sn码"
              show-overflow-tooltip
              align="center"
            ></el-table-column>

            <el-table-column
              prop="deviceName"
              label="设备名称"
              show-overflow-tooltip
              align="center"
            ></el-table-column>

            <el-table-column
              prop="deviceType"
              label="设备类型"
              show-overflow-tooltip
              align="center"
            ></el-table-column>

            <el-table-column
              prop="status"
              label="设备状态"
              show-overflow-tooltip
              align="center"
            ></el-table-column>

            <el-table-column
              prop="onlineTime"
              label="最后在线时间"
              show-overflow-tooltip
              align="center"
            ></el-table-column>

            <el-table-column
              prop="createTime"
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
      </el-col>
    </el-row>

    <operator-dialog :visible.sync="operatorShow" :deptId="searchParams.deptId" @closeDialog="searchHandler" />
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import { getDeviceList } from "@/api/monitor/device";
import operatorDialog from "./components/operatorDialog.vue"
export default {
  data() {
    return {
      searchParams: {},
      deviceType: [],
      deviceStatus: [],
      tableData: [],
      tableLoading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      selectData: [],
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label"
      },
      operatorShow: false
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  components: {
    operatorDialog
  },
  methods: {
    searchHandler() {
      this.pageParams.pageNum = 1;
      this.getDeviceList()
    },
    refreshHandler() {
      this.searchParams = {}
      this.pageParams.pageNum = 1
      this.getDeviceList()
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val
      this.getDeviceList()
    },
    handleCurrentChange(val) {
      this.pageParams.pageNum = val
      this.getDeviceList()
    },
    selectHandler(val) {
      this.selectData = val;
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.searchParams.deptId = data.id;
      this.getDeviceList();
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 获取列表数据
    async getDeviceList() {
      this.tableLoading = true;
      let params = Object.assign({}, this.searchParams, this.pageParams);
      let { code, rows, total } = await getDeviceList(params);
      if (code == 200) {
        this.tableData = rows;
        this.pageParams.total = total;
      }
      this.tableLoading = false;
    }
  },
  created() {
    this.getTreeselect();
    this.getDeviceList();
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 10px 20px;
}
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
