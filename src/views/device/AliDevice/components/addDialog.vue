<template>
  <el-dialog title="添加设备" :visible.sync="dialogShow" width="30%">
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
        <el-form size="small">
          <el-form-item label="产品">
            <el-select v-model="formParams.productName" placeholder="请选择产品">
              <el-option
                v-for="(item, index) in productList"
                :key="index"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="DeviceName">
            <el-input v-model="formParams.deviceName" placeholder="请输入DeviceName"></el-input>
          </el-form-item>

          <el-form-item label="备注名称">
            <el-input v-model="formParams.mark" placeholder="请输入备注名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addDevicehandler" size="small"
        >确 定</el-button
      >
      <el-button @click="dialogShow = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogShow: false,
      formParams: {},
      productList: []
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
    addDevicehandler() {}
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
</style>
