<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      label-width="98px"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="sn码" prop="sn">
            <el-input
              v-model="queryParams.sn"
              placeholder="请输入sn码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="设备名称" prop="deviceName">
            <el-input
              v-model="queryParams.deviceName"
              placeholder="请输入设备名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="告警时间" prop="warnTv">
            <el-date-picker
              clearable
              size="small"
              v-model="queryParams.warnTv"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择告警时间"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="告警代码" prop="warnCode">
            <el-input
              v-model="queryParams.warnCode"
              placeholder="请输入告警代码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="告警内容" prop="warnInfo">
            <el-input
              v-model="queryParams.warnInfo"
              placeholder="请输入告警内容"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
            >重置</el-button
          >
        </el-col>
      </el-row>
    </el-form>

    <el-row :gutter="10" class="mb8">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['alarm:powerAlarm:export']"
          >导出</el-button
        >
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="alarmList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="告警内容" align="center" prop="warnsId" />
      <el-table-column label="sn码" align="center" prop="sn" />
      <el-table-column label="设备名称" align="center" prop="deviceName" />
      <el-table-column
        label="告警时间"
        align="center"
        prop="warnTv"
        width="180"
      >
      </el-table-column>
      <el-table-column label="告警代码" align="center" prop="warnCode" />
      <el-table-column
        label="告警内容"
        align="center"
        prop="warnInfo"
        show-overflow-tooltip
      />
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备告警信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="sn码" prop="sn">
          <el-input v-model="form.sn" placeholder="请输入sn码" />
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="告警时间" prop="warnTv">
          <el-date-picker
            clearable
            size="small"
            v-model="form.warnTv"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择告警时间"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="告警代码" prop="warnCode">
          <el-input v-model="form.warnCode" placeholder="请输入告警代码" />
        </el-form-item>
        <el-form-item label="告警内容" prop="warnInfo">
          <el-input
            v-model="form.warnInfo"
            type="textarea"
            rows="5"
            placeholder="请输入告警内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" size="small"
          >确 定</el-button
        >
        <el-button @click="cancel" size="small">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAlarm,
  getAlarm,
  delAlarm,
  addAlarm,
  updateAlarm,
  exportAlarm,
} from "@/api/alarm/powerAlarm";

export default {
  name: "Alarm",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备告警信息表格数据
      alarmList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sn: null,
        deviceName: null,
        warnTv: null,
        warnCode: null,
        warnInfo: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询设备告警信息列表 */
    getList() {
      this.loading = true;
      listAlarm(this.queryParams).then((response) => {
        this.alarmList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        warnsId: null,
        sn: null,
        deviceName: null,
        warnTv: null,
        warnCode: null,
        warnInfo: null,
        createTime: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.warnsId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备告警信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const warnsId = row.warnsId || this.ids;
      getAlarm(warnsId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备告警信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.warnsId != null) {
            updateAlarm(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAlarm(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const warnsIds = row.warnsId || this.ids;
      this.$confirm(
        '是否确认删除设备告警信息编号为"' + warnsIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delAlarm(warnsIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有设备告警信息数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.exportLoading = true;
          return exportAlarm(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
