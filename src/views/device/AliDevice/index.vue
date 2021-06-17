<template>
  <div class="aliDeviceList-box">
    <div class="top-header">
      <div>
        <el-select
          v-model="searchParams.productKey"
          size="small"
          style="width: 200px"
          placeholder="请选择产品..."
          @change="searchHandler"
        >
          <el-option label="全部产品" :value="allProduct"></el-option>
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
        <div class="count-text">{{ deviceCount.deviceCount }}</div>
      </div>
      <div>
        <div>
          <span class="dot blue"></span>
          <span class="top-text">激活设备</span>
        </div>
        <div class="count-text">{{ deviceCount.activeCount }}</div>
      </div>
      <div>
        <div>
          <span class="dot green"></span>
          <span class="top-text">当前在线</span>
        </div>
        <div class="count-text">{{ deviceCount.onlineCount }}</div>
      </div>
    </div>
    <div class="bottom-detail">
      <div class="form-wrapper">
        <el-row :gutter="20">
          <el-form label-position="left" label-width="80px" size="small">
            <el-col :span="6">
              <el-form-item label="设备名称">
                <el-input
                  v-model="searchParams.deviceName"
                  placeholder="请输入设备名称..."
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="设备状态">
                <el-select
                  v-model="searchParams.deviceStatus"
                  placeholder="请选择设备状态..."
                  clearable
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
            prop="productKey"
            label="设备所属产品"
            show-overflow-tooltip
            align="center"
            :formatter="productKeyFormatter"
          ></el-table-column>
          <el-table-column
            label="状态/启用状态"
            show-overflow-tooltip
            align="center"
          >
            <template #default="record">
              <span
                class="dot"
                :class="statusClassFormatter(record.row.status)"
              ></span>
              {{ statusFormate(record.row.status) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="gmtModified"
            label="最后上线时间"
            show-overflow-tooltip
            align="center"
          ></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip align="center">
            <template #default="record">
              <el-button
                type="text"
                @click="doView(record.row.productKey, record.row.iotId)"
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
          :page-sizes="[10, 15, 20]"
        >
        </el-pagination>
      </div>
    </div>

    <add-dialog :visible.sync="addDialogShow" @closeAdd="refreshHandler" />
    <detail-dialog :visible.sync="detailDialogShow" :deviceInfo="deviceInfo" />
  </div>
</template>

<script>
import addDialog from "./components/addDialog.vue";
import detailDialog from "./components/deviceDetail.vue";
import { getAliProduct } from "@/api/monitor/aliProduct";
import { getDeviceList, deleteDevice } from "@/api/monitor/aliDevice";
export default {
  data() {
    return {
      loading: false,
      addDialogShow: false,
      detailDialogShow: false,
      deviceInfo: {},
      productList: [],
      status: [],
      searchParams: {},
      deviceCount: {
        deviceCount: 0,
        activeCount: 0,
        onlineCount: 0
      },
      pageParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      tableData: []
    };
  },
  components: {
    addDialog,
    detailDialog
  },
  computed: {
    allProduct() {
      let temp = this.productList.map(item => item.value);
      return temp.length ? temp.join(",") : "";
    }
  },
  methods: {
    statusFormate(val) {
      let temp = this.status.filter(item => item.value == val);
      return temp.length ? temp[0].label : "";
    },
    // 重置
    refreshHandler() {
      this.$set(this.searchParams, "deviceName", null);
      this.$set(this.searchParams, "deviceStatus", null);
      this.pageParams.pageNum = 1;
      this.getList();
    },
    // 搜索
    searchHandler() {
      this.pageParams.pageNum = 1;
      this.getList();
    },
    // 获取数据
    async getList() {
      this.loading = true;
      let params = Object.assign({}, this.pageParams, this.searchParams);
      let { code, rows, total } = await getDeviceList(params);
      if (code == 200) {
        this.tableData = rows.rows;
        this.deviceCount = {
          activeCount: rows.activeCount,
          deviceCount: rows.deviceCount,
          onlineCount: rows.onlineCount
        };
        this.pageParams.total = total;
      }
      this.loading = false;
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
    doView(productKey, iotId) {
      this.deviceInfo = {
        productKey,
        iotId
      };
      this.detailDialogShow = true;
    },
    // 删除
    doDelete(record) {
      this.$confirm(`此操作将永久删除${record.deviceName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let { code } = await deleteDevice({
            iotId: record.iotId
          });
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
            setTimeout(() => {
              this.getList();
            }, 1000)
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取产品列表
    getAliProductHandler() {
      return new Promise(async resolve => {
        let { code, rows } = await getAliProduct();
        if (code == 200) {
          this.productList = rows.map(item => {
            return {
              value: item.productKey,
              label: item.productName
            };
          });
          if (!this.$route.params.productKey) {
            this.$set(
              this.searchParams,
              "productKey",
              this.productList.map(item => item.value).join(",")
            );
          } else {
            this.$set(
              this.searchParams,
              "productKey",
              this.$route.params.productKey
            );
          }
          resolve();
        }
      });
    },
    // 转码
    productKeyFormatter(row, col, cellValue) {
      let temp = this.productList.filter(item => item.value == cellValue);
      return temp.length ? temp[0].label : "";
    },
    // 获取设备状态
    getDeviceStatus() {
      return new Promise(async resolve => {
        let { code, data } = await this.getDicts("aliDevice_status");
        if (code == 200) {
          this.status = data.map(item => {
            return {
              value: item.dictValue,
              label: item.dictLabel
            };
          });
          resolve();
        }
      });
    },
    // 颜色提示
    statusClassFormatter(status) {
      switch (status) {
        case "ONLINE": {
          return "green";
        }

        case "OFFLINE": {
          return "red";
        }

        case "UNACTIVE": {
          return "orange";
        }

        case "DISABLE": {
          return "gray";
        }
      }
    }
  },
  async created() {
    await this.getAliProductHandler();
    await this.getDeviceStatus();
    this.getList();
  }
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
  &.red {
    background-color: red;
  }
}

.pagination-wrapper {
  text-align: right;
  margin-top: 15px;
}
</style>
