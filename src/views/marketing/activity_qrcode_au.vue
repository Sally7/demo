<template>
  <div class="app-container" id="wrapper">
    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="app__content">
      <p class="form-title">活动码信息</p>
      <el-form :model="QRCode" :rules="rules" ref="QRCode" label-width="100px" class="form-content">
        <el-row>
          <el-col :span="10">
            <el-form-item label="活动码名称" prop = "name">
              <el-input v-model="QRCode.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="页面头部" prop = "headRelURL">
          <el-upload
            class="avatar-uploader"
            action="http://swdev.suconnected.com/file_uploadImg.do"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="QRCode.headRelURL && QRCode.headRelURL.length>0" :src="QRCode.headRelURL" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过2M,建议尺寸:750*260px</div>
            <div slot="tip" class="el-upload__tip" v-show="QRCode.headRelURL">点击图片可进行更换</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="有效时间"  prop = "dateType">
          <el-row>
            <el-col>
              <el-radio v-model="QRCode.dateType" :label=2 @change="changeRadio">永久</el-radio>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-radio v-model="QRCode.dateType" :label=1 @change="changeRadio">
                <el-date-picker
                  v-model="QRCode.startDate"
                  type="datetime"
                  :editable=false
                  @focus="changeDate"
                  placeholder="请选择开始时间">
                </el-date-picker>
                <span>至</span>
                <el-date-picker
                  v-model="QRCode.endDate"
                  type="datetime"
                  :editable=false
                  @focus="changeDate"
                  placeholder="请选择结束时间">
                </el-date-picker>
              </el-radio>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>

    <div class="footer">
      <el-button size="small" @click="doCancel">取消</el-button>
      <el-button size="small" type="primary" @click="doSubmit('QRCode')" :loading="disabled">保存</el-button>
    </div>
  </div>
</template>

<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import timeUtils from '@/utils/TimeUtil'
  import ActivityQRCodeService from '@/api/ActivityQRCodeService'

  export default {
    data() {
      var validateDate = (rule, value, callback) => { //自定义有效时间的验证
        if (value===1) {
            var startTime = this.dateToMs(this.QRCode.startDate);
            var endTime = this.dateToMs(this.QRCode.endDate);
          if (!startTime){
            callback(new Error('请选择开始时间'));
          }
          if (!endTime){
            callback(new Error('请选择结束时间'));
          }
          if(startTime > endTime){
            callback(new Error('开始时间不能比结束时间大'));
          }
          callback();
        }else {
          callback();
        }
      };
      return {
        QRCode:{name:'',headRelURL:'',headImgURL:'',startDate:'',endDate:'',dateType:2,type:16,belong:'402881ae4cd4a25a014cd4f8bbf3000f'},
        rules: {
          name: [
            { required: true, message: '请输入活动码名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          headRelURL :[
            { required: true, message: '请上传一张头部图片', trigger: 'blur' }
          ],
          dateType :[
            { required: true, validator: validateDate, trigger: 'blur' }
          ]
        },
        disabled:false
      }
    },
    components: {
      Breadcrumb
    },
    created(){
      if(this.$route.query.id){ //处理编辑逻辑
        this.doGetQRCodeById();
      }
    },
    methods: {
      doGetQRCodeById(){ //根据id查询活动码
        var self = this;
        ActivityQRCodeService.doGetQRCodeById({id:this.$route.query.id}).then(response => {
          if(response.status ===1){
            self.QRCode = response.data;
          }
        });
      },
      changeDate() { //改变时间
        this.changeRadio(1);
        //由于使用的时间选择控件，使用的数据模型为中国标准时间，所以需要将查询到时间戳用timeUtils先转成标准时间，再通过new Date()转成中国标准时间
        this.QRCode.startDate =this.msToDate(this.QRCode.startDate);
        this.QRCode.endDate = this.msToDate(this.QRCode.endDate);
      },
      changeRadio(value){ //切换Radio的选项
        this.QRCode.dateType = value;
        this.$refs['QRCode'].validate((valid) => { //切换radio时重新验证有效时间
          if (valid) {
           return true;
          } else {
            return false;
          }
        });
      },
      handleAvatarSuccess(res, file) { //图片上传成功的回调
        this.QRCode.headRelURL = res.absolute;
        this.QRCode.headImgURL = res.relative;
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
      doCancel () {
        this.$router.push("/marketing/activity_qrcode");
      },
      doSubmit(formName) {
        var self = this;
        this.disabled = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
              self.QRCode.startDate = self.dateToMs(self.QRCode.startDate);
              self.QRCode.endDate = self.dateToMs(self.QRCode.endDate);
              self.doAddOrUpdateActivityCode();
          } else {
            self.disabled = false;
            return false;
          }
        });
      },
      msToDate(date) { //毫秒转中国标准时间,适配时间控件
        var getType=Object.prototype.toString;
        if (getType.call(date) !== "[object Date]") {
          return new Date(timeUtils.formatTime(date, 'Y-M-D H:m:s'))
        }else {
            return date;
        }
      },
      dateToMs(date) { //因为日历控件会将date转成中国标准时间，所以需要转回到毫秒时间戳
        var getType=Object.prototype.toString;
        if (getType.call(date) === "[object Date]") { //该方法可以判断数据的类型
          return new Date(date).getTime();
        } else {
            return date ;
        }
      },
      resetForm(formName) { //重置验证
        this.$refs[formName].resetFields();
      },
      doAddOrUpdateActivityCode(){
        var self = this;
        ActivityQRCodeService.doAddOrUpdateActivityCode(this.QRCode).then(response => {
          if(response.status ===1){
            self.$message({
              message: '编辑成功!',
              type: 'success'
            });
            self.$router.push("/marketing/activity_qrcode");
            self.disabled = false;
          }else {
            self.$message.error('编辑失败，请重新编辑!');
            self.disabled = false;
          }
        });
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  
</style>
