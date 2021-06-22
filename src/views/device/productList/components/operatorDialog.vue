<template>
  <el-dialog
    :title="operatorType ? '修改产品' : '新增产品'"
    :visible.sync="dialogVisible"
    width="40%"
  >
    <div class="form-wrapper">
      <el-form
        label-position="left"
        label-width="110px"
        size="small"
        :model="formParams"
        ref="form"
      >
        <el-form-item label="所属阿里云产品" prop="productKey">
          <el-select
            v-model="formParams.productKey"
            placeholder="请选择所属阿里云产品.."
          >
            <el-option
              v-for="(item, index) in aliProductList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input
            v-model="formParams.productName"
            placeholder="请输入产品名称..."
          ></el-input>
        </el-form-item>
        <el-form-item label="数据格式" prop="dataFormat">
          <el-input
            v-model="formParams.dataFormat"
            placeholder="请输入数据格式..."
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formParams.remark"
            type="textarea"
            placeholder="请输入备注..."
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="submitHandler"
        size="small"
        :loading="buttonLoading"
        >确 定</el-button
      >
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addProduct, updateProduct } from "@/api/monitor/product";
import { getAliProduct } from "@/api/monitor/aliProduct";
export default {
  data() {
    return {
      dialogVisible: false,
      aliProductList: [],
      formParams: {},
      buttonLoading: false
    };
  },
  props: {
    visible: {
      default: () => {
        return false;
      }
    },
    updateInfo: {
      default: () => {
        return {};
      }
    },
    operatorType: {
      default: () => {
        return null;
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
    updateInfo(val) {
      if (val.productId) {
        let params = JSON.parse(JSON.stringify(val))
        this.$set(this, "formParams", params);
      } else {
        this.resetForm()
      }
    }
  },
  methods: {
    submitHandler() {
      this.buttonLoading = true;
      if (this.operatorType == 0) {
        addProduct(this.formParams)
          .then(res => {
            if (res.code == 200) {
              this.dialogVisible = false;
              this.$message.success("新增成功!");
              this.$emit("closeHandler");
            }
            this.buttonLoading = false;
          })
          .catch(() => {
            this.buttonLoading = false;
          });
      } else {
        updateProduct(this.formParams)
          .then(res => {
            if (res.code == 200) {
              this.dialogVisible = false;
              this.$message.success("修改成功!");
              this.$emit("closeHandler");
            }
            this.buttonLoading = false;
          })
          .catch(() => {
            this.buttonLoading = false;
          });
      }
    },
    resetForm() {
      this.$set(this, "formParams", {});
    },
    // 获取阿里云产品列表
    getAliProductHandler() {
      getAliProduct().then(res => {
        if (res.code == 200) {
          this.aliProductList = res.rows.map(item => {
            return {
              value: item.productKey,
              label: item.productName
            };
          });
        }
      });
    }
  },
  created() {
    this.getAliProductHandler(0);
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 10px 20px;
}

.el-select {
  width: 100%;
}
</style>
