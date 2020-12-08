<template>
  <!-- 2020-12-02 第一个任务 -->
  <!-- 需求：两个页面A、B，A页面有输入框，在A页面跳转到B页面时，提示用户是否要离开当前页面，并保存输入框的内容，由B页面切换到A页面时，输入框内容仍然存在 -->
  <div class="hello">
    <el-input v-model="inputContent" placeholder="请输入内容"></el-input>
    <!-- <router-link 
      :to="{
        path:'/b',
        params: {
          key: 'this.inputContent'
        }
      }">
      跳转到B页面
    </router-link> -->

    <el-button type="primary" round @click="open">跳转</el-button>
  </div>
</template>

<script>
export default {
  name: 'A',
  data () {
    return {
      inputContent: ""
    }
  },
  mounted(){
    this.inputContent = this.$route.query.inputContent;
  },
  methods:{
    open(){
      this.$confirm('是否要离开当前页面？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.jump();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    jump(){
      this.$router.push({
        path:'/b',
        // name:'B',
        // params:{
        //   content: this.inputContent
        // }
        query:{
          content: this.inputContent
        }
        // name 和 params 组合，path和query组合
      });
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
