<template>
  <div>
    <el-dialog title="已选内容" :visible.sync="showdialog">
      <el-transfer
          style="text-align: left; display: inline-block"
          :props="{
              key: propmap.key,
              label: propmap.label
          }"
          v-model="tranvalue"
          :titles="['丢弃项', '保留项']"
          @change="handleChange"
          :data="resultlist">
        <!--<span slot-scope="{ option }">{{ option.title || option.name }}</span>-->
        <el-button slot="right-footer" size="small" @click="handleAgign">确定</el-button>
      </el-transfer>
    </el-dialog>
    <el-link class="active" style="margin-right: 5px" type="primary" @click="handleShow">当前选中{{count}}条记录</el-link>
  </div>
</template>

<script>
  function util(arr) {
    let newArr = [];
    arr.forEach(el => {
      const result = newArr.findIndex(ol => {
        return el.id === ol.id;
      });
      if (result !== -1) {
        newArr[result].value = newArr[result].value + el.value;
      } else {
        newArr.push(el);
      }
    });
    return newArr;
  }

  export default {
    name: 'RecordSelected',
    props: {
      text: {
        type: String,
        default: '请选择导出项',
      },
      pagelist: {
        type: Array,
        required: true,
      },
      alllist: {
        type: Array,
        required: true,
      },
      propmap: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        resultlist: [],
        showdialog: false,
        tranvalue: [],
      };
    },
    computed: {
      cdata() {
        const {pagelist, alllist} = this;
        return {pagelist, alllist};
      },
      count() {
        return this.resultlist.length;
      },
    },
    watch: {
      cdata: {
        handler: function(newval, oldval) {
          this.resultlist = util([].concat(newval.pagelist, newval.alllist));
        },
      },
      resultlist: {
        handler: function(newval, oldval) {
          let temp = [];
          for (let i = 0; i < newval.length; i++) {
            temp.push(newval[i].id);
          }
          this.tranvalue = temp;
        },
      },
    },
    methods: {
      handleChange(value, direction, movedKeys) {
        console.log(value, direction, movedKeys);
      },
      handleShow() {
        this.showdialog = true;
      },
      handleAgign() {
        this.$emit('agign', this.tranvalue);
        this.showdialog = false;
      },
    },
  };
</script>

<style scoped>

</style>