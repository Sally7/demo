<template>
  <div class="menu-wrapper">
    <template>
      <router-link v-for="(item, index) in route.children" :to="route.path+'/'+item.path" :key="index" v-if="!item.hidden">
        <el-menu-item :index="index+''">
          <span v-if="item.label" slot="title">{{item.label}}</span>
        </el-menu-item>
      </router-link>
    </template>
  </div>
</template>

<script>

export default {
  name: 'SidebarItem',
  props: {
    route: {
      type: Object
    }
  },
  created(){
    console.log(this.routes)
  },
  data() {
    return {
      //subMenu: []
    }
  },
  methods: {
    generateTitle(title) {
      return this.$t('route.' + title)
    }
  }
}
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .icon{
    width: 14px;
    height: 14px;
    margin-right: 5px;
    display: inline-block;
    background-size: cover;
  }
</style>
