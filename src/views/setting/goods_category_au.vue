<template>
  <div>
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="app__content" style="background: #ffffff">
      <el-form ref="modelForm" label-width="100px" class="form-content">
        <el-row>
          <el-col :span="20">
            <el-row>
              <el-col :span="10">
                <el-form-item label="角色名称：">
                  <el-input v-model="model.name" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="15">
                <el-form-item label="备注或描述：">
                  <el-input v-model="model.descprtion" :rows="2" type="textarea" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="auth-box" v-for="(title,index) in hotree" :key="title.id">
              <el-col :span="24">
                <el-link>{{title.hotName}}</el-link>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="model.hots">
                  <el-checkbox
                      style="width: 150px;"
                      :label="role.id"
                      v-for="role in title.children||[]"
                      :key="role.id">
                    {{role.hotName}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-row>
            <!--<el-row style="border:1px solid #D72928;padding: 10px 5px;">-->
            <el-row>
              <div style="margin-top: 20px;text-align: center;">
                <el-button type="primary" @click="doAdd">保存</el-button>
                <!--<el-button>取消</el-button>-->
              </div>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb';
  import cacheCookies from '@/utils/auth';
  import TimeUtils from '@/utils/TimeUtil';
  import buildTree from '@/utils/buildTree';
  import RoleService from '@/api/RoleService';

  function getTree(treeData, parentId) {
    var treeArr = [];
    for (var i = 0; i < treeData.length; i++) {
      var node = treeData[i];
      if (node.parentId == parentId) {
        var newNode = {id: node.id, hotName: node.hotName, children: getTree(treeData, node.id)};
        treeArr.push(newNode);
      }
    }
    return treeArr;
  };

  export default {
    name: 'role_au',
    data() {
      return {
        model: {roleType: 1, descprtion: '', name: '', hots: []},
        hotree: [],
      };
    },
    components: {
      Breadcrumb,
    },

    computed: {},
    async created() {
      let This = this;
      this.getmygrouphot();
      var roleid = this.$route.query.roleid;
      if (roleid) {
        let onerole = await RoleService.getOneRole(roleid);
        let hots = await RoleService.getRoleHots(roleid);
        hots = hots.data, onerole = onerole.data;
        this.model.roleType=onerole.roleType;
        this.model.descprtion=onerole.descprtion;
        this.model.name=onerole.name;
        hots.forEach(item => {
          This.model.hots.push(item.id);
        });
      }
    },
    methods: {
      async getmygrouphot() {
        var res = await RoleService.getMyGroupHot();
        if (res.status != 1) return;
        let list = res.data;
        for (let i = 0; i < list.length; i++) {
          if (list[i].id == list[i].parentId) {
            list[i].parentId = 0;
          }
        }
        this.hotree = getTree(list, 0);

      },

      async doAdd() {
        let m = this.model;
        let role = {
          hots: m.hots.join(','),
          name: m.name,
          descprtion: m.descprtion,
          roleType: m.roleType,
        };
        var res = await RoleService.doAddRole(role);
        if (res.status == 1) {
          this.$router.back();
        }
      },
    },
  };
</script>

<style scoped>
  .auth-box {
    border-bottom: 1px solid #D72928;
    min-height: 100px;
    padding: 20px;
  }
</style>