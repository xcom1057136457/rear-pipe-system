<template>
  <el-dialog
    title="添加设备"
    :visible.sync="dialogShow"
    width="30%"
    v-draggable
    @closed="resetForm"
  >
    <div>
      <div class="top-alert">
        <div>
          <span class="el-icon-info"></span>
        </div>
        <div>
          特别说明：DeviceName可以为空，当为空时，阿里云会颁发产品下的唯一标识符作为DeviceName
        </div>
      </div>

      <div class="form-wrapper">
        <el-form
          size="small"
          :rules="rules"
          :model="formParams"
          ref="ruleForm"
          status-icon
        >
          <el-form-item label="产品" prop="productKey">
            <el-select v-model="formParams.productKey" placeholder="请选择产品">
              <el-option
                v-for="(item, index) in productList"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="设备名称" prop="deviceName">
            <el-popover
              placement="top-start"
              width="400"
              trigger="hover"
              content="设备名称长度为4~32个字符，可以包含英文字母、数字和特殊字符：短划线（-）、下划线（_）、at（@）、半角句号（.）、半角冒号（:）"
            >
              <span class="el-icon-warning-outline" slot="reference"></span>
            </el-popover>
            <el-input
              v-model="formParams.deviceName"
              placeholder="请输入设备名称"
            ></el-input>
          </el-form-item>

          <el-form-item label="备注名称" prop="nickName">
            <el-input
              v-model="formParams.nickName"
              placeholder="请输入备注名称"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="addDevicehandler"
        size="small"
        :loading="buttonLoading"
        >确 定</el-button
      >
      <el-button @click="dialogShow = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getAliProduct } from "@/api/monitor/aliProduct";
import { addDevice } from "@/api/monitor/aliDevice";
export default {
  data() {
    return {
      dialogShow: false,
      formParams: {
        productKey: "",
        deviceName: "",
        nickName: ""
      },
      productList: [],
      buttonLoading: false,
      rules: {
        productKey: [
          { required: true, message: "请选择产品", trigger: "change" }
        ],
        deviceName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
          { min: 4, max: 32, message: "长度在 4 到 32 个字符", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "请输入备注名称", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    visible: {
      required: true,
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  watch: {
    visible(val) {
      this.dialogShow = val;
    },
    dialogShow(val) {
      this.$emit("update:visible", val);
    }
  },
  methods: {
    async addDevicehandler() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          addDevice(this.formParams)
            .then(res => {
              if (res.code == 200) {
                this.$message.success("新增成功!");
                this.dialogShow = false;
                this.$emit("closeAdd");
                this.buttonLoading = false;
              }
            })
            .catch(() => {
              this.buttonLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async getAliProductHandler() {
      let { code, rows } = await getAliProduct();
      if (code == 200) {
        this.productList = rows.map(item => {
          return {
            value: item.productKey,
            label: item.productName
          };
        });
      }
    },
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    }
  },
  created() {
    this.getAliProductHandler();
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
.top-alert {
  display: flex;
  background-color: rgba(#1890ff, 0.1);
  padding: 10px;
  margin-bottom: 20px;
  > div {
    &:first-child {
      margin-right: 10px;
      > span {
        color: #1890ff;
        font-size: 18px;
      }
    }
    &:last-child {
      flex: 1;
    }
  }
}
::v-deep .el-dialog__body {
  padding: 10px 20px;
}

.form-item-label {
  display: flex;
  align-items: center;
  .el-icon-warning-outline {
    cursor: pointer;
  }
}
</style>
