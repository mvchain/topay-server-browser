<template>
  <div class="user">
    <el-row style="margin-bottom:20px;">
      <el-col :span="18">
        <el-select @change="userListData" v-model="userStatus" placeholder="请选择">
          <el-option
            v-for="item in userTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input clearable placeholder="输入手机号" v-model="searchText" class="input-with-select">
          <el-button @click="userListData" slot="append" icon="el-icon-search">搜索</el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table
      :data="userList.list"
      border
      style="width: 100%">
      <el-table-column
        label="邮箱">
        <template slot-scope="scope">
          {{scope.row.email || scope.row.cellphone}}
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="balance"
        label="总资产">
      </el-table-column>

      <el-table-column
        label="类型">
        <template slot-scope="scope">
          {{scope.row.userType === 0 ? '普通' : scope.row.userType === 1 ? '币商' : 'SDK商户'}}
        </template>
      </el-table-column>
      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{scope.row.status === 1 ? '启用' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column
        width="350"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="$router.push({path: 'assets', query: {id: scope.row.id, nickname: scope.row.nickname, cellphone: scope.row.cellphone}})" size="small">资产列表</el-button>
          <el-button @click="$router.push({path: 'operating', query: {id: scope.row.id, nickname: scope.row.nickname, cellphone: scope.row.cellphone}})" size="small">操作记录</el-button>
          <el-button @click="userTypeHandler(scope.row)" size="small">类型</el-button>
          <el-button @click="enableDisable({id: scope.row.id, status: scope.row.status})" v-if="permission.includes('2')" size="small">{{scope.row.status === 1 ? '禁用' : '启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:30px; text-align:center;">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="20"
        layout="prev, pager, next"
        :total="userList.total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="typeFlag" width="30%">
      <el-form :model="typeFrom">
        <el-form-item label="用户类型"  label-width="100px">
          <el-select v-model="typeFrom.userType" placeholder="请选择用户类型">
            <el-option label="普通" :value="0"></el-option>
            <el-option label="币商" :value="1"></el-option>
            <el-option label="SDK商户" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="typeFrom.userType === 2" label="商户名称"  label-width="100px">
          <el-input v-model="typeFrom.name" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="typeFlag = false">取 消</el-button>
        <el-button type="primary" @click="subTypeHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'user',
    props: {
      manage: Object
    },
    data() {
      return {
        pageNum: 1,
        userStatus: '',
        searchText: '',
        typeFlag: false,
        typeFrom: {
          name: '',
          userId: '',
          userType: 0
        },
        userTypeList: [
          {
            id: '',
            name: '所有状态'
          },
          {
            id: 1,
            name: '正常'
          },
          {
            id: 0,
            name: '禁用'
          }
        ]
      }
    },
    computed: {
      ...mapGetters({
        userList: 'userList',
        permission: 'permission',
        adminType: 'adminType'
      })
    },
    mounted() {
      this.userListData()
    },
    methods: {
      userTypeHandler(obj) {
        this.typeFrom.userType = obj.userType
        this.typeFrom.userId = obj.id
        this.typeFlag = true
      },
      subTypeHandler() {
        if (this.typeFrom.userType === 2 && !this.typeFrom.name.trim()) {
          this.$message.error('请输入商户名称')
          return
        }
        this.$store.dispatch('putUserType', this.typeFrom).then(() => {
          this.typeFlag = false
          this.$message.success('设置成功')
          this.userListData()
        }).catch()
      },
      handleCurrentChange(v) {
        this.pageNum = v;
        this.userListData()
      },
      userListData() {
        this.$store.dispatch('getUserList', `?pageNum=${this.pageNum}&pageSize=20&cellphone=${this.searchText}&status=${this.userStatus}`);
      },
      enableDisable(opt) {
        this.$confirm(`是否${opt.status === 1 ? '禁用' : '启用'}此用户?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          opt.status = opt.status === 1 ? 0 : 1;
          this.$store.dispatch('putUserStatus', opt).then(() => {
            this.$message.success('修改成功');
            this.userListData();
          }).catch()
        }).catch(() => {});
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .user{
    padding:20px;
  }
</style>
