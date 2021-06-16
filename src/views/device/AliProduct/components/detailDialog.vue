<template>
  <el-dialog title="提示" :visible.sync="dialogVisible" width="70%" v-draggable>
    <div class="detail-box" v-loading="loading">
      <div class="top-header">
        <el-row :gutter="20">
          <el-col :span="8">
            <label for="">ProductKey:</label>
            {{ detailForm.productKey }}
          </el-col>

          <el-col :span="8">
            <label for="">ProductSecret:</label>
            {{ detailForm.productSecret }}
          </el-col>

          <el-col :span="8">
            <label for="">设备数:</label>
            {{ detailForm.deviceCount }}
          </el-col>
        </el-row>
      </div>

      <div class="table-wrapper">
        <table>
          <tr>
            <td class="label">产品名称</td>
            <td>{{ detailForm.productName }}</td>
            <td class="label">节点类型</td>
            <td>{{ forMatter(detailForm.nodeType, 'nodeTypeList') }}</td>
            <td class="label">创建时间</td>
            <td>{{ parseTime(detailForm.gmtCreate) }}</td>
          </tr>

          <tr>
            <td class="label">所属品类</td>
            <td>{{ detailForm.categoryName }}</td>
            <td class="label">数据格式</td>
            <td>{{ forMatter(detailForm.dataFormat, 'dataFormateList') }}</td>
            <td class="label">数据校验级别</td>
            <td>{{ forMatter(detailForm.validateType, 'validateTypeList') }}</td>
          </tr>

          <tr>
            <td class="label">认证方式</td>
            <td>{{ forMatter(detailForm.authType, 'authTypeList') }}</td>
            <td class="label">状态</td>
            <td>
              <span
                class="dot green"
                :class="
                  detailForm.productStatus == 'RELEASE_STATUS' ? 'green' : 'red'
                "
              ></span>
              {{ forMatter(detailForm.productStatus, 'statusList') }}
            </td>
            <td class="label">连网协议</td>
            <td>{{ forMatter(detailForm.netType, 'netTypeList') }}</td>
          </tr>

          <tr>
            <td class="label">产品描述</td>
            <td colspan="5">{{ detailForm.description || '暂无描述...' }}</td>
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
import { getAliProductDetail } from "@/api/monitor/aliProduct";
import { parseTime } from "@/utils/ruoyi";
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      detailForm: {},
      nodeTypeList: [],
      validateTypeList: [],
      authTypeList: [],
      statusList: [],
      netTypeList: [],
      dataFormateList: []
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
      this.getProductDetail(val);
    }
  },
  methods: {
    // 获取产品详情
    async getProductDetail(productKey) {
      this.loading = true;
      let { code, data } = await getAliProductDetail({
        productKey
      });
      if (code == 200) {
        this.detailForm = data;
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
    // 获取数据校验级别
    async getValidateType() {
      let { code, data } = await this.getDicts("validate_type");
      if (code == 200) {
        this.validateTypeList = data;
      }
    },
    // 获取认证方式
    async getAuthType() {
      let { code, data } = await this.getDicts("auth_type");
      if (code == 200) {
        this.authTypeList = data;
      }
    },
    // 获取状态
    async getStatus() {
      let { code, data } = await this.getDicts("product_status");
      if (code == 200) {
        this.statusList = data;
      }
    },
    // 获取联网协议
    async getNetType() {
      let { code, data } = await this.getDicts("net_type");
      if (code == 200) {
        this.netTypeList = data;
      }
    },
    // 获取数据格式
    async getDataFormate() {
      let { code, data } = await this.getDicts('data_format')
      if (code == 200) {
        this.dataFormateList = data
      }
    },
    // 格式化
    forMatter(val, type) {
      let temp = this[type].filter(item => item.dictValue == val);
      return temp.length ? temp[0].dictLabel : ''
    }
  },
  created() {
    this.getNodeTypeList();
    this.getValidateType();
    this.getAuthType();
    this.getStatus();
    this.getNetType();
    this.getDataFormate()
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
