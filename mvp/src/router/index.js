import { createRouter, createWebHistory } from 'vue-router'
import UtilityPage from '../views/UtilityPage.vue'
import EvrenMVP5 from '@/views/EvrenMVP5.vue'
import EvrenMVP6 from '@/views/EvrenMVP6.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'EvrenMVP6',
      component: EvrenMVP6
    },
    {
      path: '/5',
      name: 'EvrenMVP5',
      component: EvrenMVP5
    },
    {
      path: '/utility',
      name: 'utility',
      component: UtilityPage
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
