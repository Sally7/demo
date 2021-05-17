<template>
  <div v-if="isEdit">
    <el-row v-for="(dyform,index) in dyforms" :key="'dyform_'+index" :id="dyform.moduleId">
      <p class="form-title">{{dyform.title}}</p>
        <dynamic-form-for-archive :dyform="dyform" :moduleId="moduleId" :modelId="modelId"  ref="dynamicFormsForArchiveReadonly"></dynamic-form-for-archive>
    </el-row>
  </div>
  <div v-else>
    <el-row v-for="(dyform,index) in dyforms" :key="'dyform_'+index" :id="dyform.moduleId">
      <p class="form-title">{{dyform.title}}</p>
      <dynamic-form-for-archive-readonly :dyform="dyform" :moduleId="moduleId" :modelId="modelId"  ref="dynamicFormsForArchiveReadonly"></dynamic-form-for-archive-readonly>
    </el-row>
  </div>
</template>

<script>
  import cacheCookies from '@/utils/auth'
  import DynamicFormService from '@/api/DynamicFormService'
  import DynamicFormForArchiveReadonly from '@/components/DynamicFormForArchiveReadonly/index'
  import DynamicFormForArchive from '@/components/DynamicFormForArchive/index'
  export default {
    name:"DynamicFormTable",
    components:{DynamicFormForArchiveReadonly,DynamicFormForArchive},
    props: {
      moduleId:{
        type: String
      },
      modelId:{
        type: String
      },
      keyId:{
        type: String
      },
      isEdit:{
        type:Boolean,
        default: false,
      }
    },
    data() {
      return {
        dyforms:[],
      }
    },
    watch:{
      modelId:function (newValue) {

      }
    },
    async created() {
      var dyformsRes = await DynamicFormService.doSearchByModuleId(this.moduleId);
      if (dyformsRes.status) {
        //dyformsRes.data = dyformsRes.data.sort(this.sortChangeType)
        console.log('dyforms-------:',dyformsRes.data);
        this.dyforms = dyformsRes.data;
      }
    },
    methods: {
      doCancel() {

      },
      auCallback() {

      },
      doAU(orderId){
        console.log(orderId)
        this.$refs.dynamicFormsForArchiveReadonly[0].doAUDynamicFormItemValueRelations(orderId)
      },

      async doSearchValueRelationsForTable() {
      },
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .el-form-item {
    margin-bottom: 14px;
  }
</style>
