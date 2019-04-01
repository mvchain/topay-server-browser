<template>
  <div class="wallet-summary">
    <el-row>
      <el-col :span="18">
        <el-button  :loading="exportFlag" @click="summaryExports" style="margin-right:20px;">汇总导出</el-button>
        <import-component :action="action" :labelTxt="'汇总导入'"></import-component>
        <el-select @change="summaryData" v-model="tokenId" placeholder="请选择">
          <el-option
            v-for="item in tokenList"
            v-if="item.contractAddress || item.tokenId === 3 || item.tokenId === 4"
            :key="item.tokenId"
            :label="item.tokenName"
            :value="item.tokenId">
          </el-option>
        </el-select>
        <el-date-picker
          v-model="rechargeTime"
          type="daterange"
          align="right"
          @change="summaryData"
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
        <el-input clearable placeholder="输入单号、目标地址" v-model="searchText" class="input-with-select">
          <el-button @click="summaryData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <div>
      <span>待汇总:</span><span>历史汇总:</span><span>累计使用手续费:</span><span>汇总中:</span>
    </div>
    <div style="margin-top:20px;">
      <el-table
        :data="blockTxList.list"
        @selection-change="handleSelectionChange"
        border
        style="width: 100%">
        <el-table-column
          type="selection"
          :selectable="isSelectHandler"
          width="55">
        </el-table-column>
        <el-table-column
          label="时间">
          <template slot-scope="scope" >
            <span>{{new Date(scope.row.createdAt).toLocaleString()}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNumber"
          label="单号">
        </el-table-column>
        <el-table-column
          prop="cellphone"
          label="用户手机号">
        </el-table-column>
        <el-table-column
          label="提币金额">
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
        <el-table-column
          label="状态">
          <template slot-scope="scope" >
            <el-dropdown v-if="scope.row.transactionStatus === 1 && (permission.includes('1'))" @command="handleCommand" :disabled="true">
              <span class="el-dropdown-link">
                待审核<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{id: scope.row.id, status: 1}">同意</el-dropdown-item>
                <el-dropdown-item :command="{id: scope.row.id, status: 2}">拒绝</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown v-else-if="(scope.row.transactionStatus === 2 || scope.row.transactionStatus === 6) && (permission.includes('1')) " @command="handleCommand" :disabled="true">
             <span class="el-dropdown-link" :title="scope.row.errorData">
                {{scope.row.transactionStatus === 2 ? '待签名' : '失败'}}{{scope.row.errorMsg}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item  :command="{id: scope.row.id, status: 2}">拒绝</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span  v-else>{{scope.row.transactionStatus | statusFliter}}</span>
            <span :title="scope.row.errorData" v-if="scope.row.errorData">{{'-' + scope.row.errorMsg}}</span>
          </template>
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
  import {mapGetters} from 'vuex';
  export default {
    name: 'wallet-summary',
    data() {
      return {
        onlyBlockToken: {},
        exportFlag: false,
        tokenId: 4,
        action: window.urlData.url + '/block/sign/import',
        rechargeTime: '',
        searchText: ''
      }
    },
    mounted() {

    },
    computed: {
      ...mapGetters({
        adminType: 'adminType',
        tokenList: 'tokenList'
      })
    },
    method: {
      summaryExports() {},
      summaryData() {},
      exportTable() {}
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .wallet-summary{
    padding:20px;
  }
</style>
