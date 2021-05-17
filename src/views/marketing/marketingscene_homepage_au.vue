<template>
  <div class="app-container" id="wrapper">
    <div class="app-inner">
      <Breadcrumb class="breadcrumb-container"></Breadcrumb>
      <div class="app__content mainContent">
        <div class="subContent">
          <p class="showTitle"><span>示例</span><br /><span>建议图片按自己需求进行适当设计，图上辅之以营销文案，来吸引消费者。</span></p>
          <img></img>
        </div>
        <div style="flex: auto;">
          <p class="form-title">场景信息</p>
          <el-form :model="marketingScene" ref="marketingScene" label-width="100px" class="form-content">
            <el-form-item label="场景类型" required>
              <el-input value="打开首页" :disabled="true" class="shortSpan"></el-input>
            </el-form-item>
            <el-form-item label="场景名称">
              <el-input placeholder="请填写场景名称" class="shortSpan"></el-input>
            </el-form-item>
            <el-form-item label="营销方式">
              <el-radio-group v-model="marketingScene.marketingType">
                <el-radio :label=0>推送广告</el-radio>
                <el-radio :label=1>赠送优惠券</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="marketingScene.imageUrl" :src="marketingScene.imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div slot="tip" class="el-upload__tip">{{marketingScene.marketingType==0?'广告图片弹框':'优惠券弹框'}}：只能上传jpg/png文件,且不超过2M,建议尺寸:630*830px</div>
                <div slot="tip" class="el-upload__tip" v-if="marketingScene.marketingType==1">注：图片上优惠券区域为630*500px</div>
                <div slot="tip" class="el-upload__tip" v-show="marketingScene.imageUrl">点击图片可进行更换</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="领取按钮颜色">
              <el-row>
                <el-col :span="2"><el-color-picker v-model="marketingScene.color"></el-color-picker></el-col>
                <el-col :span="6" class="receive-btn" v-if="marketingScene.color!=''">
                  <el-col>{{marketingScene.color}}</el-col>
                  <el-col><el-tag :color="marketingScene.color" style="height: 100%;width: 40px"></el-tag></el-col>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="有效时间">
              <el-radio :label=0 v-model="marketingScene.dateType">永久</el-radio>
              <el-row>
                <el-radio :label=1 v-model="marketingScene.dateType">
                  <el-date-picker type="datetime" placeholder="请选择开始日期" v-model="marketingScene.startDate" @focus="tapDatePicker"></el-date-picker>
                  <span>至</span>
                  <el-date-picker type="datetime" placeholder="请选择结束日期" v-model="marketingScene.endDate" @focus="tapDatePicker" @blur="disableFocus"></el-date-picker>
                </el-radio>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="app__content" style="margin-top: -50px">
        <p class="form-title">优惠设置</p>
        <el-table :header-row-style="tableHeaderClass"
                  style="width: 100%;"
                  :data="marketingScene.conditions">
          <el-table-column
            type="index"
            align="center"
            width="100"
            label="层级">
          </el-table-column>
          <el-table-column
            align="center"
            width="500"
            label="优惠门槛">
            <template slot-scope="scope">
              <el-select v-model="marketingScene.conditions[scope.$index].targetValue" clearable><el-option v-for="item in [{label:'点击广告',value:0}]" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="优惠方式(可多选)">
            <template slot-scope="scope">
              <el-checkbox v-model="marketingScene.conditions[scope.$index].switch">点击跳转至</el-checkbox>
              <el-row v-if="marketingScene.conditions[scope.$index].switch == true"><el-input clearable size="mini" placeholder="请输入跳转链接" style="width: 50%;margin-left: 3%"></el-input></el-row>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-popover
                ref="popover"
                placement="top"
                width="100%"
                v-model="scope.row.visible">
                <p>这是一段内容确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.visible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="scope.row.visible = false">确定</el-button>
                </div>
              </el-popover>
              <el-button type="text" v-popover:popover>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="footer">
      <el-button size="small" @click="doCancel">取消</el-button>
      <el-button size="small" type="primary" @click="doAU">保存</el-button>
    </div>
  </div>
</template>
<script>
  import Breadcrumb from '@/components/Breadcrumb'
  export default {
    data(){
      return {
        visible2: false,
        tableHeaderClass: {background: '#f0f0f0'},
        uploadUrl:process.env.BASE_API+'/file_uploadImg.do?key=system.image.processor.1xxl',
        marketingScene:{
          marketingType:0,
          dateType:0,
          startDate:'',
          endDate:'',
          color:'',
          conditions:[{}]
        }
      }
    },
    created() {
    },
    components: {
      Breadcrumb
    },
    methods: {
      handleAvatarSuccess(res,file){ //图片上传成功的回调
        console.log(res);
      },
      beforeAvatarUpload(file) { //上传图片之前的限制
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
      tapDatePicker(){ //点击了时间选择的控件
        this.marketingScene.dateType = 1;
      },
      disableFocus(){
        if(this.marketingScene.startDate!='' && this.marketingScene.endDate!=''){
          var startDateStamp = new Date(this.marketingScene.startDate).getTime(); //中国标准时间转时间戳
          var endDateStamp = new Date(this.marketingScene.endDate).getTime();
          if(startDateStamp > endDateStamp){ //互换两个值的位置
            this.marketingScene.startDate = [this.marketingScene.endDate,this.marketingScene.endDate=this.marketingScene.startDate][0];
          }
        }
      },
      doAU(){
        console.log('doAU');
        console.log(this.marketingScene);
      },
      doCancel(){
        console.log('doCancel');
      }
    }
  }
</script>

<style rel="stylesheet/css" lang="css" scoped>
  .form-title {
    padding: 15px 0;
    margin: 0;
    font-size: 14px;
    font-weight: bold;
    line-height: 24px;
  }
  .showTitle {
    font-size: 16px;
  }
  .shortSpan{
    width:40%;
  }
  .el-upload__tip {
    line-height: 13px;
  }
  .mainContent {
    display: flex;
    flex-direction:row-reverse
  }
  .subContent {
    width: 40%;
    height: 500px;
    padding-top: 150px;
    flex: none
  }
  .subContent img{
    width: 150px;
    height: 200px;
    margin-top: 20px;
  }
  .receive-btn{
    display: flex;
    height: 100%;
    border: 1px solid darkgray;
  }
</style>
