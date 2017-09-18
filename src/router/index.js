import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/index.vue'


Vue.use(VueRouter)


const City = resolve => {
  require.ensure(['../components/city.vue'], () => {
    resolve(require('../components/city.vue'))
  },'cityview')
}


export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/city',
      name: 'City',
      component: City
    },
   
  ]
})
