<style>
</style>
<template>
  <div class="app-container" id="wrapper">
    <div class="module-title" style="display: flex;justify-content: space-between">{{title}}
      <el-button type="text" @click="toAU()" style="margin-right: 20px">+就业安置</el-button>
    </div>
    <div class="app__content">
      <dynamic-form-table :dyform="dyform"  :modelId="model.id"></dynamic-form-table>
    </div>
  </div>
</template>
<script>
  import AreaSelect from '@/components/AreaSelect/index'
  import ElFormItem from "element-ui/packages/form/src/form-item";
  export default{
    components: {
      AreaSelect,
      ElFormItem
    },
    data() {
      return {
        archiveType:1,
      }
    },
    created() {
    }
  }
</script>
