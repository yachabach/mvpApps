import { createRouter, createWebHistory } from 'vue-router'
import UtilityPage from '../views/UtilityPage.vue'
import EvrenMVP6 from '@/views/EvrenMVP6.vue'
import ReadDevice from '@/views/readDevice.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'EvrenMVP6',
      component: EvrenMVP6
    },
    {
      path: '/read',
      name: 'readDevice',
      component: ReadDevice
    },
    {
      path: '/u',
      name: 'utility',
      component: UtilityPage
    },
  ]
})

export default router
