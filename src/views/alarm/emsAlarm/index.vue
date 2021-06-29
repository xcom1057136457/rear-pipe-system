<template>
  <div class="alarm-wrapper">
    <div class="left-wrapper">
      <div class="chart-wrapper">
        <alarmChart :chartData="chartData" />
      </div>

      <div class="type-wrapper">
        <div
          :class="{ current: alarmType == 'ALL' }"
          @click="changeType('ALL')"
        >
          全部
        </div>
        <div
          :class="{ current: alarmType == item.alarmtype }"
          v-for="(item, index) in alarmCount"
          :key="index"
          @click="changeType(item.alarmtype)"
        >
          {{ item.types + " ( " + item.alarmsum + " )" }}
        </div>
      </div>
    </div>
    <div class="right-wrapper">
      <div class="form-wrapper">
        <el-form
          label-position="left"
          label-width="70px"
          size="small"
          :model="searchParams"
          ref="searchForm"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="告警时间">
                <el-date-picker
                  v-model="searchParams.alarmDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width: 100%"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="告警级别">
                <el-select
                  v-model="searchParams.level"
                  placeholder="请选择告警级别"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in levelList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="设备名称">
                <el-select
                  v-model="searchParams.sn"
                  filterable
                  default-first-option
                  placeholder="请选择设备名称"
                >
                  <el-option :value="null" label="全部设备"></el-option>
                  <el-option
                    v-for="(item, index) in deviceList"
                    :key="index"
                    :value="item.sn"
                    :label="item.deviceName"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6" style="text-align: right">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-search"
                @click="searchHandler"
                >搜索</el-button
              >
              <el-button
                type="default"
                size="small"
                icon="el-icon-refresh-right"
                @click="resetHandler"
                >重置</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="table-wrapper">
        <el-table :data="alarmData" ref="formTable" v-loading="tableLoading">
          <el-table-column
            label="设备"
            align="center"
            show-overflow-tooltip
            prop="deviceName"
          ></el-table-column>

          <el-table-column
            label="告警类型"
            align="center"
            show-overflow-tooltip
            prop="type"
            :formatter="typeFormatter"
          ></el-table-column>

          <el-table-column
            label="告警内容"
            align="center"
            show-overflow-tooltip
            prop="warnInfo"
          ></el-table-column>

          <el-table-column
            label="级别"
            align="center"
            show-overflow-tooltip
            prop="deviceName"
          >
            <template #default="record">
              <div :style="getColor(record.row.level)">
                {{
                  record.row.level == 1
                    ? "一级"
                    : record.row.level == 2
                    ? "二级"
                    : "三级"
                }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="告警时间"
            align="center"
            show-overflow-tooltip
            prop="continueTv"
            width="160px"
          ></el-table-column>

          <el-table-column
            label="解除时间"
            align="center"
            show-overflow-tooltip
            prop="finishTv"
            width="160px"
          ></el-table-column>

          <el-table-column label="状态" align="center" show-overflow-tooltip>
            <template #default="record">
              <div :class="{ red: record.row.state == 1 }">
                {{ record.row.state == 1 ? "报警" : "解除" }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParams.pageNum"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getAlarmPage } from "@/api/alarm/emsAlarm";
import alarmChart from "./components/alarm-chart";
import dayjs from "dayjs";
import { getAllDevice } from "@/api/monitor/device";
export default {
  data() {
    return {
      pageParams: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchParams: {
        alarmDate: "",
        startTime: "",
        endTime: "",
        level: "",
        type: ""
      },
      chartData: [],
      alarmData: [],
      alarmCount: [],
      alarmType: "ALL",
      levelList: [
        { label: "一级", value: "1" },
        { label: "二级", value: "2" },
        { label: "三级", value: "3" }
      ],
      tableLoading: false,
      deviceList: []
    };
  },
  components: {
    alarmChart
  },
  methods: {
    async getAlarmPageHandler() {
      this.tableLoading = true;
      let params = Object.assign({}, this.pageParams, this.searchParams);
      if (params.alarmDate && params.alarmDate.length) {
        params.startTime = dayjs(params.alarmDate[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        params.endTime = dayjs(params.alarmDate[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        delete params.alarmDate;
      }
      let { code, data } = await getAlarmPage(params);
      if (code == 200) {
        this.chartData = data.alarmCount;
        this.alarmData = data.items.list;
        this.alarmCount = data.alarmCount;
        this.alarmCount.forEach(e => {
          if (e.alarmtype === "1001") {
            e.types = "逆变器";
          } else if (e.alarmtype === "1002") {
            e.types = "电池系统";
          } else if (e.alarmtype === "1003") {
            e.types = "电表";
          } else if (e.alarmtype === "1004") {
            e.types = "环境";
          } else if (e.alarmtype === "1005") {
            e.types = "消防";
          } else if (e.alarmtype === "1006") {
            e.types = "门禁";
          } else {
            e.types = e.alarmtype;
          }
        });
        this.pageParams.total = data.items.total;
      }
      this.tableLoading = false;
    },
    searchHandler() {
      this.pageParams.pageNum = 1;
      this.getAlarmPageHandler();
    },
    resetHandler() {
      this.searchParams = {};
      this.searchHandler();
    },
    handleSizeChange(val) {
      this.pageParams.pageSize = val;
      this.getAlarmPageHandler();
    },
    handleCurrentChange(val) {
      this.pageParams.pageNum = val;
      this.getAlarmPageHandler();
    },
    typeFormatter(row, col, e) {
      let temp = "";
      if (e === "1001") {
        temp = "PCS";
      } else if (e === "1002") {
        temp = "BMS";
      } else if (e === "1003") {
        temp = "电表";
      } else if (e === "1004") {
        temp = "环境";
      } else if (e === "1005") {
        temp = "消防";
      } else if (e === "1006") {
        temp = "门禁";
      } else {
        temp = e;
      }
      return temp;
    },
    getColor(val) {
      if (val == 1) {
        return "";
      } else if (val == 2) {
        return "color: #ffdc60";
      } else {
        return "color: red";
      }
    },
    changeType(val) {
      this.alarmType = val;
      val == "ALL"
        ? (this.searchParams.type = "")
        : (this.searchParams.type = val);
      this.searchHandler();
    },
    // 获取所有设备
    getAllDeviceHandler() {
      getAllDevice().then(res => {
        if (res.code == 200) {
          this.deviceList = res.rows.filter(item => item.deviceType == 17);
        }
      });
    }
  },
  mounted() {
    this.getAlarmPageHandler();
    this.getAllDeviceHandler();
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.top-text {
  font-size: 18px;
  color: #666;
  font-weight: bold;
  position: relative;
  margin-bottom: 10px;
  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    background-color: #f0f0f0;
    height: 1px;
  }
}
.alarm-wrapper {
  display: flex;
  padding: 10px;
  > div {
    float: left;
  }
  .left-wrapper {
    width: 320px;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
  }
  .right-wrapper {
    width: calc(100% - 320px - 10px);
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    box-sizing: border-box;
    .pagination-wrapper {
      margin-top: 10px;
      text-align: right;
    }
    .table-wrapper {
      position: relative;
      width: 100%;
    }
  }
}

.chart-wrapper {
  width: 100%;
  height: 250px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.type-wrapper {
  width: 100%;
  margin-top: 10px;
  background-color: #fff;
  box-sizing: border-box;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  flex: 1;
  > div {
    cursor: pointer;
    padding: 10px;
    &:hover {
      background-color: rgba(#409eff, 0.1);
      color: #409eff;
    }
  }
}

.current {
  background-color: rgba(#409eff, 0.1);
  color: #409eff;
}

.red {
  color: red;
}
</style>
