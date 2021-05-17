<template>
    <div class="actions">
        <div class="actions-wrap">
          	<span class="action edit">编辑</span><span class="action add">加内容</span><span class="action delete">删除</span>
        </div>
    </div>
</template>

<script>

export default {
  name: 'unitAction'
}
</script>

<style rel="stylesheet/css" lang="css" scoped>
	.actions {
	    position: absolute;
	    display: none;
	    left: 0;
	    bottom: 0;
	    height: 100%;
	    width: 320px;
	    border: 2px dashed rgba(255,0,0,0.5);
	    -webkit-box-sizing: border-box;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
	    z-index: 2;
	}
	.app-design .app-preview .app-field.editing .actions {
	    display: inline-block;
	}
	.actions .actions-wrap {
	    position: absolute;
	    bottom: 0;
	    right: 0;
	}
	.actions span {
	    display: inline-block;
	    background-color: rgba(0,0,0,0.3);
	    color: #fff;
	    padding: 0 5px;
	    margin-left: 1px;
	    font-size: 12px;
	    line-height: 1.5;
	}
	.actions span:hover {
	    color: #ddd;
	    cursor: pointer;
	}
</style>
