<template>
  <el-dialog title="设备详情" :visible.sync="dialogVisible" width="50%">
    <div class="detail-wrapper" v-loading="loading">
      <table>
        <tr>
          <td class="label">设备编码</td>
          <td>{{ detailInfo.deviceCode }}</td>
          <td class="label">设备名称</td>
          <td>{{ detailInfo.deviceName }}</td>
          <td class="label">设备SN码</td>
          <td>{{ detailInfo.sn }}</td>
        </tr>

        <tr>
          <td class="label">所属产品</td>
          <td>{{ detailInfo.deviceType }}</td>
          <td class="label">设备专责</td>
          <td>{{ detailInfo.equipSpecialist }}</td>
          <td class="label">IEME卡号</td>
          <td>{{ detailInfo.ieme }}</td>
        </tr>

        <tr>
          <td class="label">安装位置</td>
          <td>{{ detailInfo.installPosition }}</td>
          <td class="label">联系厂家</td>
          <td>{{ detailInfo.manufactor }}</td>
          <td class="label">电网专责</td>
          <td>{{ detailInfo.powergridSpecialist }}</td>
        </tr>

        <tr>
          <td class="label">备注</td>
          <td colspan="5">{{ detailInfo.remark }}</td>
        </tr>
      </table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDeiveDetail } from "@/api/monitor/device";
export default {
  data() {
    return {
      dialogVisible: false,
      detailInfo: {},
      loading: false
    };
  },
  props: {
    visible: {
      default: () => {
        return false;
      }
    },
    detailId: {
      default: () => {
        return "";
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    },
    detailId(val) {
      this.getDetailInfo(val);
    }
  },
  methods: {
    getDetailInfo(val) {
      this.loading = true;
      getDeiveDetail({
        deviceId: val
      })
        .then(res => {
          if (res.code == 200) {
            this.detailInfo = res.data;
          }
          this.loading = false;
          console.log(res);
        })
        .catch(() => {
          this.loading = false;
        });
    }
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
