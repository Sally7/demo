<template>
  <el-menu class="navbar" mode="horizontal">
    <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->

    <!-- <breadcrumb class="breadcrumb-container"></breadcrumb> -->
    <div class="logo-wrap">
      <img class="logo" src="~@/assets/backend/suconnect_logo.png">
    </div>
    <tags-view></tags-view>

    <div class="right-menu">

      <!-- <error-log v-if="log.length>0" class="errLog-container right-menu-item" :logsList="log"></error-log>

      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <el-dropdown trigger="click" class='international' @command="handleSetLanguage">
        <div>
          <svg-icon class-name='right-menu-item international-icon' icon-class="language" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh" :disabled="language==='zh'">中文</el-dropdown-item>
          <el-dropdown-item command="en" :disabled="language==='en'">English</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-tooltip effect="dark" content="换肤" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip> -->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar?avatar:require('@/assets/backend/head-default.png')">
          <span class="user-name">{{name}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <!-- <a target='_blank' href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>
              项目地址
            </el-dropdown-item>
          </a> -->
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import TagsView from './TagsView'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ThemePicker from '@/components/ThemePicker'
import Screenfull from '@/components/Screenfull'
import ErrorLog from '@/components/ErrLog'
import errLogStore from 'store/errLog'

export default {
  components: {
    TagsView,
    Breadcrumb,
    Hamburger,
    ThemePicker,
    ErrorLog,
    Screenfull
  },
  data() {
    return {
      log: errLogStore.state.errLog
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'language'
    ])
  },
  methods: {
    /*toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$store.dispatch('setLanguage', lang)
      this.$message({
        message: 'switch language success',
        type: 'success'
      })
    },*/
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
        //this.$router.push("/login");
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 9999;
  line-height: 50px;
  border-bottom: 1px solid #293541;
  border-radius: 0px !important;
  background-color: #293541;
  .logo-wrap {
    float: left;
    width: 200px;
    height: 100%;
    padding: 0 20px;
  }
  .logo {
    width: 130px;
    margin-top: 5px;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
      .international-icon{
        font-size: 20px;
        cursor: pointer;
        vertical-align: -5px;
      }
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        position: relative;
        padding-top: 10px;
        box-sizing: border-box;
        height: 50px;
        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align: top;
        }
        .user-name{
          line-height: 30px;
          vertical-align: top;
          margin-left: 5px;
          color: rgba(255,255,255,.9);
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 50%;
          margin-top: -6px;
          font-size: 12px;
          color: rgba(255,255,255,0.6);
        }
      }
    }
  }
}
</style>



