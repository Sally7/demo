<template>
<div class="sidebar clearfix">
  <scroll-bar class="scroll-menu" >
    <div class="shop_logo" style="display: flex;flex-direction:column;align-items:center;justify-content:center;padding: 20px 0 20px;border-bottom: 1px solid #eee;">
      <el-avatar slot="reference" size="medium" :src="route.iconUrl?route.iconUrl:require('@/assets/backend/head-default.png')"></el-avatar>
      <div class="class_name">{{route.label}}</div>
    </div>
    <el-menu mode="vertical" :default-active="0+''" >
      <sidebar-item :route="route" ></sidebar-item>
    </el-menu>
  </scroll-bar>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Submenu from './submenu'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, Submenu, ScrollBar },
  computed: {
    ...mapGetters([
      'sidebar','tagId'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  props: {
    route:  {
      default:{meta:{title:""}}
    }
  },
  data() {
    return {
    }
  },
  created() {
    console.log("Sidebar-index", this.route);
  },
  methods: {
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    },
    home() {
      this.$router.push({ path: '/' });
    },
    resetPassword() {
      this.$router.push({ path: '/resetpassword' });
    },
    generateTitle(title) {
      return this.$t('route.' + title)
    }
  }
}
</script>
<style rel="stylesheet/css" lang="css" scoped>
  .sidebar .scroll-menu {
    width: 160px;
    float: left;
    background-color: #fff;
  }
  .sidebar .scroll-submenu {
    width: 110px;
    float: left;
    background-color: #fff;
    border-right: 1px solid #E0E0E0;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .class_name{
    margin-top: 10px;
    font-size: 16px;
    color: #409EFF;
  }
</style>
