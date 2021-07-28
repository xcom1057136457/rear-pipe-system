<template>
  <el-dialog
    title="设备信息"
    :visible.sync="dialogVisible"
    width="80%"
    v-draggable
    @open="initData"
    @closed="resetForm"
  >
    <div v-loading="loading">
      <table>
        <tr>
          <td class="label">产品名称</td>
          <td>{{ detailInfo.productName }}</td>
          <td class="label">productKey</td>
          <td>{{ detailInfo.productKey }}</td>
          <td class="label">地域</td>
          <td>{{ detailInfo.region }}</td>
        </tr>

        <tr>
          <td class="label">节点类型</td>
          <td>{{ forMatter(detailInfo.nodeType, "nodeTypeList") }}</td>
          <td class="label">DeviceName</td>
          <td>{{ detailInfo.deviceName }}</td>
          <td class="label">认证方式</td>
          <td></td>
        </tr>

        <tr>
          <td class="label">备注名称</td>
          <td>{{ detailInfo.nickname }}</td>
          <td class="label">IP地址</td>
          <td>{{ detailInfo.ipAddress }}</td>
          <td class="label">固件版本</td>
          <td>{{ detailInfo.firmwareVersion }}</td>
        </tr>

        <tr>
          <td class="label">创建时间</td>
          <td>{{ detailInfo.gmtCreate }}</td>
          <td class="label">激活时间</td>
          <td>{{ detailInfo.gmtActive }}</td>
          <td class="label">最后上线时间</td>
          <td>{{ detailInfo.gmtOnline }}</td>
        </tr>

        <tr>
          <td class="label">当前状态</td>
          <td>{{ forMatter(detailInfo.status, "statusList") }}</td>
          <td class="label">实时延迟</td>
          <td></td>
          <td class="label">设备本地日志上报</td>
          <td></td>
        </tr>
      </table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDeviceDetail } from "@/api/monitor/aliDevice";
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      detailInfo: {},
      nodeTypeList: [],
      statusList: []
    };
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: () => {
        return false;
      }
    },
    deviceInfo: {
      default: () => {
        return {};
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    }
  },
  methods: {
    initData() {
      this.getDeviceDetailhandler(this.deviceInfo);
    },
    // 获取详情
    async getDeviceDetailhandler(val) {
      this.loading = true;
      let { code, data } = await getDeviceDetail(val);
      if (code == 200) {
        for (let key in data) {
          if (data[key] == null) {
            data[key] = "暂无数据...";
          }
        }
        this.detailInfo = data;
      }
      this.loading = false;
    },
    // 获取节点类型
    async getNodeTypeList() {
      let { code, data } = await this.getDicts("aliyun_node_type");
      if (code == 200) {
        this.nodeTypeList = data;
      }
    },
    // 获取状态
    async getStatus() {
      let { code, data } = await this.getDicts("aliDevice_status");
      if (code == 200) {
        this.statusList = data;
      }
    },
    // 格式化
    forMatter(val, type) {
      let temp = this[type].filter(item => item.dictValue == val);
      return temp.length ? temp[0].dictLabel : "";
    },
    resetForm() {
      this.detailInfo = {};
    }
  },
  created() {
    this.getNodeTypeList();
    this.getStatus();
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 10px 20px;
}

table {
  width: 100%;
  border-left: 1px solid #dedede;
  border-bottom: 1px solid #dedede;
  border-collapse: collapse;
  tr > td {
    border-top: 1px solid #dedede;
    border-right: 1px solid #dedede;
    padding: 10px 0 10px 10px;
  }
}

.label {
  background-color: #f0f0f0;
}
</style>
