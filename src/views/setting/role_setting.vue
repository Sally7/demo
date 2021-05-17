<template>
  <div class="app-container" id="wrapper">
    <div class="module-title">角色管理</div>
    <div class="app__content">
      <el-button type="primary" size="small"  @click="toedit" style="margin-bottom: 20px">+添加角色</el-button>
      <el-table class="mb15"
                :empty-text="loadingText"
                :data="roles"
                :header-row-style="tableHeaderClass"
                style="width: 100%">
        <el-table-column
            align="center"
            label="序号"
            type="index">
        </el-table-column>
        <el-table-column
            align="center"
            label="角色名称"
            prop="name">
        </el-table-column>
        <el-table-column
            align="center"
            label="描述"
            prop="descprtion"
        >
        </el-table-column>
        <el-table-column
            align="center"
            label="所属地域"
            prop="cityId"
        >
        </el-table-column>
        <el-table-column
            align="right"
            label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toedit(scope.row)">编辑</el-button>
            <el-popover
                ref="popover"
                placement="top"
                width="200"
                trigger="click"
                v-model="scope.row.visible">
              <p>确定删除 {{scope.row.name}}吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="dodelete(scope.row.id),scope.row.visible = false">确定</el-button>
              </div>
              <el-button class="ml10" type="text" size="small" slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import cacheCookies from '@/utils/auth';
  import TimeUtils from '@/utils/TimeUtil';
  import RoleService from '@/api/RoleService';

  export default {
    components: {},
    data() {
      return {
        loadingText: '正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        roles: [],
      };
    },
    async created() {
      this.dopage();
    },
    methods: {
      /**
       * 查询所有角色
       */
      async dopage() {
        var res = await RoleService.doSearchRoleListAll();
        this.loadingText='暂无角色信息'
        if (res.status != 1) return;
        this.roles = res.data;
        this.totalCount = res.total;
      },

      /**
       * 跳转角色编辑页
       * @param row
       */
      toedit(row){
//        role_setting/role_au
        var url = 'role_setting/role_au';
        if (row.id) {
          url += '?roleid=' + row.id;
        }
        this.$router.push(url);
      },

      /**
       * 删除指定角色
       * @param id
       */
      async dodelete(id){
        var res = await RoleService.doDeleteRole(id);
        if(res.status == 1){
          this.dopage();
        }
      }
    },
  };
</script>
