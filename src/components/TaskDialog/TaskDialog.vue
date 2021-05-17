<template>
  <el-dialog
      :visible.sync="taskVisible"
      width="80%"
      center="center"
      :append-to-body="true"
  >
    <div class="df x-ten">
      <div class="t-top-left">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAwFBMVEX29va70/9Oje5Qi+y81P5Ojez39vNPjO+buvFFivD29vdMiu729vr49vVime5WkPKwzPyixPrY4/KcvfGErPDw8/ey0PrF1/N/q/Q+hO6oyfvB1/+JtPhrn/GrxvKGr/B0pvS61vvl7Pe+0f9Yk+zy+PSlxetgl+9nlfKy0fSWv/u2zvWKsfqxxvLr6vFGi+jW4/lto/hPj+P78/rg8vVAgvJ2oe16qfm72fH6/PCeyvzu+vLE1+82h+zX5/Jqm+Y+hYLcAAAJIklEQVR4nO2dDVvaOhvH27RJ1qRFcYBSxrTSHs7cnlXHM51nO9v3/1Yn6RsVSIpIK8T7f12blxglP+68tLn/SS0LBAKBQCAQCAQCgUAgEOj45ZNEfmGMdCj5joukG0Di+4kVCLGgS5EkCboBtIi1IH+97143H1lHhCwJkvnY4x3LGfeGHREGCSN/ewgh3KkonTK/G0LiE9KjqGtRpzckQAiEQFgSBkGPV4iU4ha5eEpp8Va8s7F0hdChTptKqw/Qey1COY63E79skvB4/MqEnofE7O+1ITHNe6mDEX1dwjj8ZI9alH3DXzGG8h8euXZku+2pz/HrxvDk1HUjuzVJwlfuh4LQdoHwmAnpWyCM2iS03b736oStxhAIgRAIgRAIgRAIgRAIgRAID5qQSRlN+BIBocGEjQuDtXpvXbQixN50SJ6T95f2ht1SOSpC9/OXyy8fNLqJolmU851++KAt+t6N3FVCfvLxfx+fp7++sl3sDcoYhl6qy+5708moKDrpp57WCDCtwlgRejj1xs+RKP3vbUB2yIwrYxiOcbkuti5RfloFZtbHypxclue5c6u/WhBizJ1xun3OSuZ1UPo72cWCoyKMQhpjulkigiKGdlHUjf5BHOmKPkzsFULE8TdBubXkn/Lwmb9Y7I/Q7o9TqnNTXNll25v1OUoVpdI0xc6dO1olxIhzR9lE1iX+lMPPgl2CqG6lXqp7S9G5Jjmh6/ZpmTPb2FD5lRutEj5TFMm03BnbZTQ9IkIKhK0S6mp3pITONCoGGjfqe46Okd9NqrIFIUVezFFTOl1Ou3nVWiJU10D+YF7lcAQh1Sb/xVi6SviN4sHgskmyROy0RBiFU70G0ayqdkPRy+ratCKkfJo0V1depQ14W4RiDlOaFmz5o0/llVgUaUvaI/vz2oyf4vmQZdfSeaWLqlffkOxL0CahKy6rI939wiyaVbchk1mzR2HlmibdxvWVDBfkoi3CdvTM+0PmEzagQAiEQAiEQAiEQAiERhBS4wnNjyEQAiEQAmH7hDBbHAHhIkkW0m8h9+wGbJkFNYeQMBLInLegfJJeMqeVkgX7fZ3p/9fXwdI4Y1IMz8coy51742nt9dcjfGrFsO2tPxUFIXv89Z1m2/TxuPe4xGiVMHK168H5onCR5W5YO3bdiZvbNpRjaSBiWFShV6NolVDUXr2LLYvhMm8xsSN3cxRL54prjw6OMApjzBXJ+RMhei/3KeYx7ItvdSn/C9deXdU/AEI7HKeUKpwRSO7F/jSLSj+Ngxydk+JOBFnbDxsI25kt3FDtxcjK3sneV8RQvL86gohfTdYyMypCh+eErE54nE4FIKwTUuMJzY9hNZb6ex1L+1p/xVNCD6ude2JAfljOjDsSSttXmp6Jy7v9EUZ97KjMatkIOV1abftjrpsP0ctjKHWCBeEe3ZdR6KBUYTjMnILST1M2aKS0MWZFH9YdtDu0UhSfkX0Simnc0zVT50/NFjseq6yo0hwqGvSL+yGORTPdcysdXej1YXkpOnrQF735vOqgfXYrjXvzON5vKxXX03rV7OnPKLoboRhIv/U4OtvJy34Qd8BaQo5wHMf85JsYaYI9ttIDIoxj7PRiHhtLSOMYeVggGknICLt0RBMVt6qx45jYDy0SXDpitkWpCOQxr7WpCC1GgoHHYzFTzDF1DCSUMRzIzRliwkd8z/cWB0GYxRBheWEvCM1opWh1pAkucYrzQ97MIHTokxjKkUZM9/joV/VVhFkM5SKXuYQyhlnFzCFEdHWkEfOhrN2REzLy43u+eDzmvYQVhEweNs5a8+p3ShiwH/M/+d6M+UXt0tOc/KGIlZ+d1R48kp/1rb7MGEKLJIkvxJKFqM8SkJmS5fYDxhZZDIfESurN1JwYbpZB/RAIgXBnQt0+NLfare66DSdj2IWnQT3SEJYfQcPYkyXRdgl19ZY/z8waeUm7YXOePWok9B8zU5Rctidrrq92ZouRqL/WQyJz82UMm4wpUUMeP/HJY5CFMCBJbeW+1RhOon7YVykMw344KZf1J5/VJfPikT3REy6s27NCt7Vm2iqh+w+NT3QWkvuo8GK4rjz5Q1t0UpgalNel/o9xXBb+2VErzbwYaLOytOe07JBupE+mUn5lu/p+yIJf3/OXMe2x8t6i7RgeYpYbCIHwjRHaoYdVBweVI0155RNypCoqXxeEVdEDInQloSYwdIVQU9R5KWFbs4WntONlVVkhVHtNELpyG2aL14qhNjDbxxDRq8omfViEVBtDNF0eURY6mguaLIb2AbbSyA71Ol02vdPtix5SDMXdg/6Wobw/bLivyHzgB0nYVPmnWxCaPosDnA+jqOGmr/oYRIwayi4/jEMitO2ZrZer2IGwqehL3ZfHvxL11gkNWNV/8zEEQiAEQiAEwmcRIgSER09oeiuloh9aJhNi5DhTI2OYkPN/eXniwHqG1ADCILi9vxgM5MnCD5e1yplD6BOSn0ib5YBNJLQSi2RHmiSsbvoyiDBg/sLPnAqBFXTmxeiSUCWD7vH1hObHEAiBEAiBsH1CmC2A8PAJoZUCIRACIRAeGmF03ISM+NXWjUK+T0iv9KVxGcNGD9Dusu1+YVqlfD4csiZZvkUulv66s0TUv6q44H9cJ7QCkj2WdalHiwTz0v9K8ajBCPUSusz0zvMKY9wjW8giyZeKkN+y+s/kjsX1IPoJWfmYiG89TrsgzCQIc9+fI2K4WpV1iR7EBhUh/s38ZBle9rO+U7HsdMH19dfhU4nv/14Shqf26anqEWMv1unoZlzEEP05GzYrGQ4vlzH8NaxX3veH6zEkw3uO+JOntHqOIw+dKAi9lGNH431+oRyOcd4RU+5xvvGxsU8qhzy+PHFMVDV/dmm2/u+cb3wE8ldBuGo6p7UXdDtD9iH6ojegtV+n3vnGgfXrfesQHYnT82BDDAkQHo8UhG+glQ6vlHs/jkiSQRCSDSEMrqdI+YDp45EgEJd9ihje4+ZZ6Agkj9zeTHg9HY8bHsJ7LHI2E7KP74zQ+3fvbm43jqVBYrEdjh48QDGZDV8nZPJAlEB1q3Jc0qIbLWZIIxUdzlJ0OPlAnu1+/1lv1mXhoPzfmGiBQCAQCAQCgUAgEGg/+g/SVkrG9fCZ6AAAAABJRU5ErkJggg==" class="img x-ten y-ten" alt="企业图标">
      </div>
      <div class="x-nine mar">
        <div class="df">
          <div class="x-eight">
            <div class="t-top-right-title padding-bot">{{titleData.name}}</div>
            <div class="t-top-right-intro" style="margin-top: 1%">
              <el-tag type="success" size="mini">营业</el-tag>
              <el-tag size="mini">高新企业</el-tag>
              <el-tag size="mini">销售型</el-tag>
              <el-tag size="mini">生产型</el-tag>
              <el-tag size="mini">医疗试剂</el-tag>
              <el-tag size="mini">生物诊断仪器</el-tag>
            </div>
          </div>
          <div class="x-two">
            <div class="ri xy-center">
              <i class="el-icon-star-off" style="margin-right: 2%;font-size:15px;color: blue"></i>关注企业</div>
            <div class="ri xy-center">
              <i class="el-icon-refresh-right" style="margin-right: 2%;font-size:15px;color: blue"></i>
              2021/4/13数据更新</div>
          </div>
        </div>
        <div class="t-top-right-in x-ten padding margin-top" style="margin-top: 2%">
          <div class="grey-top df">
            <div class="grey-1">
              <div class="grey df">
                <div class="grey-t">企业法人：</div>
                <div class="grey-c">某某</div>
              </div>
              <div class="grey df" style="margin-top: 2%">
                <div class="grey-t">企业官网：</div>
                <div class="grey-c" style="color: blue">
                  <a href="www.vazymemedical.com">www.vazymemedical.com</a>
                </div>
              </div>
            </div>
            <div class="grey-2" style="margin-left: 1%">
              <div class="grey df">
                <div class="grey-t">人员规模：</div>
                <div class="grey-c">101-10000人</div>
              </div>
              <div class="grey df" style="margin-top: 1%">
                <div class="grey-t">企业地址：</div>
                <div class="grey-c df">
                  <span><i class="el-icon-location-outline" style="font-size:15px;color: blue"></i>{{titleData.address}}</span>
                </div>
              </div>
            </div>
            <div class="grey-3 df" style="margin-left: 1%">
              <div class="grey-t">年营业额：</div>
              <div class="grey-c">500万-1000万</div>
            </div>
          </div>
          <div class="grey-bottom df" style="margin-top: 0.5%;">
            <div class="grey-t">所属行业：</div>
            <div class="grey-c">制造业>医药制造业>生物药品制品制造</div>
          </div>
        </div>
      </div>
    </div>
    <!--          操作-->
    <div class="action x-ten margin-top" style="color: white;padding-bottom: 1%">
      <el-dropdown>
          <el-button type="primary" size="mini" style="font-size: 13px"  class="el-dropdown-link">更多操作
            <i class="el-icon-arrow-down" style="margin-right: 2%;font-size:15px"></i>
          </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>释放</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--          表格信息-->
    <div class="table x-ten df">
      <div class="table-in y-ten">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClickTab" style="background-color: white">
          <el-tab-pane label="企业信息" name="first" class="deep">
            <el-tabs v-model="activeNameTwo" @tab-click="handleClickTab" class="table-two margin-top">
              <el-tab-pane label="公司信息" name="one" style="font-size: 13px !important;">
                <div class="button diver x-ten padding">
                  <el-button size="small">公司简介</el-button>
                  <el-button size="small">工商信息</el-button>
                  <el-button size="small">股东信息(1)</el-button>
                  <el-button size="small">主要人员(2)</el-button>
                  <el-button size="small" disabled>对外投资</el-button>
                  <el-button size="small">分支机构(1)</el-button>
                  <el-button size="small">工商变更(6)</el-button>
                </div>
                <div class="company-intro margin-top diver" style="padding-bottom: 1%">
                  <div class="company-title df"><div style="margin-right: 1%;font-size: 16px; color: blue;font-weight: bold">|</div>
                    <div style="font-weight: bold;font-size: 16px;color: #2a2a2a">公司简介</div>
                  </div>
                  <div class="company-content margin-top">
                    南京诺唯赞医疗科技有限公司于2016年02月23日成立。法定代表人唐波，公司经营范围包括：医疗试剂、生物诊断仪器研发、生产、销售、技术咨询、技术服务、技术转让等。
                  </div>
                </div>
                <div class="margin-top">
                  <div class="company-title df"><div style="margin-right: 1%;font-size: 16px; color: blue;font-weight: bold">|</div>
                    <div style="font-weight: bold;font-size: 16px;color: #2a2a2a">工商信息</div>
                  </div>
                  <div class="margin-top">
                    <table class="info">
                      <tbody>
                      <tr>
                        <th class="i-1">统一社会信用代码</th>
                        <td class="i-2">{{titleData.groupNo}}</td>
                        <th class="i-1">注册号</th>
                        <td class="i-2">360406210008500</td>
                      </tr>
                      <tr>
                        <th class="i-1">组织机构代码</th>
                        <td class="i-2">MA35GWHM-X</td>
                        <th class="i-1">经营状态</th>
                        <td class="i-2">营业 &gt; 存续(在营、开业、在册)</td>
                      </tr>
                      <tr>
                        <th class="i-1">企业法人</th>
                        <td class="i-2">徐娟</td>
                        <th class="i-1">注册资本</th>
                        <td class="i-2">1000.000000万元人民币</td>
                      </tr>
                      <tr>
                        <th class="i-1">公司类型</th>
                        <td class="i-2">有限责任公司(自然人投资或控股)</td>
                        <th class="i-1">成立日期</th>
                        <td class="i-2">{{titleData.createDate | formatDate}}</td>
                      </tr>
                      <tr>
                        <th class="i-1">营业期限</th>
                        <td class="i-2">2016-03-18 至 2036-03-17</td>
                        <th class="i-1">登记机关</th>
                        <td class="i-2">
                          九江经济技术开发区市场监督管理局</td>
                      </tr>
                      <tr>
                        <th class="i-1">核准日期</th>
                        <td class="i-2">2018-06-07</td>
                        <th class="i-1">公司规模</th>
                        <td class="i-2">--</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </el-tab-pane>
              <el-tab-pane v-for="(tabContent,index) in pageList" :key="index" :label="tabContent.title"></el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="发展情况" name="second">发展情况</el-tab-pane>
          <el-tab-pane label="合同信息" name="third">合同信息</el-tab-pane>
          <el-tab-pane label="收付款" name="fourth">收付款</el-tab-pane>
          <el-tab-pane label="科技人才(15)" name="fifth">科技人才(15)</el-tab-pane>
          <el-tab-pane label="安全生产(2)" name="sixth">安全生产(2)</el-tab-pane>
        </el-tabs>
      </div>
      <div class="table-p mar">
        <div class="x-ten y-two df padding">
          <div class="x-seven df">
            <div style="margin-right: 1%;font-size: 16px; color: blue;font-weight: bold">|</div>
            <div style="font-weight: bold;font-size: 16px;color: #2a2a2a">政策匹配</div>
          </div>
          <div class="x-three">匹配度</div>
        </div>
        <div class="x-ten y-two df diver padding-bot padding" style="align-items: center">
          <div class="x-eight">瞪羚企业</div>
          <div class="x-two" style="color: orange">85%</div>
        </div>
        <div class="x-ten y-two df diver padding-bot padding" style="align-items: center">
          <div class="x-eight">南京市培育独角兽企业</div>
          <div class="x-two">80%</div>
        </div> 
        <div class="x-ten y-two df diver padding-bot padding" style="align-items: center">
          <div class="x-eight">南京市独角兽企业</div>
          <div class="x-two">46%</div>
        </div>
      </div>
    </div>
  </el-dialog>

</template>

<script>
import DynamicFormService from "../../api/DynamicFormService";

export default {
name: "TaskDialog",
  props: {
    titleData:""
  },
  data() {
  return {
    taskVisible:false,
    activeNameTwo:'one',
    activeName: 'first',
    pageList:[]
  }
  },
  created() {
    this.tabContent();
  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + MM + '-' + d;
    }
  },
  methods: {
    // 显示dialog
    isTaskDialog() {
      this.taskVisible = true;
    },
    handleClickTab(tab, event) {
      console.log(tab, event);
    },
    //弹出层
    taskClose(done) {
      this.$confirm('确认关闭？').then(_=>{
        done();
      }).catch(_ => {});
    },
    async tabContent(categoryId) {
      var pageListRes = await  DynamicFormService.doSearchByModuleId("group_"+"9010000000000000");
      if(pageListRes.status) {
        pageListRes.data = pageListRes.data.sort(this.sortChangeType)
        // console.log('pageList---------',pageListRes.data);
        this.pageList = pageListRes.data;
      }
    }
  },
}
</script>

<style scoped>
.action {
  height:90%;
  border-bottom: 1px solid #EEE9E9;
  text-align: right;
  align-items: center;
}
.info {
  table-layout: fixed;
  font-size: 13px;
  word-wrap: break-word;
  border-collapse: collapse;
}
table {
  border-collapse: separate;
  text-indent: initial;
  border-spacing: 2px;
}
.info, .info tbody, .info tbody tr {
  width: 100%;
}
.i-1 {
  width: 15%;
  text-align: center;
}
.info tbody td {
  padding: 10px 30px;
}
.info tbody td, .info tbody th {
  height: 50px;
  color: #404040;
  border: 1px solid #e9e9e9;
}
.i-2 {
  width: 35%;
  text-align: left;
}
.x-ten {
  width: 100%;
}
.x-nine {
  width: 90%;
}
.x-eight {
  width: 80%;
}
.x-seven {
  width: 70%;
}
.x-three {
  width: 30%;
}
.x-two {
  width: 20%;
}
.y-ten {
  height: 100%;
}
.y-two {
  height: 20%;
}
.mar {
  margin: 0 auto;
}
.table-two {
  width: 95%;
  margin: 0 auto;
}
.table {
  height: 600px;
  background-color: #F5F5F5;
}
.table-in {
  width: 77%;
}
.table-p {
  width: 19%;
  height: 200px;
  background-color: white;
}
.button {
  height: auto;
}
.diver {
  border-bottom: 2px solid 	#F5F5F5;
}
.grey-t {
  color: #6E7580;
}
.grey-c {
  color: #000000;
}
.df {
  display: flex;
}
.t-top-left {
  width: 9%;
  height: 80px;
}
.xy-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.t-top-right-in {
  background-color: #f7f8fa;
  font-size: 12px;
}
.padding {
  padding: 10px 10px 10px 10px;
}
.padding-bot {
  padding-bottom: 2px;
}
.margin-top {
  margin-top: 1%;
}
.img {
  border-radius: 10px;
}
.t-top-right-title {
  font-weight: 800;
  font-size: 20px;
  color: #2a2a2a;
}
.t-top-right-intro {
  font-size: 1px;
}
</style>