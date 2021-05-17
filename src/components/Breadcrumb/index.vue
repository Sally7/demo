<template>
  <el-breadcrumb class="module-title" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path" v-if='item.meta.title'>
        <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.label}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.label}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
    <el-dropdown v-if="showPrint" style="float:right;margin-right: 20px" @command="handleClick">
      <el-link icon="el-icon-printer" type="primary">打印<i class="el-icon-arrow-down el-icon--right"></i></el-link>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="archive">档案打印</el-dropdown-item>
        <el-dropdown-item command="archive_review">政审打印</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </el-breadcrumb>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  props: {
    showPrint: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ...mapGetters([
      'permission_routers'
    ])
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    },
    showPrint(newValue) {
      console.log("showPrint：->"+newValue);
    }
  },
  methods: {
    getBreadcrumb() {
      var that = this;
      const matched = this.$route.matched.filter(item => item.name)
      var startPath = matched[0].path;
      var levelLists = [];
      for(var i = 0; i < this.permission_routers.length; i++) {
        if(this.permission_routers[i].path !='/'){
          if(this.permission_routers[i].path && this.$route.path.indexOf(this.permission_routers[i].path) >-1) {
            this.permission_routers[i].children.forEach(function(item, index) {
              console.log('item.path:',item);
              if(that.$route.path.indexOf(item.path) > -1) {
                var tempItem = JSON.parse(JSON.stringify(item));
                levelLists.push(tempItem)
              }
            });
            break;
          }
        }

      }

      //console.log(levelLists);
      levelLists.forEach(function(item, index) {
        item.path = startPath + '/' + item.path;
      })
      //let matched = this.$route.matched.filter(item => item.name)
      /*const first = matched[0]
      if (first && first.name !== 'dashboard') {
        matched = [{ path: '/dashboard', meta: { title: 'dashboard' }}].concat(matched)
      }*/
      //this.levelList = matched
      this.levelList = levelLists
      console.log(levelLists);
    },
    generateTitle(title) {
      return this.$t('route.' + title)
    },
    handleClick(command) {
      this.$emit('handleClick', command);
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .title.el-breadcrumb {
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
