<template>
    <div class="notice-edit">
        <el-form ref="form" label-width="100px" class="form">
          	<el-form-item label="公告：">
			    <el-input></el-input>
			</el-form-item>
        </el-form>
        <p class="error-message">请填写公告内容</p>
    </div>
</template>

<script>

export default {
  	data() {
      	return {
        }
    }
}
</script>

<style rel="stylesheet/css" lang="css" scoped>
	.error-message {
		margin-top: 10px;
		line-height: 14px;
    	font-size: 12px;
    	color: #b94a48;
	}
</style>
