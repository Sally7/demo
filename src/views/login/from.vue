<template>
  <el-dialog
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="cancel"
      :visible.sync="dialogTemplate"
      title="编辑"
      width="910px"
  >
    <el-form ref="form" :model="params" :inline="false" :rules="rules" size="small" label-width="100px">
      <el-button type="success" @click="addDomain" style="margin-bottom: 30px">添加步骤</el-button>
      <el-card
          v-for="(item, index) in params.data"
          :key="item.key"
          style="margin-bottom: 10px"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item
                :label="`步骤${index+1}`"
                :prop="'data.' + index + '.name'"
                :rules="{required: true, message: '步骤名称不能为空', trigger: 'blur'}"
            >

              <el-input v-model="params.data[index].name"/>
            </el-form-item>

            <el-form-item
                :label="`图片模板`"
            >
              <div style="display: flex">
                <div v-for="(item,index) in params.data[index].preview">
                  <img :key="index" :src="item" class="avatar">
                  <el-input class="input-box" placeholder="请输入备注内容"></el-input>
                </div>
                <el-upload
                    class="avatar-uploader"
                    action="https://ms-api.52plays.com/merchant/utils/upload/image"
                    :show-file-list="false"
                    :objectBind="index"
                    name="image"
                    :data={key:index}
                    :limit="9"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                  <i v-if="params.data[index].preview.length<9" class="el-icon-plus avatar-uploader-icon"></i>

                </el-upload>

              </div>
             </el-form-item>

            <el-form-item
                :label="`视频上传`"
               >
              <div  @click="getIndex(index)">
                <el-upload
                    class="avatar-uploader el-upload--text"
                    action="http://123.57.214.213/merchant/utils/upload/videos"
                    :show-file-list="false"
                    :objectVideo="index"
                    :on-success="handleVideoSuccess"
                    :before-upload="beforeUploadVideo"
                    :on-progress="uploadVideoProcess"
                    name="videos"
                >
                  <video
                      v-if="params.data[index].videos != '' && !videoFlag[index]"
                      :src="params.data[index].videos"
                      class="avatar"
                      controls="controls"
                  >
                    浏览中...
                  </video>
                  <i
                      v-else-if="params.data[index].videos == '' && !videoFlag[index]"
                      class="el-icon-plus avatar-uploader-icon"
                  ></i>
                  <el-progress
                      v-if="videoFlag[index] == true"
                      type="circle"
                      :percentage="videoUploadPercent"
                      style="margin-top:30px;"
                  ></el-progress>
                </el-upload>

              </div>
              <!-- action必选参数, 上传的地址 -->
             </el-form-item>

          </el-col>
          <el-col :span="4">
            <el-button type="danger" @click.prevent="removeDomain(item)">删除</el-button>
          </el-col>
        </el-row>


      </el-card>

      <el-form-item style="width: 100%;text-align: right">
        <el-button type="warning" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<script>

// import { updateStaffWorkRecordTemplate } from '@/api/staff-work-record-template'

export default {
    // action="https://ms-api.52plays.com/merchant/utils/upload/image"
    // action="http://27.124.7.116:808/merchant/utils/upload/image"
  components: {},
  props: {},
  data () {
    return {
      curIndex:0,
        videoForm: {
            storageurl: ''// 视频地址
        },
        videoFlag:[],
        //是否显示进度条
        videoUploadPercent: "",
        //进度条的进度，
        isShowUploadVideo: false,

        loading: false,
        dialogTemplate: true,
        params: {
            id: '',
            merchant_id: '',
            category_id: '',
            service_id: '',
            data: [
              {
                name: '',
                image: '',
                videos: '',
                preview:[],
                key: Date.now()
              }
            ],
            imagePreview: []
        },
      rules: {}
    }
  },
  watch: {},
  created () {
      const {a,b} = {1:11,2:22};
      console.log("ok_"+a+"__"+b);
  },
  methods: {

    initParams () {
      this.params = {
        id: '',
        merchant_id: '',
        category_id: '',
        service_id: '',
        data: [
          {
            name: '',
            image: '',
            videos: '',
            preview: [],
            key: Date.now()
          }
        ],
        imagePreview: []
      }
    },

    handleAvatarSuccess (res, file) {
      const { image, key } = res.data
      this.params.data[key].image  += (","+image.path)
     this.params.data[key].preview.push(image.preview)
      // this.params.data[key].push(image.preview)
    },
    beforeAvatarUpload (file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },

    removeDomain (item) {
      let index = this.params.data.indexOf(item)
      if (index !== -1) {
        this.params.data.splice(index, 1)
      }
    },
    addDomain () {
      this.params.data.push({
        name: '',
        image: '',
        videos: '',
        preview: [],
        key: Date.now()
      })
    },

    cancel () {
      this.resetForm()
    },
    resetForm () {
      this.dialogTemplate = false
      this.loading = false
      this.$refs['form'].resetFields()
      this.initParams()

    },
    getIndex(index){
      this.curIndex=index
    },
    doSubmit () {
      this.loading = true
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false
        } else {
            let params = this.params
            // 获取视频地址
            let videoForm = this.videoForm;

          params.data.forEach((item) => {
            delete item.preview
            // item['videos'] = this.videoForm.storageurl;
          })
          return console.log(params.data);
          updateStaffWorkRecordTemplate(params).then(response => {
            this.$notify({
              title: '编辑成功',
              type: 'success',
              duration: 2500
            })
            this.$parent.init()
            this.resetForm()

          }).catch(error => {
            this.loading = false
          })

        }
      })

    },
    doAdd () {

    },
    doEdit () {
      let params = this.params
      params.data.forEach((item) => {
        delete item.preview
      })
      updateStaffWorkRecord(params).then(response => {
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.resetForm()
        this.$parent.init()
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    handleChangeSort (value) {
      console.log(value)
    },
      // 验证视频格式
      beforeUploadVideo(file) {
          if (
              [
                  'video/mp4',
                  'video/ogg',
                  'video/flv',
                  'video/avi',
                  'video/wmv',
                  'video/rmvb'
              ].indexOf(file.type) === -1
          ) {
              this.$message.error('请上传正确的视频格式')
              return false
          }
      },
      // 上传进度显示
      uploadVideoProcess(event, file, fileList) {
          this.loading = true
          console.log(event.percent, file, fileList)
          this.videoFlag[this.curIndex] = true
          this.videoUploadPercent = Math.floor(event.percent)
      },

      // 获取上传视频地址
      handleVideoSuccess(res, file) {
          this.videoFlag[this.curIndex] = false
          this.videoUploadPercent = 0
          // console.log(JSON.stringify(res));

          if (res.code === 200) {
              this.loading = false
              this.videoForm.storageurl = this.GLOBAL.hosts+res.data.url
              // const { videos, key } = res.data
              // console.log(videos);
              // this.params.data[key].videos = this.GLOBAL.hosts+res.data.url


              // return console.log("0_"+JSON.stringify(videos));
              // this.params.data[key].videos = videos.url

              this.$notify({
                  title: '视频添加成功',
                  type: 'success',
                  duration: 2500
              })
              console.log("视频添加成功");
          } else {
              this.$message.error(res.message)
          }
      }
  },

}
</script>

<style scoped>
::v-deep.avatar-uploader.el-upload {
  border: none;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

::v-deep.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

::v-deep.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar{
  width: 178px;
  height: 178px;
  display: block;
  margin:0 10px 10px 0;
}
.input-box{
  width: 178px;
}
::v-deep.avatar {
  width: 178px;
  height: 178px;
  display: block;
  margin-right: 10px;
}
.avatar-uploader-icon {
    border: 1px dashed #d9d9d9 !important;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px !important;
    position: relative !important;
    overflow: hidden !important;
}
.avatar-uploader .el-upload:hover {
    border: 1px dashed #d9d9d9 !important;
    border-color: #409eff;
}
</style>
