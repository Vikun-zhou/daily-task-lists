<template>
 <div class="">
   <!-- <A></A> -->
   <Container></Container>
 </div>
</template>
 
<script>

// import A from './A.vue'
import Container from '@/views/Container'



export default {
 name: 'Home',
 components:{
  //  A,
  Container
 },
 data () {
   return {
     msg:'Welcome to your vueName'
   }
 },
 methods:{
 
 }
}
</script>
 
<style scoped lang = "sass">
 
</style>