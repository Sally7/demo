<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 20px;
  }
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">潜力配置
    </div>
    <div class="app__content">
      <el-row :gutter="10">
        <el-button type="primary" size="small" @click="toAU()">新建企业分类</el-button>
      </el-row>
      <div class="search-box">
        <el-form :inline="true">
          <el-form-item label="分类名称">
            <el-input v-model="sm.search.name" size="small" clearable></el-input>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" style="margin-top: 10px;">
          <el-col :span="24" class="text-left">
            <el-button type="primary" size="small" @click="doFilter">搜索</el-button>
          </el-col>
        </el-row>
      </div>

      <el-tree
          style="width: 500px;margin-top:20px;"
          :data="pageList"
          :props="defaultProps"
          ref="tree"
          :render-content="renderContent"
          node-key="id"
          @current-change="swichiNode"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
      >

      </el-tree>

      <!-- <el-table class="mb15"
                row-key="id"
                :tree-props="{children: 'nodes'}"
                :empty-text="loadingText"
                :data="pageList"
                :header-row-style="tableHeaderClass"
                style="width: 100%;margin-top: 20px;">
        <el-table-column
                align="left"
                label="潜力分类名称"
                prop="name">
        </el-table-column>
        <el-table-column
                v-if="false"
                align="center"
                label="导出配置"
                prop="isExport">
        </el-table-column>
        <el-table-column
                v-if="false"
                align="center"
                label="统计配置"
                prop="isStatistics">
        </el-table-column>
        <el-table-column
                v-if="false"
                align="center"
                label="属性配置">
                  <template slot-scope="scope">
                    <el-button class="ml10" type="text" size="small"  slot="reference" @click="toAUProps(scope.row.id)" v-if="!scope.row.nodes||scope.row.nodes.length==0">编辑</el-button>
                  </template>
        </el-table-column>
        <el-table-column
                align="right"
                label="操作">
          <template slot-scope="scope">
            <el-popover
                    v-if="!scope.row.nodes||scope.row.nodes.length==0"
                    placement="top"
                    width="200"
                    trigger="click"
                    v-model="scope.row.visible">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="scope.row.visible = false">确定</el-button>
              </div>
              <el-button  class="ml10" type="text" slot="reference">删除</el-button>
            </el-popover>
            <el-button class="ml10" type="text" size="small"  slot="reference" @click="toAU(scope.row.id)" v-if="!scope.row.nodes||scope.row.nodes.length==0">编辑</el-button>
            <el-button size="mini" type="text" @click="toFormMaker(scope.row)" v-if="!scope.row.nodes||scope.row.nodes.length==0">设置字段</el-button>
          </template>
        </el-table-column>
      </el-table> -->
    </div>
    <FormMaker ref="formMaker" @doMaked="doMaked"></FormMaker>
  </div>
</template>
<script>
  import GoodsService from '@/api/GoodsService'
  import cacheCookies from '@/utils/auth'
  import GroupService from '@/api/GroupService'
  import ConfigUtil from '@/utils/ConfigUtil'
  import FormMaker from '@/components/FormMaker'
  import DynamicFormService from '@/api/DynamicFormService'
  export default{
    components: {
      FormMaker
    },
    data() {
      return {
        loadingText:'正在加载,请稍后...',
        tableHeaderClass: {background: '#f0f0f0'},
        sm:{page : 1, count : 20, search:{status:1, sortExp:"createTime desc"}},
        totalCount:0,
        pageList:[],

        defaultProps: {
          children: 'nodes',
          label: 'name'
        },

        currentGroupCategoryId:null
      }
    },
    async created() {
      this.doPage();
    },
    methods: {
      init() {

      },
      doReset() {
        console.log("doReset");
        this.sm = {};
        this.doPage();
      },
      async doPage(){
        var res = await GroupService.doSearchGroupCategoryTree();
        this.pageList = res;
        if(this.pageList.length==0) {
          this.loadingText = '暂无潜力分类信息';
        }
      },
      doExport() {

      },
      toAU(id) {
        var url = "/setting/defence_config/defence_category_au";
        if(id) {
          url+="?id="+id;
        }
        this.$router.push(url);
      },
      renderContent(h, { node, data, store }) {
        return (
        <span class="custom-tree-node">
        <span>
        {node.label}
        </span>
          { 
            (!data.nodes || data.nodes.length==0)?
            <div>
              <el-popover ref="popover" placement="top" width="200" v-model="scope.row.visible">
                <p>确定删除{data.name}吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" on-click={()=>{}}>取消</el-button>
                  <el-button type="primary" size="mini" on-click={()=>{}}>确定</el-button>
                </div>
            </el-popover>
            <span>
            <el-button size="mini" type="text" on-click={ () => this.edit(data) }>编辑</el-button>
            <el-button size="mini" type="text" on-click={ () => this.remove(data) }>删除</el-button>
            <el-button size="mini" type="text" on-click={ () => this.toFormMaker(node, data) }>设置字段</el-button>
            </span>
            </div>
            
            :
            ''
          }
        </span>
        );
      },
      toFormMaker(node,groupCategory) {
        this.currentGroupCategoryId = groupCategory.id;
        var configJson = {};
        if(groupCategory.categoryDispose) {
           configJson = JSON.parse(JSON.parse(groupCategory.categoryDispose).formsJson);
        }
        this.$refs.formMaker.doOpen(configJson);
      },
      async doMaked(formJson) {
        var param = {type:'group',groupId:ConfigUtil.getPlatformId(),formsJson:JSON.stringify(formJson)};
        param.groupCategoryId = this.currentGroupCategoryId;
        console.log("defence_config.vue->doMaked", formJson);
        await DynamicFormService.doAddDynamicFormByFormsJson(param);
        this.$refs.formMaker.doClose();
      },

      async edit(data){
        console.log('编辑的data参数：',data)
        let res=await GroupService.doUpdateGroupCategory(data);

        this.doPage();
      },
      async remove(data){
        console.log('删除的data参数：',data)
        let res=await GroupService.doDeleteGroupCategory(data);
        this.doPage();
      },
      swichiNode(data,node){
        console.log('选中节点变化时：',data,node)
      },

      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },

      groupCategorySelect(item) {
        this.currentGroupCategory = item;
        this.sm.groupCategoryId = item.id;
        this.doRePage();
      },

      doFilter(){
        console.log(this.sm.search.name)
        this.$refs.tree.filter(this.sm.search.name);
      }
    }
  }
</script>
