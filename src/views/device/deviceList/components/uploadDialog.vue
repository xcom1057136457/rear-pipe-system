<template>
  <el-dialog
    :title="upload.title"
    :visible="upload.open"
    width="400px"
    append-to-body
  >
    <el-upload
      ref="upload"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.url + '?updateSupport=' + upload.updateSupport"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">
        <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的设备数据
        <el-link type="info" style="font-size:12px" @click="importTemplate"
          >下载模板</el-link
        >
      </div>
      <div class="el-upload__tip" style="color:red" slot="tip">
        提示：仅允许导入“xls”或“xlsx”格式文件！
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitFileForm" size="small"
        >确 定</el-button
      >
      <el-button @click="upload.open = false" size="small">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getToken } from "@/utils/auth";
import { importTemplate } from "@/api/monitor/device";
export default {
  data() {
    return {
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/manager/device/importData"
      }
    };
  },
  props: {
    visible: {
      required: true,
      default: () => {
        return false;
      }
    }
  },
  watch: {
    visible(val, oldVal) {
      if (val == oldVal) return;
      this.$set(this.upload, "open", val);
    },
    "upload.open": {
      handler(val, oldVal) {
        if (val == oldVal) return;
        this.$emit("update:visible", val);
      },
      deep: true
    }
  },
  methods: {
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.$emit("getAllList");
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg);
      });
    }
  }
};
</script>

<style></style>
