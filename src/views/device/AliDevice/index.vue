<template>
  <div class="aliDeviceList-box">
    <div class="top-header">
      <div>
        <el-select
          v-model="searchParams.deviceType"
          size="small"
          style="width: 200px"
          placeholder="请选择产品..."
        >
          <el-option
            v-for="(item, index) in productList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>
      <div>
        <div class="top-text">设备总数</div>
        <div class="count-text">155</div>
      </div>
      <div>
        <div>
          <span class="dot blue"></span>
          <span class="top-text">激活设备</span>
        </div>
        <div class="count-text">148</div>
      </div>
      <div>
        <div>
          <span class="dot green"></span>
          <span class="top-text">当前在线</span>
        </div>
        <div class="count-text">27</div>
      </div>
    </div>
    <div class="bottom-detail">
      <div class="form-wrapper">
        <el-row :gutter="20">
          <el-form label-position="left" label-width="80px" size="small">
            <el-col :span="6">
              <el-form-item label="设备名称">
                <el-input
                  v-model="searchParams.devicename"
                  placeholder="请输入设备名称..."
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="设备状态">
                <el-select
                  v-model="searchParams.status"
                  placeholder="请选择设备状态..."
                >
                  <el-option
                    v-for="(item, index) in status"
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
          type="primary"
          @click="addDialogShow = !addDialogShow"
          plain
          size="small"
          v-hasPermi="['device:AliDevice:add']"
          icon="el-icon-plus"
          >添加设备</el-button
        >
      </div>

      <div class="table-wrapper">
        <el-table :data="tableData" v-loading="loading">
          <el-table-column
            type="selection"
            show-overflow-tooltip
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="deviceName"
            label="DeviceName/备注名称"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column
            prop="beloneProduct"
            label="设备所属产品"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="节点类型" align="center">
            <template #default="record">
              {{ record.row.type == 0 ? "网关" : "" }}
            </template>
          </el-table-column>
          <el-table-column label="状态/启用状态" show-overflow-tooltip align="center">
            <template #default="record">
              <span
                :class="statusColorFormate(record.row.status)"
                class="dot"
              ></span>
              {{ statusFormate(record.row.status) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            label="最后上线时间"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip align="center">
            <template #default="record">
              <el-button type="text" @click="doView(record.row.id)"
                >查看</el-button
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
    </div>

    <add-dialog :visible.sync="addDialogShow" />
    <detail-dialog :visible.sync="detailDialogShow" :deviceId="deviceId" />
  </div>
</template>

<script>
import addDialog from "./components/addDialog.vue";
import detailDialog from "./components/deviceDetail.vue";
export default {
  data() {
    return {
      loading: false,
      addDialogShow: false,
      detailDialogShow: false,
      deviceId: null,
      productList: [
        {
          value: "g60wW1111",
          label: "全部产品"
        }
      ],
      status: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "离线"
        },
        {
          value: 2,
          label: "未激活"
        },
        {
          value: 3,
          label: "在线"
        }
      ],
      searchParams: {},
      pageParams: {
        total: 3,
        pageNum: 1,
        pageSize: 10
      },
      tableData: [
        {
          id: 0,
          deviceName: "Test20210611",
          beloneProduct: "pulaoc_gateway",
          type: 0,
          status: 1,
          time: "2021/05/27 15:27:00.169"
        },
        {
          id: 1,
          deviceName: "Test20210611",
          beloneProduct: "pulaoc_gateway2",
          type: 0,
          status: 2,
          time: "2021/05/27 15:27:00.169"
        },
        {
          id: 2,
          deviceName: "Test20210611",
          beloneProduct: "pulaoc_gateway3",
          type: 0,
          status: 3,
          time: "2021/05/27 15:27:00.169"
        }
      ]
    };
  },
  components: {
    addDialog,
    detailDialog
  },
  methods: {
    statusFormate(val) {
      let temp = this.status.filter(item => item.value == val);
      return temp.length ? temp[0].label : "";
    },
    statusColorFormate(val) {
      if (val == 1) {
        return "gray";
      } else if (val == 2) {
        return "orange";
      } else {
        return "green";
      }
    },
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
    // 详情
    doView(id) {
      this.deviceId = id;
      this.detailDialogShow = true;
    },
    // 删除
    doDelete(record) {
      this.$confirm(`此操作将永久删除${record.deviceName}, 是否继续?`, "提示", {
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
  },
  created() {
    if (this.$route.params.productKey) {
      this.searchParams.deviceType = this.$route.params.productKey;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.aliDeviceList-box {
  padding: 20px;
  .el-select {
    width: 100%;
  }
}

.top-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .top-text {
    font-size: 14px;
    color: #a3a3a3;
  }
  .count-text {
    font-size: 20px;
    font-weight: bold;
  }
  > div {
    flex: 0 0 250px;
    border-left: 1px solid #dedede;
    padding-left: 30px;
    &:first-child {
      border-left: none;
      padding-left: 0;
    }
  }
}

.table-wrapper {
  margin-top: 15px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 7px;
  &.blue {
    background-color: cornflowerblue;
  }
  &.green {
    background-color: green;
  }
  &.gray {
    background-color: gray;
  }
  &.orange {
    background-color: orange;
  }
}

.pagination-wrapper {
  text-align: right;
  margin-top: 15px;
}
</style>
