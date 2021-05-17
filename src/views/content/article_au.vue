<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <Breadcrumb class="breadcrumb-container"></Breadcrumb>
      <div class="app__content">
        <el-form :model="model" :rules="rules" ref="modelForm" label-width="80px" class="form-content">
          <el-row>
            <el-col :span="10">
              <el-form-item label="资讯分类" prop="categoryId">
                <el-cascader
                    size="small"
                    style="width: 100%"
                    v-model="model.categoryId"
                    :props="{value: 'id',label:'name',children:'nodes' }"
                    :options="categorys"
                    filterable
                    clearable
                    @change="categorySelect">
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="资讯标题" prop="title">
                <el-input v-model="model.title" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="作者" prop="author">
                <el-input v-model="model.author" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="内容描述" prop="description">
                <el-input v-model="model.description" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="封面图片">
                <el-upload
                    :action="uploadUrl"
                    list-type="picture-card"
                    :file-list="fileList"
                    :on-remove="handleRemove"
                    :limit="1"
                    :on-success="handlePictureSuccess"
                    :on-preview="handlePictureCardPreview">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!--<tinymce :height="300" ref="tnyc"></tinymce>-->
            <tinymce id="editor" :height="300" :v-model="model.content" :value="model.content" @input="getEditorInfo"></tinymce>
          </el-row>
        </el-form>

        <div class="footer">
          <el-button size="small" type="primary" @click="doAU()" :loading="doAUing">保存</el-button>
        </div>
        <!--右侧栏结束-->
      </div>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb';
  import ConfigUtil from '@/utils/ConfigUtil';
  import Tinymce from '@/components/Tinymce';
  import GoodsService from '../../api/GoodsService';
  import ArticleService from '@/api/ArticleService';

  export default {
    data() {
      return {
        oper: 'add',
        model: {id: this.$route.query.id, content: '', categoryId: []},
        fileList: [],
        category: [],
        categorys: [],
        size: 'small',
        dialogVisible: false,
        uploadUrl: process.env.BASE_API + '/file_uploadImg.do?key=system.image.processor.1xxl',

        dialogImageUrl: '',
        tableHeaderClass: {background: '#f0f0f0'},
        rules: {
          title: [
            {required: true, message: '请输入资讯标题', trigger: 'change'},
            {min: 1, max: 100, message: '长度在 1 到 100 个字', trigger: 'change'},
          ],
//          artNo: [{required: true, message: '请输入装备型号', trigger: 'change'}],
          categoryId: [{required: true, message: '请输入咨询标题', trigger: 'change'}],
//          unitName: [{required: true, message: '请选择单位', trigger: 'change'}],
        },
        doAUing: false,

      };
    },
    components: {
      Tinymce,
      Breadcrumb,
    },
    async created() {
//      window.tinymce.get(this.tinymceId).setContent(val))
      var id = this.$route.query.id;
      this.categorys = await ArticleService.doSearchTreeJson();
      if (id) {
        this.oper = 'update';
        this.model = await ArticleService.doSearchById(id);
        if (this.model.picurl) {
          let arr1 = this.model.picurl.split(',');
          let arr2 = this.model.showPicUrl.split(',');
          arr1.forEach((item, index) => {
            this.fileList.push({name: item || '', url: arr2[index]});
          });
        }
      }
    },
    computed: {
      uploadDisabled() {
        return this.fileList.length > 0;
      },
    },

    methods: {
      categorySelect() {
        console.log('合并yuanqu')
      },
      handlePictureSuccess(res, file) {
        var that = this;
        var fileParam = {};
        fileParam.url = res.absolute;
        fileParam.name = res.relative;
        this.fileList.push(fileParam);

        this.model.picurl = '';
        this.fileList.forEach(function(item, index) {
          if (that.model.picurl) {
            that.model.picurl += (',' + item.name);
          } else {
            that.model.picurl = item.name;
          }
        });
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleRemove(file) {
        console.log(this.fileList.indexOf(file));
        this.fileList.splice(this.fileList.indexOf(file), 1);
      },
      doCancel() {
        this.$router.back();
      },
      goodsCategorySelect() {

      },
      getEditorInfo(e) {
        console.log('编辑器输入：',e)
        this.model.content = e;
      },
      async doAU() {
        console.log('编辑器ID',window.tinymceId);
//        this.$children[1].$children[5].$children[0].value='耷拉脑袋'
//        console.log(this.$children[1].$children[5].$children[0].value='');
        this.doAUing = true;
        var that = this;
        this.$refs.modelForm.validate(async (valid) => {
          if (!valid) {
            that.$message({
              showClose: true,
              message: '请检查必填项',
              type: 'warning',
            });
            that.doAUing = false;
            return;
          }
          let picurlArr = [], showurlArr = [];
          that.fileList.forEach((item, index) => {
            picurlArr.push(item.name);
            showurlArr.push(item.url);
          });
          if (that.oper == 'update') {
            let model = {
              id: that.model.id,
              belong: that.model.belong,
              isGetUserInfo: 0,
              linktype: 1,
              creatTime: new Date().getTime(),
              title: that.model.title,
              author: that.model.author,
              description: that.model.description,
              picurl: picurlArr.join(','),
              showPicUrl: showurlArr.join(','),
              content: that.model.content || '',
              categoryId: that.model.categoryId[0] || that.model.categoryId,
            };
            let res = await ArticleService.doUpdate(model);
            if (res.status == 1) {
              that.doAUing = false;
              that.$router.back();
//              that.$children
            }
          } else {
            let model = {...that.model};
            model.categoryId = that.model.categoryId[0] || that.model.categoryId;
            let res = await ArticleService.doAdd(model);
            if (res.status == 1) {
              that.$confirm('添加成功，是否继续新建?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'success',
              }).then(() => {
                that.doAUing = false;
                that.model = {};
                window.tinymce.get(window.tinymceId).setContent('');
              }).catch(() => {
                that.$router.back();
              });
            }
          }
        });
      },
    },
  };
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .form-title {
    padding: 15px 0;
    margin: 0;
    font-size: 14px;
    font-weight: bold;
    line-height: 24px;
  }

  .counts-wrap {
    padding: 0 10px;
    text-align: right;
    color: #333;
    font-size: 14px;
  }

  .pagination {
    text-align: right;
  }

  .avatar-uploader {
    line-height: 14px;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
  }

  .avatar {
    width: 140px;
    height: 48px;
    display: block;
  }

  .el-upload__tip {
    line-height: 13px;
  }

  .footer {
    width: 1040px;
    position: fixed;
    bottom: 0;
    left: 50%;
    margin-left: -435px;
    padding: 10px 0;
    text-align: center;
    z-index: 99;
    background-color: #ffffcc;
  }

  .coupon-box {
    margin-left: 35px;
    max-width: 320px;
    background-color: #F8F8F8;
    border: 1px solid #D7D7D7;
  }

  .coupon-box + .coupon-box {
    margin-top: 10px;
  }

  .coupon-box .coupon {
    padding: 8px 0;
    margin: 0 20px 0 5px;
    vertical-align: middle;
  }

  .coupon-box .coupon + .coupon {
    border-top: 1px dashed #ccc;
  }

  .coupon > span, .coupon > .spec, .coupon > .name {
    vertical-align: middle;
  }

  .coupon > span {
    display: inline-block;
  }

  .spec {
    display: inline-block;
    padding: 2px 11px;
    font-size: 12px;
    color: #fff;
    background-color: #008000;
  }

  .name {
    display: inline-block;
    max-width: 80px;
    margin-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #333;
  }

  .limit {
    color: #999;
  }

  .amount {
    margin-left: 10px;
    color: #333;
  }

  .del {
    margin-left: 10px;
    color: #aaa;
    cursor: pointer;
  }

  .el-form-item {
    margin-bottom: 14px;
  }

  .base-info-mousein {
    border: 1px solid #409EFF;
    border-bottom: none;
    padding: 10px 5px;
  }

  .detail-info-mousein {
    border: 1px solid #409EFF;
    border-top: none;
    padding: 10px 5px;
  }

  .disabled {
    display: none;
  }
</style>
