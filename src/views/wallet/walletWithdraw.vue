<template>
  <div class="wallet-withdraw">
    <el-button  style="margin-right:20px;" @click="withdrawFlag = true">提币</el-button>
    <el-button  :loading="exportFlag" @click="exportsSign" style="margin-right:20px;">待签名文件导出</el-button>
    <import-component  :action="action" :labelTxt="'签名文件导入'"></import-component>
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
          prop="tokenName"
          label="币种">
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
            <span>{{scope.row.transactionStatus | statusFliter}}</span>
            <span :title="scope.row.errorData" v-if="scope.row.errorData">{{'-' + scope.row.errorMsg}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope" >
            <el-button @click="cancelHandler(scope.row.id)" size="small" v-if="scope.row.transactionStatus === 2">取消</el-button>
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
      <el-dialog  @closed="dialogClose" width="500px" :title="'提币'" :visible.sync="withdrawFlag" center>
        <el-form :rules="withdrawRules" :model="withdrawForm" ref="withdrawForm">
          <el-form-item label="选择币种" :label-width="formLabelWidth" >
            <el-select v-model="withdrawForm.tokenId" placeholder="请选择">
              <el-option
                v-for="item in tokenList"
                v-if="item.contractAddress || item.tokenId === 3 || item.tokenId === 4"
                :key="item.tokenId"
                :label="item.tokenName"
                :value="item.tokenId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="value" label="输入提币数量" :label-width="formLabelWidth" >
            <el-input type="value" v-model="withdrawForm.value"></el-input>
          </el-form-item>
          <el-form-item prop="toAddress" label="输入提币地址" :label-width="formLabelWidth" >
            <el-input type="toAddress" v-model="withdrawForm.toAddress"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="主管理员密码" :label-width="formLabelWidth" >
            <el-input type="password" v-model="withdrawForm.password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="withdrawFlag = false">取 消</el-button>
          <el-button :loading="subFlag" type="primary" @click="withdrawHandler('withdrawForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import importComponents from '../../components/import-component';
  import {mapGetters} from 'vuex';
  import md5 from 'blueimp-md5'
  export default {
    name: "wallet-withdraw",
    computed: {
      ...mapGetters({
        blockTxList: 'blockTxList',
        permission: 'permission',
        adminType: 'adminType',
        tokenList: 'tokenList'
      }),
    },
    props: {
      manage: Object
    },
    components: {
      'import-component': importComponents
    },
    data() {
      return {
        exportFlag: false,
        withdrawFlag: false,
        subFlag: false,
        action: window.urlData.url + '/block/sign/import',
        pageNum: 1,
        formLabelWidth: '120px',
        withdrawForm: {
          tokenId: 4,
          value: '',
          toAddress: '',
          password: ''
        },
        copyForm: {
          tokenId: 4,
          value: '',
          toAddress: '',
          password: ''
        },
        withdrawRules: {
          value: [
            { required: true, message: '请输入提币数量', trigger: 'blur' }
          ],
          toAddress: [
            { required: true, message: '请输入提币地址', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入主管理员密码', trigger: 'blur' }
          ]
        },
      }
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
      handleCurrentChange(v) {
        this.pageNum = v;
        this.withdrawData()
      },
      withdrawData() {
        this.$store.dispatch('getBlockTxList', `?orderBy=created_at desc&pageNum=${this.pageNum}&pageSize=20&oprType=2&isAdmin=1`).then().catch()
      },
      withdrawHandler(form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.subFlag = true;
            let cy = Object.assign({}, this.withdrawForm);
            cy.password = md5(md5(cy.password) + this.manage.username);
            this.$store.dispatch('postTx', cy).then(() => {
              this.subFlag = false;
              this.withdrawFlag = false;
              this.$refs[form].resetFields();
              this.$message.success('提交成功');
              this.withdrawData();
            }).catch(() => {
              this.subFlag = false
            })
          } else {
            this.subFlag = false;
            this.$message({
              type: 'error',
              message: '请输入正确信息'
            });
          }
        })
      },
      cancelHandler(id) {
        this.$store.dispatch('putBlockStatus', `?ids=${id}&status=2`).then(() => {
          this.withdrawData();
          this.$message.success('修改成功')
        }).catch()
      },
      dialogClose() {
        this.withdrawForm = Object.assign({}, this.copyForm);
        this.dialogTitle = true;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .wallet-withdraw {
    padding: 20px;
  }
</style>
