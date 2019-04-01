<template>
  <div class="assets">
    <div class="assets-title">
      <span style="padding-right:20px;">手机号：{{$route.query.cellphone}}</span>
      <span>用户昵称：{{$route.query.nickname}}</span>
    </div>
    <div style="margin-top:20px;">
      <el-table
        :data="userBalanceList"
        border
        style="width: 100%">
        <el-table-column
          prop="tokenName"
          label="币种">
        </el-table-column>
        <el-table-column
          prop="address"
          label="钱包地址">
        </el-table-column>
        <el-table-column
          prop="value"
          label="数量">
        </el-table-column>
        <el-table-column
          prop="balance"
          label="价值">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: "assets",
    computed: {
      ...mapGetters({
        userBalanceList: 'userBalanceList'
      })
    },
    mounted() {
      this.$store.dispatch('getUserBalanceList', this.$route.query.id)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .assets {
    padding: 20px;
  }
</style>
