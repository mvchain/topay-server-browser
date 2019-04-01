<template>
  <div class="wallet-manage">
    <div class="wallet-title">
      <import-component v-if="adminType === '0'" :action="action" :labelTxt="'导入地址'"></import-component>
      <el-button @click="summaryFun" style="margin-right:20px;">汇总导出</el-button>
      <import-component :action="action1" :labelTxt="'签名文件导入'"></import-component>
    </div>
    <div class="token-item">
      <div class="wallet-card-item-summary">
        <p>USDT待汇总金额：{{usdtAddr.waitBalance}}</p>
        <p>USDT地址剩余库存：{{usdtAddr.count}}</p>
      </div>
    </div>
    <el-row :gutter="20" class="wallet-card">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="wallet-card-item">
        <div class="wallet-card-item-img">
          <img :src="tokenAddr.usdtColdImg" alt="">
        </div>
        <div class="wallet-card-item-info">
          <h3>USDT冷钱包地址</h3>
          <p>地址余额：{{usdtAddr.coldBalance}}</p>
          <p>{{usdtAddr.coldAddress}}</p>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="wallet-card-item">
        <div class="wallet-card-item-img">
          <img :src="tokenAddr.usdtHotImg" alt="">
        </div>
        <div class="wallet-card-item-info">
          <h3>USDT热钱包地址</h3>
          <p>地址余额：{{usdtAddr.hotBalance}}</p>
          <p>{{usdtAddr.hotAddress}}</p>
        </div>
      </el-col>
    </el-row>





    <div class="token-item">
      <div class="wallet-card-item-summary">
        <p>BTC待汇总金额：{{btcAddr.waitBalance}}</p>
        <p>BTC地址剩余库存：{{btcAddr.count}}</p>
      </div>
    </div>
    <el-row :gutter="20" class="wallet-card">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="wallet-card-item">
        <div class="wallet-card-item-img">
          <img :src="tokenAddr.btcColdImg" alt="">
        </div>
        <div class="wallet-card-item-info">
          <h3>BTC冷钱包地址</h3>
          <p>地址余额：{{btcAddr.coldBalance}}</p>
          <p>{{btcAddr.coldAddress}}</p>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="wallet-card-item">
        <div class="wallet-card-item-img">
          <img :src="tokenAddr.btcHotImg" alt="">
        </div>
        <div class="wallet-card-item-info">
          <h3>BTC热钱包地址</h3>
          <p>地址余额：{{btcAddr.hotBalance}}</p>
          <p>{{btcAddr.hotAddress}}</p>
        </div>
      </el-col>
    </el-row>


    <div class="token-item" style="margin-top:40px;">
      <div class="wallet-card-item-summary">
        <p>
          <span>{{ethAddr.tokenName}}待汇总金额：{{ethAddr.waitBalance}}</span>
        </p>
        <p>
          <span>{{ethAddr.tokenName}}地址剩余库存：{{ethAddr.count}}</span>
          <el-select size="small" @change="changeHandler" v-model="tokenId" placeholder="请选择">
            <el-option
              v-for="item in tokenList"
              v-if="item.contractAddress || item.tokenId === 3"
              :key="item.tokenId"
              :label="item.tokenName"
              :value="item.tokenId">
            </el-option>
          </el-select>
        </p>
      </div>
    </div>
    <el-row :gutter="20" class="wallet-card">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="wallet-card-item">
        <div class="wallet-card-item-img">
          <img :src="tokenAddr.ethColdImg" alt="">
        </div>
        <div class="wallet-card-item-info">
          <h3>{{ethAddr.tokenName}}冷钱包地址</h3>
          <p>地址余额：{{ethAddr.coldBalance}}</p>
          <p>{{ethAddr.coldAddress}}</p>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="wallet-card-item">
        <div class="wallet-card-item-img">
          <img :src="tokenAddr.ethHotImg" alt="">
        </div>
        <div class="wallet-card-item-info">
          <h3>{{ethAddr.tokenName}}热钱包地址</h3>
          <p>地址余额：{{ethAddr.hotBalance}}</p>
          <p>{{ethAddr.hotAddress}}</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>//getAddrInfo
import QRCode from 'qrcode';
import {mapGetters} from 'vuex';
import importComponents from '../../components/import-component'

export default {
  name: "wallet-manage",
  components: {
    'import-component': importComponents
  },
  computed: {
    ...mapGetters({
      adminType: 'adminType',
      tokenList: 'tokenList',
    })
  },
  data() {
    return {
      tokenAddr: {
        usdtColdImg: '',
        usdtHotImg: '',
        ethColdImg: '',
        ethHotImg: '',
        btcColdImg: '',
        btcHotImg: '',
      },
      usdtAddr: {},
      ethAddr: {},
      btcAddr: {},
      action: window.urlData.url + '/block/account/import',
      action1: window.urlData.url + '/block/sign/import',
      exportFlag: false,
      tokenId: 3
    }
  },
  beforeMount() {
    this.$store.dispatch('getAddrInfo', 4).then((res) => {
      this.usdtAddr = res;
      let code = QRCode.toDataURL(res.coldAddress, {width:200});
      let hot = QRCode.toDataURL(res.hotAddress, {width:200});
      Promise.all([code, hot]).then((res) => {
        this.tokenAddr.usdtColdImg = res[0];
        this.tokenAddr.usdtHotImg = res[1];
      });
    }).catch()
    this.$store.dispatch('getAddrInfo', 3).then((res) => {
      this.ethAddr = res;
      let code = QRCode.toDataURL(res.coldAddress, {width:200});
      let hot = QRCode.toDataURL(res.hotAddress, {width:200});
      Promise.all([code, hot]).then((res) => {
        this.tokenAddr.ethColdImg = res[0];
        this.tokenAddr.ethHotImg = res[1];
      });
    }).catch()
    this.$store.dispatch('getAddrInfo', 2).then((res) => {
      this.btcAddr = res;
      let code = QRCode.toDataURL(res.coldAddress, {width:200});
      let hot = QRCode.toDataURL(res.hotAddress, {width:200});
      Promise.all([code, hot]).then((res) => {
        this.tokenAddr.btcColdImg = res[0];
        this.tokenAddr.btcHotImg = res[1];
      });
    }).catch()
  },
  methods: {
    summaryFun() {
      this.exportFlag = true;
      this.$store.dispatch('getSign').then((s) => {
        window.open(`${window.urlData.url}/block/collect/export?sign=${s}`)
        this.exportFlag = false
      }).catch(() => {
        this.exportFlag = false
      })
    },
    changeHandler(v) {
      this.$store.dispatch('getAddrInfo', v).then((res) => {
        this.ethAddr = res;
        let code = QRCode.toDataURL(res.coldAddress, {width:200});
        let hot = QRCode.toDataURL(res.hotAddress, {width:200});
        Promise.all([code, hot]).then((res) => {
          this.tokenAddr.ethColdImg = res[0];
          this.tokenAddr.ethtHotImg = res[1];
        });
      }).catch()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .wallet-manage {
    padding: 20px;
    .wallet-card {
      .wallet-card-item {
        margin-top:20px;
        & .wallet-card-item-img {
          float:left;
          width:200px;
          height:200px;
          margin-right:20px;
        }
        & .wallet-card-item-info {
          float:left;
          & h3{
            margin:80px 0 20px 0;
          }
          & p{
            margin-top:20px;
          }
        }
      }
    }
    .wallet-title {
      margin-bottom: 20px;
      & span {
        padding-right: 30px;
        font-size: 18px;
      }
    }
    .token-item{
      & .wallet-card-item-summary {
        line-height: 30px;
      }
    }
  }
</style>
