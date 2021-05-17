<template>
    <div>
        <div v-if="!isTop" class="top-header-box">

            <div class="ebase-frame-header-inner" style="position: relative">

                <div class="top-header">
                    <div class="ebase-frame-header-inner top-title">
                        <div class="logo-box" style="padding-top: 10px" @click="toST" >
                            <img src="../../../assets/logo/logo_title.png" style="height: 50px"/>
                            <div class="sub-logo" v-if="false">|</div>
                            <div class="sub-logo">&nbsp|&nbsp&nbsp{{area.curAreaName}}</div>
                        </div>
                        <div class="ebase-frame-header-userTopBar" style="padding-top: 10px;">
          <span>
            <a class="ebase-frame-header-userLink" href="" v-if="false">帮助</a>
            <a class="ebase-frame-header-userLink" v-if="false" href="#" @click="openChat"><i
                    class="el-icon-message-solid"></i>消息<span></span></a>
            <a class="ebase-frame-header-userLink" href="#" @click="logout">退出</a>
          </span>
                        </div>
                    </div>
                </div>
                <div class="top-header">
                    <div class="ebase-frame-header-inner header-inner top-title">
                        <div class="logo-box nav">
                            <el-tabs v-model="tagId" @tab-click="handleClick">
                                <el-tab-pane v-for="(item,index) in routes"
                                             v-if="item.children && item.children.length>0 && !item.rootHide"
                                             :label="item.label" :name="index.toString()" :key="index"></el-tab-pane>
                                <el-tab-pane v-if="false" name="1"><span slot="label">{{routes.length}}<div
                                        class="menu-remind"></div></span></el-tab-pane>
                            </el-tabs>
                            <el-divider v-if="false" direction="vertical"></el-divider>
                        </div>
                        <div class="search_box" style=" width: 250px;margin-top: 8px">
                            <el-autocomplete
                                    ref="searchInput"
                                    size="small"
                                    v-model="state"
                                    style="width: 100%"
                                    prefix-icon="el-icon-search"
                                    :fetch-suggestions="doSearch"
                                    placeholder="请输入搜索内容"
                                    @focus="idNoFocus"
                                    @select="handleSelect"
                                    clearable>
                                <template slot-scope="{ item }">
                                    <div style="border-bottom: 1px solid #909399">
                                        <div class="name">{{ item.name }}</div>
                                        <span class="type" style="color: #909399">{{ item.typeLabel }}</span>
                                    </div>
                                </template>
                            </el-autocomplete>
                        </div>
                    </div>
                </div>
                <img v-if="false" class="start" src="../../../assets/starts.png">
            </div>
        </div>

        <div class="top-header-nav">
            <div class="top-header header-inner-height" v-if="isTop">
                <div class="ebase-frame-header-inner header-inner"
                     style="display: flex;align-items: center;justify-content: space-between">
                    <div class="logo-box nav">
                        <img src="../../../assets/logo/title.png" style="height: 40px;margin-right: 10px"/>
                        <el-tabs v-model="tagId" @tab-click="handleClick">
                            <el-tab-pane v-for="(item,index) in routes"
                                         v-if="item.children && item.children.length>0 && !item.rootHide"
                                         :label="item.label" :name="index+''" :key="index"></el-tab-pane>
                            <el-tab-pane v-if="false" name="1"><span slot="label">{{routes.length}}<div
                                    class="menu-remind"></div></span></el-tab-pane>
                        </el-tabs>
                        <el-divider v-if="false" direction="vertical"></el-divider>
                        <a  v-if="false" class="ebase-frame-header-userLink" href="javascript:void(0)" @click="openChat"><i
                                class="el-icon-message-solid"></i>消息<span></span></a>

                    </div>
                    <div class="search_box" style="width: 250px">
                        <el-autocomplete
                                ref="searchInput"
                                size="small"
                                v-model="state"
                                style="width: 100%"
                                prefix-icon="el-icon-search"
                                :fetch-suggestions="doSearch"
                                placeholder="请输入搜索内容"
                                @focus="idNoFocus"
                                @select="handleSelect"
                                clearable>
                            <template slot-scope="{ item }">
                                <div style="border-bottom: 1px solid #909399">
                                    <div class="name">{{ item.name }}</div>
                                    <span class="type" style="color: #909399">{{ item.typeLabel }}</span>
                                </div>
                            </template>
                        </el-autocomplete>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ConfigUtil from '@/utils/ConfigUtil'
  import UserService from '@/api/UserService'
  import ArticleService from '@/api/ArticleService'
  import GoodsService from '@/api/GoodsService'
  import GatherService from '@/api/GatherService'

  export default {
    name: 'top-header',
    props: {
      isTop: {
        type: Boolean,
        required: false
      },
      routes: {
        type: Array
      }
    },
    data () {
      return {
        isNav: null,
        tagId: this.$store.state.tagId ? this.$store.state.tagId : '4',
        state: ''
      }
    },
    computed: {
      ...mapGetters([
        'avatar',
        'area',
        'idNo',
      ]),
    },
    created () {

      console.log('++++++++++++++', this.routes)
      //this.active_path = this.$route.path.match(/\w+/)[0];
    },
    mounted () {
      console.log('topbar mounted:')
      let _this = this
      setTimeout(function () {
        if (localStorage.getItem('path') != null)
          _this.$router.push({ path: localStorage.getItem('path') })
        _this.tagId = localStorage.getItem('name') != null ? localStorage.getItem('name') : '4'
        // console.error('当前内存中的index', _this.tagId)
        _this.$emit('topMenuSelect', _this.routes[+localStorage.getItem('name')])
        _this.$store.dispatch('doTagId', localStorage.getItem('name'))//vuex存储tagid
      }, 200)
    },
    methods: {
      handleClick (tab, event) {
        console.log(this.routes[+tab.name].path+'/'+this.routes[+tab.name].children[0].path)
        localStorage.setItem('path', this.routes[+tab.name].path+'/'+this.routes[+tab.name].children[0].path)+"?index="+tab.index
        localStorage.setItem('name', tab.name)
        localStorage.setItem('index', tab.index)
        localStorage.setItem("selectTwo","0")

        this.$store.state.selectTwo=localStorage.getItem("selectTwo")
        this.$emit('topMenuSelect', this.routes[+tab.name])
        this.$store.dispatch('doTagId', tab.name)//vuex存储tagid
        this.$emit("changeOne")

      },
      generateTitle (title) {
        return this.$t('route.' + title)
      },
      logout () {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      },
      openChat () {
        this.$store.dispatch('doOpenChat', true)
      },
      resetSM (sm) {
        userSM.idNo = null
        userSM.phone = null
        userSM.name = null
      },
      async doSearch (key, cb) {
        var that = this
        if (!key) {
          return
        }
        console.log('doSearch.....', key)
        var userSM = {
          sortExp: 'createTime desc',
          townId: this.area.townId,
          villageId: this.area.villageId,
          groupBatchNumber: ConfigUtil.getTradingAreaId()
        }
        if (userSM.townId || userSM.villageId) {
          userSM.areaId = null
        }
        userSM.idNo = null
        userSM.phone = null
        userSM.name = null

        var articleSM = { page: 1, count: 5, status: 1, sortExp: 'createTime desc' }
        articleSM.title = null
        articleSM.content = null

        var goodsSM = { page: 1, count: 20, search: { status: 1, sortExp: 'createTime desc' } }
        goodsSM.title = null

        var users = []
        var articles = []
        var goodss = []

        if (ConfigUtil.isLegal(key)) {
          userSM.idNo = key
          var res = await UserService.doPage(userSM, 1, 5)
          users = res.data
        } else if (ConfigUtil.isPoneAvailable(key)) {
          userSM.phone = key
          var res = await UserService.doPage(userSM, 1, 5)
          users = res.data
        } else {
          //查用户姓名
          userSM.name = key
          var res = await UserService.doPage(userSM, 1, 5)
          users = res.data

          //资讯名
          articleSM.title = key
          var res = await ArticleService.doPage(articleSM)
          articles = res.data

          //咨询类容
          articleSM.title = null
          articleSM.content = key
          var res = await ArticleService.doPage(articleSM)
          articles = articles.concat(res.data)

          //装备名
          goodsSM.search.titleKeyword = key
          var res = await GoodsService.doPage(goodsSM)
          goodss = res.data
          //机构名
        }
        var searchList = []
        users.forEach(function (user) {
          searchList.push({ name: user.name, id: user.id, typeLabel: '人员', type: 1 })
        })

        articles.forEach(function (article) {
          searchList.push({ name: article.title, id: article.id, typeLabel: '资讯', type: 2 })
        })

        goodss.forEach(function (goods) {
          searchList.push({ name: goods.title, id: goods.id, typeLabel: '装备', type: 3 })
        })

        cb(searchList)
      },
      handleSelect (item) {
        console.log('handleSelect', item)
        var url = ''
        switch (item.type) {
          case 1:
            url = '/archive/archive_list_1/archive_au?archiveType=1&id=' + item.id
            break
          case 2:
            url = '/open/article_detail?id=' + item.id
            break
          case 3:
            url = '/equipment/equipment_list/equipment_au?id=' + item.id
            break
        }
        this.$router.push(url)
      },
      async idNoFocus () {
        if (this.state) {
          return
        }
        var res = await GatherService.doScanIdCard()

        if (res.Certificate) {
          this.state = res.Certificate.IDNumber
          this.$refs['searchInput'].handleChange(this.state)
        }
      },
      toST() {
        //window.location.href = "http://swdev.suconnected.com/st/";
      }
    }
  }
</script>

<style scoped lang="scss">
    @import "../../../../src/styles/variables";

    .top-header-box {
        background-color: $--color-primary;
        background-position: top;
        background-repeat: no-repeat;

        .start {
            position: absolute;
            width: 90px;
            left: -105px;
            top: 10px;
        }
    }

    .top-header-nav {
        background-color: $--color-primary;
        /*background-image: url("../../../assets/bg_2.jpeg");*/
        background-position: top;
        background-repeat: no-repeat;
    }

    .top-header {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        /deep/ .el-tabs__item {
            color: white;
            height: 100%;
            line-height: 50px;
            font-size: 16px;
            border-bottom: 2px solid $--color-primary;
        }

        /deep/ .el-tabs__active-bar {
            height: 3px;
        }

        /deep/ .el-tabs__item:hover {
            color: $barActive;
        }

        /deep/ .el-tabs__item.is-active {
            color: $barActive;
        }

        /deep/ .el-tabs__nav-wrap {
            margin-bottom: 0px;
        }

        /deep/ .el-tabs__active-bar {
            background-color: $barActive;
        }

        /deep/ .el-tabs__item.is-top {
            padding: 0 12px;
        }
    }

    .header-inner-height {
        /deep/ .el-tabs__item {
            height: 60px;
            line-height: 60px;

        }
    }

    .top-title {
        display: flex;
        justify-content: space-between;
    }

    .logo-text {
        color: #ffffff;
        margin-left: 10px;
        font-size: 22px;
        font-weight: 400;
    }

    .menu-remind {
        position: absolute;
        top: 12px;
        right: 4px;
        width: 8px;
        height: 8px;
        background-color: #f3d024;
        border-radius: 50%;
    }

    .logo-box {
        display: flex;
        align-items: center;
    }

    .sub-logo {
        font-weight: bold;
        font-size: 22px;
        color: #fff;
        margin-left: 5px;
    }

    .ebase-frame-header-userLink {
        position: relative;
        color: #fefefe;
        opacity: .7;
        line-height: 20px;
        margin-left: 20px;
        font-size: 14px;

        .el-icon-message-solid {
            margin-right: 2px;
        }

        span {
            display: block;
            background-color: #EDCF4A;
            border-radius: 5px;
            color: #fff;
            height: 10px;
            width: 10px;
            position: absolute;
            top: 0;
            right: 2px;
            transform: translateY(-50%) translateX(100%);
        }
    }

    .nav {
        color: white;
        height: 100%;
        line-height: 50px;
        font-size: 16px;

        /deep/ .el-tabs__item.is-top {
            padding: 0 12px;
        }
    }

    .search_box {

    }

    /*.header-inner{*/
    /*  width: auto;*/
    /*}*/
</style>
