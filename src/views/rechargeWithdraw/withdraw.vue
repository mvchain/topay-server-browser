<template>
  <div class="company-withdraw">
    <el-row>
      <el-col :span="18">
        <el-button style="margin-right:20px;" @click="multipleFun" v-if="permission.includes('1')">同意已勾选</el-button>
        <!--<el-button v-if="adminType === '0'"  @click="exportsHandler" style="margin-right:20px;">待签名文件导出</el-button>-->
        <el-button v-if="adminType === '0'" :loading="exportFlag" @click="exportsSign" style="margin-right:20px;">待签名文件导出</el-button>
        <import-component v-if="permission.includes('1')" :action="action" :labelTxt="'签名文件导入'"></import-component>
        <el-select @change="withdrawData" v-model="companyStatus" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
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
        <el-button v-if="permission.includes('1')" :loading="exportFlag" @click="exportTable">导出表格</el-button>
      </el-col>
      <el-col :span="6">
        <el-input clearable placeholder="输入单号、目标地址" v-model="searchText" class="input-with-select">
          <el-button @click="searchHandler" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
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
          prop="email"
          label="用户邮箱">
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
  import { mapGetters } from 'vuex'
  import importComponents from '../../components/import-component'
  export default {
    name: 'withdraw',
    props: {
      manage: Object
    },
    data() {
      return {
        statusList: [
          {
            name: '全部状态',
            id: ''
          },
          {
            name: '待审核',
            id: '1'
          },
          {
            name: '待签名',
            id: '2'
          },
          {
            name: '拒绝',
            id: '3'
          },
          {
            name: '正在提币',
            id: '4'
          },
          {
            name: '提币成功',
            id: '5'
          },
          {
            name: '失败',
            id: '6'
          }
        ],
        companyStatus: '',
        rechargeTime: '',
        searchText: '',
        pageNum: 1,
        toAddress: '',
        orderNumber: '',
        multipleTable: [],
        exportFlag: false,
        action: window.urlData.url + '/block/sign/import',
      }
    },
    components: {
      'import-component': importComponents
    },
    computed: {
      ...mapGetters({
        blockTxList: 'blockTxList',
        permission: 'permission',
        adminType: 'adminType'
      }),
    },

    mounted() {
      this.withdrawData()
    },
    methods: {
      exportsSign() {
        this.exportFlag = true;
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/block/transaction/export?sign=${s}`)
          this.exportFlag = false;
        }).catch(() => {
          this.exportFlag = false;
        })
      },
      exportsHandler() {
        this.$store.dispatch('getExportCount').then((res) => {
          const h = this.$createElement;
          let html = [h('div', null, '因手续费浮动，建议中心钱包所有币种保留余额0.1以上')];
          res.forEach((item) => {
            let arr = [];
            arr[2] = h('div', null, [h('span', null , '数量：'), h('span', null, item.num)]);
            arr[1] = h('div', {class: 'export-item'}, [h('span', null , '币种：'), h('span', null, item.tokenName)]);
            arr[3] = h('div', null, [h('span', null , '总计：'), h('span', null, item.total)]);
            html.push(arr)
          });
          this.$msgbox({
            title: '待签名数据统计信息',
            message: h('div', null, html),
            showCancelButton: true,
            confirmButtonText: '下载文件',
            cancelButtonText: '取消',
          }).then(() => {
            this.exportsSign()
          });
        }).catch()

      },
      exportsSign() {
        this.exportFlag = true;
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/block/transaction/export?sign=${s}`)
          this.exportFlag = false;
        }).catch(() => {
          this.exportFlag = false;
        })
      },
      handleSelectionChange(v) {
        this.multipleTable = v;
      },
      multipleFun() {
        if (this.multipleTable.length === 0) return;
        let arr = [];
        for (let i = 0; i < this.multipleTable.length; i++) {
          arr.push(this.multipleTable[i].id)
        }
        this.putStatus({ids: arr.toString(), s: 1})
      },
      putStatus(opt) {
        this.$store.dispatch('putBlockStatus', `?ids=${opt.ids}&status=${opt.s}`).then(() => {
          this.withdrawData();
          this.$message.success('修改成功')
        }).catch()
      },
      handleCommand(v) {
        this.putStatus({ids: v.id, s: v.status})
      },
      isSelectHandler(v) {
        return v.transactionStatus === 1;
      },

      exportTable() {
        this.exportFlag = true;
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/block/transactions/excel?createdStartAt=${this.rechargeTime ? this.rechargeTime[0] : 1}&createdStopAt=${this.rechargeTime ? this.rechargeTime[1] : new Date().getTime()}&toAddress=${this.toAddress}&orderNumber=${this.orderNumber}&oprType=2&pageNum=1&pageSize=${this.blockTxList.total}&transactionStatus=${this.companyStatus}&sign=${s}`)
          this.exportFlag = false;
        }).catch(() => {
          this.exportFlag = false;
        })
      },
      searchHandler() {
        this.searchText = this.searchText.replace(/\s/g, '');
        if (this.searchText.length !== 42 && this.searchText.length !== 35) {
          this.orderNumber = this.searchText;
          this.toAddress = '';
        } else if (this.searchText === '') {
          this.orderNumber = '';
          this.toAddress = '';
        } else {
          this.toAddress = this.searchText;
          this.orderNumber = '';
        }
        this.withdrawData()
      },

      handleCurrentChange(v) {
        this.pageNum = v;
        this.withdrawData()
      },
      withdrawData() {
        this.$store.dispatch('getBlockTxList', `?orderBy=created_at desc&orderNumber=${this.orderNumber}&pageNum=${this.pageNum}&pageSize=20&transactionStatus=${this.companyStatus}&toAddress=${this.toAddress}&createdStartAt=${this.rechargeTime ? this.rechargeTime[0] : 1}&createdStopAt=${this.rechargeTime ? this.rechargeTime[1] : new Date().getTime()}&oprType=2`).then().catch()
      }
    }
  }
</script>

<style  rel="stylesheet/scss" lang="scss" scoped>
  .company-withdraw{
    padding:20px;
  }
  .export-item{
    margin-top:20px;
  }
</style>
