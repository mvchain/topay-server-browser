<template>
  <div class="financial-order">
    <el-row>
      <el-col :span="18">
        <el-select @change="orderData" v-model="orderStatus" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>

        <el-date-picker
          v-model="rechargeTime"
          type="daterange"
          align="right"
          @change="orderData"
          :clearable="true"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button :loading="exportFlag" @click="exportTable">导出表格</el-button>
      </el-col>
      <el-col :span="6">
        <el-input clearable placeholder="输入单号、用户名、邮箱" v-model="searchText" class="input-with-select">
          <el-button @click="searchHandler" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <div style="margin-top:20px;">
      <el-table
        border
        :data="financialOrder.list"
        style="width: 100%">
        <el-table-column
          prop="orderNumber"
          label="订单号">
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="statusStr"
          label="状态">
        </el-table-column>
        <el-table-column
          prop="financialName"
          label="理财项目">
        </el-table-column>
        <el-table-column
          label="购买时间">
          <template  slot-scope="scope">
            {{new Date(scope.row.createdAt).toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column
          prop="valueStr"
          label="持仓本金">
        </el-table-column>
        <el-table-column
          prop="incomeStr"
          label="累计收益">
        </el-table-column>
        <el-table-column
          prop="priceStr"
          label="价值">
        </el-table-column>
      </el-table>
      <div style="margin-top:30px; text-align:center;">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="financialOrder.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'financial-order',
    data() {
      return {
        statusList: [
          {
            id: '',
            label: '全部'
          },
          {
            id: 1,
            label: '计息中'
          },
          {
            id: 2,
            label: '待提取'
          },
          {
            id: 3,
            label: '已提取'
          }
        ],
        orderStatus: '',
        searchText: '',
        rechargeTime: '',
        pageNum: 1,
        exportFlag: false,
      }
    },
    computed: {
      ...mapGetters({
        financialOrder: 'financialOrder',
      })
    },
    beforeMount() {
      this.orderData();
    },
    methods: {
      searchHandler() {
        this.orderData();
      },
      exportTable() {
        this.exportFlag = true;
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/financial/${this.$route.query.id}/order/excel?createdStartAt=${this.rechargeTime ? this.rechargeTime[0] : 1}&createdStopAt=${this.rechargeTime ? this.rechargeTime[1] : new Date().getTime()}&searchKey=${this.searchText}&pageNum=1&pageSize=${this.financialOrder.total}&sign=${s}&status=${this.orderStatus}`);
          this.exportFlag = false
        }).catch(() => {
          this.exportFlag = false
        })
      },
      handleCurrentChange(v) {
        this.pageNum = v;
        this.orderData();
      },
      orderData() {
        this.$store.dispatch('getFinancalOrder', {
          id: this.$route.query.id,
          data: `?orderBy=created_at desc&createdStartAt=${this.rechargeTime ? this.rechargeTime[0] : 1}&createdStopAt=${this.rechargeTime ? this.rechargeTime[1] : new Date().getTime()}&pageNum=${this.pageNum}&pageSize=20&searchKey=${this.searchText}&status=${this.orderStatus}`
        });
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .financial-order{
    padding:20px;
  }
</style>
