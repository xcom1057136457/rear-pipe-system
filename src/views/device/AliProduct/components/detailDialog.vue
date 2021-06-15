<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="70%" v-draggable>
    <div class="detail-box" v-loading="loading">
      <div class="top-header">
        <el-row :gutter="20">
          <el-col :span="8">
            <label for="">ProductKey:</label>
            g60wW1111
          </el-col>

          <el-col :span="8">
            <label for="">ProductSecret:</label>
            123456
          </el-col>

          <el-col :span="8">
            <label for="">设备数:</label>
            113
          </el-col>
        </el-row>
      </div>

      <div class="table-wrapper">
        <table>
          <tr>
            <td class="label">产品名称</td>
            <td>pulaoc_gateway</td>
            <td class="label">节点类型</td>
            <td>网关设备</td>
            <td class="label">创建时间</td>
            <td>2021/04/08 15:45:36</td>
          </tr>

          <tr>
            <td class="label">所属品类</td>
            <td>自定义品类</td>
            <td class="label">数据格式</td>
            <td>ICA标准数据格式 (Alink JSON)</td>
            <td class="label">数据校验级别</td>
            <td>弱校验</td>
          </tr>

          <tr>
            <td class="label">认证方式</td>
            <td>设备秘钥</td>
            <td class="label">状态</td>
            <td>
              <span class="dot green"></span>
              已发布
            </td>
            <td class="label">连网协议</td>
            <td>蜂窝 (2G/3G/4G/5G)</td>
          </tr>

          <tr>
            <td class="label">产品描述</td>
            <td colspan="5">topic通信协议</td>
          </tr>
        </table>
      </div>
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
      required: true,
      default: () => {
        return false;
      }
    },
    productKey: {
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
    productKey(val) {
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

label {
  margin-right: 10px;
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

.table-wrapper {
  margin-top: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
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
</style>
