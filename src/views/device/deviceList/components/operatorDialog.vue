<template>
  <el-dialog
    title="新增设备"
    :visible.sync="dialogVisible"
    width="30%"
    @closed="resetForm"
  >
    <div class="form-wrapper">
      <el-form
        label-position="left"
        label-width="90px"
        size="small"
        ref="ruleForm"
        :model="params"
      >
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

        <el-form-item label="设备类型" prop="deviceType">
          <el-input
            v-model="params.deviceType"
            placeholder="请输入设备类型..."
          ></el-input>
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

        <el-form-item label="设备SN码" prop="sn">
          <el-input
            v-model="params.sn"
            placeholder="请输入设备SN码..."
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
      <el-button type="primary" @click="submitHandler" size="small"
        >确 定</el-button
      >
      <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addDevice } from "@/api/monitor/device";
export default {
  data() {
    return {
      dialogVisible: false,
      params: {}
    };
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
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    },
    dialogVisible(val) {
      this.$emit("update:visible", val);
    }
  },
  methods: {
    async submitHandler() {
      let params = JSON.parse(JSON.stringify(this.params));
      params.deptId = this.deptId;
      let { code } = await addDevice(params);
      if (code == 200) {
        this.$message.success("新增设备成功!");
        this.dialogVisible = false;
        this.$emit("closeDialog");
      }
    },
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    }
  }
};
</script>

<style></style>
