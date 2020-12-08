<template>
  <!-- 2020-12-02 第一个任务 -->
  <!-- 需求：两个页面A、B，A页面有输入框，在A页面跳转到B页面时，提示用户是否要离开当前页面，并保存输入框的内容，由B页面切换到A页面时，输入框内容仍然存在 -->
  <div class="hello">
    <el-button type="primary" round @click="back">返回UserManagement</el-button>
    <div>
      传过来的数据为：{{this.configcontent}}
    </div>
  </div>
</template>

<script>
import bus from '../util/bus'

export default {
  name: 'ConfigManagement',
  props:{
    // content:[String,Number]
  },
  data () {
    return {
      configcontent:''
    }
  },
  mounted(){
    bus.$on('trans',val=>{
        this.configcontent = val;
    })
  },
  methods:{
    back(){
      this.$emit('configTrans','user-management');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
