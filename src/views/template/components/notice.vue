<template>
    <div class="custom-notice">
        <img src="https://img.yzcdn.cn/public_files/2017/8/10/6af5b7168eed548100d9041f07b7c616.png">
        <div class="custom-notice-inner">
            <div class="custom-notice-scroll">
                <span>请填写内容，如果过长，将会在手机上滚动显示</span>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'notice'
}
</script>

<style rel="stylesheet/css" lang="css" scoped>
	.custom-notice {
	    padding: 0 10px;
	    height: 37px;
	    line-height: 37px;
	    color: #f60;
	    background: #fff7cc;
	    border-top: 1px solid #f2f2f2;
	    border-bottom: 1px solid #f2f2f2;
	    font-size: 12px;
	    overflow: hidden;
	    position: relative;
	    -webkit-font-smoothing: antialiased;
	}
	.custom-notice img {
	    position: absolute;
	    width: 16px;
	    height: 16px;
	    top: 11px;
	    left: 10px;
	}
	.custom-notice-inner {
	    overflow: hidden;
	    padding-left: 20px;
	}
	.custom-notice-inner {
	    white-space: nowrap;
	}
</style>
