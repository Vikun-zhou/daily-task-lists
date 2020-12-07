<template>
<!-- 2020-12-07 第一个任务后续 -->
<!-- 这是上次的需求：两个页面A、B，A页面有输入框，在A页面跳转到B页面时，提示用户是否要离开当前页面，并保存输入框的内容，由B页面切换到A页面时，输入框内容仍然存在。 -->
<!-- 因为理解不同所以现在重新开始做。真正想要的是：同一个页面两个tab切换传值 -->
<!-- 解题思路:
        1.非父子传值,采用bus(引入bus,bus.$emit()传,bus.$on()收);
        2.user-management和tab之间采用父子组件传值，将activeName的值更改之后传回
 -->
  
  <div class="container" >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="user-management">
          <user-management @userTrans="toConfigManagement"></user-management>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="config-management">
          <config-management @configTrans="backUserManagement"></config-management>
        </el-tab-pane>
      </el-tabs> 
  </div>
 
</template>
 
<script>
import UserManagement from './UserManagement.vue'
import ConfigManagement from '@/views/ConfigManagement'
export default {
 components: { 
    UserManagement,
    ConfigManagement 
 },
 name: 'Container',
 props:{
   
 },
 data () {
   return {
     activeName: 'user-management',
     containerValue:''
   }
 },
 methods:{
   handleClick(){

   },
   toConfigManagement(val){
     this.activeName = val;
     console.log(this.activeName,"123activeName");
   },
   backUserManagement(val){
     this.activeName = val;
   }
 
 }
}
</script>
 
<style scoped lang = "sass">
 
</style>