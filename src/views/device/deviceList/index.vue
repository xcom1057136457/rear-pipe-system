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
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20">
        <div class="form-wrapper">
          <el-row :gutter="20">
            <el-form
              label-position="left"
              label-width="90px"
              size="small"
              v-show="showSearch"
            >
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
                <el-form-item label="所属产品">
                  <el-select
                    v-model="searchParams.deviceType"
                    placeholder="请选择所属产品"
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
            @click="addHandler"
            >新增</el-button
          >
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            v-hasPermi="['device:deviceList:delete']"
            :disabled="selectData.length > 0 ? false : true"
            @click="batchDeleteHandler"
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

          <right-toolbar
            :columns="columns"
            :showSearch.sync="showSearch"
            @queryTable="getDeviceList"
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
              prop="deviceCode"
              label="设备编码"
              show-overflow-tooltip
              align="center"
              v-if="columns[0].visible"
            ></el-table-column>

            <el-table-column
              prop="sn"
              label="设备sn码"
              show-overflow-tooltip
              align="center"
              v-if="columns[1].visible"
            ></el-table-column>

            <el-table-column
              prop="deviceName"
              label="设备名称"
              show-overflow-tooltip
              align="center"
              v-if="columns[2].visible"
            ></el-table-column>

            <el-table-column
              prop="deviceTypeName"
              label="所属产品"
              show-overflow-tooltip
              align="center"
              v-if="columns[3].visible"
            ></el-table-column>

            <el-table-column
              prop="status"
              label="设备状态"
              show-overflow-tooltip
              align="center"
              :formatter="statusFormatter"
              v-if="columns[4].visible"
            ></el-table-column>

            <el-table-column
              prop="onlineTime"
              label="最后在线时间"
              show-overflow-tooltip
              align="center"
              v-if="columns[5].visible"
            ></el-table-column>

            <el-table-column
              prop="createTime"
              label="创建时间"
              show-overflow-tooltip
              align="center"
              v-if="columns[6].visible"
            ></el-table-column>

            <el-table-column label="操作" align="center" show-overflow-tooltip fixed="right" width="220">
              <template #default="record">
                <el-button type="text" @click="doDetail(record.row.deviceId)"
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

    <operator-dialog
      :visible.sync="operatorShow"
      :deptId="searchParams.deptId"
      :updateInfo="updateInfo"
      @closeDialog="searchHandler"
      :operatorType="operatorType"
    />
  </div>
</template>

<script>
import { treeselect } from "@/api/system/dept";
import {
  getDeviceList,
  deleteDevice,
  batchDeleteDevice
} from "@/api/monitor/device";
import { getAllProduct } from "@/api/monitor/product";
import operatorDialog from "./components/operatorDialog.vue";
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
      operatorShow: false,
      detailId: null,
      updateInfo: {},
      showSearch: true,
      columns: [
        { key: 0, label: `设备编码`, visible: true },
        { key: 1, label: `设备sn码`, visible: true },
        { key: 2, label: `设备名称`, visible: true },
        { key: 3, label: `所属产品`, visible: true },
        { key: 4, label: `设备状态`, visible: true },
        { key: 5, label: `最后在线时间`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      operatorType: 0 // 0：新增, 1: 修改
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
      this.getDeviceList();
    },
    refreshHandler() {
      this.searchParams = {};
      this.pageParams.pageNum = 1;
      this.getDeviceList();
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getDeviceList();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.getDeviceList();
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
    // 获取产品列表
    getAllProductHandler() {
      return new Promise(async resolve => {
        let { code, rows } = await getAllProduct();
        if (code == 200) {
          this.deviceType = rows.map(item => {
            return {
              label: item.productName,
              value: item.productId
            };
          });
          this.$route.params.productId
            ? this.$set(
                this.searchParams,
                "deviceType",
                this.$route.params.productId
              )
            : "";
        }
        resolve();
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
    },
    // 删除数据
    doDelete(val) {
      this.$confirm(`此操作将永久删除${val.deviceName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await deleteDevice(val.deviceId);
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
            this.getDeviceList();
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
    batchDeleteHandler() {
      let deviceName = this.selectData.map(item => item.deviceName).join(",");
      let deviceIds = this.selectData.map(item => item.deviceId);
      this.$confirm(`此操作将永久批量删除${deviceName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await batchDeleteDevice(deviceIds);
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
            this.getDeviceList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 设备详情
    doDetail(id) {
      this.$router.push({
        name: "DeviceListDetail",
        query: {
          deviceId: id
        }
      });
    },
    // 获取设备状态
    async getDeviceStatus() {
      let { code, data } = await this.getDicts("device_status");
      if (code == 200) {
        this.deviceStatus = data.map(item => {
          return {
            value: item.dictValue,
            label: item.dictLabel
          };
        });
      }
    },
    statusFormatter(rows, cell, value) {
      let temp = this.deviceStatus.filter(item => item.value == value);
      return temp.length ? temp[0].label : "";
    },
    // 修改
    doUpdate(val) {
      this.operatorType = 1;
      this.updateInfo = val;
      this.operatorShow = true;
    },
    // 新增
    addHandler() {
      this.operatorType = 0;
      this.updateInfo = {};
      this.operatorShow = true;
    }
  },
  async created() {
    this.getTreeselect();
    await this.getAllProductHandler();
    this.getDeviceList();
    this.getDeviceStatus();
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
