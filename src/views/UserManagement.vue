<template>
 <div class="">
    <el-input v-model="usercontent" placeholder="请输入内容"></el-input>
    <el-button type="primary" round @click="open">跳转</el-button>
 </div>
</template>
 
<script>
import bus from '../util/bus'

export default {
 name: 'UserManagement',
 props:{
 },
 data () {
   return {
     usercontent:''
   }
 },
 mounted(){
},
 methods:{
     open(){
      this.$confirm('是否要离开当前页面？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.trans();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    trans(){
      bus.$emit('trans',this.usercontent);
      this.$emit('userTrans','config-management');
    }

 }
}
</script>
 
<style scoped lang = "sass">
 
</style>