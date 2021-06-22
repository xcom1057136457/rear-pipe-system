<template>
  <el-dialog
    :title="operatorType ? '修改设备' : '新增设备'"
    :visible.sync="dialogVisible"
    width="30%"
  >
    <div class="form-wrapper">
      <el-form
        label-position="left"
        label-width="90px"
        size="small"
        ref="ruleForm"
        :model="params"
        :rules="rules"
        status-icon
      >
        <el-form-item label="归属部门" prop="deptId">
          <treeselect
            v-model="params.deptId"
            :options="deptOptions"
            :show-count="true"
            placeholder="请选择归属部门"
          />
        </el-form-item>
        <el-form-item label="设备编码" prop="deviceCode">
          <el-input
            v-model="params.deviceCode"
            placeholder="请输入设备编码..."
          ></el-input>
        </el-form-item>

        <el-form-item label="设备名称" prop="deviceName">
          <el-input
            v-model="params.deviceName"
            placeholder="请输入设备名称..."
          ></el-input>
        </el-form-item>

        <el-form-item label="设备SN码" prop="sn">
          <el-select
            v-model="params.sn"
            filterable
            remote
            reserve-keyword
            placeholder="请输入设备SN码"
            :remote-method="remoteMethod"
            :loading="selectLoading"
            @change="productSearch"
            clearable
          >
            <el-option
              v-for="item in snList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属产品" prop="deviceType">
          <!-- <el-input
            v-model="params.deviceType"
            placeholder="请输入所属产品..."
            disabled
          ></el-input> -->
          <el-select
            v-model="params.deviceType"
            :disabled="!productList.length"
          >
            <el-option
              v-for="(item, index) in productList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备专责" prop="equipSpecialist">
          <el-input
            v-model="params.equipSpecialist"
            placeholder="请输入设备专责..."
          ></el-input>
        </el-form-item>

        <el-form-item label="IEME卡号" prop="ieme">
          <el-input
            v-model="params.ieme"
            placeholder="请输入IEME卡号..."
          ></el-input>
        </el-form-item>

        <el-form-item label="安装位置" prop="installPosition">
          <el-input
            v-model="params.installPosition"
            placeholder="请输入安装位置..."
          ></el-input>
        </el-form-item>

        <el-form-item label="联系厂家" prop="manufactor">
          <el-input
            v-model="params.manufactor"
            placeholder="请输入联系厂家..."
          ></el-input>
        </el-form-item>

        <el-form-item label="电网专责" prop="powergridSpecialist">
          <el-input
            v-model="params.powergridSpecialist"
            placeholder="请输入电网专责..."
          ></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="params.remark"
            placeholder="请输入备注..."
            type="textarea"
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
import { addDevice, getSN, updateDevice } from "@/api/monitor/device";
import { getProductList } from "@/api/monitor/product";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { treeselect } from "@/api/system/dept";
export default {
  data() {
    return {
      dialogVisible: false,
      params: {
        deviceCode: "",
        deviceName: "",
        sn: "",
        deviceType: "",
        equipSpecialist: "",
        ieme: "",
        installPosition: "",
        manufactor: "",
        powergridSpecialist: "",
        remark: ""
      },
      buttonLoading: false,
      pageParams: {
        pageNum: 1,
        pageSize: 20
      },
      rules: {
        deptId: [
          { required: true, message: "请选择归属部门", trigger: "change" }
        ],
        ieme: [{ required: true, message: "请输入IEME卡号", trigger: "blur" }],
        deviceCode: [
          { required: true, message: "请输入设备编码", trigger: "blur" }
        ],
        sn: [{ required: true, message: "请输入设备SN码", trigger: "change" }],
        deviceName: [
          { required: true, message: "请输入设备名称", trigger: "blur" }
        ],
        deviceType: [
          { required: true, message: "请输入所属产品", trigger: "change" }
        ]
      },
      selectLoading: false,
      snList: [],
      productList: [],
      // 部门树选项
      deptOptions: undefined
    };
  },
  components: {
    Treeselect
  },
  props: {
    visible: {
      default: () => {
        return false;
      }
    },
    deptId: {
      default: () => {
        return "";
      }
    },
    updateInfo: {
      default: () => {
        return {};
      }
    },
    operatorType: {
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
    "params.sn": {
      handler(val) {
        if (!val) {
          this.$set(this.params, "deviceType", "");
          this.productList = [];
          this.snList = [];
        }
      },
      deep: true
    },
    updateInfo(val) {
      if (val.deviceId) {
        let update = JSON.parse(JSON.stringify(val));
        this.$set(this, "params", update);
      } else {
        this.resetForm();
      }
    }
  },
  methods: {
    async submitHandler() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          let params = JSON.parse(JSON.stringify(this.params));
          if (this.operatorType == 0) {
            addDevice(params)
              .then(res => {
                if (res.code == 200) {
                  this.$message.success("新增设备成功!");
                  this.dialogVisible = false;
                  this.$emit("closeDialog");
                }
                this.buttonLoading = false;
              })
              .catch(() => {
                this.buttonLoading = false;
              });
          } else {
            updateDevice(params)
              .then(res => {
                if (res.code == 200) {
                  this.$message.success("修改设备成功!");
                  this.dialogVisible = false;
                  this.$emit("closeDialog");
                }
                this.buttonLoading = false;
              })
              .catch(() => {
                this.buttonLoading = false;
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.productList = [];
      this.snList = [];
      this.$set(this, "params", {});
      this.$nextTick(() => {
        this.$refs["ruleForm"].clearValidate();
      });
    },
    openHandler() {
      this.$refs["ruleForm"].clearValidate();
    },
    // 模糊搜索SN
    remoteMethod(query) {
      if (query.split("").length >= 4) {
        this.selectLoading = true;
        let params = Object.assign({}, this.pageParams, { sn: query });
        getSN(params)
          .then(res => {
            if (res.code == 200) {
              this.snList = res.rows.map(item => {
                return {
                  label: item.deviceName + " (" + item.isEnabled + ")",
                  value: item.deviceName,
                  productKey: item.productKey,
                  disabled: item.isEnabled == "已使用" ? true : false
                };
              });
            }
            this.selectLoading = false;
          })
          .catch(() => {
            this.selectLoading = false;
          });
      } else {
        this.snList = [];
      }
    },
    // 搜索产品
    productSearch(val) {
      if (val) {
        this.$set(this.params, "deviceType", "");
        this.productList = [];
        let productKey = this.snList.filter(item => item.value == val)[0]
          .productKey;
        getProductList({
          productKey: productKey
        }).then(res => {
          if (res.code == 200) {
            this.productList = res.rows.map(item => {
              return {
                value: item.productId,
                label: item.productName
              };
            });
          }
        });
      }
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.deptOptions = response.data;
      });
    }
  },
  created() {
    this.getTreeselect();
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
