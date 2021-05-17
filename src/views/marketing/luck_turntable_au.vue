<style>
    .form__content {
        width: 100%;
        padding: 30px 30px;
        display: flex;
        flex-direction: row;
    }
    .turntable_content {
        flex: auto;
    }
    .cssNav {
        width: 100%;
        display: flex;
    }
    .cssNav li {
        flex: 1;
        padding: 0px 20px;
        line-height: 40px;
        background: #b0c2e0;
        display: inline-block;
        color: #fff;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .cssNav li::after {
        content: '';
        /*display: block;*/
        border-top: 20px solid transparent;
        border-bottom: 20px solid transparent;
        border-left: 20px solid #b0c2e0;
        position: absolute;
        top: 0;
        right: -20px;
        z-index: 10;
    }
    .cssNav li:before {
        content: '';
        /*display: block;*/
        border-top: 20px solid transparent;
        border-bottom: 20px solid transparent;
        border-left: 20px solid white;
        position: absolute;
        left: 0px;
        top: 0;
    }
    .cssNav li:first-child{
        padding-left: 25px;
    }
    .cssNav li:last-child,.cssNavEnd{
        padding-right: 25px;
    }
    .cssNav li:first-child:before{
        display: none;
    }
    .cssNav li:last-child:after,.cssNavEnd:after{
        display: none;
    }
    .cssNav li.active {
        background-color: #2e82d3;
    }
    .cssNav li.active:after {
        border-left-color: #2e82d3;
    }
    .setting {
        margin-top: 30px;
        padding: 20px 0 50px 30px;
        width: 100%;
        color: gray;
        border: 1px solid gray;
    }
    .setting_title {
        line-height: 40px;
        padding: 0 20px 0 0;
        margin-right: 30px;
        border-bottom: 1px dashed gray;
    }
    .setting_content {
        padding: 20px 30px 0 0;
        width: 100%;
    }
    .mini_input {
        width: 100px;
        margin-right: 5px;
        margin-left: 5px
    }
    .middle_input {
        width: 40%;
    }
    /****这里存放抽奖九宫格的css****/
    .turntable_bg {
        width: 20vw;
        margin-right: 30px;
        background-color: #f4a314;
    }
    .turntable_bg img {
        width: 100%;
        height: 200px;
    }
    .luck_draw {
        margin-top: 16px;
    }
    .luck_header {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
    }
    .luck_header_btn1 {
        display: flex;
        align-items: center;
        background-color: #ffde7d;
        color: #ff6900;
        height: 26px;
        padding-left: 13px;
        padding-right: 13px;
        border-radius: 13px;

    }
    .luck_header_btn2 {
        display: flex;
        align-items: center;
        margin-left: 10px;
        background-color: #ffde7d;
        color: #ff6900;
        padding: 3px 13px;
        height: 26px;
        padding-left: 13px;
        padding-right: 13px;
        border-radius: 13px;
    }
    .luck_grid {
        position: relative;
        margin-left: 2%;
        margin-right: 2%;
        margin-top: 15px;
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .luck_grid img {
        width: 100%;
        height: 100%;
        background: -o-linear-gradient(right, red, blue);
    }
    .luck_grid_content {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        padding: 30px 30px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
    }
    .luck_grid_block {
        width: 30%;
        height: 30%;
        position: relative;
        display: flex;
        flex-direction: column;
        border: 1px solid gray;
    }
    .luck_grid_block_noborder {
        width: 30%;
        height: 30%;
        position: relative;
        display: flex;
        flex-direction: column;
    }
    .luck_grid_block img {
        width: 100%;
        height: 100%;
    }
    .luck_grid_block-content {
        position: absolute;
        top:0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid purple;
    }
    .number_statistics {
        height: 29px;
        margin: 5% 5%;
        border-radius: 13px;
        font-size: 16px;
        background-color: #f15a1e;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .activity_detail_btn {
        font-size: 18px;
        color: white;
        line-height: 30px;
        background-color: #f15a1e;
        margin: 10% 30%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 4px solid #f7c05d;
        border-radius: 25px;
    }
    .activity_rule {
        padding-left: 10px;
        padding-right: 10px;
        margin-bottom: 10px;
        font-size: 16px;
    }
    .activity_rule-line {
        display: flex;
    }
    .rule_title {
        display: flex;
        margin-bottom: 10px;
        line-height: 30px
    }
    .rule_number {
        flex: none;
        margin-right: 5px;
        width: 25px;
        height: 25px;
        background-color: #f15a1e;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .rule_content {
        padding-left: 30px;
        word-break:break-all;
        line-height: 30px
    }
    .pl {
        padding-left: 0px;
    }
    .active {
        border-color: red;
    }

</style>
<template>
    <div class="app-container" id="wrapper">
        <div class="module-title">幸运大转盘</div>
        <div class="form__content">
            <div class="turntable_bg">
                <img src="~@/assets/lucky_draw_bg.jpg" />
                <div class="luck_draw">
                    <div class="luck_header">
                        <div class="luck_header_btn1">您还有8次抽奖机会</div>
                        <div class="luck_header_btn2">查看奖品</div>
                    </div>
                    <div class="luck_grid">
                        <img src="~@/assets/turntable.png" />
                        <div class="luck_grid_content">
                            <div v-for="(item,index) in prizeBlockList" :key="index" :class="(item.selected?'luck_grid_block active':(item.imageUrl?'luck_grid_block_noborder':'luck_grid_block'))">
                                <img @click="doSelectedLottery(item)" :src="item.imageUrl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="number_statistics">
                    <span style="color: white">当前已有</span>
                    <span style="color: #fde84c">98654389</span>
                    <span style="color: white">人参与抽奖</span>
                </div>
                <div class="activity_detail_btn">活动详情</div>
                <div class="activity_rule">
                    <div class="rule_title">
                        <div class="rule_number">1</div>
                        <div>活动时间:</div>
                    </div>
                    <div class="rule_content">2018-08-08 00:00:00至2018-08-15 00:00:00</div>
                </div>
                <div class="activity_rule">
                    <div class="rule_title">
                        <div class="rule_number">2</div>
                        <div>活动期间:</div>
                    </div>
                    <div class="rule_content">任何用户打开报多多养车小程序即可参与抽奖</div>
                </div>
                <div class="activity_rule">
                    <div class="rule_title">
                        <div class="rule_number">3</div>
                        <div class="rule_content pl">500元提前报销券奖项仅限消费排队中的用户享受中奖机会</div>
                    </div>
                </div>
                <div class="activity_rule">
                    <div class="rule_title">
                        <div class="rule_number">4</div>
                        <div class="rule_content pl">抽到优惠券奖品需领取之后方可到点使用</div>
                    </div>
                </div>
                <div class="activity_rule">
                    <div class="rule_title">
                        <div class="rule_number">5</div>
                        <div class="rule_content pl">活动如有问题请到报多多养车小程序联系客服</div>
                    </div>

                </div>
            </div>
            <div class="turntable_content">
                <ul class="cssNav">
                    <li v-for="(item,index) in flow.flowList" :class="item.selected?'active':''" @click="flow.currentSelectedIndex = index,doFlowListSelected(item,index)">{{item.label}}</li>
                </ul>
                <div class="setting">
                    <div v-if="flow.currentSelectedIndex == 0">
                        <div class="setting_title">基本选项</div>
                        <div class="setting_content">
                            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="活动标题:" prop="name" required>
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="活动时间:" required>
                                    <el-col :span="11">
                                        <el-form-item>
                                            <el-date-picker type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col style="display: flex;justify-content: center;" :span="2">至</el-col>
                                    <el-col :span="11">
                                        <el-form-item>
                                            <el-date-picker type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="参与人数:" prop="participation">
                                    <el-row>
                                        <el-radio-group>
                                            <el-radio label="隐藏"></el-radio>
                                            <el-radio label="展示"></el-radio>
                                        </el-radio-group>
                                    </el-row>
                                    <el-row style="display: flex">
                                        <span>增加虚拟参与人数</span>
                                        <el-input class="mini_input"></el-input>
                                        <span>人 (只展示不计入统计)</span>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="参与人数限制:" prop="participationLimit">
                                    <el-row style="display: flex;align-items: center">
                                        <el-radio-group>
                                            <el-radio label="不限"></el-radio>
                                            <el-radio label="限制"></el-radio>
                                        </el-radio-group>
                                        <el-input class="mini_input"></el-input>
                                        <span>人参与</span>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="活动形式:">
                                    <el-input type="textarea"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div v-if="flow.currentSelectedIndex == 1">
                        <div class="setting_title">抽奖限制</div>
                        <div class="setting_content">
                            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="总抽奖机会:" prop="participationLimit">
                                    <el-row style="display: flex;align-items: center">
                                        <el-radio-group>
                                            <el-radio label="不限"></el-radio>
                                            <el-radio label="限制"></el-radio>
                                        </el-radio-group>
                                        <span style="margin-left: 50px">每人最多有</span>
                                        <el-input class="mini_input"></el-input>次
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="每日抽奖机会:" prop="participationLimit">
                                    <el-row style="display: flex;align-items: center">
                                        <span>每人最多有</span>
                                        <el-input class="mini_input"></el-input>次抽奖机会
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="好友助力:" prop="participation">
                                    <el-row>
                                        <el-radio-group>
                                            <el-radio label="关闭"></el-radio>
                                            <el-radio label="分享奖励"></el-radio>
                                        </el-radio-group>
                                    </el-row>
                                    <el-row style="display: flex">
                                        <span>分享一次奖励</span>
                                        <el-input class="mini_input"></el-input>次抽奖机会，最多奖励
                                        <el-input class="mini_input"></el-input>次
                                    </el-row>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="setting_title">中奖率</div>
                        <div class="setting_content">
                            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="每人中奖次数:" prop="participationLimit">
                                    <el-row style="display: flex;align-items: center">
                                        <span>每人最多可中奖</span>
                                        <el-input class="mini_input"></el-input>次
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="总中奖率:" prop="participationLimit">
                                    <el-row style="display: flex;align-items: center">
                                        <el-input class="mini_input"></el-input>%
                                    </el-row>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div v-if="flow.currentSelectedIndex == 2">
                        <div class="setting_title">
                            <p>设置奖品</p>
                            <p>等级设置的奖品数量越多，则该等级中奖率越高</p>
                            <p>例如：总中奖率50%，一等奖1个，二等奖2个，三等奖3个，四等奖4个，一等奖中奖概率为50%*1/(1+2+3+4)=5%</p>
                        </div>
                        <div class="setting_content">
                            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="奖品类型">
                                    <el-radio-group v-model="prizeRadio" @change="doChangePrize">
                                        <el-radio :label="prize.label" :key="prize.label" v-for="prize in prizeList">{{prize.text}}</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="奖项名称:" required>
                                    <el-input></el-input>
                                </el-form-item>
                                <el-form-item label="送优惠券:" v-if="prizeRadio ==0" required>
                                    <div style="display: flex">
                                        <el-select placeholder="未选择">
                                            <el-option v-for="item in [{value:'0',label:'空调清洗券'},{value:'1',label:'500报销券'}]"
                                                       :key="item.value"
                                                       :label="item.label"
                                                       :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <el-input-number :min="1" controls-position="right" style="width: 100px"></el-input-number>张
                                    </div>
                                </el-form-item>
                                <el-form-item label="赠送多多币:" v-if="prizeRadio ==1" required>
                                    <el-input class="mini_input"></el-input>个
                                </el-form-item>
                                <el-form-item label="送礼品:" v-if="prizeRadio ==2" required>
                                    <el-input class="mini_input"></el-input>个
                                </el-form-item>
                                <el-form-item label="奖品数量:">
                                    <el-input-number :min="1" controls-position="right"></el-input-number>个
                                    <p>已发放0份</p>
                                    <p>奖品数量为0时不设此奖项</p>
                                </el-form-item>
                                <el-form-item label="上传图片:">
                                    <el-upload
                                            :action="uploadUrl"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess">
                                        <el-button size="small" type="primary">上传奖品图片</el-button>
                                        <div slot="tip" class="el-upload__tip">仅支持 jpg、png、 尺寸48*48 不超过1M</div>
                                    </el-upload>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div v-if="flow.currentSelectedIndex == 3">
                        <div class="setting_title">您已成功创建改活动</div>
                        <div class="setting_content">
                            <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                                <el-form-item label="链接地址:">
                                    <div style="display: flex">
                                        <el-input class="middle_input"></el-input>
                                        <el-button plain>复制</el-button>
                                    </div>
                                    <span style="display: block">复制改链接给你的粉丝</span>
                                </el-form-item>
                                <el-form-item label="链接地址:">
                                    <img style="width: 150px;height: 150px" src="https://splatformnew.oss-cn-shanghai.aliyuncs.com/file/QRcode_Local_42968d24b0d711e8bb9af3a07ff4af57.jpg@!1x1_m"  />
                                    <el-button type="text" style="display: block">下载二维码</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'luckTurntable',
    data() {
      return {
        uploadUrl:process.env.BASE_API+'/file_uploadImg.do?key=system.image.processor.1xxl',
        flow:{ //顶部流程
          currentSelectedIndex:0, //当前选中的index
          flowList:[
            {selected:true,label:'创建活动'},
            {selected:false,label:'用户参与设置'},
            {selected:false,label:'奖项设置'},
            {selected:false,label:'完成'}]
        },
        ruleForm:{},
        prizeRadio:0, //奖品类型
        prizeList:[{label:0,text:'送优惠券'},{label:1,text:'赠送多多币'},{label:2,text:'礼品'}],
        prizeBlockList:[{
          index:0,
          selected:true,
          imageUrl:null
        },{
          index:1,
          selected:false,
          imageUrl:null
        },{
          index:2,
          selected:false,
          imageUrl:null
        },{
          index:3,
          selected:false,
          imageUrl:null
        },{
          index:4,
          selected:false,
          imageUrl:null
        },{
          index:5,
          selected:false,
          imageUrl:null
        },{
          index:6,
          selected:false,
          imageUrl:null
        },{
          index:7,
          selected:false,
          imageUrl:null
        },{
          index:8,
          selected:false,
          imageUrl:null
        }]
      }
    },
    created() {
    },
    methods: {
      doFlowListSelected(item,key) {
        this.flow.flowList.forEach(function (flow,index) {
          flow.selected = key > index -1;
        });
      },
      doChangePrize() {
        var that = this;
        this.prizeList.forEach(function (prize) {
          if (that.prizeRadio == prize.label) {
            that.prizeName = prize.text;
          }
        });
      },
      doSelectedLottery(item) {
        this.prizeBlockList.forEach(function (prize) {
          prize.selected = prize.index == item.index;
        });
      },
      handleAvatarSuccess(res, file) { //图片上传成功的回调
        this.prizeBlockList.forEach(function (prize) {
          if(prize.selected) {
            prize.imageUrl = res.absolute
          }
        });
      },
    }
  }
</script>
