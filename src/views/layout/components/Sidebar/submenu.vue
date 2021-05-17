<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&routes.length>0">
      <!-- <router-link :to="item.path" :key="item.name">
        <el-menu-item :index="item.name||item.path" class='submenu-title-noDropdown'>
          <span v-if="item.meta&&item.meta.title">{{generateTitle(item.meta.title)}}</span>
        </el-menu-item>
      </router-link> -->

      <el-submenu class="submenu" v-if="!item.hidden&&item.children.length>0" :index="item.name||item.path" :key="item.name">
        <div class="title">{{generateTitle(item.meta.title)}}</div>
        <template v-if="!child.hidden" v-for="child in item.children">
          <router-link :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <span v-if="child.meta&&child.meta.title">{{generateTitle(child.meta.title)}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    routes: {
      type: Array
    }
  },
  data() {
    return {
    }
  },
  methods: {
    generateTitle(title) {
      return this.$t('route.' + title)
    }
  }
}
</script>
