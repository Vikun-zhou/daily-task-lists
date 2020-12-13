<template>
 <div class="">
   <!-- <A></A> -->
   <Container></Container>
   <Dialog></Dialog>
 </div>
</template>
 
<script>

// import A from './A.vue'
import Container from '@/views/Container'
import Dialog from './Dialog.vue'



export default {
 name: 'Home',
 components:{
  //  A,
  Container,
  Dialog
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