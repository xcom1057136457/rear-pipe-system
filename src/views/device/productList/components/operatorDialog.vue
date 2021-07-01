<template>
  <el-dialog
    :title="operatorType ? '修改产品' : '新增产品'"
    :visible.sync="dialogVisible"
    width="40%"
    v-draggable
    append-to-body
  >
    <div class="form-wrapper">
      <el-form
        label-position="left"
        label-width="120px"
        size="small"
        :model="formParams"
        ref="form"
        :rules="rules"
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
            rows="10"
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
import { isJSON } from "@/utils/validate"
export default {
  data() {
    var checkDataFormat = (rule, value, callback) => {
      if (!value) return callback()
      if (isJSON(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的JSON格式'))
      }
    };
    return {
      dialogVisible: false,
      aliProductList: [],
      formParams: {
        productKey: "",
        productName: "",
        dataFormat: "",
        remark: ""
      },
      buttonLoading: false,
      rules: {
        productKey: [
          { required: true, message: "请选择阿里云产品", triger: "change" }
        ],
        dataFormat: [
          { validator: checkDataFormat, triger: 'blur' }
        ],
        productName: [
          { required: true, message: "请输入产品名称", triger: "blur" },
          {
            min: 4,
            max: 10,
            message: "产品名称长度在 4 到 10 个字符",
            trigger: "blur"
          }
        ]
      }
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
      this.resetForm();
      if (val.productId) {
        let params = JSON.parse(JSON.stringify(val));
        this.$set(this, "formParams", params);
      }
    }
  },
  methods: {
    submitHandler() {
      this.$refs["form"].validate(valid => {
        if (valid) {
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
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$set(this, "formParams", {});
      this.$nextTick(() => {
        this.$refs["form"].clearValidate();
      });
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
