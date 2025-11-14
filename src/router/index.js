import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/qr-generator',
      name: 'qr-generator',
      component: () => import('../views/QRCodeGenerator.vue'),
    }
  ],
})

export default router
