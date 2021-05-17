<template>
  <div class="app-container" id="wrapper">
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="app__content">
      <p class="form-title">活动码信息</p>
      <el-form :model="kkCouponSku" :rules="rules" ref="kkCouponSku" label-width="100px" class="form-content">
        <el-row>
          <el-col :span="10">
            <el-form-item label="套餐名称" prop = "label">
              <el-input v-model="kkCouponSku.label"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="套餐图片" prop = "imageUrl">
          <el-upload
            class="avatar-uploader"
            action="http://swdev.suconnected.com/file_uploadImg.do"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="kkCouponSku.imageUrl && kkCouponSku.imageUrl.length>0" :src="kkCouponSku.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过2M,建议尺寸:750*260px</div>
            <div slot="tip" class="el-upload__tip" v-show="kkCouponSku.imageUrl">点击图片可进行更换</div>
          </el-upload>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="套餐描述">
              <el-input type="textarea" v-model="kkCouponSku.skuDesc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="footer">
      <el-button size="small" @click="doCancel">取消</el-button>
      <el-button size="small" type="primary" @click="doSubmit('kkCouponSku')" :loading="loading">提交</el-button>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import timeUtils from '@/utils/TimeUtil'
  import KakaService from '@/api/KakaService'

  export default {
    data() {
      return {
        kkCouponSku:{
          couponId: this.$route.query.couponId,
          label: "",
          goodsId: this.$route.query.goodsId,
          skuDesc: "",
          imageUrl: ""
        },
        rules: {
          label: [
            { required: true, message: '请输入活动码名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
        },
        loading:false
      }
    },
    components: {
      Breadcrumb
    },
    created(){
      if(this.$route.query.id){
        this.init();
      }
    },
    methods: {
      async init(){
        var res = await KakaService.searchKSku({
          kSkuId: this.$route.query.id
        });
        if(res.status === 1){
          this.kkCouponSku = res.data;
        }
      },
      handleAvatarSuccess(res, file) { //图片上传成功的回调
        this.kkCouponSku.imageUrl = res.absolute;
        //this.kkCouponSku.headImgURL = res.relative;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG && !isPNG) {
          this.$message.error('上传图片只能是 JPG或者PNG 格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return false;
        }
        if (isJPG){
          return isJPG && isLt2M;
        }else if(isPNG){
          return isPNG && isLt2M;
        }
      },
      doCancel() {
        this.$router.back();
      },
      doSubmit(formName) {
        this.loading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
              this.auKSku();
          } else {
            this.loading = false;
            return false;
          }
        });
      },
      async auKSku(){
        var auType = "",
            res;
        if(this.kkCouponSku.id){
          auType = "修改";
          res = await KakaService.updateKSku({
            kkCouponSku: this.kkCouponSku
          });
        }else{
          auType = "新增";
          res = await KakaService.addKSku({
            kkCouponSku: this.kkCouponSku
          });
        }
          
        if(res.status === 1){
          if(res.data === 1){
            this.$message({
              message: auType + '套餐成功!',
              type: 'success'
            });
            this.$router.back();
          }else{
            this.$message.error(auType + '套餐失败，请重新编辑!');
          }
          this.loading = false;
        }
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  
</style>
