import { createRouter, createWebHistory } from 'vue-router'
import EvrenDevice from '@/views/EvrenDevice.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: EvrenDevice
    },
  ]
})

export default router
