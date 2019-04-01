<template>
  <div class="batch">
    <el-row style="margin-bottom:20px;">
      <el-col :span="18">
        <el-button type="success" @click="paramsFlag = true">参数配置</el-button>
      </el-col>
      <el-col :span="6">
        <el-input clearable placeholder="输入订单号、交易人账号" v-model="searchText">
          <el-button @click="textSearch" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="batchData.list"
      border
      style="width: 100%">

      <el-table-column
        label="下单时间">
        <template slot-scope="scope">
          {{new Date(scope.row.create).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column
        label="完成时间">
        <template slot-scope="scope">
          {{new Date(scope.row.payAt).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column
        prop="balance"
        label="orderNumber">
      </el-table-column>
      <el-table-column
        prop="orderType"
        label="交易类型">
      </el-table-column>
      <el-table-column
        label="法币金额">
        <template sloat-scope="scope">
          {{scope.row.amount}} CNY
        </template>
      </el-table-column>
      <el-table-column
        label="数字货币金额">
        <template sloat-scope="scope">
          {{scope.row.tokenValue}} {{scope.row.tokenName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="tokenValue"
        label="交易人账号">
      </el-table-column>
      <el-table-column
        prop="payType"
        label="付款方式">
        <template sloat-scope="scope">
          {{scope.row.payType === 1 ? '银行卡' : scope.row.payType === 2 ? '支付宝' : '微信'}}
        </template>
      </el-table-column>

      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{scope.row.status | orderStatusFliter}}
        </template>
      </el-table-column>
      <el-table-column
        width="350"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="cancelHandler(scope.row.id)" size="small">取消</el-button>

        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:30px; text-align:center;">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="20"
        layout="prev, pager, next"
        :total="batchData.total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="paramsFlag" width="30%">
      <el-form :model="paramsFrom">
        <el-form-item label="差价百分比"  label-width="100px">
          <el-input v-model="paramsFrom.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行卡"  label-width="100px">
          <el-button size="small">编辑</el-button>
          <el-switch :active-value="1" :inactive-value="0" v-model="paramsFrom.visible"></el-switch>
        </el-form-item>
        <el-form-item label="支付宝"  label-width="100px">
          <el-button size="small">编辑</el-button>
          <el-switch :active-value="1" :inactive-value="0" v-model="paramsFrom.visible"></el-switch>
        </el-form-item>
        <el-form-item label="微信"  label-width="100px">
          <el-button size="small">编辑</el-button>
          <el-switch :active-value="1" :inactive-value="0" v-model="paramsFrom.visible"></el-switch>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="paramsFlag = false">取 消</el-button>
        <el-button type="primary" @click="subTypeHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'batch',
    data() {
      return {
        searchText: '',
        paramsFlag: false,
        pageNum: 1,
        paramsFrom: {
          name: ''
        }
      }
    },
    computed: {
      ...mapGetters({
        batchData: 'batchData'
      })
    },
    methods: {
      textSearch() {
      },
      batchData() {
        this.$store.dispatch('getBatchData', {id: 0, condition: `?orderBy=created_at desc&pageNum=1&pageSize=20`})
      },
      subTypeHandler() {},
      handleCurrentChange() {},
      cancelHandler(v) {
        console.log(v)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .batch{
    padding:20px;
  }
</style>
