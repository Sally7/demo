<template>
      <el-row>
          <el-col :span="defaultSpan" v-if="areaLevel==-1||areaLevel>=6">
            <el-select  size="small" class="fix-width" filterable v-model="addressForm.provinceId" value-key="id" @change="changeProvince(addressForm.provinceId)" placeholder="省份">
              <el-option label="省" value=""></el-option>
              <el-option v-for="province in provinceList" :key="province.id" :label="province.name" :value="province.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="defaultSpan" style="padding-left:8px" v-if="areaLevel==-1||areaLevel>=5">
            <el-select size="small" class="fix-width" filterable v-model="addressForm.cityId" value-key="id" @change="changeCity(addressForm.cityId)" placeholder="城市">
              <el-option label="市" value=""></el-option>
              <el-option v-for="city in showCityList" :key="city.id" :label="city.name" :value="city.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="defaultSpan" style="padding-left:8px" v-if="(areaLevel==-1||areaLevel>=4)">
            <el-select size="small" class="fix-width" filterable v-model="addressForm.areaId" value-key="id" @change="changeArea(addressForm.areaId)" placeholder="区县">
              <el-option label="区" value=""></el-option>
              <el-option v-for="area in showAreaList" :key="area.id" :label="area.name" :value="area.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="defaultSpan" style="padding-left:8px" v-if="type=='address'&&(areaLevel==-1||areaLevel>=3)">
            <el-select size="small" class="fix-width" filterable v-model="addressForm.townId" value-key="id" @change="changeTown(addressForm.townId)" placeholder="园区">
              <el-option label="园区" value=""></el-option>
              <el-option v-for="town in showTownList" :key="town.id" :label="town.name" :value="town.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="lastSpan" style="padding-left:8px" v-if="type=='address'">
            <el-select size="small" class="fix-width" filterable v-model="addressForm.villageId" :disabled="areaLevel == 1" value-key="id" @change="changeVillage(addressForm.villageId)" placeholder="网格">
              <el-option label="网格" value=""></el-option>
              <el-option v-for="village in showVillageList" :key="village.id" :label="village.name" :value="village.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="lastSpan" style="padding-left:8px" v-if="type=='saddress'||type=='paddress'">
            <el-input size="small" placeholder="请输入详细地址" v-model="addressForm.address" class="input-with-select">
            </el-input>
          </el-col>
          <el-col :span="lastSpan" style="padding-left:8px" v-if="type=='paddress'">
            <el-input size="small" placeholder="经纬度 如:120.100641,34.09"  v-if="type=='paddress'" v-model="addressForm.point" class="input-with-select">
            </el-input>
          </el-col>
          <el-col :span="lastSpan" style="padding-left:8px" v-if="type=='maddress'">
            <el-input size="small"  placeholder="请输入详细地址" v-model="addressForm.address" class="input-with-select" @change="changeAddress">
              <el-button slot="append" icon="el-icon-search" @click="doSearchAddress()"></el-button>
            </el-input>
          </el-col>
      </el-row>
</template>

<script>
  import AreaService from '@/api/AreaService'
  import GroupService from '@/api/GroupService'
  import ConfigUtil from '@/utils/ConfigUtil'
  import AreaList from '@/utils/AreaList'
  export default {
    props: {
      addressModel: {
        type: Object,
        default:function(){
          return {};
        }
      },
      areaId:String,
      villageId:String,
      townId:String,
      address: {
        type: String,
        default: ""
      },
      point: {
        type: String,
        default: ""
      },
      type: {
        type: String,
        default: "address" //area village
      },
      areaLevel:{
        type: Number,
        default: -1 //area village
      },
    },
    data() {
      return {
        provinceList: [], //省份列表
        showCityList: [], //城市列表
        showAreaList: [], //区域列表
        showTownList: [],
        showVillageList: [],
        addressForm: {
          provinceId: '',
          provinceName:'',
          cityId: '',
          cityName:'',
          areaId: '',
          areaName:'',
          townId: '',
          villageId: '',
          address: "",
          point:""
        },
        defaultSpan:4,
        lastSpan:0,
        rules: {
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
        },
        confirmAddress: "",
        local: ""
      }
    },
    watch: {
      areaId:function (newValue) {
        if(newValue){
          this.setValue();
          this.$forceUpdate();
        }
      },
      address:function (newValue) {
        console.log("address", this.address);
        if(newValue){
          this.addressForm.point = this.point;
          this.addressForm.address = this.address;

          this.$forceUpdate();
        }
      }
    },
    created(){

    },
    mounted() {
      //console.log("mounted:"+this.areaId);
      if(this.type == "area") {
        this.defaultSpan = 8;
        this.lastSpan = 8;
      } else if(this.type == "address"){
        this.defaultSpan = 5;
        this.lastSpan = 4;
      } else if(this.type == "saddress") {
        this.defaultSpan = 4;
        this.lastSpan = 12;
      } else if(this.type == "paddress") {
        this.defaultSpan = 4;
        this.lastSpan = 6;
      }

      this.init();
      this.setValue();
    },
    methods: {
      async init() {
        var that = this;
        this.doGetArea();
      },
      async setValue() {
        if(this.areaId && this.areaId!='undefined' && this.areaId!='null') {
          console.log("setValue:",this.areaId);
          for(var i=0; i< this.provinceList.length; i++) {
            for(var j=0; j<this.provinceList[i].nodes.length; j++) {
              for(var k=0; k<this.provinceList[i].nodes[j].nodes.length; k++) {
                if(+this.areaId == this.provinceList[i].nodes[j].nodes[k].id) {
                  this.showCityList = this.provinceList[i].nodes;
                  this.showAreaList = this.provinceList[i].nodes[j].nodes;
                  this.addressForm.provinceId = this.provinceList[i].id;
                  this.addressForm.cityId = this.provinceList[i].nodes[j].id;
                  this.addressForm.areaId = this.provinceList[i].nodes[j].nodes[k].id;
                  break;
                }
              }
            }
          }

          console.log("addressForm",this.addressForm);
        }

        //if(this.villageId) {
          this.addressForm.townId = this.townId;
          this.addressForm.villageId = this.villageId;
          this.changeArea(+this.areaId);
          this.changeTown(this.townId);
        //}

        if(this.address){
          this.addressForm.address = this.address;
        }
      },
      //获取省市区
      doGetArea() {
        var that = this;
        that.provinceList = AreaList.getAreaJson();
      },
      //修改省份
      changeProvince(provinceId) {
        this.addressForm = {
          provinceId: provinceId,
          cityId: '',
          areaId: '',
          townId: '',
          villageId: '',
          address: this.addressForm.address,
          point: this.addressForm.point
        }

        var curProvince = null;
        this.provinceList.forEach(function (province) {
          if(provinceId == province.id) {
            curProvince = province;
          }
        })

        if(curProvince) {
          this.showCityList = curProvince.nodes;
        } else {
          this.showCityList = [];
        }

        this.showAreaList = [];
        this.showTownList = [];
        this.showVillageList = [];
      },
      //修改城市
      changeCity(cityId) {
        this.addressForm = {
          provinceId: this.addressForm.provinceId,
          cityId: cityId,
          areaId: '',
          townId: '',
          villageId: '',
          address: this.addressForm.address,
          point: this.addressForm.point
        }

        var curCity = null;
        this.showCityList.forEach(function (city) {
          if(cityId == city.id) {
            curCity = city;
          }
        })

        if(curCity) {
          this.showAreaList = curCity.nodes;
        } else {
          this.showAreaList = [];
        }
        this.showTownList = [];
        this.showVillageList = [];
      },
      async changeArea(areaId) {
        if(areaId){
          this.addressForm = {
            provinceId: this.addressForm.provinceId,
            cityId: this.addressForm.cityId,
            areaId: areaId,
            townId: '',
            villageId: '',
            address: this.addressForm.address,
            point: this.addressForm.point
          }

          var showTownListRes = await GroupService.doSearch({generalId:true, tradingAreaId:ConfigUtil.getTradingAreaId(), areaId:areaId, groupType:3, groupCategoryId:2001000000000000});
          this.showTownList = showTownListRes.data;
        }
      },
      async changeTown(townId) {
        if(townId) {
          this.addressForm = {
            provinceId: this.addressForm.provinceId,
            cityId: this.addressForm.cityId,
            areaId: this.addressForm.areaId,
            townId: townId,
            villageId: this.villageId,
            address: this.addressForm.address,
            point: this.addressForm.point
          }
          var showVillageListRes = await GroupService.doSearch({generalId:townId});
          this.showVillageList = showVillageListRes.data;
        }
      },
      async changeVillage(villageId) {
        if(villageId){
          console.log(villageId);
        }
      },
      changeAddress(address) {
        this.$emit("changeAddress", []);
      },
      doSearchAddress() {
        this.$emit("doSearchAddress", []);
      },
      getArea() {
        for(var i=0; i< this.provinceList.length; i++) {
          for(var j=0; j<this.provinceList[i].nodes.length; j++) {
            for(var k=0; k<this.provinceList[i].nodes[j].nodes.length; k++) {
              if(+this.addressForm.areaId == this.provinceList[i].nodes[j].nodes[k].id) {
                this.addressForm.provinceName = this.provinceList[i].name;
                this.addressForm.cityName = this.provinceList[i].nodes[j].name;
                this.addressForm.areaName = this.provinceList[i].nodes[j].nodes[k].name;
                break;
              }
            }
          }
        }
        return this.addressForm;
      }
    }
  }
</script>

<style scoped>
</style>
