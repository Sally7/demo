/**
 * 处理表格跨页多选
 * 本项目重构步骤：
 * 1.	ref="table"
 2.	import multiselect from '@/mixins/multiselect';
 3.	mixins: [multiselect],

 4.	this.tableData=this.users = res.data;
 this.$nextTick(() => { //获取列表数据后
 		 this.mixinSetSelectRow();
	});

 5.	handleCurrentChange(page) { //点击分页的组件
 		 this.mixinCurrentChange();
  		this.currentPage = page;
  		this.doPage();
 		 this.mixinSetSelectRow()
	},

 6. 	handleSelectionChange(rows) {//复选框改变时
 		var that = this;
  		that.selectedIds = [];
 		 rows.forEach(function(item) {
    			that.selectedIds.push(item.id);
 		 });

  		this.mixinHandleSelectionChange(rows);
	},
 7.	最后需要使用收集到的这些被选中选项时
 sels=this.mixinGetAllSelectionData();

 */
export default {
  data() {
    return {
      multipleSelectionAll: [],   // 所有选中的数据包含跨页数据
      multipleSelection: [],   // 当前页选中的数据
      idKey: 'id',
      tableData: [],
    };
  },
  methods: {
    /**
     * 设置选中的方法
     */
    mixinSetSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      this.$refs.table.clearSelection();
      for (var i = 0; i < this.tableData.length; i++) {
        if (selectAllIds.indexOf(this.tableData[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.table.toggleRowSelection(this.tableData[i], true);
        }
      }
    },

    /**
     * 记忆选择的核心方法
     */
    mixinChangePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      let noSelectIds = [];
      // 得到当前页没有选中的id
      this.tableData.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    },

//------------------------------------------------------------------------------
    /**
     * 改变页的时候调用一次
     * @param val
     */
    mixinCurrentChange(val) {
      this.mixinChangePageCoreRecordData();
//      this.pagination.page = val;
//      this.doPage();
    },

    /**
     * 改变每页显示条数的时候调用一次
     * @param val
     */
    mixinSizeChange(val) {
      this.mixinChangePageCoreRecordData();
//      this.pagination.count = val;
//      this.doPage();
    },

    /**
     * table组件选中事件
     * 记得加上:
     * @selection-change="handleSelectionChange"
     * @param val
     */
    mixinHandleSelectionChange(val) {
      this.multipleSelection = val;
      console.log('合并yuanqu')
    },
    //

    /**
     * 得到选中的所有数据
     * 再执行一次记忆勾选数据匹配，目的是为了在当前页操作勾选后直接获取选中数据
     */
    mixinGetAllSelectionData() {
      this.mixinChangePageCoreRecordData();
      return this.multipleSelectionAll;
    },

    mixinAgignEvent(values){
        this.multipleSelection=this.multipleSelection.filter(item => values.indexOf(item.id)>-1)
        this.mixinChangePageCoreRecordData()
        this.mixinSetSelectRow();
    },





    /**
     *
     * @param list
     */
    agignFilterxxx(list) {
      let This = this;
      let temparr = [];
      new Promise(function(resolve, reject) {
        This.tableData.forEach(item => {
          if (list.indexOf(item.id) != -1) {
            temparr.push(item);
          }
        });
        resolve(temparr);
      }).then((rows) => {
        This.$refs.table.clearSelection();
        rows.forEach(row=>{
          This.$refs.table.toggleRowSelection(row);
        })

      });
    },
  },
};
