<template>
  <el-dialog title="产品详情" :visible.sync="dialogVisible" width="50%">
    <div v-loading="loading" class="detail-wrapper">
      <div>
        <label for="">ProductKey:</label>
        <span>{{ detailInfo.productKey }}</span>
      </div>

      <div>
        <label for="">产品名称:</label>
        <span>{{ detailInfo.productName }}</span>
      </div>

      <div>
        <label for="">数据格式:</label>
        <span>
          <el-input v-model="detailInfo.dataFormat" type="textarea" readonly rows="5"></el-input>
        </span>
      </div>

      <div>
        <label for="">备注:</label>
        <span>{{ detailInfo.remark }}</span>
      </div>

      <div>
        <label for="">创建时间:</label>
        <span>{{ detailInfo.createTime }}</span>
      </div>

      <div>
        <label for="">创建人:</label>
        <span>{{ detailInfo.createBy }}</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getProductDetail } from "@/api/monitor/product";
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      detailInfo: {}
    };
  },
  props: {
    visible: {
      default: () => {
        return false;
      }
    },
    productId: {
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
    productId(val) {
      this.getProductDetailHandler(val);
    }
  },
  methods: {
    getProductDetailHandler(val) {
      this.loading = true;
      getProductDetail({
        productId: val
      })
        .then(res => {
          if (res.code == 200) {
            this.detailInfo = res.data;
          }
          this.loading = false;
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

.detail-wrapper {
  > div {
    line-height: 50px;
    border-bottom: 1px solid #F0F0F0;
    &:nth-child(3) {
      display: flex;
      padding: 10px 0;
      > label {
        flex: 0 0 110px;
      }
      > span {
        flex: 1;
      }
    }
    &:first-child {
      border-top: 1px solid #f0f0f0;
    }
    > label {
      width: 110px;
      display: inline-block;
    }
  }
}
</style>
