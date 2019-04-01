<template>
  <div class="operating">
    <el-row class="operating-title">
      <el-col :span="12" style="line-height: 40px">
        <span style="padding-right:20px;">手机号：{{$route.query.cellphone}}</span>
        <span>用户昵称：{{$route.query.nickname}}</span>
      </el-col>
      <el-col :span="12" style="text-align: right">
        <template>
          <el-date-picker
            v-model="rechargeTime"
            type="daterange"
            align="right"
            @change="timeChangeFun"
            :clearable="true"
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </template>
        <el-button @click="exportTable">导出表格</el-button>
      </el-col>
    </el-row>
    <div style="margin-top:20px;">
      <el-table
        :data="userLogList.list"
        border
        style="width: 100%">
        <el-table-column
          label="时间">
          <template slot-scope="scope">
            {{new Date(scope.row.createdAt).toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column
          prop="message"
          label="描述">
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top:30px; text-align:center;">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="20"
        layout="prev, pager, next"
        :total="userLogList.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "operating",
    data() {
      return {
        rechargeTime: '',
        pageNum: 1
      }
    },
    computed: {
      ...mapGetters({
        userLogList: 'userLogList'
      })
    },
    mounted() {
      this.userLogData('?orderBy=created_at desc&pageNum=1&pageSize=20')
    },
    methods: {
      exportTable() {
        this.$store.dispatch('getSign').then((s) => {
          window.open(`${window.urlData.url}/user/${this.$route.query.id}/log/excel?createdStartAt=${this.rechargeTime ? this.rechargeTime[0] : 1}&createdStopAt=${this.rechargeTime ? this.rechargeTime[1] : new Date().getTime()}&pageNum=1&pageSize=${this.userLogList.total}&sign=${s}`)
        }).catch()
      },
      timeChangeFun() {
        let str = '';
        if (this.rechargeTime) {
          str = `?orderBy=created_at desc&pageNum=${this.pageNum}&pageSize=20&createdStartAt=${this.rechargeTime ? this.rechargeTime[0] : 1}&createdStopAt=${this.rechargeTime ? this.rechargeTime[1] : new Date().getTime()}`;
        } else {
          str = `?orderBy=created_at desc&pageNum=${this.pageNum}&pageSize=20`;
        }
        this.userLogData(str)
      },
      userLogData(str) {
        this.$store.dispatch('getUserLogList', {id: this.$route.query.id, str})
      },
      handleCurrentChange(v) {
        this.pageNum = v;
        this.timeChangeFun()
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .operating {
    padding: 20px;
  }
</style>
