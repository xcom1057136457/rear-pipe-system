<template>
  <el-dialog
    title="设备信息"
    :visible.sync="dialogVisible"
    width="80%"
    v-draggable
  >
    <div v-loading="loading">
      <table>
        <tr>
          <td class="label">产品名称</td>
          <td>pulaoc_gateway</td>
          <td class="label">productKey</td>
          <td>test2021xxx</td>
          <td class="label">地域</td>
          <td>华东2(上海)</td>
        </tr>

        <tr>
          <td class="label">节点类型</td>
          <td>网关</td>
          <td class="label">DeviceName</td>
          <td>bxbxbxbxbxb22</td>
          <td class="label">认证方式</td>
          <td>设备秘钥</td>
        </tr>

        <tr>
          <td class="label">备注名称</td>
          <td>markDone</td>
          <td class="label">IP地址</td>
          <td>221.178.124.145</td>
          <td class="label">固件版本</td>
          <td>default - Teb - 7EC - 001 - GW - 1.000</td>
        </tr>

        <tr>
          <td class="label">创建时间</td>
          <td>2021/05/27 11:07:25</td>
          <td class="label">激活时间</td>
          <td>2021/05/27 11:07:25</td>
          <td class="label">最后上线时间</td>
          <td>2021/05/27 11:07:25</td>
        </tr>

        <tr>
          <td class="label">当前状态</td>
          <td>离线</td>
          <td class="label">实时延迟</td>
          <td>11Ms</td>
          <td class="label">设备本地日志上报</td>
          <td>已关闭</td>
        </tr>
      </table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false
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
    deviceId: {
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
    deviceId(val) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
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
