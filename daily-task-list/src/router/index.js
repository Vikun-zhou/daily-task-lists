import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import B from '@/views/B'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      // children:[
      //   {
      //     path: '/',
      //     name: 'B',
      //     component: B
      //   },
      //   {

      //   }
      // ]
    },
    
  ]
})
