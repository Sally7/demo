<template>
    <div>
        <el-form ref="form" label-width="100px" class="form">
            <el-form-item label="显示个数：">
              <el-radio v-model="radio" label="1">5个</el-radio>
            </el-form-item>
            <div class="js-choices-region">
                <image-text-list></image-text-list>
            </div>
        </el-form>
    </div>
</template>

<script>
import ImageTextList from './image_text_list.vue'

export default {
  	data() {
      	return {
            radio: '1'
        }
    },
    components: {
        ImageTextList
    }
}
</script>

<style rel="stylesheet/css" lang="css" scoped>
	
</style>
