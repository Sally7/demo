<template>
    <div class="app-title clearfix editing">
      	<h1><span>朋友圈的11.11</span></h1>
    </div>
</template>

<script>

export default {
  name: 'pageTitle'
}
</script>

<style rel="stylesheet/css" lang="css" scoped>
	.app-title {
		position: relative;
      	cursor: pointer;
      	background-color: #f9f9f9;
	}
	.app-title h1 {
	    margin: 0;
	    padding: 18px 60px 0 60px;
	    height: 46px;
	    line-height: 46px;
	    font-size: 16px;
	    color: #fff;
	    font-weight: bold;
	    text-align: center;
	    background: url("~@/assets/backend/titlebar.png") no-repeat;
	    box-sizing: content-box;
	    -webkit-box-sizing: content-box;
	}
	.app-title h1 span {
	    display: inline-block;
	    height: 46px;
	    width: 200px;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
	}
</style>
