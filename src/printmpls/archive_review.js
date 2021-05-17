/**
 * 获取政审表模板
 * @param item
 * @return {{style: string, html: string}}
 */
export default function getArchiveReviewTmpl(item) {
  let list1 = [{dt: '2220年9月'}, {dt: '2220年9月'}, {dt: '2220年9月'}];
  let json = {
    style: `<style>
        p,
        th,
        td {
          margin: 0;
          padding: 0;
          
        }
        .tmp-table {
          border-spacing: 0;
          border-collapse: collapse;
          margin: 0 auto;
        }
        
        .tmp-table th,
        .tmp-table td {
          border: 1px solid #000;
          word-wrap: break-word;
          font-size: 11px;
          height: 31px;
        }
        .tmp-table th {
          height: 43px;
        }
        .tmp-txt-right {
          text-align: right;
          padding-right: 15px;
          padding-bottom: 15px;
          position: relative;
        }
        .tem-list-title {
          text-align: center;
          padding-top:5px;
        }
        .tem-list-title > span,
        .tem-list-content > p > span {
          display: inline-block;
          width: 35%;
          box-sizing: border-box;
          line-height: 1.6;
          vertical-align: top;
          text-align: left;
          padding: 0 5px 0 5px;
        }
        
        .tem-list-title > span:nth-child(1),
        .tem-list-content > p > span:nth-child(1) {
          width: 25%;
        }
        .tem-list-title > span:nth-child(3),
        .tem-list-title > span:nth-child(4),
        .tem-list-content > p > span:nth-child(3),
        .tem-list-content > p > span:nth-child(4) {
          width: 20%;
          box-sizing: border-box;
        }
        .tem-advice-con{
          text-align:left;
          padding: 5px;
          margin-bottom: 20px;
          min-height:60px;
        }
        </style>`,
    html: `
      <div id="demo" style="position:relative;>
      <h1 style="font-size:30px;text-align:center;font-weight:normal;">政治考核表</h1>
      <table class="tmp-table" >
        <tbody class="tmp-body">
          <tr>
            <td style="width:180px">姓名</td>
            <td style="width:120px">${item.name}</td>
            <td style="width:100px">曾用名</td>
            <td style="width:100px">${item.name}</td>
            <td style="width:90px">性别</td>
            <td style="width:50px">女</td>
            <td style="width:100px" rowspan="4">照片</td>
          </tr>
          <tr>
            <td>出生日期</td>
            <td></td>
            <td>政治面貌</td>
            <td></td>
            <td>民族</td>
            <td></td>
          </tr>
          <tr>
            <td>宗教信仰</td>
            <td></td>
            <td>户籍类别</td>
            <td></td>
            <td>婚姻状况</td>
            <td></td>
          </tr>
          <tr>
            <td>工作单位及职务</td>
            <td colspan="3"></td>
            <td>文化程度</td>
            <td></td>
          </tr>
          <tr>
            <td>身份证号码</td>
            <td colspan="2"></td>
            <td>户籍所在地</td>
            <td colspan="4"></td>
          </tr>
          <tr>
            <td>家庭住址及邮箱</td>
            <td colspan="3"></td>
            <td>本人手机号码</td>
            <td colspan="2"></td>
          </tr>
          <tr>
            <td>主要经历</td>
            <td colspan="6">
              <p class="tem-list-title">
                <span>起止时间</span>
                <span>所在学校或单位</span>
                <span>职业</span>
                <span>证明人</span>
              </p>
              <div class="tem-list-content">
              ${getJLstr(list1)}
              </div>
            </td>
          </tr>
          <tr>
            <td>奖惩情况</td>
            <td colspan="6">
              <p class="tem-list-title">
                <span>奖惩名称</span>
                <span>奖惩时间</span>
                <span>奖惩单位</span>
                <span>奖惩原因</span>
              </p>
              <div class="tem-list-content">
                <p>
                  <span>2006年9月-2008年6月</span>
                  <span>广州工商职业技术学院</span>
                  <span>会计</span>
                  <span>张昌明</span>
                </p>
               
              </div>
            </td>
          </tr>
          <tr>
            <td>家庭成员情况</td>
            <td colspan="6">
              <p class="tem-list-title">
                <span>称 谓</span>
                <span>姓 名</span>
                <span>身份证号码</span>
                <span>工作单位及职务</span>
              </p>
              <div class="tem-list-content">
                <p>
                  <span>2010.10-2010.11</span>
                  <span>广东省珠海市香洲区南屏居委</span>
                  <span>第六次全国人口普查员</span>
                  <span>孙绍航</span>
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="height:20px" rowspan="2">本人承诺</td>
            <td colspan="6" style="text-align:left;padding-left:15px;">以上内容属实，如有隐瞒或不实，本人自愿承担相关责任</td>
          </tr>
          <tr>
            <td colspan="6" style="text-align:right;padding-right:15px;">本人签字：_____年___月___日</td>
          </tr>
          <tr>
            <td>所在单位自查意见</td>
            <td colspan="6" class="tmp-txt-right">
              <p class="tem-advice-con">认真学习贯彻习近平中国特色社会主义新思想，持续推进“两学一做”学习教育常态化制度化，带头发挥示范带头作用，推动党员教育经常化、组织生化正常化、作用发挥常态化，切实加强基层党建建设，不断促进党建工作水平上台阶</p>
              <p class="tmp-txt-right">单位盖章：_____年___月___日</p>
              <span>
                <img
                  border="0"
                  transcolor="#FFFFFF"
                  src="http://www.lodop.net/demolist/PrintSample37.png"
                  style="z-index: -1; position: absolute; right:0; bottom:0;"
                />
              </span>
            </td>
          </tr>
          
          <tr>
            <td>公安(派出所考核意见)</td>
            <td colspan="6" class="tmp-txt-right">
              <p class="tem-advice-con">认真学习贯彻习近平中国特色社会主义新思想，持续推进“两学一做”学习教育常态化制度化，带头发挥示范带头作用，推动党员教育经常化、组织生化正常化、作用发挥常态化，切实加强基层党建建设，不断促进党建工作水平上台阶</p>
              <p class="tmp-txt-right">单位盖章：_____年___月___日</p>
              <span>
                <img
                  border="0"
                  transcolor="#FFFFFF"
                  src="http://www.lodop.net/demolist/PrintSample37.png"
                  style="z-index: -1; position: absolute; right:0; bottom:0;"
                />
              </span>
            </td>
          </tr>
          <tr>
            <td>基层武装审查意见</td>
            <td colspan="6" class="tmp-txt-right">
              <p class="tem-advice-con">认真学习贯彻习近平中国特色社会主义新思想，持续推进“两学一做”学习教育常态化制度化，带头发挥示范带头作用，推动党员教育经常化、组织生化正常化、作用发挥常态化，切实加强基层党建建设，不断促进党建工作水平上台阶</p>
              <p class="tmp-txt-right">单位盖章：_____年___月___日</p>
               <span>
                <img
                  border="0"
                  transcolor="#FFFFFF"
                  src="http://www.lodop.net/demolist/PrintSample37.png"
                  style="z-index: -1; position: absolute; right:0; bottom:0;"
                />
              </span>
            </td>
          </tr>
          <tr>
            <td>镇(区)、街道或单位党委审批意见</td>
            <td colspan="6" class="tmp-txt-right">
              <p class="tem-advice-con">认真学习贯彻习近平中国特色社会主义新思想，持续推进“两学一做”学习教育常态化制度化，带头发挥示范带头作用，推动党员教育经常化、组织生化正常化、作用发挥常态化，切实加强基层党建建设，不断促进党建工作水平上台阶</p>
              <p class="tmp-txt-right">单位盖章：_____年___月___日</p>
              <span>
                <img
                  border="0"
                  transcolor="#FFFFFF"
                  src="http://www.lodop.net/demolist/PrintSample37.png"
                  style="z-index: -1; position: absolute; right:0; bottom:0;"
                />
              </span>
            </td>
          </tr>
          
        </tbody>
      </table>
    <div style="position:absolute;z-index:-1;left:0;top:calc(50% - 50px);font-family:仿宋;font-size:180px;color:#e2e2e2;transform:rotate(-30deg);">版权所有</div>
    </div>
        `,
  };
  return json;
}

function getJLstr(list) {
  let str = '';
  for (let i = 0; i < list.length; i++) {
    str += `<p><span>${list[i].dt}</span><span>广州工商职业技术学院</span><span>会计</span><span>张昌明</span></p>`;
  }
  return str;
}