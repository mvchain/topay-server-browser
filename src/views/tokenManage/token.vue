<template>
  <div class="token">
    <el-row style="margin-bottom:20px;">
      <el-col :span="18">
        <el-button type="success" @click="dialogFormVisible = true; editFlag = false;" v-if="permission.includes('3')">新建币种</el-button>
      </el-col>
      <el-col :span="6">
        <el-input clearable placeholder="输入币种缩写" v-model="searchText">
          <el-button @click="tokenData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="onlyBlockToken"
      border
      style="width: 100%">
      <el-table-column
        prop="tokenName"
        label="币种缩写">
      </el-table-column>
      <el-table-column
        prop="withdraw"
        width="100"
        label="可否提币">
        <template slot-scope="scope">
          {{scope.row.withdraw ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="recharge"
        width="100"
        label="可否充值">
        <template slot-scope="scope">
          {{scope.row.recharge ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="visible"
        width="100"
        label="是否展示">
        <template slot-scope="scope">
          {{scope.row.visible ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column
        label="单笔提币区间">
        <template slot-scope="scope">
          {{scope.row.withdrawMin}}—{{scope.row.withdrawMax}}
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawDay"
        label="每日提币上限">
      </el-table-column>

      <el-table-column
        prop="fee"
        label="手续费">
      </el-table-column>
      <el-table-column
        width="300"
        v-if="permission.includes('3')"
        label="操作">
        <template slot-scope="scope">
          <el-button  size="small" @click="parameterHandler(scope.row.tokenId)">参数设置</el-button>
          <el-button  size="small" @click="editToken(scope.row.tokenId)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog @closed="dialogClose" width="500px"  :visible.sync="dialogFormVisible" center>
      <el-form :rules="tokenRules" :model="tokenForm" ref="tokenForm">
        <el-form-item prop="tokenImage" label="币种图标" :label-width="formLabelWidth" >
          <pro-oss @set-img-url="getImg" :imgName="imgName" :payload="'image/jpeg/image/png/image/jpg'" :limit="1"></pro-oss>
        </el-form-item>
        <el-form-item prop="tokenEnName" label="币种英文名" :label-width="formLabelWidth" >
          <el-input  v-model="tokenForm.tokenEnName"></el-input>
        </el-form-item>
        <el-form-item prop="tokenCnName" label="币种中文名" :label-width="formLabelWidth" >
          <el-input  v-model="tokenForm.tokenCnName"></el-input>
        </el-form-item>
        <el-form-item prop="tokenName" label="币种缩写" :label-width="formLabelWidth" >
          <el-input  v-model="tokenForm.tokenName"></el-input>
        </el-form-item>
        <el-form-item label="合约地址" :label-width="formLabelWidth" >
          <el-input  v-model="tokenForm.contractAddress"></el-input>
        </el-form-item>
        <el-form-item label="小数点位数" :label-width="formLabelWidth" >
          <el-input  v-model="tokenForm.decimals"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="subFlag" type="primary" @click="subTokenForm('tokenForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="500px" :title="'参数设置'" :visible.sync="parameterDialog" center>
      <el-form :rules="parameterRules" :model="parameterForm" ref="parameterForm">
        <el-form-item  label="单笔提币上下线区间" :label-width="parameterWidth" >
          <el-input  v-model="parameterForm.withdrawMin" class="parameter-input"></el-input>
          ——
          <el-input  v-model="parameterForm.withdrawMax" class="parameter-input"></el-input>
        </el-form-item>
        <el-form-item label="每日提币上限" :label-width="parameterWidth" >
          <el-input  v-model="parameterForm.withdrawDay" ></el-input>
        </el-form-item>
        <el-form-item label="用户提币手续费" :label-width="parameterWidth" >
          <el-input  v-model="parameterForm.fee" ></el-input>
        </el-form-item>


        <el-form-item :label="'区块链手续费'" :label-width="parameterWidth" >
          <el-slider
            v-model="parameterForm.transaferFee"
            :min="parameterForm.id === 4 || parameterForm.id === 2 ? feeObj.usdt.min : feeObj.eth.min"
            :max="parameterForm.id === 4 || parameterForm.id === 2? feeObj.usdt.max : feeObj.eth.max"
            :step="parameterForm.id === 4 || parameterForm.id === 2? feeObj.usdt.step : feeObj.eth.step"
          >
          </el-slider>
        </el-form-item>
        <el-form-item prop="fee" label="汇总保留" :label-width="parameterWidth" >
          <el-slider
            v-model="parameterForm.hold"
            :min="parameterForm.id === 4 || parameterForm.id === 2? holdObj.usdt.min : holdObj.eth.min"
            :max="parameterForm.id === 4 || parameterForm.id === 2? holdObj.usdt.max : holdObj.eth.max"
            :step="parameterForm.id === 4 || parameterForm.id === 2? holdObj.usdt.step : holdObj.eth.step"
          >
          </el-slider>
        </el-form-item>

        <!--<el-form-item  class="parameter-label-item"  label="余额交易区" :label-width="parameterWidth" >
          <el-switch :active-value="1" :inactive-value="0" v-model="parameterForm.balance" ></el-switch>
        </el-form-item>-->
        <el-form-item  class="parameter-label-item" label="提币" :label-width="parameterWidth" >
          <el-switch  :active-value="1" :inactive-value="0" v-model="parameterForm.withdraw" ></el-switch>
        </el-form-item>
        <el-form-item  class="parameter-label-item" label="充币" :label-width="parameterWidth" >
          <el-switch  :active-value="1" :inactive-value="0" v-model="parameterForm.recharge" ></el-switch>
        </el-form-item>
        <el-form-item  class="parameter-label-item"  label="一键买卖" :label-width="parameterWidth" >
          <el-switch :active-value="1" :inactive-value="0" v-model="parameterForm.officialSell" ></el-switch>
        </el-form-item>
        <el-form-item class="parameter-label-item" label="前端展示" :label-width="parameterWidth" >
          <el-switch :active-value="1" :inactive-value="0" v-model="parameterForm.visible"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="parameterDialog = false">取 消</el-button>
        <el-button :loading="subFlag" type="primary" @click="subParameterForm('parameterForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="500px" :title="'交易设置'" :visible.sync="transactionDialog" center>
      <el-form :rules="transactionRules" :model="transactionForm" ref="transactionForm">
        <el-form-item prop="startPrice"  label="开盘价格" :label-width="parameterWidth" >
          <el-input v-model="transactionForm.startPrice" ></el-input>
        </el-form-item>
        <el-form-item prop="increase" label="涨停百分比区间" :label-width="parameterWidth" >
          <el-input v-model="transactionForm.increaseMin" class="parameter-input"></el-input>
          ——
          <el-input v-model="transactionForm.increaseMax" class="parameter-input"></el-input>
        </el-form-item>
        <el-form-item prop="decrease" label="跌停百分比区间" :label-width="parameterWidth" >
          <el-input v-model="transactionForm.decreaseMin" class="parameter-input"></el-input>
          ——
          <el-input v-model="transactionForm.decreaseMax" class="parameter-input"></el-input>
        </el-form-item>
        <el-form-item prop="buy" label="购买定价区间" :label-width="parameterWidth" >
          <el-input v-model="transactionForm.buyMin" class="parameter-input"></el-input>
          ——
          <el-input v-model="transactionForm.buyMax" class="parameter-input"></el-input>
        </el-form-item>
        <el-form-item prop="sell" label="出售定价区间" :label-width="parameterWidth" >
          <el-input v-model="transactionForm.sellMin" class="parameter-input"></el-input>
          ——
          <el-input v-model="transactionForm.sellMax" class="parameter-input"></el-input>
        </el-form-item>
        <el-form-item prop="wave" label="价格波动" :label-width="parameterWidth" >
          <el-input v-model="transactionForm.waveMin" class="parameter-input"></el-input>
          ——
          <el-input v-model="transactionForm.waveMax" class="parameter-input"></el-input>
        </el-form-item>
        <el-form-item prop="minLimit" label="最小挂单数量" :label-width="parameterWidth" >
          <el-input v-model="transactionForm.minLimit" class="parameter-input"></el-input>
        </el-form-item>
        <el-form-item prop="priceBase" label="价格波动交易金额" :label-width="parameterWidth" >
          <el-input v-model="transactionForm.priceBase" class="parameter-input"></el-input>
        </el-form-item>
        <el-form-item label="下个基准价格" :label-width="parameterWidth" >
          <el-input v-model="transactionForm.nextPrice" class="parameter-input"></el-input>
        </el-form-item>
        <el-form-item label="是否交易" :label-width="parameterWidth" >
          <el-switch :active-value="1" :inactive-value="0" v-model="transactionForm.transactionStatus"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="transactionDialog = false">取 消</el-button>
        <el-button :loading="subFlag" type="primary" @click="subTransactionForm('transactionForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import oss from '../../components/ossload'
  export default {
    name: 'token',
    props: {
      manage: Object
    },
    components: {
      'pro-oss': oss
    },
    data() {
      const validatorMinMax = (rule, value, callback) => {
        if (!this.parameterForm.withdrawMax || !this.parameterForm.withdrawMin) {
          callback(new Error('请输入提币下线和提币上限'));
        } else {
          callback();
        }
      };
      const validatorIncrease = (rule, value, callback) => {
        if (!this.transactionForm.increaseMin || !this.transactionForm.increaseMax) {
          callback(new Error('请输入涨停百分比区间'));
        } else {
          callback();
        }
      };
      const validatorDecrease = (rule, value, callback) => {
        if (!this.transactionForm.decreaseMin || !this.transactionForm.decreaseMax) {
          callback(new Error('请输入跌停百分比区间'));
        } else {
          callback();
        }
      };
      const validatorBuy = (rule, value, callback) => {
        if (!this.transactionForm.buyMin || !this.transactionForm.buyMax) {
          callback(new Error('请输入购买定价区间'));
        } else {
          callback();
        }
      };
      const validatorSell = (rule, value, callback) => {
        if (!this.transactionForm.sellMax || !this.transactionForm.sellMin) {
          callback(new Error('请输入出售定价区间'));
        } else {
          callback();
        }
      };
      const validatorWave = (rule, value, callback) => {
        if (!this.transactionForm.waveMax || !this.transactionForm.waveMin) {
          callback(new Error('请输入价格波动区间'));
        } else {
          callback();
        }
      };
      return {
        searchText: '',
        holdObj: {
          usdt: {
            min: 0,
            max: 100,
            step: 0.1
          },
          eth: {
            min: 0,
            max: 10000,
            step:1
          }
        },
        feeObj: {
          usdt: {
            min: 0.00005,
            max: 0.001,
            step: 0.00001
          },
          eth: {
            min: 1,
            max: 500,
            step:1
          }
        },
        editFlag: false,
        dialogFormVisible: false,
        subFlag: false,
        parameterDialog: false,
        transactionDialog: false,
        tokenRules: {
          tokenImage: [
            { required: true, message: '请上传token图标', trigger: 'blur' }
          ],
          tokenEnName: [
            { required: true, message: '请输入token英文名称', trigger: 'blur' }
          ],
          tokenCnName: [
            { required: true, message: '请输入token中文名称', trigger: 'blur' }
          ],
          tokenName: [
            { required: true, message: '请输入token缩写名称', trigger: 'blur' }
          ],
        },
        tokenForm: {
          contractAddress: '',
          tokenImage: '',
          tokenEnName: '',
          tokenCnName: '',
          tokenName: '',
          decimals: '',
          blockType: ''
        },
        formLabelWidth: '120px',
        parameterWidth: '140px',
        intList: [],
        parameterForm: {
          id: '',
          balance: 0,
          fee: 0,
          transaferFee: 0,
          hold: 0,
          recharge: 0,
          officialSell: 0,
          withdraw: 0,
          withdrawDay: '',
          withdrawMax: '',
          withdrawMin: '',
          visible: 0
        },
        parameterRules: {
          withdrawMinMax: [
            { trigger: 'blur', validator: validatorMinMax }
          ],
          fee: [
            { required: true, message: '请输入提币手续费', trigger: 'blur' }
          ],
          withdrawDay: [
            { required: true, message: '请输入每日提币上限', trigger: 'blur' }
          ]
        },
        transactionForm: {
          increaseMax: '',
          increaseMin: '',
          decreaseMax: '',
          tokenId: '',
          minLimit: '',
          decreaseMin: '',
          buyMin: '',
          buyMax: '',
          sellMin: '',
          sellMax: '',
          waveMin: '',
          waveMax: '',
          priceBase: '',
          nextPrice: '',
          startPrice: '',
          transactionStatus: 0
        },
        transactionRules: {
          minLimit: [
            { required: true, message: '请输入最小挂单交易数量', trigger: 'blur' }
          ],
          startPrice: [
            { required: true, message: '请输入开盘价格', trigger: 'blur' }
          ],
          increase: [
            { trigger: 'blur', validator: validatorIncrease }
          ],
          decrease: [
            { trigger: 'blur', validator: validatorDecrease }
          ],
          buy: [
            { trigger: 'blur', validator: validatorBuy }
          ],
          sell: [
            { trigger: 'blur', validator: validatorSell }
          ],
          wave:[
            { trigger: 'blur', validator: validatorWave }
          ],
          priceBase: [
            { required: true, message: '请输入价格波动交易金额量', trigger: 'blur' }
          ],
          nextPrice: [
            { required: true, message: '请输入下个基准价格', trigger: 'blur' }
          ]
        },
        imgName: '',
        dialogCopy: {},
        onlyBlockToken: []
      }
    },
    computed: {
      ...mapGetters({
        permission: 'permission',
        adminType: 'adminType'
      })
    },
    mounted() {
      this.tokenData();
      this.dialogCopy = Object.assign({},this.tokenForm);
    },
    methods: {
      parameterHandler(v) {
        this.parameterDialog = true;
        this.$store.dispatch('getTokenSettingInfo', `/${v}`).then((res) => {
          this.parameterForm = Object.assign({}, res)
        }).catch();
      },
      getImg(v) {
        this.tokenForm.tokenImage = v;
      },
      tokenData() {
        this.$store.dispatch('getOnlyBlockTokenList', `?tokenName=${this.searchText}`).then((res) => {
          this.onlyBlockToken = res
        }).catch()
      },
      subTokenForm(form) {
        this.subFlag = true;
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (this.tokenForm.decimals && this.tokenForm.contractAddress) {
              this.tokenForm.blockType = 'ETH';
            }
            this.$store.dispatch(this.editFlag ? 'putTokenList' : 'postTokenList', this.tokenForm).then(() => {
              this.subFlag = false;
              this.dialogFormVisible = false;
              this.$refs[form].resetFields();
              this.$message.success('提交成功');
              this.tokenData();
            }).catch(() => {
              this.subFlag = false
            })
          } else {
            this.subFlag = false;
            this.$message({
              type: 'error',
              message: '请输入正确信息'
            });
            return false
          }
        })
      },
      subParameterForm(form) {
        this.subFlag = true;
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$store.dispatch('putTokenSetting', this.parameterForm).then(() => {
              this.subFlag = false;
              this.parameterDialog = false;
              this.$refs[form].resetFields();
              this.$message.success('提交成功');
              this.tokenData();
            }).catch(() => {
              this.subFlag = false
            })
          } else {
            this.subFlag = false;
            this.$message({
              type: 'error',
              message: '请输入正确信息'
            });
            return false
          }
        })
      },
      subTransactionForm(form) {
        this.subFlag = true;
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$store.dispatch('putTokenTx', this.transactionForm).then(() => {
              this.subFlag = false;
              this.transactionDialog = false;
              this.$refs[form].resetFields();
              this.$message.success('提交成功');
              this.tokenData();
            }).catch(() => {
              this.subFlag = false
            })
          } else {
            this.subFlag = false;
            this.$message({
              type: 'error',
              message: '请输入正确信息'
            });
            return false
          }
        })
      },
      editToken(tokenName) {
        this.editFlag = true;
        this.$store.dispatch('getTokenInfo', `/${tokenName}`).then((res) => {
          this.imgName = res.tokenImage;
          this.dialogFormVisible = true;
          this.tokenForm = Object.assign({}, res)
        }).catch()
      },
      dialogClose() {

        this.tokenForm = Object.assign({},this.dialogCopy);
        this.imgName = '';
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .token {
    padding: 20px;
    .parameter-label-item{
      width:45%;
      display: inline-block;
    }
    .parameter-input{
      display: inline-block;
      width:135px;
    }
  }
</style>
