<!--一个组件多用，添加/编辑弹窗-->
<template>
    <el-dialog
            :visible.sync="newBuildingVisible"
            width="30%"
            center="center"
            :append-to-body="true"
            style="margin-top: 10%"
            @close="addDialogClosed"
    >
                <el-form ref="form" :model="form" label-width="70px">
                    <el-form-item label="楼宇名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>

                    <div style="display:flex;justify-content: flex-end">
                        <el-button type="primary" @click="newBuildingVisible = false" size="mini">新 增</el-button>
                        <el-button @click="newBuildingVisible = false" size="mini">取 消</el-button>
                    </div>
                </el-form>

    </el-dialog>
</template>

<script>
    export default {
        name: '',
        components: {},
        data() {
            return {
                newBuildingVisible: false,
                form: {
                    name: '',
                }
            }
        },
        methods: {
            isNewBuilding() {
                this.newBuildingVisible = true
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            // 监听添加用户对话框的关闭事件
            addDialogClosed () {
                this.$refs.addFormRef.resetFields()
            }
        },
    }
</script>
<style>
</style>