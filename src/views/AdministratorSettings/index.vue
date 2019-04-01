<template>
  <div class="admin">
    <div >
      <el-button type="success" @click="dialogFormVisible = true" v-if="adminType === '0'">新建管理员</el-button>
    </div>
    <div class="admin-table">
      <el-table
        :data="adminList.list"
        border
        style="width: 100%">
        <el-table-column
          label="类型">
          <template slot-scope="scope">
            {{scope.row.adminType | adminTypeFilter}}
          </template>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="管理员名称">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.status ? '正常' : '禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button @click="editManage(scope.row)" size="small">编辑</el-button>
            <el-button @click="deleteManage(scope.row.id)" size="small" v-if="manage.userId !== scope.row.id">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:30px; text-align:center;">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="20"
          layout="prev, pager, next"
          :total="adminList.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog @closed="dialogClose" width="500px" :title="dialogTitle?'新建管理员':'编辑管理员'" :visible.sync="dialogFormVisible" center>
      <el-form :rules="manageRule" :model="manageForm" ref="manageForm">
        <el-form-item prop="nickname" label="管理员名称：" :label-width="formLabelWidth" >
          <el-input v-model="manageForm.nickname"></el-input>
        </el-form-item>
        <el-form-item prop="username" label="登录账号：" :label-width="formLabelWidth" >
          <el-input v-model="manageForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" v-if="dialogTitle" label="登录密码：" :label-width="formLabelWidth" >
          <el-input type="password" v-model="manageForm.password"></el-input>
        </el-form-item>
        <el-form-item v-else="!dialogTitle" label="登录密码：" :label-width="formLabelWidth" >
          <el-button size="small" @click="modifyFlag = true">修改</el-button>
        </el-form-item>
        <el-form-item v-if="adminType === '0'" class="admin-form-item"  label="一键买卖："  :label-width="formLabelWidth">
          <el-switch :active-value="1" :inactive-value="0" v-model="manageForm.permissionList[6].status"></el-switch>
        </el-form-item>
        <el-form-item v-if="adminType === '0'" class="admin-form-item"  label="充提控制："  :label-width="formLabelWidth">
          <el-switch :active-value="1" :inactive-value="0" v-model="manageForm.permissionList[0].status"></el-switch>
        </el-form-item>
        <el-form-item v-if="adminType === '0'" class="admin-form-item" label="用户控制："  :label-width="formLabelWidth">
          <el-switch :active-value="1" :inactive-value="0" v-model="manageForm.permissionList[1].status"></el-switch>
        </el-form-item>
        <el-form-item v-if="adminType === '0'" class="admin-form-item" label="币种控制："  :label-width="formLabelWidth">
          <el-switch :active-value="1" :inactive-value="0" v-model="manageForm.permissionList[2].status"></el-switch>
        </el-form-item>
        <el-form-item v-if="adminType === '0'" class="admin-form-item" label="启用："  :label-width="formLabelWidth">
          <el-switch :active-value="1" :inactive-value="0" v-model="manageForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button :loading="subFlag" type="primary" @click="subForm('manageForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="500px"  :visible.sync="modifyFlag" center>
      <el-form :rules="pwdRule" :model="pwdForm" ref="pwdForm">
        <el-form-item prop="newPassword" label="登录密码：" :label-width="formLabelWidth" >
          <el-input type="password" v-model="pwdForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="管理员密码：" :label-width="formLabelWidth" >
          <el-input type="password" v-model="pwdForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyFlag = false">取 消</el-button>
        <el-button :loading="pwdFlag" type="primary" @click="subPwdForm('pwdForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import md5 from 'blueimp-md5'
  export default {
    name: 'AdministratorSettings',
    props: {
      manage: Object
    },
    data() {
      return {
        dialogFormVisible: false,
        dialogTitle: true,
        subFlag: false,
        pwdFlag: false,
        modifyFlag: false,
        formLabelWidth: '120px',
        manageForm: {
          nickname: '',
          password: '',
          permissionList: [
            {
              permissionId: 1,
              status: 0
            },
            {
              permissionId: 2,
              status: 0
            },
            {
              permissionId: 3,
              status: 0
            },
            {
              permissionId: 4,
              status: 0
            },
            {
              permissionId: 5,
              status: 0
            },
            {
              permissionId: 6,
              status: 0
            },
            {
              permissionId: 7,
              status: 0
            }
          ],
          status: 0,
          username: ''
        },
        manageRule: {
          nickname: [
            { required: true, message: '请输入管理员名称', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入管理员密码', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '请输入管理员账号', trigger: 'blur' }
          ]
        },
        pwdForm: {
          userId: '',
          password: '',
          newPassword: ''
        },
        pwdRule: {
          password: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '请输入当前管理员密码', trigger: 'blur' }
          ]
        },
        pageNum: 1,
        copyForm: {}
      }
    },
    computed: {
      ...mapGetters({
        adminList: 'adminList',
        permission: 'permission',
        adminType: 'adminType'
      })
    },
    mounted() {
      this.getTableData('?pageNum=1&pageSize=20');
      this.copyForm = Object.assign({}, this.manageForm);
    },
    methods: {
      editManage(obj) {
        this.pwdForm.userId = obj.id;
        this.dialogFormVisible = true;
        this.dialogTitle = false;
        this.$store.dispatch('getAdminInfoEdit', `/${obj.id}`).then((data) => {
          this.manageForm = Object.assign({id: obj.id}, data)
        }).catch()
      },
      deleteManage(id) {
        this.$confirm('确认删除管理员?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.$store.dispatch('deleteDeleteAdmin', id).then(() => {
            this.getTableData('?orderBy=created_at&pageNum=1&pageSize=20');
          }).catch(() => { return false })
        }).catch(() => { return false })
      },
      handleCurrentChange(v) {
        this.pageNum = v;
        this.getTableData(`?pageNum=${this.pageNum}&pageSize=20`);
      },
      subForm(form) {
        this.subFlag = true;
        this.$refs[form].validate((valid) => {
          if (valid) {
            let cyForm = Object.assign({}, this.manageForm);
            cyForm.password = md5(md5(cyForm.password) + cyForm.username);
            this.$store.dispatch(this.dialogTitle ? 'postCreateAdmin' : 'putModifyAdmin', cyForm).then(() => {
              this.subFlag = false;
              this.dialogFormVisible = false;
              this.$refs[form].resetFields();
              this.$message.success('提交成功');
              this.getTableData('?pageNum=1&pageSize=20');
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
      subPwdForm(form) {
        this.pwdFlag = true;
        let userInfo = JSON.parse(window.localStorage.getItem('user'));
        this.$refs[form].validate((valid) => {
          if (valid) {
            let cyForm = Object.assign({}, this.pwdForm);
            cyForm.password = md5(md5(cyForm.password) + userInfo.username);
            cyForm.newPassword = md5(md5(cyForm.newPassword) + this.manageForm.username);
            this.$store.dispatch('putModifyPwd', cyForm).then(() => {
              this.pwdFlag = false;
              this.modifyFlag = false;
              this.$refs[form].resetFields();
              this.$message.success('修改成功')
            }).catch(() => {
              this.subFlag = false;
              this.pwdFlag = false;
            })
          } else {
            this.pwdFlag = false;
            this.$message({
              type: 'error',
              message: '请输入正确信息'
            });
            return false
          }
        })
      },
      getTableData(condition) {
        this.$store.dispatch('getAdminListAction', condition).then()
      },
      dialogClose() {
        this.manageForm = Object.assign({}, this.copyForm)
        this.dialogTitle = true;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .admin {
    padding: 20px;
    .admin-table {
      margin-top: 20px;
    }
    .admin-form-item{
      width:45%;
      display: inline-block;
    }
  }
</style>
