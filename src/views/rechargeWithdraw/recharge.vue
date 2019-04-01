<template>
  <div class="recharge">
    <el-row>
      <el-col :span="18">
        <el-date-picker
          v-model="rechargeTime"
          type="daterange"
          align="right"
          @change="withdrawData"
          :clearable="true"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button @click="exportTable">导出表格</el-button>
      </el-col>
      <el-col :span="6">
        <el-input clearable placeholder="输入hash、来源地址" v-model="searchText" class="input-with-select">
          <el-button @click="searchHandler" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <div style="margin-top:20px;">
      <el-table
        :data="blockTxList.list"
        border
        style="width: 100%">
        <el-table-column
          label="时间">
          <template slot-scope="scope" >
            <span>{{new Date(scope.row.createdAt).toLocaleString()}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="email"
          label="用户邮箱">
        </el-table-column>
        <el-table-column
          label="充值金额">
          <template slot-scope="scope" >
            <span>{{scope.row.value}}{{scope.row.tokenName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="toAddress"
          label="目标地址">
        </el-table-column>
        <el-table-column
          prop="hash"
          label="交易哈希">
        </el-table-column>
      </el-table>
      <div style="margin-top:30px; text-align:center;">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="blockTxList.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'recharge',
    data() {
      return {
        rechargeTime: '',
        searchText: '',
        pageNum: 1,
        hash: '',
        fromAddress: '',
        exportFlag: false,
      }
    },
    computed: {
      ...mapGetters({
        blockTxList: 'blockTxList'
      })
    },
    mounted() {
      this.withdrawData();
    },
    methods: {
      exportTable() {
        this.exportFlag = true;
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/block/transactions/excel?createdStartAt=${this.rechargeTime ? this.rechargeTime[0] : 1}&createdStopAt=${this.rechargeTime ? this.rechargeTime[1] : new Date().getTime()}&fromAddress=${this.fromAddress}&oprType=1&pageNum=1&pageSize=${this.blockTxList.total}&sign=${s}`)
          this.exportFlag = false
        }).catch(() => {
          this.exportFlag = false
        })
      },
      searchHandler() {
        this.searchText = this.searchText.replace(/\s/g, '');
        if (this.searchText.length !== 42 && this.searchText.length !== 35) {
          this.hash = this.searchText;
          this.fromAddress = '';
        } else if (this.searchText === '') {
          this.hash = '';
          this.fromAddress = '';
        } else {
          this.fromAddress = this.searchText;
          this.hash = '';
        }
        this.withdrawData()
      },
      handleCurrentChange() {
        this.pageNum = v;
        this.withdrawData()
      },
      withdrawData() {
        this.$store.dispatch('getBlockTxList', `?orderBy=created_at desc&hash=${this.hash}&pageNum=${this.pageNum}&pageSize=20&fromAddress=${this.fromAddress}&createdStartAt=${this.rechargeTime ? this.rechargeTime[0] : 1}&createdStopAt=${this.rechargeTime ? this.rechargeTime[1] : new Date().getTime()}&oprType=1`).then().catch()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .recharge {
    padding: 20px;
  }
</style>
