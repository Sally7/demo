<style>
</style>
<template>
    <div class="app-container" id="wrapper">
        <div class="module-title">用户管理</div>
        <div class="app__content">
            <el-button type="primary" size="small" @click="userAUDialogVisible = true;cleanForm();doSearch()" style="margin-bottom: 20px">+新建用户</el-button>
            <el-table class="mb15"
                      :empty-text="loadingText"
                      :data="users"
                      :header-row-style="tableHeaderClass"
                      style="width: 100%">
                <el-table-column
                  align="center"
                  label="序号"
                  type="index">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="用户名"
                        prop="name">
                </el-table-column>
                <el-table-column
                        align="center"
                        label="账号"
                        prop="accountLabel"
                        >
                </el-table-column>
                <el-table-column
                  align="center"
                  label="权限"
                  prop="roleLabel"
                >
                </el-table-column>
                <el-table-column
                        align="right"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="toUpdate(scope.row)">编辑</el-button>
                        <el-popover
                                ref="popover"
                                placement="top"
                                width="200"
                                trigger="click"
                                v-model="scope.row.visible">
                          <p>确定删除 {{scope.row.name}}吗？</p>
                          <div style="text-align: right; margin: 0">
                              <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                              <el-button type="primary" size="mini" @click="doDelete(scope.row),scope.row.visible = false">确定</el-button>
                          </div>
                          <el-button class="ml10" type="text" size="small"  slot="reference">删除</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog title="用户" :visible.sync="userAUDialogVisible">
          <el-form :model="form" :rules="rules" label-width="80px" ref="user">
            <el-form-item label="用户名" prop="name" >
              <el-input v-model="form.name" autocomplete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="登陆账号" prop="account" >
              <el-input v-model="form.account" autocomplete="off" placeholder="请输入数字账号"></el-input>
            </el-form-item>
            <el-form-item label="登陆密码" prop="password" >
              <el-input type="password" v-model="form.password" autocomplete="off" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="account" >
              <el-input v-model="form.phone" autocomplete="off" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="角色">
                <el-checkbox v-for="role in roles" v-bind:key="role.id" :label="role.name" name="type" v-model="role.checked"></el-checkbox>
            </el-form-item>
            <el-form-item label="指纹">
              <img style="width: 100px;" v-if="form.fingerUrls" :src="form.fingerUrls"/>
              <el-button type="primary" v-if="!form.fingerUrls" icon="el-icon-edit" circle @click="toGatherFinger"></el-button>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="userAUDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="userAUDialogVisible = false;doConfirm()">确 定</el-button>
          </div>
        </el-dialog>

      <gather-finger
          ref="gatherFinger"
          type="vice"
          @success="gatherUserFingerSuccess"
      ></gather-finger>
    </div>
</template>
<script>
  import cacheCookies from '@/utils/auth'
  import TimeUtils from '@/utils/TimeUtil'
  import UserService from '@/api/NadminuserService'
  import AreaService from  '@/api/AreaService'
  import RoleService from '@/api/RoleService'
  import GatherFinger from '@/components/GatherFinger/index';

  export default{
    components: {
      GatherFinger
    },
    data() {
      return {
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        totalCount:0,
        currentPage:1,
        pageSize:20,
        users:[],
        roles:[],
        userAUDialogVisible:false,
        form:{},
        rules:{
          name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          account: [
            { required: true, message: '请输入账户', trigger: 'blur' },
            { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    async created() {
      this.doSearch();

      var rolesRes = await RoleService.doSearchRoleListAll();
      rolesRes.data.forEach(function (role) {
        role.checked = false;
      });
      this.roles = rolesRes.data;
    },
    methods:{
      async doSearch() {
        var that = this;
        var res = await UserService.doSearchByUserType(5);
        this.loadingText = '暂无用户信息';
        if(res.status !=1) {
          return
        }
        this.totalCount = res.total;

        res.data.forEach(function (user) {
          user.roleLabel = "";
          user.accountLabel = user.account;
          if(user.account && user.account.indexOf("@")!=-1) {
            user.account = user.account.split("@")[0];
          }
        });

        res.data.forEach(async function (user) {
            user.roleLabel = "";
            var userRolesRes = await RoleService.doGetRoleByEmployeeId(user.id);
            if(userRolesRes.data) {
              user.roles = userRolesRes.data;

              user.roles.forEach(function (role) {
                user.roleLabel += role.name + ",";
              });
              if(user.roleLabel.length > 0) {
                user.roleLabel = user.roleLabel.substr(0, user.roleLabel.length-1);
              }
            }
        });

        this.users = res.data;
      },
      handleCurrentChange(){

      },
      cleanForm() {
        this.form = {};
        this.roles.forEach(function (role) {
          role.checked = false;
        });

      },
      toUpdate(user){
        var that = this;
        this.cleanForm();

        this.form = user;

        user.roles.forEach(function (userRole) {
          that.roles.forEach(function (groupRole) {
            if(userRole.id == groupRole.id) {
              groupRole.checked = true;
            }
          })
        })

        this.userAUDialogVisible = true;
      },
      async doDelete(e){
        var res = await UserService.doDeleteUser(e.id);
        if(res.status === 1){
          this.doSearch();
        }
      },
      gatherUserFingerSuccess(res){
        console.log("gatherUserFingerSuccess:",res);
        this.form.fingerUrls = res.absolute;
        this.form.fingerOne = res.relative;
        this.form.fingerOneCode = res.fingerCode;
        this.$forceUpdate();
      },
      doConfirm(){
        var that = this;
        this.$refs["user"].validate((valid) => {
          if (valid) {
            that.doAU();
          } else {
            that.$message.warning("输入项未按规则输入！");
            return false;
          }
        });
      },
      async doAU(){
        var roleIds = "";
        this.roles.forEach(function (groupRole) {
          if(groupRole.checked) {
            roleIds += groupRole.id+",";
          }
        })

        this.form.roleIds = roleIds;

        if(!this.form.id){
          await UserService.doAddEmpUser(this.form);
        } else {
          await UserService.doChangeInfor(this.form);
        }
        this.$message.success("操作成功！");
        this.form={};
        this.doSearch();
      },
      toGatherFinger() {
        this.$refs.gatherFinger.doOpen();
      }
    }
  }
</script>
