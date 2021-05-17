<template>
    <el-container style="min-width: 1210px;">
        <el-header class="nav" :style="isTop?'position: fixed; z-index: 999;':''">
            <top-bar @changeOne="changeOne" :isTop="isTop" :routes="routes" @topMenuSelect="topMenuSelect"></top-bar>
        </el-header>
        <div style="height: 60px"></div>
        <el-container class="main_height">
            <el-aside width="160px" v-if="route.children.length>=1&&!route.hide">
                <sidebar ref="twoTitle" class="sidebar-container" :route="route"></sidebar>
            </el-aside>
            <el-main :style="tagId==4?'padding: 0px':'padding: 0px 0 0 10px'">
                <app-main></app-main>
            </el-main>
        </el-container>
        <im-dialog v-if="openChat"></im-dialog>
    </el-container>
</template>

<script>
  import { Sidebar, AppMain, TopBar } from 'views/layout/components'

  import ImDialog from '@/components/ImDialog'

  import { mapGetters, mapState } from 'vuex'
  import local from '../i18n-demo/local'

  export default {
    name: 'layout',
    components: {
      Sidebar,
      AppMain,
      TopBar,
      ImDialog
    },
    data () {
      return {
        isTop: false,
        route: { meta: { title: '' }, children: [] },
        routes: [],
        webSocket: null
      }
    },
    watch: {},
    created () {
    },
    mounted () {
      console.log('Layout.vue route:', this.$route)
      this.permission_routers.sort(function sortNumber (a, b) {
        return a.orderNum - b.orderNum
      })
      this.routes = this.permission_routers
      console.log(this.routes)
      for (var route of this.permission_routers) {
        if (!route.hidden && route.children && route.children.length > 0) {
          this.topMenuSelect(route)
          console.log('route.children&&route.children.length>0')
          break
        }
      }

      window.addEventListener('scroll', this.scroll)
    },
    computed: {
      ...mapGetters([
        'tagId',
        'permission_routers',
        'openChat'
      ])
    },
    methods: {
      changeOne(){
        console.error("改变了一级标题")
       this.$refs.twoTitle.initSelect()
      },
      scroll () {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        if (scrollTop > 120) {
          this.isTop = true
        } else {
          this.isTop = false
        }
      },
      topMenuSelect (route) {
        console.log("topMenuSelect....");

        this.route = route
        this.$router.push({ path: route.path + '/' + route.children[0].path })
        console.log(route.path + '/' + route.children[0].path)
        console.log('topMenuSelcet:', route)
      }

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "src/styles/mixin.scss";

    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;
    }

    .header {
        padding: 0;
    }

    .nav {

        padding: 0px auto;
        width: 100%;
    }
</style>
