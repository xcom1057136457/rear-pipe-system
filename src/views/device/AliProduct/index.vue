<template>
  <div class="aliProduct-box">
    <div class="form-wrapper">
      <el-row :gutter="20">
        <el-form label-position="left" label-width="90px" size="small">
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input
                v-model="searchParams.productName"
                placeholder="请输入产品名称查询"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="searchHandler"
              >搜索</el-button
            >
            <el-button
              size="small"
              type="default"
              icon="el-icon-refresh"
              @click="refreshHandler"
              >重置</el-button
            >
          </el-col>
        </el-form>
      </el-row>
    </div>

    <div class="table-wrapper">
      <el-table :data="tableData" v-loading="loading">
        <el-table-column
          show-overflow-tooltip
          prop="productName"
          label="产品名称"
          align="center"
        ></el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="productKey"
          label="ProductKey"
          align="center"
        ></el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="nodeType"
          label="节点类型"
          align="center"
        >
          <template #default="record">
            {{ nodeTypeFormatter(record.row.nodeType) }}
          </template>
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="gmtCreate"
          label="创建时间"
          align="center"
          :formatter="timeFormatter"
        ></el-table-column>

        <el-table-column label="操作" show-overflow-tooltip align="center">
          <template #default="record">
            <el-button type="text" @click="doView(record.row.productKey)"
              >查看</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" @click="deviceManager(record.row.productKey)"
              >管理设备</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <detail-dialog :visible.sync="detailShow" :productKey="productKey" />
  </div>
</template>

<script>
import detailDialog from "./components/detailDialog.vue";
import * as Api from "@/api/monitor/aliProduct";
import { parseTime } from "@/utils/ruoyi";
export default {
  data() {
    return {
      loading: false,
      searchParams: {},
      tableData: [],
      detailShow: false,
      productKey: null,
      nodeTypeList: []
    };
  },
  components: {
    detailDialog
  },
  methods: {
    // 节点类型转换
    typeFormate() {},
    // 重置
    refreshHandler() {
      this.searchParams = {};
      this.getList();
    },
    // 搜索
    searchHandler() {
      this.getList();
    },
    // 获取数据
    async getList() {
      this.loading = true;
      let { code, rows } = await Api.getAliProduct();
      if (code == 200) {
        this.tableData = rows;
      }
      this.loading = false;
    },
    // 管理设备
    deviceManager(key) {
      this.$router.push({
        name: "AliDevice",
        params: {
          productKey: key
        }
      });
    },
    // 查看详情
    doView(productKey) {
      this.productKey = productKey;
      this.detailShow = true;
    },
    // 格式化时间
    timeFormatter(row, col, cellValue) {
      return parseTime(cellValue);
    },
    // 获取节点类型
    async getNodeType() {
      let { code, data } = await this.getDicts("aliyun_node_type");
      if (code == 200) {
        this.nodeTypeList = data;
      }
    },
    nodeTypeFormatter(val) {
      return this.nodeTypeList.filter(item => item.dictValue == val)[0]
        .dictLabel;
    }
  },
  created() {
    this.getNodeType();
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.aliProduct-box {
  padding: 20px;
}

.table-wrapper {
  margin-top: 10px;
}

.pagination-wrapper {
  text-align: right;
  margin-top: 15px;
}
</style>
