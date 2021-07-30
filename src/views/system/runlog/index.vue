<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      label-width="80px"
      label-position="left"
    >
      <el-row :gutter="20">
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
          <el-form-item label="产品key" prop="productKey">
            <el-input
              v-model="queryParams.productKey"
              placeholder="请输入产品key"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="topic名称" prop="topicName">
            <el-input
              v-model="queryParams.topicName"
              placeholder="请输入topic名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="消费状态" prop="consumptionStatus">
            <el-select
              v-model="queryParams.consumptionStatus"
              placeholder="请选择消费状态"
              clearable
              size="small"
              style="width: 100%"
            >
              <el-option
                v-for="(item, index) in consumptionStatusList"
                :key="index"
                :value="item.dictValue"
                :label="item.dictLabel"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="消息id" prop="messageId">
            <el-input
              v-model="queryParams.messageId"
              placeholder="请输入消息id"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="消费时间" prop="consumptionTime">
            <el-date-picker
              clearable
              size="small"
              v-model="queryParams.consumptionTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择消费时间"
              style="width: 100%"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="topic主题" prop="topicType">
            <el-input
              v-model="queryParams.topicType"
              placeholder="请输入topic主题"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            ></el-input>
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
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:log:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['system:log:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        :columns="columns"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="logList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        label="日志主键"
        align="center"
        prop="logId"
        show-overflow-tooltip
        v-if="columns[0].visible"
      />
      <el-table-column
        label="设备名称"
        align="center"
        prop="deviceName"
        show-overflow-tooltip
        v-if="columns[1].visible"
      />
      <el-table-column
        label="产品key"
        align="center"
        prop="productKey"
        show-overflow-tooltip
        v-if="columns[2].visible"
      />
      <el-table-column
        label="topic名称"
        align="center"
        prop="topicName"
        show-overflow-tooltip
        v-if="columns[3].visible"
      />
      <el-table-column
        label="topic主题"
        align="center"
        prop="topicType"
        show-overflow-tooltip
        v-if="columns[8].visible"
      />
      <el-table-column
        label="消费状态"
        align="center"
        prop="consumptionStatus"
        show-overflow-tooltip
        v-if="columns[4].visible"
      >
        <template #default="record">
          {{ consumptionStatusFormate(record.row.consumptionStatus) }}
        </template>
      </el-table-column>
      <el-table-column
        label="消息id"
        align="center"
        prop="messageId"
        show-overflow-tooltip
        v-if="columns[5].visible"
      />
      <el-table-column
        label="消息内容"
        align="center"
        prop="message"
        show-overflow-tooltip
        v-if="columns[6].visible"
      />
      <el-table-column
        label="消费时间"
        align="center"
        prop="consumptionTime"
        width="180"
        show-overflow-tooltip
        v-if="columns[7].visible"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        show-overflow-tooltip
        width="180px"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:log:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备运行日志对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="form.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="产品key" prop="productKey">
          <el-input v-model="form.productKey" placeholder="请输入产品key" />
        </el-form-item>
        <el-form-item label="topic名称" prop="topicName">
          <el-input v-model="form.topicName" placeholder="请输入topic名称" />
        </el-form-item>
        <el-form-item label="消费状态">
          <el-select v-model="form.consumptionStatus" style="width: 100%">
            <el-option
              v-for="(item, index) in consumptionStatusList"
              :key="index"
              :value="item.dictValue"
              :label="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="消息id" prop="messageId">
          <el-input v-model="form.messageId" placeholder="请输入消息id" />
        </el-form-item>
        <el-form-item label="消息内容" prop="message">
          <el-input
            v-model="form.message"
            type="textarea"
            placeholder="请输入内容"
            rows="5"
          />
        </el-form-item>
        <el-form-item label="消费时间" prop="consumptionTime">
          <el-date-picker
            clearable
            size="small"
            v-model="form.consumptionTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择消费时间"
            style="width: 100%"
          >
          </el-date-picker>
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
  listLog,
  getLog,
  delLog,
  addLog,
  updateLog,
  exportLog
} from "@/api/system/log";

export default {
  name: "Log",
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
      // 设备运行日志表格数据
      logList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deviceName: null,
        productKey: null,
        topicName: null,
        consumptionStatus: null,
        messageId: null,
        message: null,
        consumptionTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      consumptionStatusList: [],
      columns: [
        { key: 0, label: `日志主键`, visible: true },
        { key: 1, label: `设备名称`, visible: true },
        { key: 2, label: `产品key`, visible: true },
        { key: 3, label: `topic名称`, visible: true },
        { key: 8, label: `topic主题`, visible: true },
        { key: 4, label: `消费状态`, visible: true },
        { key: 5, label: `消息id`, visible: true },
        { key: 6, label: `消息内容`, visible: true },
        { key: 7, label: `消费时间`, visible: true }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取消费状态字典
    getConsumptionStatus() {
      return new Promise(async (resolve, reject) => {
        try {
          let { code, data } = await this.getDicts("consumption_status");
          if (code == 200) {
            this.consumptionStatusList = data;
            resolve();
          }
        } catch (err) {
          reject();
        }
      });
    },
    consumptionStatusFormate(val) {
      let temp = this.consumptionStatusList.filter(
        item => item.dictValue == val
      );
      return temp && temp.length ? temp[0].dictLabel : "暂无数据";
    },
    /** 查询设备运行日志列表 */
    async getList() {
      this.loading = true;
      await this.getConsumptionStatus();
      listLog(this.queryParams).then(response => {
        this.logList = response.rows;
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
        logId: null,
        deviceName: null,
        productKey: null,
        topicName: null,
        consumptionStatus: "0",
        messageId: null,
        message: null,
        consumptionTime: null
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
      this.ids = selection.map(item => item.logId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备运行日志";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const logId = row.logId || this.ids;
      getLog(logId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备运行日志";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.logId != null) {
            updateLog(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLog(this.form).then(response => {
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
      const logIds = row.logId || this.ids;
      this.$confirm(
        '是否确认删除设备运行日志编号为"' + logIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delLog(logIds);
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
      this.$confirm("是否确认导出所有设备运行日志数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.exportLoading = true;
          return exportLog(queryParams);
        })
        .then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        })
        .catch(() => {});
    }
  }
};
</script>
