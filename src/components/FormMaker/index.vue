<template>
  <div class="form-marker">
      <el-dialog title="属性编辑"
                 :close-on-click-modal="false"
                 fullscreen width="80%" top="1%"
                 :visible="show"
                 :before-close="handleClose"
      >
        <fm-making-form
                ref="makingform"
                style="height: 600px"
                preview>
          <template slot="action"></template>
        </fm-making-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="doClose">取 消</el-button>
          <el-button size="small" type="primary" @click="doMaked" :loading="doing">保存</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
  export default {
    name:"FormMaker",
    props: {

    },
    data() {
      return {
        show:false,
        doing:false
      }
    },
    mounted() {

    },
    methods: {

      doClose() {
        this.show = false;
      },
      handleClose(){
          this.show = false;
      },
      doOpen(formJson) {
        console.log("formJson",formJson);
        var that = this;
        this.show = true;
        this.$nextTick(()=>{
          /*现在数据已经渲染完毕*/
          that.$refs.makingform.setJSON(formJson);
        })
      },
      async doMaked() {
          this.doing = true;
          var formJson = this.$refs.makingform.getJSON();
          console.log("doMaked", formJson);
          this.$emit("doMaked", formJson);
          this.doing = false;
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>

</style>
