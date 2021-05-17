<template>
  <div class="image-swiper-edit">
    <el-form ref="form" label-width="100px" class="form">
      <el-form-item label="编辑图标：">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="橱窗个数：">
        <el-radio v-model="radio" label="1">{{shopWindowTile.itemLists.length}}个</el-radio>
      </el-form-item>
      <el-form-item label="橱窗标题：">
        <el-input v-model="shopWindowTile.name"></el-input>
      </el-form-item>
      <div class="control-group js-choices-region">
        <image-text-list v-bind:imageTile="shopWindowTile"></image-text-list>
      </div>
    </el-form>
  </div>
</template>

<script>
  import ImageTextList from './image_text_list.vue'

  export default {
    props:['shopWindowTile'],
    data() {
      return {
        radio: '1',
        imageUrl: ''
      }
    },
    created() {
    },
    components: {
      ImageTextList
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .form .control-group {
    margin-bottom: 10px;
  }
  .form .control-group:after, .form .control-group:before {
    display: table;
    line-height: 0;
    content: "";
  }
  .avatar-uploader .el-upload {
    height: 40px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .avatar {
    width: 40px;
    height: 40px;
    display: block;
  }
</style>
